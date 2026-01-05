import json
import logging
from kafka import KafkaProducer
from kafka.errors import KafkaError
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class SensorEventProducer:
    """Kafka producer for sensor events"""

    def __init__(
        self,
        bootstrap_servers: str = None,
        topic: str = None,
    ):
        self.bootstrap_servers = (bootstrap_servers or os.getenv("KAFKA_BROKER", "localhost:9092")).split(
            ","
        )
        self.topic = topic or os.getenv("KAFKA_TOPIC_SENSORS", "sensor_readings")
        self.producer = None
        self._init_producer()

    def _init_producer(self):
        """Initialize Kafka producer"""
        try:
            self.producer = KafkaProducer(
                bootstrap_servers=self.bootstrap_servers,
                value_serializer=lambda v: json.dumps(v).encode("utf-8"),
                acks="all",
                retries=3,
            )
            logger.info(f"Kafka producer initialized for topic: {self.topic}")
        except Exception as e:
            logger.error(f"Failed to initialize Kafka producer: {str(e)}")
            self.producer = None

    def send_sensor_reading(self, equipment_id: str, sensor_data: dict):
        """Send sensor reading to Kafka"""
        if not self.producer:
            logger.warning("Kafka producer not available")
            return False

        try:
            message = {
                "equipment_id": equipment_id,
                "sensor_data": sensor_data,
                "timestamp": str(__import__("datetime").datetime.utcnow()),
            }

            future = self.producer.send(self.topic, value=message, key=equipment_id.encode())
            record_metadata = future.get(timeout=10)

            logger.info(
                f"Sent sensor reading to Kafka: {record_metadata.topic} "
                f"[{record_metadata.partition}] @ {record_metadata.offset}"
            )
            return True
        except KafkaError as e:
            logger.error(f"Failed to send message to Kafka: {str(e)}")
            return False

    def send_prediction(self, equipment_id: str, prediction_data: dict):
        """Send prediction to Kafka"""
        if not self.producer:
            logger.warning("Kafka producer not available")
            return False

        try:
            topic = os.getenv("KAFKA_TOPIC_PREDICTIONS", "predictions")
            message = {
                "equipment_id": equipment_id,
                "prediction": prediction_data,
                "timestamp": str(__import__("datetime").datetime.utcnow()),
            }

            future = self.producer.send(topic, value=message, key=equipment_id.encode())
            record_metadata = future.get(timeout=10)

            logger.info(
                f"Sent prediction to Kafka: {record_metadata.topic} "
                f"[{record_metadata.partition}] @ {record_metadata.offset}"
            )
            return True
        except KafkaError as e:
            logger.error(f"Failed to send prediction to Kafka: {str(e)}")
            return False

    def close(self):
        """Close producer connection"""
        if self.producer:
            self.producer.close()
            logger.info("Kafka producer closed")


class SensorEventConsumer:
    """Kafka consumer for sensor events"""

    def __init__(
        self,
        bootstrap_servers: str = None,
        topic: str = None,
        group_id: str = "sensor-processor",
    ):
        self.bootstrap_servers = (bootstrap_servers or os.getenv("KAFKA_BROKER", "localhost:9092")).split(
            ","
        )
        self.topic = topic or os.getenv("KAFKA_TOPIC_SENSORS", "sensor_readings")
        self.group_id = group_id
        self.consumer = None
        self._init_consumer()

    def _init_consumer(self):
        """Initialize Kafka consumer"""
        try:
            from kafka import KafkaConsumer

            self.consumer = KafkaConsumer(
                self.topic,
                bootstrap_servers=self.bootstrap_servers,
                group_id=self.group_id,
                value_deserializer=lambda m: json.loads(m.decode("utf-8")),
                auto_offset_reset="earliest",
                enable_auto_commit=True,
            )
            logger.info(f"Kafka consumer initialized for topic: {self.topic}")
        except Exception as e:
            logger.error(f"Failed to initialize Kafka consumer: {str(e)}")
            self.consumer = None

    def consume_messages(self, callback=None, timeout_ms=1000):
        """Consume messages from Kafka"""
        if not self.consumer:
            logger.warning("Kafka consumer not available")
            return

        try:
            for message in self.consumer:
                logger.info(f"Consumed message: {message.value}")
                if callback:
                    callback(message.value)
        except Exception as e:
            logger.error(f"Error consuming messages: {str(e)}")

    def close(self):
        """Close consumer connection"""
        if self.consumer:
            self.consumer.close()
            logger.info("Kafka consumer closed")
