import requests
import json
import logging
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class SalesforceAgentforce:
    """Salesforce Agentforce integration for case creation and automation"""

    def __init__(
        self,
        instance_url: str = None,
        api_key: str = None,
        api_version: str = "v60.0",
    ):
        self.instance_url = instance_url or os.getenv("SALESFORCE_INSTANCE_URL")
        self.api_key = api_key or os.getenv("SALESFORCE_API_KEY")
        self.api_version = api_version
        self.base_url = f"{self.instance_url}/services/data/{api_version}"

    def create_service_case(
        self,
        equipment_id: str,
        subject: str,
        description: str,
        priority: str = "High",
        failure_probability: Optional[float] = None,
        rul_days: Optional[int] = None,
    ) -> Optional[str]:
        """Create a service case in Salesforce"""
        if not self.instance_url or not self.api_key:
            logger.warning("Salesforce credentials not configured")
            return None

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }

            case_data = {
                "Subject": subject,
                "Description": description,
                "Priority": priority,
                "Status": "New",
                "Origin": "Predictive Maintenance System",
                "Equipment_ID__c": equipment_id,
            }

            if failure_probability is not None:
                case_data["Failure_Probability__c"] = failure_probability * 100

            if rul_days is not None:
                case_data["RUL_Days__c"] = rul_days

            url = f"{self.base_url}/sobjects/Case/"
            response = requests.post(url, json=case_data, headers=headers)

            if response.status_code in [200, 201]:
                result = response.json()
                case_id = result.get("id")
                logger.info(f"Service case created: {case_id}")
                return case_id
            else:
                logger.error(f"Failed to create case: {response.text}")
                return None
        except Exception as e:
            logger.error(f"Error creating Salesforce case: {str(e)}")
            return None

    def update_case_status(self, case_id: str, status: str) -> bool:
        """Update case status in Salesforce"""
        if not self.instance_url or not self.api_key:
            logger.warning("Salesforce credentials not configured")
            return False

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }

            update_data = {"Status": status}

            url = f"{self.base_url}/sobjects/Case/{case_id}"
            response = requests.patch(url, json=update_data, headers=headers)

            if response.status_code in [200, 204]:
                logger.info(f"Case {case_id} updated to {status}")
                return True
            else:
                logger.error(f"Failed to update case: {response.text}")
                return False
        except Exception as e:
            logger.error(f"Error updating Salesforce case: {str(e)}")
            return False

    def assign_technician(self, case_id: str, technician_id: str) -> bool:
        """Assign technician to case"""
        if not self.instance_url or not self.api_key:
            logger.warning("Salesforce credentials not configured")
            return False

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }

            update_data = {"OwnerId": technician_id}

            url = f"{self.base_url}/sobjects/Case/{case_id}"
            response = requests.patch(url, json=update_data, headers=headers)

            if response.status_code in [200, 204]:
                logger.info(f"Technician assigned to case {case_id}")
                return True
            else:
                logger.error(f"Failed to assign technician: {response.text}")
                return False
        except Exception as e:
            logger.error(f"Error assigning technician: {str(e)}")
            return False

    def create_work_order(
        self,
        case_id: str,
        equipment_id: str,
        maintenance_type: str,
        estimated_duration: int,
        parts_required: Optional[str] = None,
    ) -> Optional[str]:
        """Create work order in Salesforce"""
        if not self.instance_url or not self.api_key:
            logger.warning("Salesforce credentials not configured")
            return None

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }

            work_order_data = {
                "Subject": f"{maintenance_type} - {equipment_id}",
                "Description": f"Maintenance work for {equipment_id}",
                "Status": "New",
                "Priority": "High",
                "ParentRecordId": case_id,
                "Equipment_ID__c": equipment_id,
                "Maintenance_Type__c": maintenance_type,
                "Estimated_Duration__c": estimated_duration,
            }

            if parts_required:
                work_order_data["Parts_Required__c"] = parts_required

            url = f"{self.base_url}/sobjects/WorkOrder/"
            response = requests.post(url, json=work_order_data, headers=headers)

            if response.status_code in [200, 201]:
                result = response.json()
                work_order_id = result.get("id")
                logger.info(f"Work order created: {work_order_id}")
                return work_order_id
            else:
                logger.error(f"Failed to create work order: {response.text}")
                return None
        except Exception as e:
            logger.error(f"Error creating work order: {str(e)}")
            return None

    def get_case(self, case_id: str) -> Optional[dict]:
        """Get case details from Salesforce"""
        if not self.instance_url or not self.api_key:
            logger.warning("Salesforce credentials not configured")
            return None

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }

            url = f"{self.base_url}/sobjects/Case/{case_id}"
            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Failed to get case: {response.text}")
                return None
        except Exception as e:
            logger.error(f"Error getting case: {str(e)}")
            return None

    def query_cases(self, equipment_id: str) -> Optional[list]:
        """Query cases for equipment"""
        if not self.instance_url or not self.api_key:
            logger.warning("Salesforce credentials not configured")
            return None

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }

            query = f"SELECT Id, Subject, Status, Priority FROM Case WHERE Equipment_ID__c = '{equipment_id}' ORDER BY CreatedDate DESC LIMIT 10"
            url = f"{self.base_url}/query?q={query}"

            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                result = response.json()
                return result.get("records", [])
            else:
                logger.error(f"Failed to query cases: {response.text}")
                return None
        except Exception as e:
            logger.error(f"Error querying cases: {str(e)}")
            return None
