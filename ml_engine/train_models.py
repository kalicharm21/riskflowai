import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.ensemble import IsolationForest
from lifelines import CoxPHFitter
import joblib

class RiskFlowMLPipeline:
    def __init__(self):
        self.clf_default = lgb.LGBMClassifier(
            n_estimators=250,
            learning_rate=0.03,
            max_depth=6,
            class_weight='balanced',
            random_state=42
        )
        self.cph_survival = CoxPHFitter(penalizer=0.01)
        self.anomaly_detector = IsolationForest(
            n_estimators=150,
            contamination=0.06,
            random_state=42
        )
        self.feature_cols = [
            'original_balance', 'current_balance', 'interest_rate',
            'credit_score', 'ltv', 'dti', 'days_past_due', 'loan_age_months'
        ]

    def fit(self, train_df: pd.DataFrame):
        X = train_df[self.feature_cols].fillna(0)
        y = train_df['default_flag']

        # 1. Train Supervised Default Predictor
        self.clf_default.fit(X, y)

        # 2. Train Time-to-Event Survival Model
        survival_data = X.copy()
        survival_data['duration'] = np.clip(train_df['loan_age_months'], 1, None)
        survival_data['event'] = y
        self.cph_survival.fit(survival_data, duration_col='duration', event_col='event')

        # 3. Fit 9D Anomaly Detector
        self.anomaly_detector.fit(X)

    def evaluate_loan(self, loan_features: dict) -> dict:
        df_single = pd.DataFrame([loan_features])[self.feature_cols].fillna(0)
        
        # Supervised Default Probability
        pd_prob = float(self.clf_default.predict_proba(df_single)[0][1])
        
        # Survival Curve across 12-month horizon
        surv_fn = self.cph_survival.predict_survival_function(df_single)
        horizons = [3, 6, 12]
        survival_curve = {
            f"month_{m}": round(float(surv_fn.iloc[min(m, len(surv_fn)-1)].values[0]), 4)
            for m in horizons
        }

        # Anomaly Score (0 - 100)
        raw_iso = self.anomaly_detector.decision_function(df_single)[0]
        anomaly_score = round(float(np.clip(100 * (0.5 - raw_iso), 0, 100)), 1)

        # Risk Rating Band
        if pd_prob >= 0.20 or anomaly_score >= 80:
            band = "CRITICAL"
        elif pd_prob >= 0.10 or anomaly_score >= 65:
            band = "HIGH"
        elif pd_prob >= 0.04:
            band = "WATCH"
        else:
            band = "LOW"

        return {
            "probability_of_default": round(pd_prob * 100, 2),
            "expected_loss_cr": round(loan_features.get('current_balance', 10.0) * pd_prob * 0.45, 2),
            "risk_band": band,
            "anomaly_score": anomaly_score,
            "survival_trajectory": survival_curve
        }