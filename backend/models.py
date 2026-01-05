from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, Enum, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()


class EquipmentStatus(str, enum.Enum):
    HEALTHY = "healthy"
    WARNING = "warning"
    CRITICAL = "critical"
    DOWN = "down"


class MaintenanceStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True)
    equipment_id = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)
    location = Column(String(255))
    manufacturer = Column(String(255))
    model = Column(String(255))
    criticality = Column(String(50))
    status = Column(Enum(EquipmentStatus), default=EquipmentStatus.HEALTHY)
    health_score = Column(Float, default=100.0)
    last_reading_time = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    sensor_readings = relationship("SensorReading", back_populates="equipment")
    predictions = relationship("Prediction", back_populates="equipment")
    maintenance_events = relationship("MaintenanceEvent", back_populates="equipment")


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True)
    equipment_id = Column(String(50), ForeignKey("equipment.equipment_id"))
    temperature = Column(Float)
    vibration = Column(Float)
    pressure = Column(Float)
    power_consumption = Column(Float)
    operating_hours = Column(Float)
    anomaly_score = Column(Float, default=0.0)
    raw_data = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    equipment = relationship("Equipment", back_populates="sensor_readings")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True)
    equipment_id = Column(String(50), ForeignKey("equipment.equipment_id"))
    failure_probability = Column(Float, nullable=False)
    rul_days = Column(Integer)
    expected_failure_date = Column(DateTime)
    confidence_score = Column(Float)
    top_factors = Column(Text)
    feature_importance = Column(JSON)
    model_version = Column(String(50))
    prediction_timestamp = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    equipment = relationship("Equipment", back_populates="predictions")


class MaintenanceEvent(Base):
    __tablename__ = "maintenance_events"

    id = Column(Integer, primary_key=True)
    equipment_id = Column(String(50), ForeignKey("equipment.equipment_id"))
    maintenance_type = Column(String(100))
    status = Column(Enum(MaintenanceStatus), default=MaintenanceStatus.SCHEDULED)
    description = Column(Text)
    scheduled_date = Column(DateTime)
    completed_date = Column(DateTime)
    estimated_duration = Column(Integer)
    actual_duration = Column(Integer)
    parts_required = Column(Text)
    technician_assigned = Column(String(255))
    cost = Column(Float)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    equipment = relationship("Equipment", back_populates="maintenance_events")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True)
    equipment_id = Column(String(50))
    action = Column(String(100))
    prediction_id = Column(Integer)
    payload_hash = Column(String(255))
    solana_tx_hash = Column(String(255))
    user_id = Column(String(100))
    ip_address = Column(String(50))
    timestamp = Column(DateTime, default=datetime.utcnow)


class ModelRegistry(Base):
    __tablename__ = "model_registry"

    id = Column(Integer, primary_key=True)
    model_version = Column(String(50), unique=True)
    model_type = Column(String(100))
    training_date = Column(DateTime)
    dataset_hash = Column(String(255))
    auc_score = Column(Float)
    accuracy = Column(Float)
    precision = Column(Float)
    recall = Column(Float)
    f1_score = Column(Float)
    model_path = Column(String(500))
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
