from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
import joblib
import os

from app.core.milp_model import run_smart_milp_scheduler

app = FastAPI(title="Factory Maintenance AI", description="Real-time predictive maintenance API")

# Define expected incoming JSON data
class MachineSensorData(BaseModel):
    machine_id: str
    type: int
    air_temperature: float
    process_temperature: float
    rotational_speed: float
    torque: float
    tool_wear: float

class MaintenanceRequest(BaseModel):
    available_technicians: int
    machines: List[MachineSensorData]

# --- LOAD MODELS AND ARTIFACTS INTO MEMORY ---
current_dir = os.path.dirname(os.path.abspath(__file__))

# Define both the core and data directories
core_dir = os.path.join(current_dir, "core")
data_dir = os.path.join(current_dir, "data")

model = None
scaler = None
pca = None

try:
    # 1. Fetch XGBoost model from app/core/ (Name matches your image exactly)
    model = joblib.load(os.path.join(core_dir, "saved_xgb_model.joblib"))
    
    # 2. Fetch Scaler and PCA from app/data/ (Names match your image exactly)
    scaler = joblib.load(os.path.join(data_dir, "scaler.joblib"))
    pca = joblib.load(os.path.join(data_dir, "pca.joblib"))
    
    print("✅ All AI models and preprocessing artifacts loaded successfully.")
except Exception as e:
    print(f"⚠️ Warning: Could not load models/artifacts. Error: {e}")

# --- API ENDPOINT ---
@app.post("/api/predict_and_schedule")
def predict_and_schedule(request: MaintenanceRequest):
    if not request.machines:
        raise HTTPException(status_code=400, detail="No machine data provided")
    if model is None or scaler is None or pca is None:
        raise HTTPException(status_code=500, detail="AI artifacts not loaded on server.")

    at_risk_machines = []
    all_predictions = []
    
    for machine in request.machines:
        # 1. Capture Raw Features
        raw_features = np.array([[
            machine.type, 
            machine.air_temperature, 
            machine.process_temperature, 
            machine.rotational_speed, 
            machine.torque, 
            machine.tool_wear
        ]])
        
        # 2. APPLY TRANSFORMATIONS
        scaled_features = scaler.transform(raw_features)
        pca_features = pca.transform(scaled_features)
        
        # 3. Predict Failure Probability
        failure_prob = float(model.predict_proba(pca_features)[0][1])
        is_risk = failure_prob > 0.50
        
        # Record every machine for the "predictions" array
        all_predictions.append({
            "machine_id": machine.machine_id,
            "prediction": 1 if is_risk else 0,
            "status": "FAILURE_RISK" if is_risk else "HEALTHY"
        })
        
        # Queue the failing machines for the MILP scheduler
        if is_risk:
            at_risk_machines.append({
                'id': machine.machine_id,
                'probability': failure_prob
            })

    formatted_schedule = []
    
    # Run the scheduler only if there are machines at risk
    if at_risk_machines:
        milp_schedule_raw = run_smart_milp_scheduler(
            at_risk_machines=at_risk_machines, 
            max_technicians=request.available_technicians
        )
        
        # Map the MILP output to match the QAOA format ("SCHEDULE_TODAY")
        for item in milp_schedule_raw:
            if item.get("scheduled") is True:
                formatted_schedule.append({
                    "machine_id": item["machine_id"],
                    "action": "SCHEDULE_TODAY"
                })
    
    # Return the unified JSON structure
    return {
        "status": "success",
        "total_scanned": len(request.machines),
        "total_failures_detected": len(at_risk_machines),
        "predictions": all_predictions,
        "milp_schedule": formatted_schedule
    }