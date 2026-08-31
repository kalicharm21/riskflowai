from sklearn.ensemble import IsolationForest

class LoanAnomalyEngine:
    def __init__(self):
        self.iso = IsolationForest(contamination=0.05, random_state=42)

    def score_records(self, X):
        # Raw anomaly score normalized 0 - 100
        raw_scores = self.iso.fit(X).decision_function(X)
        norm_scores = 100 * (1 - (raw_scores - raw_scores.min()) / (raw_scores.max() - raw_scores.min()))
        return norm_scores