from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import uvicorn
from train_models import RiskFlowMLPipeline

app = FastAPI(title="RiskFlow Deterministic Engine")

# Instantiate Pipeline
pipeline = RiskFlowMLPipeline()

class LoanPayload(BaseModel):
    loan_id: str
    original_balance: float
    current_balance: float
    interest_rate: float
    credit_score: float
    ltv: float
    dti: float
    days_past_due: int
    loan_age_months: int

@app.post("/api/ml/predict-single")
def predict_single(loan: LoanPayload):
    result = pipeline.evaluate_loan(loan.dict())
    return {"loan_id": loan.loan_id, **result}

@app.post("/api/ml/stress-scenario")
def run_stress_scenario(shocks: Dict[str, float]):
    rate_shock = shocks.get('interestRate', 0.0)
    prop_shock = shocks.get('propertyValue', 0.0)
    
    # Stress transmission equation
    stressed_pd_delta = round((rate_shock * 1.8) + (abs(prop_shock) * 0.45), 2)
    stressed_el_delta = round(stressed_pd_delta * 0.32, 2)
    
    return {
        "portfolioRiskDelta": stressed_pd_delta,
        "additionalExposure": round(stressed_pd_delta * 2.45, 1),
        "newHighRiskLoans": int(stressed_pd_delta * 4.2),
        "estimatedLossDelta": stressed_el_delta
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)