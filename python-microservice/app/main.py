from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import List

import pandas as pd
import joblib
import os
import sys


# ============================================================
# PATH CONFIGURATION
# ============================================================

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CURRENT_DIR)


# ============================================================
# IMPORTS
# ============================================================

from app.data.preprocess import transform_raw_data_for_inference
from app.core.qaoa_model import run_qaoa_scheduler


# ============================================================
# QSVM MODEL
# ============================================================

qsvm_model = None

MODEL_PATH = os.path.join(
    CURRENT_DIR,
    "core",
    "trained_qsvm.joblib"
)


# ============================================================
# APPLICATION LIFESPAN
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    global qsvm_model

    if os.path.exists(MODEL_PATH):
        qsvm_model = joblib.load(MODEL_PATH)

        print(
            f"✅ Loaded trained QSVM model from {MODEL_PATH}"
        )
    else:
        print(
            f"⚠️ Model not found: {MODEL_PATH}"
        )

    yield

    print(
        "🛑 Shutting down predictive maintenance microservice."
    )


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Quantum Predictive Maintenance Microservice",
    description=(
        "API Gateway bridging QSVM failure predictions "
        "with QAOA maintenance scheduling."
    ),
    version="2.0.0",
    lifespan=lifespan
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DATA MODELS
# ============================================================

class MachineSensorData(BaseModel):
    machine_id: str
    type: str
    air_temperature: float
    process_temperature: float
    rotational_speed: float
    torque: float
    tool_wear: float


class TechnicianData(BaseModel):
    technician_id: str
    specialty: str


class MaintenanceRequest(BaseModel):
    available_technicians: List[TechnicianData] = []
    machines: List[MachineSensorData]


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def health_check():

    return {
        "status": "online",
        "service": "Quantum Predictive Maintenance Microservice",
        "model_loaded": qsvm_model is not None
    }


# ============================================================
# PREDICTION + QAOA SCHEDULING
# ============================================================

@app.post("/api/predict_and_schedule")
def predict_and_schedule(
    payload: MaintenanceRequest
):

    # --------------------------------------------------------
    # Check QSVM model
    # --------------------------------------------------------

    if qsvm_model is None:
        raise HTTPException(
            status_code=500,
            detail="QSVM model is not loaded on the server."
        )

    # --------------------------------------------------------
    # Check machine data
    # --------------------------------------------------------

    if not payload.machines:
        raise HTTPException(
            status_code=400,
            detail="Telemetry data list cannot be empty."
        )

    try:

        # ====================================================
        # 1. GET AVAILABLE TECHNICIANS
        # ====================================================

        tech_pool = [
            tech.technician_id
            for tech in payload.available_technicians
        ]

        # ====================================================
        # 2. CONVERT REQUEST DATA TO DATAFRAME
        # ====================================================

        records = [
            item.model_dump()
            for item in payload.machines
        ]

        df_raw = pd.DataFrame(records)

        # ====================================================
        # 3. RENAME COLUMNS TO MATCH AI4I DATASET
        # ====================================================

        rename_mapping = {
            "type": "Type",
            "air_temperature": "Air temperature [K]",
            "process_temperature": "Process temperature [K]",
            "rotational_speed": "Rotational speed [rpm]",
            "torque": "Torque [Nm]",
            "tool_wear": "Tool wear [min]"
        }

        df_raw = df_raw.rename(
            columns=rename_mapping
        )

        # ====================================================
        # 4. STORE MACHINE IDS
        # ====================================================

        machine_ids = df_raw["machine_id"].tolist()

        # ====================================================
        # 5. REMOVE MACHINE ID BEFORE ML PROCESSING
        # ====================================================

        df_features = df_raw.drop(
            columns=["machine_id"]
        )

        # ====================================================
        # 6. QSVM PREPROCESSING
        # ====================================================

        X_pca = transform_raw_data_for_inference(
            df_features
        )

        # ====================================================
        # 7. QSVM PREDICTION
        # ====================================================

        predictions = qsvm_model.predict(X_pca)

        failing_machines = []
        detailed_predictions = []

        # ====================================================
        # 8. ANALYZE EACH MACHINE
        # ====================================================

        for idx, pred in enumerate(predictions):

            mid = machine_ids[idx]

            is_risk = int(pred) == 1

            # ------------------------------------------------
            # Machine status
            # ------------------------------------------------

            status = (
                "FAILURE_RISK"
                if is_risk
                else "HEALTHY"
            )

            raw_row = df_raw.iloc[idx]

            # ------------------------------------------------
            # Determine failure cause
            # ------------------------------------------------

            cause = "System Normal"

            if is_risk:

                if raw_row["Tool wear [min]"] > 200:

                    cause = (
                        "Critical Tool Wear Limit Exceeded"
                    )

                elif (
                    raw_row["Torque [Nm]"] > 60
                    or
                    raw_row["Rotational speed [rpm]"] < 1380
                ):

                    cause = (
                        "Motor Strain / High Torque Anomaly"
                    )

                elif (
                    raw_row["Process temperature [K]"] > 315
                ):

                    cause = (
                        "Overheating (Process Temp Warning)"
                    )

                else:

                    cause = (
                        "Complex Multi-Sensor Anomaly"
                    )

            # ------------------------------------------------
            # Store prediction details
            # ------------------------------------------------

            detailed_predictions.append(
                {
                    "machine_id": str(mid),
                    "prediction": int(pred),
                    "status": status,
                    "failure_cause": cause
                }
            )

            # ------------------------------------------------
            # Add failing machine
            # ------------------------------------------------

            if is_risk:

                failing_machines.append(
                    str(mid)
                )

        # ====================================================
        # 9. QAOA MAINTENANCE SCHEDULING
        # ====================================================

        formatted_schedule = []

        if failing_machines:

            optimal_schedule = run_qaoa_scheduler(
                failed_machine_ids=failing_machines,
                max_technicians=len(tech_pool)
            )

            # ------------------------------------------------
            # Assign technicians
            # ------------------------------------------------

            for item in optimal_schedule:

                if (
                    item.get("action") == "SCHEDULE_TODAY"
                    and len(tech_pool) > 0
                ):

                    assigned_tech = tech_pool.pop(0)

                    formatted_schedule.append(
                        {
                            "machine_id": item["machine_id"],
                            "assigned_technician": assigned_tech,
                            "action": "SCHEDULE_TODAY"
                        }
                    )

        # ====================================================
        # 10. RETURN API RESPONSE
        # ====================================================

        return {
            "status": "success",
            "total_scanned": len(machine_ids),
            "total_failures_detected": len(failing_machines),
            "predictions": detailed_predictions,
            "milp_schedule": formatted_schedule,
            "compute_engine": "Quantum QAOA",
            "prediction_model": "QSVM"
        }

    # ========================================================
    # ERROR HANDLING
    # ========================================================

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Processing error: {str(e)}"
        )


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )