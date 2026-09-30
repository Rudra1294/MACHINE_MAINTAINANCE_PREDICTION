from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
import joblib
import os
import sys

# Add directory paths for internal module imports
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CURRENT_DIR)

from data.preprocess import transform_raw_data_for_inference
from core.qaoa_model import run_qaoa_scheduler

# Global model variable
qsvm_model = None
MODEL_PATH = os.path.join(CURRENT_DIR, 'core', 'trained_qsvm.joblib')

# Modern FastAPI Lifespan Context Manager (Replaces @app.on_event)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup Logic ---
    global qsvm_model
    if os.path.exists(MODEL_PATH):
        qsvm_model = joblib.load(MODEL_PATH)
        print(f"✅ Loaded trained QSVM model from {MODEL_PATH}")
    else:
        print(f"⚠️ Warning: Model not found at {MODEL_PATH}. Run training first!")
    
    yield # Yields control to FastAPI so it can accept incoming API requests
    
    # --- Shutdown Logic ---
    print("🛑 Shutting down predictive maintenance microservice.")

app = FastAPI(
    title="Quantum Predictive Maintenance Microservice",
    description="API Gateway bridging QSVM failure predictions with QAOA maintenance scheduling.",
    version="1.0.0",
    lifespan=lifespan
)

# Pydantic Schema for incoming telemetry data
class MachineTelemetry(BaseModel):
    machine_id: int
    Type: str                             
    air_temperature_k: float              
    process_temperature_k: float          
    rotational_speed_rpm: float           
    torque_nm: float                      
    tool_wear_min: float                  

class PredictionRequest(BaseModel):
    max_technicians: Optional[int] = 2
    telemetry_data: List[MachineTelemetry]

@app.get("/")
def health_check():
    """Health check endpoint."""
    return {
        "status": "online",
        "service": "Quantum Predictive Maintenance Microservice",
        "model_loaded": qsvm_model is not None
    }

@app.post("/api/v1/predict-and-schedule")
def predict_and_schedule(payload: PredictionRequest):
    if qsvm_model is None:
        raise HTTPException(status_code=500, detail="QSVM model is not loaded on the server.")

    if not payload.telemetry_data:
        raise HTTPException(status_code=400, detail="Telemetry data list cannot be empty.")

    try:
        records = [item.dict() for item in payload.telemetry_data]
        df_raw = pd.DataFrame(records)
        
        type_mapping = {'H': 0, 'L': 1, 'M': 2}
        df_raw['Type'] = df_raw['Type'].map(type_mapping)

        rename_mapping = {
            "air_temperature_k": "Air temperature [K]",
            "process_temperature_k": "Process temperature [K]",
            "rotational_speed_rpm": "Rotational speed [rpm]",
            "torque_nm": "Torque [Nm]",
            "tool_wear_min": "Tool wear [min]"
        }
        df_raw = df_raw.rename(columns=rename_mapping)

        machine_ids = df_raw["machine_id"].tolist()
        df_features = df_raw.drop(columns=["machine_id"])

        # 1. Preprocess through saved Scaler and PCA
        X_pca = transform_raw_data_for_inference(df_features)

        # 2. QSVM Live Inference
        predictions = qsvm_model.predict(X_pca)

        # 3. Identify Failing Machines
        failing_machines = []
        detailed_predictions = []

        for idx, pred in enumerate(predictions):
            mid = machine_ids[idx]
            status = "FAILURE_RISK" if int(pred) == 1 else "HEALTHY"
            
            detailed_predictions.append({
                "machine_id": int(mid),
                "prediction": int(pred),
                "status": status
            })

            if int(pred) == 1:
                failing_machines.append(mid)

        # 4. QAOA Schedule Optimization
        optimal_schedule = run_qaoa_scheduler(
            failed_machine_ids=failing_machines,
            max_technicians=payload.max_technicians
        )

        return {
            "status": "success",
            "total_scanned": len(machine_ids),
            "total_failures_detected": len(failing_machines),
            "predictions": detailed_predictions,
            "qaoa_schedule": optimal_schedule
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Start the server directly when this script is run
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)