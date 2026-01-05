import requests
import json
import logging
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class SlackNotifier:
    """Send notifications to Slack"""

    def __init__(self, bot_token: str = None, channel: str = None):
        self.bot_token = bot_token or os.getenv("SLACK_BOT_TOKEN")
        self.channel = channel or os.getenv("SLACK_CHANNEL", "#predictive-maintenance")
        self.webhook_url = None
        self._init_webhook()

    def _init_webhook(self):
        """Initialize Slack webhook"""
        if self.bot_token:
            self.webhook_url = f"https://hooks.slack.com/services/{self.bot_token}"
            logger.info("Slack notifier initialized")
        else:
            logger.warning("Slack bot token not configured")

    def send_alert(
        self,
        equipment_id: str,
        alert_type: str,
        failure_probability: float,
        rul_days: int,
        description: Optional[str] = None,
    ):
        """Send equipment alert to Slack"""
        if not self.webhook_url:
            logger.warning("Slack webhook not configured")
            return False

        try:
            color = "#FF0000" if alert_type == "critical" else "#FFA500"
            title = f"🚨 {alert_type.upper()} Alert" if alert_type == "critical" else f"⚠️ {alert_type.upper()} Alert"

            payload = {
                "channel": self.channel,
                "attachments": [
                    {
                        "color": color,
                        "title": title,
                        "fields": [
                            {"title": "Equipment ID", "value": equipment_id, "short": True},
                            {
                                "title": "Failure Probability",
                                "value": f"{failure_probability * 100:.1f}%",
                                "short": True,
                            },
                            {"title": "RUL (Days)", "value": str(rul_days), "short": True},
                            {"title": "Alert Type", "value": alert_type, "short": True},
                        ],
                        "text": description or "Equipment failure risk detected",
                        "footer": "FleetVision Predictive Maintenance",
                        "ts": int(__import__("time").time()),
                    }
                ],
            }

            response = requests.post(self.webhook_url, json=payload)
            if response.status_code == 200:
                logger.info(f"Slack alert sent for {equipment_id}")
                return True
            else:
                logger.error(f"Failed to send Slack alert: {response.text}")
                return False
        except Exception as e:
            logger.error(f"Error sending Slack alert: {str(e)}")
            return False

    def send_maintenance_reminder(
        self,
        equipment_id: str,
        maintenance_type: str,
        scheduled_date: str,
        description: Optional[str] = None,
    ):
        """Send maintenance reminder to Slack"""
        if not self.webhook_url:
            logger.warning("Slack webhook not configured")
            return False

        try:
            payload = {
                "channel": self.channel,
                "attachments": [
                    {
                        "color": "#0099FF",
                        "title": "📅 Maintenance Scheduled",
                        "fields": [
                            {"title": "Equipment ID", "value": equipment_id, "short": True},
                            {"title": "Maintenance Type", "value": maintenance_type, "short": True},
                            {"title": "Scheduled Date", "value": scheduled_date, "short": True},
                        ],
                        "text": description or "Maintenance task scheduled",
                        "footer": "FleetVision Predictive Maintenance",
                        "ts": int(__import__("time").time()),
                    }
                ],
            }

            response = requests.post(self.webhook_url, json=payload)
            if response.status_code == 200:
                logger.info(f"Maintenance reminder sent for {equipment_id}")
                return True
            else:
                logger.error(f"Failed to send maintenance reminder: {response.text}")
                return False
        except Exception as e:
            logger.error(f"Error sending maintenance reminder: {str(e)}")
            return False

    def send_status_update(self, fleet_stats: dict):
        """Send fleet status update to Slack"""
        if not self.webhook_url:
            logger.warning("Slack webhook not configured")
            return False

        try:
            payload = {
                "channel": self.channel,
                "attachments": [
                    {
                        "color": "#36A64F",
                        "title": "📊 Fleet Status Update",
                        "fields": [
                            {
                                "title": "Healthy Equipment",
                                "value": str(fleet_stats.get("healthy", 0)),
                                "short": True,
                            },
                            {
                                "title": "Warning Status",
                                "value": str(fleet_stats.get("warning", 0)),
                                "short": True,
                            },
                            {
                                "title": "Critical Status",
                                "value": str(fleet_stats.get("critical", 0)),
                                "short": True,
                            },
                            {
                                "title": "Down Equipment",
                                "value": str(fleet_stats.get("down", 0)),
                                "short": True,
                            },
                            {
                                "title": "Average Health Score",
                                "value": f"{fleet_stats.get('avg_health', 0):.1f}%",
                                "short": True,
                            },
                        ],
                        "footer": "FleetVision Predictive Maintenance",
                        "ts": int(__import__("time").time()),
                    }
                ],
            }

            response = requests.post(self.webhook_url, json=payload)
            if response.status_code == 200:
                logger.info("Fleet status update sent to Slack")
                return True
            else:
                logger.error(f"Failed to send status update: {response.text}")
                return False
        except Exception as e:
            logger.error(f"Error sending status update: {str(e)}")
            return False
