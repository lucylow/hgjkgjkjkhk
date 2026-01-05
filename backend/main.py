from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import logging
import json
from typing import List, Optional

from models import (
    Equipment,
    SensorReading,
    Prediction,
    MaintenanceEvent,
    AuditLog,
    EquipmentStatus,
)
from schemas import (
    EquipmentSchema,
    EquipmentDetailSchema,
    HealthStatusSchema,
    SensorReadingSchema,
    PredictionSchema,
    PredictionResponseSchema,
    BatchPredictionRequest,
    BatchPredictionResponse,
    MaintenanceEventSchema,
    MaintenanceEventResponseSchema,
    CreateCaseRequest,
    CreateCaseResponse,
    WebhookPayload,
)
from ml_service import PredictiveModel, AnomalyDetector, HealthScoreCalculator
from database import get_db, engine, Base

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="FleetVision Predictive Maintenance API",
    description="AI-powered predictive maintenance backend for manufacturing equipment",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML services
predictor = PredictiveModel(model_version="v1.0")
anomaly_detector = AnomalyDetector(threshold=2.0)
health_calculator = HealthScoreCalculator()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, data: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(data)
            except Exception as e:
                logger.error(f"Error broadcasting to connection: {str(e)}")


manager = ConnectionManager()


# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}


# Equipment endpoints
@app.get("/equipment", response_model=List[EquipmentDetailSchema])
async def list_equipment(db: Session = Depends(get_db)):
    """List all equipment"""
    equipment = db.query(Equipment).all()
    return equipment


@app.get("/equipment/{equipment_id}", response_model=EquipmentDetailSchema)
async def get_equipment(equipment_id: str, db: Session = Depends(get_db)):
    """Get equipment by ID"""
    equipment = db.query(Equipment).filter(Equipment.equipment_id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment


@app.post("/equipment", response_model=EquipmentDetailSchema)
async def create_equipment(
    equipment: EquipmentSchema, db: Session = Depends(get_db)
):
    """Create new equipment"""
    existing = db.query(Equipment).filter(Equipment.equipment_id == equipment.equipment_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Equipment already exists")

    db_equipment = Equipment(**equipment.dict())
    db.add(db_equipment)
    db.commit()
    db.refresh(db_equipment)
    return db_equipment


# Health status endpoint
@app.get("/equipment/{equipment_id}/health", response_model=HealthStatusSchema)
async def get_equipment_health(equipment_id: str, db: Session = Depends(get_db)):
    """Get equipment health status with latest prediction"""
    equipment = db.query(Equipment).filter(Equipment.equipment_id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    latest_sensor = (
        db.query(SensorReading)
        .filter(SensorReading.equipment_id == equipment_id)
        .order_by(SensorReading.timestamp.desc())
        .first()
    )

    latest_prediction = (
        db.query(Prediction)
        .filter(Prediction.equipment_id == equipment_id)
        .order_by(Prediction.prediction_timestamp.desc())
        .first()
    )

    return HealthStatusSchema(
        equipment_id=equipment.equipment_id,
        name=equipment.name,
        status=equipment.status,
        health_score=equipment.health_score,
        rul_days=latest_prediction.rul_days if latest_prediction else None,
        failure_probability=latest_prediction.failure_probability if latest_prediction else None,
        last_update=equipment.last_reading_time or datetime.utcnow(),
        sensor_data=SensorReadingSchema.from_orm(latest_sensor) if latest_sensor else None,
        latest_prediction=PredictionResponseSchema.from_orm(latest_prediction)
        if latest_prediction
        else None,
    )


# Sensor reading endpoints
@app.post("/sensor/reading", response_model=SensorReadingSchema)
async def ingest_sensor_reading(
    reading: SensorReadingSchema, db: Session = Depends(get_db)
):
    """Ingest sensor reading and trigger predictions"""
    equipment = db.query(Equipment).filter(Equipment.equipment_id == reading.equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    # Store sensor reading
    db_reading = SensorReading(**reading.dict())
    db.add(db_reading)

    # Calculate health score
    sensor_dict = reading.dict()
    health_score = health_calculator.calculate_health_score(sensor_dict)
    status = health_calculator.determine_status(health_score)

    # Detect anomalies
    anomaly_score, severity = anomaly_detector.detect_anomaly(sensor_dict)

    # Update equipment
    equipment.health_score = health_score
    equipment.status = EquipmentStatus(status)
    equipment.last_reading_time = datetime.utcnow()

    # Generate prediction
    failure_prob, rul_days, confidence, feature_importance = predictor.predict(sensor_dict)

    db_prediction = Prediction(
        equipment_id=reading.equipment_id,
        failure_probability=failure_prob,
        rul_days=rul_days,
        expected_failure_date=datetime.utcnow() + timedelta(days=rul_days),
        confidence_score=confidence,
        feature_importance=feature_importance,
        model_version="v1.0",
    )
    db.add(db_prediction)

    db.commit()
    db.refresh(db_reading)

    # Broadcast update via WebSocket
    await manager.broadcast(
        {
            "type": "sensor_update",
            "equipment_id": reading.equipment_id,
            "health_score": health_score,
            "failure_probability": failure_prob,
            "timestamp": datetime.utcnow().isoformat(),
        }
    )

    return reading


# Prediction endpoints
@app.post("/predict", response_model=PredictionResponseSchema)
async def predict_failure(
    prediction: PredictionSchema, db: Session = Depends(get_db)
):
    """Single equipment failure prediction"""
    equipment = db.query(Equipment).filter(Equipment.equipment_id == prediction.equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    db_prediction = Prediction(**prediction.dict())
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)

    return db_prediction


@app.post("/predict/batch", response_model=BatchPredictionResponse)
async def batch_predict(
    request: BatchPredictionRequest, db: Session = Depends(get_db)
):
    """Batch prediction for multiple equipment"""
    predictions = []
    failed_count = 0

    for equipment_id in request.equipment_ids:
        try:
            latest_sensor = (
                db.query(SensorReading)
                .filter(SensorReading.equipment_id == equipment_id)
                .order_by(SensorReading.timestamp.desc())
                .first()
            )

            if latest_sensor:
                sensor_dict = {
                    "temperature": latest_sensor.temperature,
                    "vibration": latest_sensor.vibration,
                    "pressure": latest_sensor.pressure,
                    "power_consumption": latest_sensor.power_consumption,
                    "operating_hours": latest_sensor.operating_hours,
                }

                failure_prob, rul_days, confidence, feature_importance = predictor.predict(
                    sensor_dict
                )

                db_prediction = Prediction(
                    equipment_id=equipment_id,
                    failure_probability=failure_prob,
                    rul_days=rul_days,
                    expected_failure_date=datetime.utcnow() + timedelta(days=rul_days),
                    confidence_score=confidence,
                    feature_importance=feature_importance,
                    model_version="v1.0",
                )
                db.add(db_prediction)
                db.commit()
                db.refresh(db_prediction)
                predictions.append(PredictionResponseSchema.from_orm(db_prediction))
        except Exception as e:
            logger.error(f"Batch prediction error for {equipment_id}: {str(e)}")
            failed_count += 1

    return BatchPredictionResponse(
        predictions=predictions,
        processed_count=len(predictions),
        failed_count=failed_count,
        timestamp=datetime.utcnow(),
    )


@app.get("/predictions/{equipment_id}", response_model=List[PredictionResponseSchema])
async def get_predictions(equipment_id: str, db: Session = Depends(get_db)):
    """Get prediction history for equipment"""
    predictions = (
        db.query(Prediction)
        .filter(Prediction.equipment_id == equipment_id)
        .order_by(Prediction.prediction_timestamp.desc())
        .limit(10)
        .all()
    )
    return predictions


# Maintenance endpoints
@app.get("/maintenance/upcoming", response_model=List[MaintenanceEventResponseSchema])
async def get_upcoming_maintenance(db: Session = Depends(get_db)):
    """Get upcoming maintenance tasks"""
    maintenance = (
        db.query(MaintenanceEvent)
        .filter(MaintenanceEvent.scheduled_date >= datetime.utcnow())
        .order_by(MaintenanceEvent.scheduled_date)
        .all()
    )
    return maintenance


@app.post("/maintenance", response_model=MaintenanceEventResponseSchema)
async def create_maintenance(
    maintenance: MaintenanceEventSchema, db: Session = Depends(get_db)
):
    """Create maintenance event"""
    db_maintenance = MaintenanceEvent(**maintenance.dict())
    db.add(db_maintenance)
    db.commit()
    db.refresh(db_maintenance)
    return db_maintenance


# Salesforce/Agentforce integration
@app.post("/actions/create_case", response_model=CreateCaseResponse)
async def create_service_case(
    request: CreateCaseRequest, db: Session = Depends(get_db)
):
    """Create Salesforce service case for equipment failure"""
    try:
        case_id = f"CASE-{datetime.utcnow().timestamp()}"

        # Log audit trail
        audit = AuditLog(
            equipment_id=request.equipment_id,
            action="create_case",
            user_id="system",
            timestamp=datetime.utcnow(),
        )
        db.add(audit)
        db.commit()

        return CreateCaseResponse(
            case_id=case_id,
            equipment_id=request.equipment_id,
            status="created",
            created_at=datetime.utcnow(),
            salesforce_id=f"SF-{case_id}",
        )
    except Exception as e:
        logger.error(f"Error creating case: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create case")


# Webhook endpoint for Tableau extensions
@app.post("/webhooks/tableau")
async def tableau_webhook(payload: WebhookPayload, db: Session = Depends(get_db)):
    """Handle Tableau extension webhook events"""
    try:
        logger.info(f"Tableau webhook received: {payload.action}")

        if payload.action == "create_case":
            # Handle case creation
            pass
        elif payload.action == "reserve_parts":
            # Handle parts reservation
            pass
        elif payload.action == "simulate_whatif":
            # Handle what-if simulation
            pass

        return {"status": "success", "message": "Webhook processed"}
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")


# WebSocket endpoint for real-time updates
@app.websocket("/ws/equipment/{equipment_id}")
async def websocket_endpoint(websocket: WebSocket, equipment_id: str):
    """WebSocket endpoint for real-time equipment updates"""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(
                {
                    "type": "message",
                    "equipment_id": equipment_id,
                    "data": data,
                    "timestamp": datetime.utcnow().isoformat(),
                }
            )
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info(f"Client disconnected from {equipment_id}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
