import { Equipment, EquipmentStatus, EquipmentType, SensorReading, FailurePrediction, MaintenanceRecord, FailureMode, PredictionStatus, MaintenanceType, WorkOrderStatus } from "@/types/equipment";

// ============= PLANTS & FACILITIES =============
export interface Plant {
  id: string;
  name: string;
  location: string;
  country: string;
  timezone: string;
  operationalSince: Date;
  totalAssets: number;
  productionLines: number;
}

export const mockPlants: Plant[] = [
  { id: "plant-usa", name: "Austin Manufacturing Center", location: "Austin, TX", country: "USA", timezone: "America/Chicago", operationalSince: new Date("2018-03-15"), totalAssets: 24, productionLines: 4 },
  { id: "plant-ger", name: "Munich Production Hub", location: "Munich", country: "Germany", timezone: "Europe/Berlin", operationalSince: new Date("2015-07-01"), totalAssets: 32, productionLines: 5 },
  { id: "plant-jpn", name: "Osaka Smart Factory", location: "Osaka", country: "Japan", timezone: "Asia/Tokyo", operationalSince: new Date("2020-01-10"), totalAssets: 18, productionLines: 3 },
];

// ============= TECHNICIANS =============
export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specializations: string[];
  certifications: string[];
  plantId: string;
  availability: "available" | "busy" | "off-duty";
  currentWorkOrderId?: string;
  avgRepairTime: number; // hours
  completedJobs: number;
  rating: number;
}

export const mockTechnicians: Technician[] = [
  { id: "tech-001", name: "John Smith", email: "john.smith@company.com", phone: "+1-512-555-0101", specializations: ["pumps", "hydraulics"], certifications: ["CMRP", "Level II Vibration Analyst"], plantId: "plant-usa", availability: "available", avgRepairTime: 3.2, completedJobs: 847, rating: 4.8 },
  { id: "tech-002", name: "Sarah Williams", email: "sarah.williams@company.com", phone: "+1-512-555-0102", specializations: ["motors", "electrical"], certifications: ["Master Electrician", "PLC Programming"], plantId: "plant-usa", availability: "busy", currentWorkOrderId: "wo-003", avgRepairTime: 2.8, completedJobs: 1203, rating: 4.9 },
  { id: "tech-003", name: "Mike Johnson", email: "mike.johnson@company.com", phone: "+1-512-555-0103", specializations: ["compressors", "pneumatics"], certifications: ["HVAC Certified", "Compressed Air Systems"], plantId: "plant-usa", availability: "available", avgRepairTime: 4.1, completedJobs: 562, rating: 4.6 },
  { id: "tech-004", name: "Hans Mueller", email: "hans.mueller@company.de", phone: "+49-89-555-0201", specializations: ["conveyors", "motors"], certifications: ["TÜV Certified", "Siemens Partner"], plantId: "plant-ger", availability: "available", avgRepairTime: 2.5, completedJobs: 1456, rating: 4.9 },
  { id: "tech-005", name: "Yuki Tanaka", email: "yuki.tanaka@company.jp", phone: "+81-6-555-0301", specializations: ["robotics", "sensors"], certifications: ["Fanuc Certified", "Industry 4.0 Specialist"], plantId: "plant-jpn", availability: "off-duty", avgRepairTime: 2.1, completedJobs: 678, rating: 5.0 },
];

// ============= INVENTORY PARTS =============
export interface InventoryPart {
  id: string;
  partNumber: string;
  description: string;
  category: string;
  onHand: number;
  reorderPoint: number;
  reorderQuantity: number;
  leadTimeDays: number;
  unitCost: number;
  compatibleEquipment: string[];
  supplier: string;
  lastRestocked: Date;
}

export const mockInventory: InventoryPart[] = [
  { id: "part-001", partNumber: "BRG-6205-2RS", description: "Deep Groove Ball Bearing 6205", category: "Bearings", onHand: 24, reorderPoint: 10, reorderQuantity: 50, leadTimeDays: 5, unitCost: 45.00, compatibleEquipment: ["PUMP", "MOTOR", "CONVEYOR"], supplier: "SKF Industrial", lastRestocked: new Date("2024-12-15") },
  { id: "part-002", partNumber: "SEAL-HYD-50MM", description: "Hydraulic Seal Kit 50mm", category: "Seals", onHand: 8, reorderPoint: 5, reorderQuantity: 20, leadTimeDays: 7, unitCost: 125.00, compatibleEquipment: ["PUMP"], supplier: "Parker Hannifin", lastRestocked: new Date("2024-11-20") },
  { id: "part-003", partNumber: "MTR-WIND-5KW", description: "Motor Winding Assembly 5kW", category: "Motors", onHand: 3, reorderPoint: 2, reorderQuantity: 5, leadTimeDays: 14, unitCost: 890.00, compatibleEquipment: ["MOTOR"], supplier: "Siemens Parts", lastRestocked: new Date("2024-10-01") },
  { id: "part-004", partNumber: "BELT-CONV-2M", description: "Conveyor Belt Section 2m", category: "Belts", onHand: 15, reorderPoint: 8, reorderQuantity: 30, leadTimeDays: 10, unitCost: 320.00, compatibleEquipment: ["CONVEYOR"], supplier: "Continental AG", lastRestocked: new Date("2024-12-01") },
  { id: "part-005", partNumber: "COMP-VALVE-REL", description: "Compressor Relief Valve", category: "Valves", onHand: 6, reorderPoint: 3, reorderQuantity: 10, leadTimeDays: 8, unitCost: 275.00, compatibleEquipment: ["COMPRESSOR"], supplier: "Atlas Copco", lastRestocked: new Date("2024-11-10") },
  { id: "part-006", partNumber: "SENS-TEMP-PT100", description: "PT100 Temperature Sensor", category: "Sensors", onHand: 45, reorderPoint: 20, reorderQuantity: 100, leadTimeDays: 3, unitCost: 65.00, compatibleEquipment: ["PUMP", "MOTOR", "COMPRESSOR", "MIXER"], supplier: "Omega Engineering", lastRestocked: new Date("2024-12-20") },
  { id: "part-007", partNumber: "SENS-VIB-ACC", description: "Vibration Accelerometer", category: "Sensors", onHand: 12, reorderPoint: 5, reorderQuantity: 25, leadTimeDays: 5, unitCost: 185.00, compatibleEquipment: ["PUMP", "MOTOR", "COMPRESSOR"], supplier: "PCB Piezotronics", lastRestocked: new Date("2024-12-10") },
  { id: "part-008", partNumber: "LUB-SYN-20L", description: "Synthetic Lubricant 20L", category: "Lubricants", onHand: 18, reorderPoint: 6, reorderQuantity: 24, leadTimeDays: 4, unitCost: 145.00, compatibleEquipment: ["PUMP", "MOTOR", "COMPRESSOR", "CONVEYOR", "MIXER"], supplier: "Mobil Industrial", lastRestocked: new Date("2024-12-18") },
];

// ============= WORK ORDERS =============
export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  equipmentId: string;
  priority: "low" | "medium" | "high" | "critical";
  status: WorkOrderStatus;
  type: MaintenanceType;
  description: string;
  assignedTechnicianId?: string;
  scheduledDate: Date;
  estimatedDuration: number; // hours
  actualDuration?: number;
  partsRequired: { partId: string; quantity: number }[];
  estimatedCost: number;
  actualCost?: number;
  createdAt: Date;
  completedAt?: Date;
  notes: string[];
  triggeredByPrediction?: string;
}

export const mockWorkOrders: WorkOrder[] = [
  { id: "wo-001", workOrderNumber: "WO-2025-0001", equipmentId: "eq-001", priority: "high", status: WorkOrderStatus.SCHEDULED, type: MaintenanceType.PREDICTIVE, description: "Bearing replacement - AI predicted failure within 7 days", assignedTechnicianId: "tech-001", scheduledDate: new Date("2025-01-08"), estimatedDuration: 4, partsRequired: [{ partId: "part-001", quantity: 2 }], estimatedCost: 540, createdAt: new Date("2025-01-02"), notes: ["Prediction confidence: 85%", "Vibration trending upward"], triggeredByPrediction: "pred-001" },
  { id: "wo-002", workOrderNumber: "WO-2025-0002", equipmentId: "eq-002", priority: "medium", status: WorkOrderStatus.SCHEDULED, type: MaintenanceType.PREVENTIVE, description: "Scheduled motor inspection and lubrication", assignedTechnicianId: "tech-002", scheduledDate: new Date("2025-01-15"), estimatedDuration: 3, partsRequired: [{ partId: "part-008", quantity: 1 }], estimatedCost: 395, createdAt: new Date("2024-12-20"), notes: ["Regular quarterly maintenance"] },
  { id: "wo-003", workOrderNumber: "WO-2024-0847", equipmentId: "eq-006", priority: "critical", status: WorkOrderStatus.IN_PROGRESS, type: MaintenanceType.PREDICTIVE, description: "Emergency seal replacement - imminent failure detected", assignedTechnicianId: "tech-002", scheduledDate: new Date("2025-01-05"), estimatedDuration: 5, partsRequired: [{ partId: "part-002", quantity: 1 }], estimatedCost: 1925, createdAt: new Date("2024-12-28"), notes: ["AI prediction: 89% failure probability", "Pressure drop detected", "Started 2025-01-05 10:00"], triggeredByPrediction: "pred-003" },
  { id: "wo-004", workOrderNumber: "WO-2025-0003", equipmentId: "eq-004", priority: "low", status: WorkOrderStatus.SCHEDULED, type: MaintenanceType.PREVENTIVE, description: "Compressor filter replacement and system check", scheduledDate: new Date("2025-01-20"), estimatedDuration: 2, partsRequired: [{ partId: "part-005", quantity: 1 }], estimatedCost: 425, createdAt: new Date("2025-01-03"), notes: ["Annual maintenance schedule"] },
];

// ============= AUTOMATION EVENTS =============
export interface AutomationEvent {
  id: string;
  type: "AUTO_CREATE_CASE" | "AUTO_ORDER_PARTS" | "AUTO_ASSIGN_TECH" | "AUTO_ESCALATE" | "AUTO_NOTIFY";
  trigger: string;
  assetId: string;
  action: string;
  status: "pending" | "executed" | "failed";
  timestamp: Date;
  details: Record<string, any>;
  executedBy: string;
}

export const mockAutomationEvents: AutomationEvent[] = [
  { id: "auto-001", type: "AUTO_CREATE_CASE", trigger: "LOW_RUL", assetId: "eq-001", action: "Create Field Service Case", status: "executed", timestamp: new Date("2025-01-02T09:14:23Z"), details: { rul_days: 7, prediction_id: "pred-001", case_number: "FSC-2025-0142" }, executedBy: "Agentforce" },
  { id: "auto-002", type: "AUTO_ORDER_PARTS", trigger: "PREDICTED_FAILURE", assetId: "eq-001", action: "Reserve Parts from Inventory", status: "executed", timestamp: new Date("2025-01-02T09:14:25Z"), details: { parts: ["BRG-6205-2RS"], quantity: 2, reserved_from: "Warehouse A" }, executedBy: "Agentforce" },
  { id: "auto-003", type: "AUTO_ASSIGN_TECH", trigger: "WORK_ORDER_CREATED", assetId: "eq-001", action: "Assign Available Technician", status: "executed", timestamp: new Date("2025-01-02T09:14:28Z"), details: { technician: "John Smith", skill_match: 0.95 }, executedBy: "Agentforce" },
  { id: "auto-004", type: "AUTO_NOTIFY", trigger: "CRITICAL_ALERT", assetId: "eq-006", action: "Send Slack Notification", status: "executed", timestamp: new Date("2024-12-28T14:22:00Z"), details: { channel: "#maintenance-alerts", message: "Critical: Cooling Pump #4 requires immediate attention" }, executedBy: "Agentforce" },
  { id: "auto-005", type: "AUTO_ESCALATE", trigger: "SLA_BREACH_RISK", assetId: "eq-006", action: "Escalate to Maintenance Manager", status: "executed", timestamp: new Date("2024-12-29T08:00:00Z"), details: { escalated_to: "maintenance_manager@company.com", reason: "Work order approaching SLA deadline" }, executedBy: "Agentforce" },
];

// ============= AUDIT RECORDS =============
export interface AuditRecord {
  id: string;
  eventId: string;
  eventType: string;
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  previousState?: Record<string, any>;
  newState?: Record<string, any>;
  hash: string;
  verified: boolean;
}

export const mockAuditRecords: AuditRecord[] = [
  { id: "audit-001", eventId: "auto-001", eventType: "AUTOMATION", entityType: "WorkOrder", entityId: "wo-001", action: "CREATE", performedBy: "Agentforce", timestamp: new Date("2025-01-02T09:14:23Z"), newState: { status: "scheduled", priority: "high" }, hash: "0x7a8b9c...d4e5f6", verified: true },
  { id: "audit-002", eventId: "auto-003", eventType: "AUTOMATION", entityType: "WorkOrder", entityId: "wo-001", action: "UPDATE", performedBy: "Agentforce", timestamp: new Date("2025-01-02T09:14:28Z"), previousState: { assignedTechnicianId: null }, newState: { assignedTechnicianId: "tech-001" }, hash: "0x1b2c3d...e4f5a6", verified: true },
  { id: "audit-003", eventId: "maint-003", eventType: "MAINTENANCE", entityType: "Equipment", entityId: "eq-006", action: "STATUS_CHANGE", performedBy: "tech-002", timestamp: new Date("2025-01-05T10:00:00Z"), previousState: { status: "degraded" }, newState: { status: "maintenance" }, hash: "0x9f8e7d...c6b5a4", verified: true },
];

// ============= ENHANCED EQUIPMENT DATA =============
export const mockEquipment: Equipment[] = [
  { id: "eq-001", equipmentId: "PUMP-001", name: "Hydraulic Pump #1", type: EquipmentType.PUMP, manufacturer: "Flowserve", model: "HPX-500", factoryId: "plant-usa", productionLine: "Line 1", location: { x: 10, y: 20, zone: "Zone A" }, installationDate: new Date("2020-01-15"), criticalityScore: 0.9, status: EquipmentStatus.OPERATIONAL, currentHealthScore: 0.45, lastMaintenanceDate: new Date("2024-11-01"), nextScheduledMaintenance: new Date("2025-02-01"), degradationRate: 0.02, typicalFailureModes: ["bearing_failure", "seal_failure"] },
  { id: "eq-002", equipmentId: "MOTOR-001", name: "Drive Motor #3", type: EquipmentType.MOTOR, manufacturer: "Siemens", model: "1LE1", factoryId: "plant-usa", productionLine: "Line 1", location: { x: 15, y: 25, zone: "Zone A" }, installationDate: new Date("2019-06-20"), criticalityScore: 0.85, status: EquipmentStatus.DEGRADED, currentHealthScore: 0.62, lastMaintenanceDate: new Date("2024-10-15"), nextScheduledMaintenance: new Date("2025-01-15"), degradationRate: 0.015, typicalFailureModes: ["motor_failure", "electrical_failure"] },
  { id: "eq-003", equipmentId: "CONV-001", name: "Conveyor Belt B2", type: EquipmentType.CONVEYOR, manufacturer: "Dorner", model: "3200", factoryId: "plant-usa", productionLine: "Line 2", location: { x: 30, y: 40, zone: "Zone B" }, installationDate: new Date("2021-03-10"), criticalityScore: 0.7, status: EquipmentStatus.OPERATIONAL, currentHealthScore: 0.78, lastMaintenanceDate: new Date("2024-12-01"), nextScheduledMaintenance: new Date("2025-03-01"), degradationRate: 0.01, typicalFailureModes: ["bearing_failure"] },
  { id: "eq-004", equipmentId: "COMP-001", name: "Air Compressor #2", type: EquipmentType.COMPRESSOR, manufacturer: "Atlas Copco", model: "GA-37", factoryId: "plant-usa", productionLine: "Line 1", location: { x: 5, y: 10, zone: "Zone C" }, installationDate: new Date("2018-09-05"), criticalityScore: 0.95, status: EquipmentStatus.OPERATIONAL, currentHealthScore: 0.88, lastMaintenanceDate: new Date("2024-12-15"), nextScheduledMaintenance: new Date("2025-03-15"), degradationRate: 0.008, typicalFailureModes: ["seal_failure", "motor_failure"] },
  { id: "eq-005", equipmentId: "MIX-001", name: "Industrial Mixer #5", type: EquipmentType.MIXER, manufacturer: "Charles Ross", model: "VMS-100", factoryId: "plant-usa", productionLine: "Line 2", location: { x: 20, y: 35, zone: "Zone D" }, installationDate: new Date("2022-01-20"), criticalityScore: 0.6, status: EquipmentStatus.OPERATIONAL, currentHealthScore: 0.92, lastMaintenanceDate: new Date("2024-11-20"), nextScheduledMaintenance: new Date("2025-02-20"), degradationRate: 0.005, typicalFailureModes: ["bearing_failure", "motor_failure"] },
  { id: "eq-006", equipmentId: "PUMP-002", name: "Cooling Pump #4", type: EquipmentType.PUMP, manufacturer: "Grundfos", model: "CR-95", factoryId: "plant-usa", productionLine: "Line 3", location: { x: 45, y: 15, zone: "Zone A" }, installationDate: new Date("2020-07-12"), criticalityScore: 0.8, status: EquipmentStatus.MAINTENANCE, currentHealthScore: 0.35, lastMaintenanceDate: new Date("2024-12-28"), nextScheduledMaintenance: new Date("2025-01-05"), degradationRate: 0.025, typicalFailureModes: ["seal_failure", "hydraulic_failure"] },
  // Germany Plant Equipment
  { id: "eq-007", equipmentId: "MOTOR-GER-001", name: "Precision Motor A1", type: EquipmentType.MOTOR, manufacturer: "Siemens", model: "1PH8", factoryId: "plant-ger", productionLine: "Line 1", location: { x: 12, y: 18, zone: "Halle A" }, installationDate: new Date("2019-02-01"), criticalityScore: 0.92, status: EquipmentStatus.OPERATIONAL, currentHealthScore: 0.81, lastMaintenanceDate: new Date("2024-12-10"), nextScheduledMaintenance: new Date("2025-03-10"), degradationRate: 0.012, typicalFailureModes: ["motor_failure", "bearing_failure"] },
  { id: "eq-008", equipmentId: "CONV-GER-001", name: "High-Speed Conveyor C3", type: EquipmentType.CONVEYOR, manufacturer: "Interroll", model: "MCP", factoryId: "plant-ger", productionLine: "Line 2", location: { x: 35, y: 42, zone: "Halle B" }, installationDate: new Date("2021-08-15"), criticalityScore: 0.75, status: EquipmentStatus.OPERATIONAL, currentHealthScore: 0.89, lastMaintenanceDate: new Date("2024-11-25"), nextScheduledMaintenance: new Date("2025-02-25"), degradationRate: 0.008, typicalFailureModes: ["bearing_failure"] },
  // Japan Plant Equipment
  { id: "eq-009", equipmentId: "PUMP-JPN-001", name: "Precision Pump P1", type: EquipmentType.PUMP, manufacturer: "Ebara", model: "FSS", factoryId: "plant-jpn", productionLine: "Line 1", location: { x: 8, y: 14, zone: "エリアA" }, installationDate: new Date("2020-05-20"), criticalityScore: 0.88, status: EquipmentStatus.OPERATIONAL, currentHealthScore: 0.94, lastMaintenanceDate: new Date("2024-12-20"), nextScheduledMaintenance: new Date("2025-03-20"), degradationRate: 0.006, typicalFailureModes: ["seal_failure"] },
  { id: "eq-010", equipmentId: "COMP-JPN-001", name: "Clean Room Compressor", type: EquipmentType.COMPRESSOR, manufacturer: "Hitachi", model: "DSP", factoryId: "plant-jpn", productionLine: "Line 1", location: { x: 22, y: 28, zone: "エリアB" }, installationDate: new Date("2020-01-10"), criticalityScore: 0.96, status: EquipmentStatus.OPERATIONAL, currentHealthScore: 0.86, lastMaintenanceDate: new Date("2024-12-05"), nextScheduledMaintenance: new Date("2025-02-05"), degradationRate: 0.009, typicalFailureModes: ["seal_failure", "motor_failure"] },
];

// ============= SENSOR READING GENERATOR WITH DEGRADATION =============
export const generateSensorReadings = (equipmentId: string, count: number = 50, degradationFactor: number = 0): SensorReading[] => {
  const now = Date.now();
  const equipment = mockEquipment.find(e => e.id === equipmentId);
  const healthScore = equipment?.currentHealthScore ?? 0.8;
  const degradation = (1 - healthScore) * 2 + degradationFactor;

  return Array.from({ length: count }, (_, i) => {
    const timeProgress = i / count;
    const degradationProgress = degradation * timeProgress;
    
    return {
      id: `sr-${equipmentId}-${i}`,
      equipmentId,
      timestamp: new Date(now - (count - i) * 60000),
      temperature: 65 + Math.random() * 15 + Math.sin(i / 5) * 5 + degradationProgress * 15,
      vibration: 2 + Math.random() * 1.5 + degradationProgress * 3 + (i > count * 0.8 ? Math.random() * 2 : 0),
      pressure: 100 + Math.random() * 10 - degradationProgress * 8,
      humidity: 40 + Math.random() * 15,
      powerConsumption: 50 + Math.random() * 20 + degradationProgress * 25,
      throughput: 85 + Math.random() * 10 - degradationProgress * 20,
      isAnomaly: timeProgress > 0.85 && healthScore < 0.5 && Math.random() > 0.6,
      anomalyScore: timeProgress > 0.7 ? 0.2 + degradation * 0.3 + Math.random() * 0.2 : Math.random() * 0.15,
    };
  });
};

// ============= TIME-SERIES TELEMETRY (90 days) =============
export interface TelemetryDataPoint {
  timestamp: Date;
  equipmentId: string;
  sensorType: "temperature" | "vibration" | "pressure" | "rpm" | "power";
  value: number;
  unit: string;
}

export const generateHistoricalTelemetry = (equipmentId: string, days: number = 90): TelemetryDataPoint[] => {
  const data: TelemetryDataPoint[] = [];
  const now = new Date();
  const equipment = mockEquipment.find(e => e.id === equipmentId);
  const degradation = equipment ? (1 - equipment.currentHealthScore) : 0.2;

  for (let d = days; d >= 0; d--) {
    for (let h = 0; h < 24; h += 4) { // Every 4 hours
      const timestamp = new Date(now.getTime() - d * 24 * 60 * 60 * 1000 + h * 60 * 60 * 1000);
      const dayProgress = (days - d) / days;
      const degradationEffect = degradation * dayProgress;

      data.push(
        { timestamp, equipmentId, sensorType: "temperature", value: Math.round((68 + degradationEffect * 25 + Math.random() * 8) * 10) / 10, unit: "°C" },
        { timestamp, equipmentId, sensorType: "vibration", value: Math.round((2.2 + degradationEffect * 4 + Math.random() * 1) * 100) / 100, unit: "mm/s" },
        { timestamp, equipmentId, sensorType: "rpm", value: Math.round(1450 - degradationEffect * 50 + Math.random() * 30), unit: "rev/min" },
        { timestamp, equipmentId, sensorType: "power", value: Math.round((52 + degradationEffect * 30 + Math.random() * 10) * 10) / 10, unit: "kW" }
      );
    }
  }
  return data;
};

// ============= PREDICTIONS =============
export const mockPredictions: FailurePrediction[] = [
  { id: "pred-001", equipmentId: "eq-001", predictionTime: new Date(), failureProbability: 0.78, confidenceScore: 0.85, predictionHorizonDays: 7, expectedFailureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), expectedFailureMode: FailureMode.BEARING_FAILURE, estimatedCost: 15000, topContributingFactors: [{ factor: "Vibration Increase", importance: 0.35, currentValue: 4.2, contribution: 0.4 }, { factor: "Temperature Trend", importance: 0.28, currentValue: 78, contribution: 0.3 }, { factor: "Operating Hours", importance: 0.22, currentValue: 12500, contribution: 0.2 }], predictionStatus: PredictionStatus.ACTIVE, isAcknowledged: false, alertSent: true },
  { id: "pred-002", equipmentId: "eq-002", predictionTime: new Date(), failureProbability: 0.56, confidenceScore: 0.72, predictionHorizonDays: 14, expectedFailureDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), expectedFailureMode: FailureMode.MOTOR_FAILURE, estimatedCost: 8500, topContributingFactors: [{ factor: "Power Consumption", importance: 0.4, currentValue: 72, contribution: 0.35 }, { factor: "Temperature", importance: 0.3, currentValue: 85, contribution: 0.25 }], predictionStatus: PredictionStatus.ACTIVE, isAcknowledged: true, alertSent: true },
  { id: "pred-003", equipmentId: "eq-006", predictionTime: new Date(), failureProbability: 0.89, confidenceScore: 0.92, predictionHorizonDays: 3, expectedFailureDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), expectedFailureMode: FailureMode.SEAL_FAILURE, estimatedCost: 5200, topContributingFactors: [{ factor: "Pressure Drop", importance: 0.45, currentValue: 82, contribution: 0.5 }, { factor: "Leak Detection", importance: 0.35, currentValue: 1, contribution: 0.35 }], predictionStatus: PredictionStatus.ACTIVE, isAcknowledged: false, alertSent: true },
  { id: "pred-004", equipmentId: "eq-007", predictionTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), failureProbability: 0.42, confidenceScore: 0.68, predictionHorizonDays: 21, expectedFailureDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), expectedFailureMode: FailureMode.BEARING_FAILURE, estimatedCost: 6800, topContributingFactors: [{ factor: "Vibration Variance", importance: 0.38, currentValue: 3.1, contribution: 0.32 }], predictionStatus: PredictionStatus.ACTIVE, isAcknowledged: false, alertSent: false },
];

// ============= MAINTENANCE RECORDS =============
export const mockMaintenanceRecords: MaintenanceRecord[] = [
  { id: "maint-001", equipmentId: "eq-001", startTime: new Date("2024-11-01T08:00:00"), endTime: new Date("2024-11-01T12:00:00"), maintenanceType: MaintenanceType.PREVENTIVE, description: "Regular bearing inspection and lubrication", technicianName: "John Smith", totalCost: 450, workOrderStatus: WorkOrderStatus.COMPLETED, issuesFound: ["Minor bearing wear detected"] },
  { id: "maint-002", equipmentId: "eq-002", startTime: new Date("2024-10-15T09:00:00"), endTime: new Date("2024-10-15T16:00:00"), maintenanceType: MaintenanceType.CORRECTIVE, description: "Motor winding repair", technicianName: "Mike Johnson", totalCost: 2200, workOrderStatus: WorkOrderStatus.COMPLETED, issuesFound: ["Damaged motor windings", "Overheating signs"] },
  { id: "maint-003", equipmentId: "eq-006", startTime: new Date("2024-12-28T10:00:00"), maintenanceType: MaintenanceType.PREDICTIVE, description: "Seal replacement based on AI prediction", technicianName: "Sarah Williams", totalCost: 1800, workOrderStatus: WorkOrderStatus.IN_PROGRESS, issuesFound: [] },
  { id: "maint-004", equipmentId: "eq-004", startTime: new Date("2024-12-15T07:00:00"), endTime: new Date("2024-12-15T09:30:00"), maintenanceType: MaintenanceType.PREVENTIVE, description: "Compressor filter replacement and oil check", technicianName: "Mike Johnson", totalCost: 320, workOrderStatus: WorkOrderStatus.COMPLETED, issuesFound: [] },
  { id: "maint-005", equipmentId: "eq-003", startTime: new Date("2024-12-01T14:00:00"), endTime: new Date("2024-12-01T16:00:00"), maintenanceType: MaintenanceType.PREVENTIVE, description: "Conveyor belt tension adjustment and roller inspection", technicianName: "John Smith", totalCost: 180, workOrderStatus: WorkOrderStatus.COMPLETED, issuesFound: ["Belt showing early wear signs"] },
  { id: "maint-006", equipmentId: "eq-007", startTime: new Date("2024-12-10T06:00:00"), endTime: new Date("2024-12-10T10:00:00"), maintenanceType: MaintenanceType.PREVENTIVE, description: "Motor alignment check and bearing lubrication", technicianName: "Hans Mueller", totalCost: 380, workOrderStatus: WorkOrderStatus.COMPLETED, issuesFound: [] },
];

// ============= DASHBOARD KPIs =============
export interface DashboardKPIs {
  totalAssets: number;
  healthyAssets: number;
  warningAssets: number;
  criticalAssets: number;
  avgHealthScore: number;
  predictedFailures: number;
  plannedMaintenance: number;
  avgMTBF: number; // Mean Time Between Failures (days)
  avgMTTR: number; // Mean Time To Repair (hours)
  costSavings: number;
  downtimiePrevented: number; // hours
}

export const calculateDashboardStats = (equipment: Equipment[]) => {
  const healthy = equipment.filter(e => e.currentHealthScore >= 0.8).length;
  const warning = equipment.filter(e => e.currentHealthScore >= 0.5 && e.currentHealthScore < 0.8).length;
  const critical = equipment.filter(e => e.currentHealthScore < 0.5).length;
  const avgHealth = equipment.reduce((sum, e) => sum + e.currentHealthScore, 0) / equipment.length;

  return {
    total: equipment.length,
    healthy,
    warning,
    critical,
    avgHealth,
    predictedFailures: mockPredictions.filter(p => p.predictionStatus === PredictionStatus.ACTIVE).length,
    plannedMaintenance: mockWorkOrders.filter(w => w.status === WorkOrderStatus.SCHEDULED).length,
    avgMTBF: 47,
    avgMTTR: 3.4,
    costSavings: 284500,
    downtimePrevented: 156,
  };
};

// ============= FAILURE HISTORY FOR TRAINING DATA =============
export interface FailureEvent {
  id: string;
  equipmentId: string;
  failureDate: Date;
  failureMode: FailureMode;
  rootCause: string;
  downtimeHours: number;
  repairCost: number;
  wasPreventable: boolean;
  leadIndicators: { sensor: string; daysBeforeFailure: number; anomalyDetected: boolean }[];
}

export const mockFailureHistory: FailureEvent[] = [
  { id: "fail-001", equipmentId: "eq-001", failureDate: new Date("2023-08-15"), failureMode: FailureMode.BEARING_FAILURE, rootCause: "Lubrication degradation over extended operating period", downtimeHours: 18, repairCost: 12400, wasPreventable: true, leadIndicators: [{ sensor: "vibration", daysBeforeFailure: 12, anomalyDetected: true }, { sensor: "temperature", daysBeforeFailure: 8, anomalyDetected: true }] },
  { id: "fail-002", equipmentId: "eq-002", failureDate: new Date("2024-03-22"), failureMode: FailureMode.ELECTRICAL_FAILURE, rootCause: "Insulation breakdown due to moisture ingress", downtimeHours: 24, repairCost: 8900, wasPreventable: false, leadIndicators: [{ sensor: "power", daysBeforeFailure: 3, anomalyDetected: false }] },
  { id: "fail-003", equipmentId: "eq-004", failureDate: new Date("2023-11-05"), failureMode: FailureMode.SEAL_FAILURE, rootCause: "Seal wear from continuous high-pressure operation", downtimeHours: 8, repairCost: 3200, wasPreventable: true, leadIndicators: [{ sensor: "pressure", daysBeforeFailure: 18, anomalyDetected: true }] },
];

// ============= IoT SENSOR PLATFORM EVENTS =============
export interface IoTSensorEvent {
  replayId: number;
  createdDate: string;
  deviceId: string;
  failureProbability: number;
  sensorType: "Temperature" | "Vibration" | "Pressure" | "RPM" | "Power";
  temperature: number;
  vibration: number;
  pressure: number;
  location: string;
  payload: string;
  processed: boolean;
  triggeredWorkOrder?: string;
}

export const mockIoTSensorEvents: IoTSensorEvent[] = [
  { replayId: 1001, createdDate: "2026-01-01T08:00:00Z", deviceId: "EQ-001-ACME", failureProbability: 0.92, sensorType: "Temperature", temperature: 105, vibration: 0.12, pressure: 2.5, location: "Plant A - Line 3", payload: '{"temp":105,"vib":0.12,"press":2.5}', processed: true, triggeredWorkOrder: "wo-001" },
  { replayId: 1002, createdDate: "2026-01-01T08:01:00Z", deviceId: "EQ-002-ACME", failureProbability: 0.45, sensorType: "Vibration", temperature: 72, vibration: 0.35, pressure: 1.8, location: "Plant B - Line 2", payload: '{"temp":72,"vib":0.35,"press":1.8}', processed: true },
  { replayId: 1003, createdDate: "2026-01-01T08:01:30Z", deviceId: "EQ-003-ACME", failureProbability: 0.97, sensorType: "Pressure", temperature: 68, vibration: 0.05, pressure: 4.2, location: "Plant A - Line 5", payload: '{"temp":68,"vib":0.05,"press":4.2}', processed: true, triggeredWorkOrder: "wo-005" },
  { replayId: 1004, createdDate: "2026-01-01T08:02:15Z", deviceId: "EQ-004-ACME", failureProbability: 0.88, sensorType: "RPM", temperature: 78, vibration: 0.28, pressure: 2.1, location: "Plant A - Line 1", payload: '{"temp":78,"vib":0.28,"press":2.1,"rpm":1380}', processed: true, triggeredWorkOrder: "wo-006" },
  { replayId: 1005, createdDate: "2026-01-01T08:03:00Z", deviceId: "EQ-005-ACME", failureProbability: 0.62, sensorType: "Power", temperature: 65, vibration: 0.08, pressure: 1.9, location: "Plant B - Line 4", payload: '{"temp":65,"vib":0.08,"press":1.9,"power":52.3}', processed: false },
  { replayId: 1006, createdDate: "2026-01-01T08:03:45Z", deviceId: "EQ-001-ACME", failureProbability: 0.94, sensorType: "Temperature", temperature: 108, vibration: 0.14, pressure: 2.6, location: "Plant A - Line 3", payload: '{"temp":108,"vib":0.14,"press":2.6}', processed: true },
  { replayId: 1007, createdDate: "2026-01-01T08:04:30Z", deviceId: "EQ-006-ACME", failureProbability: 0.91, sensorType: "Vibration", temperature: 82, vibration: 0.52, pressure: 2.3, location: "Plant C - Line 1", payload: '{"temp":82,"vib":0.52,"press":2.3}', processed: true, triggeredWorkOrder: "wo-007" },
];

// ============= SLACK ALERT ROUTING =============
export interface SlackAlertConfig {
  deviceId: string;
  channel: string;
  priority: "low" | "medium" | "high" | "critical";
  mentionUsers: string[];
  escalationChannel?: string;
  escalationDelayMinutes: number;
}

export const mockSlackRouting: SlackAlertConfig[] = [
  { deviceId: "EQ-001-ACME", channel: "#maintenance-line3", priority: "critical", mentionUsers: ["@john.smith", "@sarah.williams"], escalationChannel: "#plant-managers", escalationDelayMinutes: 15 },
  { deviceId: "EQ-002-ACME", channel: "#maintenance-line2", priority: "high", mentionUsers: ["@mike.johnson"], escalationChannel: "#maintenance-leads", escalationDelayMinutes: 30 },
  { deviceId: "EQ-003-ACME", channel: "#maintenance-line5", priority: "critical", mentionUsers: ["@sarah.williams"], escalationChannel: "#plant-managers", escalationDelayMinutes: 10 },
  { deviceId: "EQ-004-ACME", channel: "#maintenance-line1", priority: "high", mentionUsers: ["@john.smith"], escalationDelayMinutes: 30 },
  { deviceId: "EQ-005-ACME", channel: "#maintenance-line4", priority: "medium", mentionUsers: [], escalationDelayMinutes: 60 },
  { deviceId: "EQ-006-ACME", channel: "#maintenance-plantc", priority: "critical", mentionUsers: ["@hans.mueller", "@yuki.tanaka"], escalationChannel: "#global-ops", escalationDelayMinutes: 10 },
];

export interface SlackAlertMessage {
  id: string;
  deviceId: string;
  channel: string;
  threadTs: string;
  message: string;
  timestamp: Date;
  isThread: boolean;
  parentThreadTs?: string;
  reactions: { emoji: string; count: number }[];
}

export const mockSlackAlerts: SlackAlertMessage[] = [
  { id: "slack-001", deviceId: "EQ-001-ACME", channel: "#maintenance-line3", threadTs: "1704096000.000100", message: "⚠️ Device EQ-001-ACME predicted failure: 0.92 | WorkOrder WO-2025-0001", timestamp: new Date("2026-01-01T08:00:05Z"), isThread: false, reactions: [{ emoji: "eyes", count: 2 }, { emoji: "wrench", count: 1 }] },
  { id: "slack-002", deviceId: "EQ-001-ACME", channel: "#maintenance-line3", threadTs: "1704096000.000101", message: "Technician John Smith assigned. ETA: 30 minutes.", timestamp: new Date("2026-01-01T08:02:15Z"), isThread: true, parentThreadTs: "1704096000.000100", reactions: [{ emoji: "thumbsup", count: 3 }] },
  { id: "slack-003", deviceId: "EQ-003-ACME", channel: "#maintenance-line5", threadTs: "1704096090.000200", message: "🚨 CRITICAL: Device EQ-003-ACME failure probability 0.97 | Immediate action required", timestamp: new Date("2026-01-01T08:01:35Z"), isThread: false, reactions: [{ emoji: "rotating_light", count: 4 }] },
  { id: "slack-004", deviceId: "EQ-006-ACME", channel: "#maintenance-plantc", threadTs: "1704096270.000300", message: "⚠️ Device EQ-006-ACME predicted failure: 0.91 | High vibration detected", timestamp: new Date("2026-01-01T08:04:35Z"), isThread: false, reactions: [] },
];

// ============= REDIS DEDUPE / COOLDOWN SIMULATION =============
export interface RedisCooldownEntry {
  key: string;
  deviceId: string;
  threadTs: string;
  expiresAt: Date;
  cooldownSeconds: number;
  hitCount: number;
  lastHitAt: Date;
}

export const mockRedisCooldowns: RedisCooldownEntry[] = [
  { key: "alert:EQ-001-ACME", deviceId: "EQ-001-ACME", threadTs: "1704096000.000100", expiresAt: new Date("2026-01-01T08:05:00Z"), cooldownSeconds: 300, hitCount: 2, lastHitAt: new Date("2026-01-01T08:03:45Z") },
  { key: "alert:EQ-003-ACME", deviceId: "EQ-003-ACME", threadTs: "1704096090.000200", expiresAt: new Date("2026-01-01T08:06:30Z"), cooldownSeconds: 300, hitCount: 1, lastHitAt: new Date("2026-01-01T08:01:30Z") },
  { key: "alert:EQ-006-ACME", deviceId: "EQ-006-ACME", threadTs: "1704096270.000300", expiresAt: new Date("2026-01-01T08:09:30Z"), cooldownSeconds: 300, hitCount: 1, lastHitAt: new Date("2026-01-01T08:04:30Z") },
];

export interface DedupeResult {
  deviceId: string;
  eventReplayId: number;
  wasDeduplicated: boolean;
  reason: "new_alert" | "cooldown_active" | "thread_update";
  threadTs?: string;
}

export const mockDedupeResults: DedupeResult[] = [
  { deviceId: "EQ-001-ACME", eventReplayId: 1001, wasDeduplicated: false, reason: "new_alert" },
  { deviceId: "EQ-002-ACME", eventReplayId: 1002, wasDeduplicated: false, reason: "new_alert" },
  { deviceId: "EQ-003-ACME", eventReplayId: 1003, wasDeduplicated: false, reason: "new_alert" },
  { deviceId: "EQ-001-ACME", eventReplayId: 1006, wasDeduplicated: true, reason: "thread_update", threadTs: "1704096000.000100" },
];

// ============= TABLEAU DRILL-THROUGH TILES =============
export interface TableauDrillThroughTile {
  id: string;
  deviceId: string;
  failureProbability: number;
  location: string;
  status: "healthy" | "warning" | "critical";
  slackChannel: string;
  alertActionUrl: string;
  workOrderUrl?: string;
  lastUpdated: Date;
  trendDirection: "up" | "down" | "stable";
  riskScore: number;
}

export const mockTableauTiles: TableauDrillThroughTile[] = [
  { id: "tile-001", deviceId: "EQ-001-ACME", failureProbability: 0.92, location: "Plant A - Line 3", status: "critical", slackChannel: "#maintenance-line3", alertActionUrl: "https://slack.com/app_redirect?channel=%23maintenance-line3&text=Device%20ID%20EQ-001-ACME%20Predicted%20failure%20probability%3A%200.92", workOrderUrl: "/work-orders/wo-001", lastUpdated: new Date("2026-01-01T08:00:00Z"), trendDirection: "up", riskScore: 92 },
  { id: "tile-002", deviceId: "EQ-002-ACME", failureProbability: 0.45, location: "Plant B - Line 2", status: "warning", slackChannel: "#maintenance-line2", alertActionUrl: "https://slack.com/app_redirect?channel=%23maintenance-line2&text=Device%20ID%20EQ-002-ACME%20Predicted%20failure%20probability%3A%200.45", lastUpdated: new Date("2026-01-01T08:01:00Z"), trendDirection: "stable", riskScore: 45 },
  { id: "tile-003", deviceId: "EQ-003-ACME", failureProbability: 0.97, location: "Plant A - Line 5", status: "critical", slackChannel: "#maintenance-line5", alertActionUrl: "https://slack.com/app_redirect?channel=%23maintenance-line5&text=Device%20ID%20EQ-003-ACME%20Predicted%20failure%20probability%3A%200.97", workOrderUrl: "/work-orders/wo-005", lastUpdated: new Date("2026-01-01T08:01:30Z"), trendDirection: "up", riskScore: 97 },
  { id: "tile-004", deviceId: "EQ-004-ACME", failureProbability: 0.88, location: "Plant A - Line 1", status: "critical", slackChannel: "#maintenance-line1", alertActionUrl: "https://slack.com/app_redirect?channel=%23maintenance-line1&text=Device%20ID%20EQ-004-ACME%20Predicted%20failure%20probability%3A%200.88", workOrderUrl: "/work-orders/wo-006", lastUpdated: new Date("2026-01-01T08:02:15Z"), trendDirection: "up", riskScore: 88 },
  { id: "tile-005", deviceId: "EQ-005-ACME", failureProbability: 0.62, location: "Plant B - Line 4", status: "warning", slackChannel: "#maintenance-line4", alertActionUrl: "https://slack.com/app_redirect?channel=%23maintenance-line4&text=Device%20ID%20EQ-005-ACME%20Predicted%20failure%20probability%3A%200.62", lastUpdated: new Date("2026-01-01T08:03:00Z"), trendDirection: "down", riskScore: 62 },
  { id: "tile-006", deviceId: "EQ-006-ACME", failureProbability: 0.91, location: "Plant C - Line 1", status: "critical", slackChannel: "#maintenance-plantc", alertActionUrl: "https://slack.com/app_redirect?channel=%23maintenance-plantc&text=Device%20ID%20EQ-006-ACME%20Predicted%20failure%20probability%3A%200.91", workOrderUrl: "/work-orders/wo-007", lastUpdated: new Date("2026-01-01T08:04:30Z"), trendDirection: "up", riskScore: 91 },
];

// ============= SALESFORCE FLOW SIMULATION =============
export interface SalesforceFlowExecution {
  id: string;
  flowName: string;
  triggerType: "Platform_Event" | "Record_Change" | "Schedule" | "Screen";
  triggerEvent?: string;
  inputVariables: Record<string, any>;
  outputVariables: Record<string, any>;
  status: "In_Progress" | "Completed" | "Failed";
  startTime: Date;
  endTime?: Date;
  durationMs?: number;
  createdRecords: { objectType: string; recordId: string }[];
  errorMessage?: string;
}

export const mockFlowExecutions: SalesforceFlowExecution[] = [
  { id: "flow-exec-001", flowName: "IoT_Predictive_Maintenance_Flow", triggerType: "Platform_Event", triggerEvent: "IoT_Sensor_Event__e", inputVariables: { deviceId: "EQ-001-ACME", failureProbability: 0.92, sensorType: "Temperature" }, outputVariables: { workOrderId: "WO-2025-0001", caseNumber: "FSC-2025-0142" }, status: "Completed", startTime: new Date("2026-01-01T08:00:01Z"), endTime: new Date("2026-01-01T08:00:03Z"), durationMs: 2100, createdRecords: [{ objectType: "WorkOrder", recordId: "0WO000000000001" }, { objectType: "Case", recordId: "500000000000001" }] },
  { id: "flow-exec-002", flowName: "IoT_Predictive_Maintenance_Flow", triggerType: "Platform_Event", triggerEvent: "IoT_Sensor_Event__e", inputVariables: { deviceId: "EQ-002-ACME", failureProbability: 0.45, sensorType: "Vibration" }, outputVariables: { actionTaken: "monitoring_only" }, status: "Completed", startTime: new Date("2026-01-01T08:01:01Z"), endTime: new Date("2026-01-01T08:01:02Z"), durationMs: 850, createdRecords: [] },
  { id: "flow-exec-003", flowName: "IoT_Predictive_Maintenance_Flow", triggerType: "Platform_Event", triggerEvent: "IoT_Sensor_Event__e", inputVariables: { deviceId: "EQ-003-ACME", failureProbability: 0.97, sensorType: "Pressure" }, outputVariables: { workOrderId: "WO-2025-0005", caseNumber: "FSC-2025-0143", escalated: true }, status: "Completed", startTime: new Date("2026-01-01T08:01:31Z"), endTime: new Date("2026-01-01T08:01:34Z"), durationMs: 3200, createdRecords: [{ objectType: "WorkOrder", recordId: "0WO000000000005" }, { objectType: "Case", recordId: "500000000000002" }] },
  { id: "flow-exec-004", flowName: "Auto_Parts_Reservation_Flow", triggerType: "Record_Change", inputVariables: { workOrderId: "WO-2025-0001", requiredParts: ["BRG-6205-2RS"] }, outputVariables: { reservationId: "RES-2025-0089", partsAvailable: true }, status: "Completed", startTime: new Date("2026-01-01T08:00:04Z"), endTime: new Date("2026-01-01T08:00:05Z"), durationMs: 1200, createdRecords: [{ objectType: "Parts_Reservation__c", recordId: "a0B000000000001" }] },
];

// ============= FIELD SERVICE WORK ORDERS (Salesforce Format) =============
export interface FieldServiceWorkOrder {
  id: string;
  workOrderNumber: string;
  subject: string;
  description: string;
  assetId: string;
  assetSerialNumber: string;
  accountId: string;
  status: "New" | "Scheduled" | "In_Progress" | "Completed" | "Canceled";
  priority: "Low" | "Medium" | "High" | "Critical";
  serviceTerritory: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  assignedResource?: string;
  estimatedDuration: number; // minutes
  predictedFailureMode: string;
  aiConfidence: number;
  createdFromPlatformEvent: boolean;
  platformEventReplayId?: number;
}

export const mockFieldServiceWorkOrders: FieldServiceWorkOrder[] = [
  { id: "0WO000000000001", workOrderNumber: "WO-2025-0001", subject: "Predicted Equipment Failure - Bearing", description: "AI prediction indicates 92% probability of bearing failure within 7 days. Proactive maintenance recommended.", assetId: "02i000000000001", assetSerialNumber: "EQ-001-ACME", accountId: "001000000000001", status: "Scheduled", priority: "Critical", serviceTerritory: "Plant A", scheduledStart: new Date("2026-01-02T09:00:00Z"), scheduledEnd: new Date("2026-01-02T13:00:00Z"), assignedResource: "tech-001", estimatedDuration: 240, predictedFailureMode: "bearing_failure", aiConfidence: 0.85, createdFromPlatformEvent: true, platformEventReplayId: 1001 },
  { id: "0WO000000000005", workOrderNumber: "WO-2025-0005", subject: "Predicted Equipment Failure - Pressure System", description: "CRITICAL: AI prediction indicates 97% probability of pressure system failure. Immediate inspection required.", assetId: "02i000000000003", assetSerialNumber: "EQ-003-ACME", accountId: "001000000000001", status: "In_Progress", priority: "Critical", serviceTerritory: "Plant A", scheduledStart: new Date("2026-01-01T09:00:00Z"), scheduledEnd: new Date("2026-01-01T14:00:00Z"), actualStart: new Date("2026-01-01T09:15:00Z"), assignedResource: "tech-002", estimatedDuration: 300, predictedFailureMode: "seal_failure", aiConfidence: 0.92, createdFromPlatformEvent: true, platformEventReplayId: 1003 },
  { id: "0WO000000000006", workOrderNumber: "WO-2025-0006", subject: "Predicted Equipment Failure - RPM Anomaly", description: "AI prediction indicates 88% probability of motor failure based on RPM variance patterns.", assetId: "02i000000000004", assetSerialNumber: "EQ-004-ACME", accountId: "001000000000001", status: "Scheduled", priority: "High", serviceTerritory: "Plant A", scheduledStart: new Date("2026-01-03T08:00:00Z"), scheduledEnd: new Date("2026-01-03T11:00:00Z"), assignedResource: "tech-003", estimatedDuration: 180, predictedFailureMode: "motor_failure", aiConfidence: 0.78, createdFromPlatformEvent: true, platformEventReplayId: 1004 },
  { id: "0WO000000000007", workOrderNumber: "WO-2025-0007", subject: "Predicted Equipment Failure - High Vibration", description: "AI prediction indicates 91% probability of bearing failure due to excessive vibration.", assetId: "02i000000000006", assetSerialNumber: "EQ-006-ACME", accountId: "001000000000002", status: "New", priority: "Critical", serviceTerritory: "Plant C", scheduledStart: new Date("2026-01-02T06:00:00Z"), scheduledEnd: new Date("2026-01-02T10:00:00Z"), estimatedDuration: 240, predictedFailureMode: "bearing_failure", aiConfidence: 0.88, createdFromPlatformEvent: true, platformEventReplayId: 1007 },
];

// ============= PIPELINE METRICS =============
export interface PipelineMetrics {
  date: Date;
  eventsReceived: number;
  eventsProcessed: number;
  eventsDeduplicated: number;
  workOrdersCreated: number;
  slackAlertsSent: number;
  slackThreadUpdates: number;
  avgProcessingTimeMs: number;
  failureRate: number;
  falsePositiveRate: number;
}

export const mockPipelineMetrics: PipelineMetrics[] = [
  { date: new Date("2026-01-01"), eventsReceived: 1247, eventsProcessed: 1198, eventsDeduplicated: 49, workOrdersCreated: 12, slackAlertsSent: 28, slackThreadUpdates: 15, avgProcessingTimeMs: 1850, failureRate: 0.008, falsePositiveRate: 0.12 },
  { date: new Date("2025-12-31"), eventsReceived: 1189, eventsProcessed: 1152, eventsDeduplicated: 37, workOrdersCreated: 8, slackAlertsSent: 22, slackThreadUpdates: 11, avgProcessingTimeMs: 1720, failureRate: 0.006, falsePositiveRate: 0.09 },
  { date: new Date("2025-12-30"), eventsReceived: 1312, eventsProcessed: 1278, eventsDeduplicated: 34, workOrdersCreated: 15, slackAlertsSent: 35, slackThreadUpdates: 18, avgProcessingTimeMs: 2100, failureRate: 0.012, falsePositiveRate: 0.14 },
];

// ============= EXPORT ALL =============
export const mockDataSummary = {
  plants: mockPlants.length,
  equipment: mockEquipment.length,
  technicians: mockTechnicians.length,
  activePredictions: mockPredictions.filter(p => p.predictionStatus === PredictionStatus.ACTIVE).length,
  openWorkOrders: mockWorkOrders.filter(w => w.status !== WorkOrderStatus.COMPLETED).length,
  inventoryItems: mockInventory.length,
  automationEvents: mockAutomationEvents.length,
  iotEvents: mockIoTSensorEvents.length,
  slackAlerts: mockSlackAlerts.length,
  tableauTiles: mockTableauTiles.length,
  flowExecutions: mockFlowExecutions.length,
  fieldServiceWorkOrders: mockFieldServiceWorkOrders.length,
};
