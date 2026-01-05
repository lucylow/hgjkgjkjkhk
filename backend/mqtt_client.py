import paho.mqtt.client as mqtt
import json
import logging
from typing import Callable, Optional
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class MQTTClient:
    """MQTT client for IoT device integration"""

    def __init__(
        self,
        broker: str = None,
        port: int = 1883,
        topic_prefix: str = "equipment/+/sensors",
        on_message_callback: Optional[Callable] = None,
    ):
        self.broker = broker or os.getenv("MQTT_BROKER", "localhost")
        self.port = port or int(os.getenv("MQTT_PORT", 1883))
        self.topic_prefix = topic_prefix or os.getenv("MQTT_TOPIC_PREFIX", "equipment/+/sensors")
        self.on_message_callback = on_message_callback
        self.client = mqtt.Client()
        self.connected = False

        # Set callbacks
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message
        self.client.on_disconnect = self._on_disconnect

    def _on_connect(self, client, userdata, flags, rc):
        """Callback for when client connects to broker"""
        if rc == 0:
            logger.info(f"Connected to MQTT broker at {self.broker}:{self.port}")
            self.connected = True
            # Subscribe to equipment sensors
            client.subscribe(self.topic_prefix)
        else:
            logger.error(f"Failed to connect to MQTT broker. Code: {rc}")
            self.connected = False

    def _on_message(self, client, userdata, msg):
        """Callback for when message is received"""
        try:
            payload = json.loads(msg.payload.decode())
            logger.info(f"Received message on {msg.topic}: {payload}")

            if self.on_message_callback:
                self.on_message_callback(msg.topic, payload)
        except json.JSONDecodeError:
            logger.error(f"Failed to decode JSON payload: {msg.payload}")
        except Exception as e:
            logger.error(f"Error processing MQTT message: {str(e)}")

    def _on_disconnect(self, client, userdata, rc):
        """Callback for when client disconnects"""
        if rc != 0:
            logger.warning(f"Unexpected disconnection. Code: {rc}")
        self.connected = False

    def connect(self):
        """Connect to MQTT broker"""
        try:
            self.client.connect(self.broker, self.port, keepalive=60)
            self.client.loop_start()
            logger.info("MQTT client started")
        except Exception as e:
            logger.error(f"Failed to connect to MQTT broker: {str(e)}")

    def disconnect(self):
        """Disconnect from MQTT broker"""
        self.client.loop_stop()
        self.client.disconnect()
        logger.info("MQTT client disconnected")

    def publish(self, topic: str, payload: dict):
        """Publish message to MQTT topic"""
        try:
            message = json.dumps(payload)
            self.client.publish(topic, message)
            logger.info(f"Published to {topic}: {message}")
        except Exception as e:
            logger.error(f"Failed to publish MQTT message: {str(e)}")

    def is_connected(self) -> bool:
        """Check if client is connected"""
        return self.connected
