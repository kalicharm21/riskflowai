import lightgbm as lgb
from lifelines import CoxPHFitter

class LoanPerformanceModel:
    def __init__(self):
        self.clf = lgb.LGBMClassifier(
            n_estimators=200, 
            learning_rate=0.05, 
            class_weight='balanced',
            random_state=42
        )
        self.cph = CoxPHFitter()

    def fit_supervised(self, X_train, y_train):
        self.clf.fit(X_train, y_train)

    def fit_survival(self, survival_df, duration_col='loan_age_months', event_col='default_flag'):
        self.cph.fit(survival_df, duration_col=duration_col, event_col=event_col)

    def predict_survival_curve(self, loan_features):
        return self.cph.predict_survival_function(loan_features)