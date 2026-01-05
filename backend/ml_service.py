import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import json
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
import logging

logger = logging.getLogger(__name__)


class PredictiveModel:
    """ML model for equipment failure prediction"""

    def __init__(self, model_version: str = "v1.0"):
        self.model_version = model_version
        self.classifier = None
        self.scaler = StandardScaler()
        self.feature_names = [
            "temperature",
            "vibration",
            "pressure",
            "power_consumption",
            "operating_hours",
        ]
        self.model_path = f"models/failure_predictor_{model_version}.pkl"
        self.load_or_train_model()

    def load_or_train_model(self):
        """Load existing model or train a new one"""
        try:
            self.classifier = joblib.load(self.model_path)
            logger.info(f"Loaded model from {self.model_path}")
        except FileNotFoundError:
            logger.info("Training new model...")
            self._train_model()

    def _train_model(self):
        """Train a new failure prediction model"""
        # Generate synthetic training data for demonstration
        np.random.seed(42)
        n_samples = 1000

        X = np.random.randn(n_samples, len(self.feature_names))
        y = (
            (X[:, 0] > 1.5)
            | (X[:, 1] > 1.2)
            | (X[:, 2] > 1.0)
            | (X[:, 3] > 1.3)
        ).astype(int)

        self.classifier = RandomForestClassifier(n_estimators=100, random_state=42)
        self.classifier.fit(X, y)

        joblib.dump(self.classifier, self.model_path)
        logger.info(f"Model trained and saved to {self.model_path}")

    def predict(
        self, sensor_data: Dict[str, float]
    ) -> Tuple[float, int, float, Dict[str, float]]:
        """
        Predict failure probability and RUL for equipment

        Returns:
            (failure_probability, rul_days, confidence_score, feature_importance)
        """
        try:
            # Extract features in correct order
            features = np.array(
                [
                    [
                        sensor_data.get("temperature", 0),
                        sensor_data.get("vibration", 0),
                        sensor_data.get("pressure", 0),
                        sensor_data.get("power_consumption", 0),
                        sensor_data.get("operating_hours", 0),
                    ]
                ]
            )

            # Get failure probability
            failure_prob = self.classifier.predict_proba(features)[0, 1]

            # Calculate RUL based on failure probability
            rul_days = max(1, int(30 * (1 - failure_prob)))

            # Calculate confidence score
            confidence = float(np.max(self.classifier.predict_proba(features)))

            # Get feature importance
            feature_importance = self._get_feature_importance(features)

            return failure_prob, rul_days, confidence, feature_importance

        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            return 0.0, 30, 0.0, {}

    def _get_feature_importance(self, features: np.ndarray) -> Dict[str, float]:
        """Calculate feature importance for the prediction"""
        importances = self.classifier.feature_importances_
        feature_importance = {}

        for name, importance in zip(self.feature_names, importances):
            feature_importance[name] = float(importance)

        # Sort by importance
        sorted_importance = dict(
            sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
        )
        return sorted_importance

    def batch_predict(
        self, sensor_data_list: List[Dict[str, float]]
    ) -> List[Tuple[float, int, float, Dict[str, float]]]:
        """Batch prediction for multiple equipment"""
        results = []
        for sensor_data in sensor_data_list:
            result = self.predict(sensor_data)
            results.append(result)
        return results


class AnomalyDetector:
    """Detect anomalies in sensor data"""

    def __init__(self, threshold: float = 2.0):
        self.threshold = threshold

    def detect_anomaly(self, sensor_data: Dict[str, float]) -> Tuple[float, str]:
        """
        Detect anomalies in sensor readings

        Returns:
            (anomaly_score, severity)
        """
        anomaly_score = 0.0
        severity_factors = []

        # Temperature anomaly
        temp = sensor_data.get("temperature", 0)
        if temp > 80:
            anomaly_score += 0.3
            severity_factors.append("High temperature")
        elif temp < 10:
            anomaly_score += 0.2
            severity_factors.append("Low temperature")

        # Vibration anomaly
        vibration = sensor_data.get("vibration", 0)
        if vibration > 5.0:
            anomaly_score += 0.4
            severity_factors.append("High vibration")

        # Pressure anomaly
        pressure = sensor_data.get("pressure", 0)
        if pressure > 15 or pressure < 2:
            anomaly_score += 0.3
            severity_factors.append("Abnormal pressure")

        # Power consumption anomaly
        power = sensor_data.get("power_consumption", 0)
        if power > 50:
            anomaly_score += 0.2
            severity_factors.append("High power consumption")

        # Determine severity
        if anomaly_score > 0.7:
            severity = "critical"
        elif anomaly_score > 0.4:
            severity = "warning"
        else:
            severity = "normal"

        return min(1.0, anomaly_score), severity

    def get_recommended_action(self, severity: str) -> str:
        """Get recommended action based on anomaly severity"""
        actions = {
            "critical": "Immediate shutdown and inspection required",
            "warning": "Schedule preventive maintenance within 24 hours",
            "normal": "Continue normal operation with monitoring",
        }
        return actions.get(severity, "Monitor equipment")


class HealthScoreCalculator:
    """Calculate equipment health score"""

    def __init__(self):
        self.weights = {
            "temperature": 0.25,
            "vibration": 0.35,
            "pressure": 0.20,
            "power_consumption": 0.10,
            "operating_hours": 0.10,
        }

    def calculate_health_score(self, sensor_data: Dict[str, float]) -> float:
        """
        Calculate health score (0-100) based on sensor data

        Returns:
            health_score (0-100)
        """
        health_score = 100.0

        # Temperature impact
        temp = sensor_data.get("temperature", 0)
        if temp > 80:
            health_score -= 30 * self.weights["temperature"]
        elif temp > 60:
            health_score -= 15 * self.weights["temperature"]

        # Vibration impact
        vibration = sensor_data.get("vibration", 0)
        if vibration > 5.0:
            health_score -= 40 * self.weights["vibration"]
        elif vibration > 3.0:
            health_score -= 20 * self.weights["vibration"]

        # Pressure impact
        pressure = sensor_data.get("pressure", 0)
        if pressure > 15 or pressure < 2:
            health_score -= 25 * self.weights["pressure"]
        elif pressure > 12 or pressure < 3:
            health_score -= 10 * self.weights["pressure"]

        # Power consumption impact
        power = sensor_data.get("power_consumption", 0)
        if power > 50:
            health_score -= 15 * self.weights["power_consumption"]

        # Operating hours impact (degradation over time)
        hours = sensor_data.get("operating_hours", 0)
        if hours > 10000:
            health_score -= 20 * self.weights["operating_hours"]
        elif hours > 5000:
            health_score -= 10 * self.weights["operating_hours"]

        return max(0.0, min(100.0, health_score))

    def determine_status(self, health_score: float) -> str:
        """Determine equipment status based on health score"""
        if health_score >= 80:
            return "healthy"
        elif health_score >= 60:
            return "warning"
        elif health_score >= 30:
            return "critical"
        else:
            return "down"
