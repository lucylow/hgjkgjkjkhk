from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum


class EquipmentStatusEnum(str, Enum):
    HEALTHY = "healthy"
    WARNING = "warning"
    CRITICAL = "critical"
    DOWN = "down"


class SensorReadingSchema(BaseModel):
    equipment_id: str
    temperature: Optional[float] = None
    vibration: Optional[float] = None
    pressure: Optional[float] = None
    power_consumption: Optional[float] = None
    operating_hours: Optional[float] = None
    anomaly_score: Optional[float] = 0.0
    raw_data: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True


class PredictionSchema(BaseModel):
    equipment_id: str
    failure_probability: float = Field(..., ge=0.0, le=1.0)
    rul_days: Optional[int] = None
    expected_failure_date: Optional[datetime] = None
    confidence_score: Optional[float] = None
    top_factors: Optional[str] = None
    feature_importance: Optional[Dict[str, float]] = None
    model_version: Optional[str] = None

    class Config:
        from_attributes = True


class PredictionResponseSchema(PredictionSchema):
    id: int
    prediction_timestamp: datetime
    created_at: datetime


class EquipmentSchema(BaseModel):
    equipment_id: str
    name: str
    type: str
    location: Optional[str] = None
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    criticality: Optional[str] = None
    status: EquipmentStatusEnum = EquipmentStatusEnum.HEALTHY
    health_score: float = 100.0
    last_reading_time: Optional[datetime] = None

    class Config:
        from_attributes = True


class EquipmentDetailSchema(EquipmentSchema):
    id: int
    created_at: datetime
    updated_at: datetime


class HealthStatusSchema(BaseModel):
    equipment_id: str
    name: str
    status: EquipmentStatusEnum
    health_score: float
    rul_days: Optional[int] = None
    failure_probability: Optional[float] = None
    last_update: datetime
    sensor_data: Optional[SensorReadingSchema] = None
    latest_prediction: Optional[PredictionResponseSchema] = None


class BatchPredictionRequest(BaseModel):
    equipment_ids: List[str]
    include_explanation: bool = True


class BatchPredictionResponse(BaseModel):
    predictions: List[PredictionResponseSchema]
    processed_count: int
    failed_count: int
    timestamp: datetime


class MaintenanceEventSchema(BaseModel):
    equipment_id: str
    maintenance_type: str
    status: str = "scheduled"
    description: Optional[str] = None
    scheduled_date: datetime
    estimated_duration: Optional[int] = None
    parts_required: Optional[str] = None
    technician_assigned: Optional[str] = None
    cost: Optional[float] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class MaintenanceEventResponseSchema(MaintenanceEventSchema):
    id: int
    completed_date: Optional[datetime] = None
    actual_duration: Optional[int] = None
    created_at: datetime
    updated_at: datetime


class CreateCaseRequest(BaseModel):
    equipment_id: str
    failure_probability: float
    rul_days: Optional[int] = None
    description: Optional[str] = None
    priority: str = "high"


class CreateCaseResponse(BaseModel):
    case_id: str
    equipment_id: str
    status: str
    created_at: datetime
    salesforce_id: Optional[str] = None


class WebhookPayload(BaseModel):
    action: str
    equipment_id: str
    user_id: str
    timestamp: datetime
    payload: Dict[str, Any]


class ModelRegistrySchema(BaseModel):
    model_version: str
    model_type: str
    auc_score: float
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    is_active: bool = False

    class Config:
        from_attributes = True


class AnomalyDetectionSchema(BaseModel):
    equipment_id: str
    anomaly_score: float
    severity: str
    detected_at: datetime
    description: str
    recommended_action: Optional[str] = None
