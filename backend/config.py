import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration"""

    # Database
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:password@localhost:3306/fleetvision_db"
    )

    # API
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    API_PORT = int(os.getenv("API_PORT", 8000))
    API_DEBUG = os.getenv("API_DEBUG", "False").lower() == "true"

    # ML Model
    MODEL_VERSION = os.getenv("MODEL_VERSION", "v1.0")
    MODEL_PATH = os.getenv("MODEL_PATH", "models/failure_predictor_v1.0.pkl")
    ANOMALY_THRESHOLD = float(os.getenv("ANOMALY_THRESHOLD", 2.0))

    # Salesforce
    SALESFORCE_API_KEY = os.getenv("SALESFORCE_API_KEY")
    SALESFORCE_INSTANCE_URL = os.getenv("SALESFORCE_INSTANCE_URL")

    # Slack
    SLACK_BOT_TOKEN = os.getenv("SLACK_BOT_TOKEN")
    SLACK_CHANNEL = os.getenv("SLACK_CHANNEL", "#predictive-maintenance")

    # Kafka
    KAFKA_BROKER = os.getenv("KAFKA_BROKER", "localhost:9092")
    KAFKA_TOPIC_SENSORS = os.getenv("KAFKA_TOPIC_SENSORS", "sensor_readings")
    KAFKA_TOPIC_PREDICTIONS = os.getenv("KAFKA_TOPIC_PREDICTIONS", "predictions")

    # MQTT
    MQTT_BROKER = os.getenv("MQTT_BROKER", "localhost")
    MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))
    MQTT_TOPIC_PREFIX = os.getenv("MQTT_TOPIC_PREFIX", "equipment/+/sensors")

    # Redis
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT = os.getenv("LOG_FORMAT", "json")
