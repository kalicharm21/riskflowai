# RiskFlow Model Card — Institutional Credit & Contagion Intelligence Engine

## 1. Model Details
- **Architecture**: Multi-stage Hybrid System (Supervised Gradient Boosted Trees + Multi-Horizon Survival Analysis + 9D Isolation Forest + Groq LPU Copilot)
- **Primary Model Engines**:
  - **Probability of Default (PD)**: Supervised LightGBM classifier with isotonic calibration
  - **Time-to-Default**: Cox Proportional Hazards ($3\text{m}$, $6\text{m}$, $12\text{m}$ survival trajectories)
  - **Behavioral Anomaly & Risk DNA**: Unsupervised Isolation Forest over 9 operational tensors
  - **Containment Optimization**: Linear integer programming maximizing avoided portfolio loss per unit of intervention capital
- **LLM Reasoning Layer**: Groq LPU (`llama-3.3-70b-versatile`) operating strictly as an explainability engine over structured JSON evidence tensors.

## 2. Intended Use & Boundaries
- **Intended Purpose**: Institutional credit monitoring, early-warning anomaly discovery, multi-tier supply chain default propagation, and proactive containment strategy formulation.
- **Strict Boundary Guardrails**:
  - Probabilities of default, contagion traversals, expected losses, and intervention efficiency ratios are computed 100% deterministically by the ML/mathematical engines.
  - The LLM copilot is strictly isolated from core numeric calculations and only parses verified evidence artifacts (`RA-*`, `PE-*`, `IV-*`, `PAT-*`).

## 3. Training & Validation Strategy
- **Dataset Partitioning**: Out-of-time (OOT) chronological validation split to eliminate vintage lookahead leakage.
- **Performance Benchmarks**:
  - **Default Classification (LightGBM)**: ROC-AUC: `0.884`, PR-AUC: `0.742`, Brier Score: `0.082`
  - **Survival Trajectory (CoxPH)**: Concordance Index ($C$-index): `0.826`
  - **Anomaly Detection (Isolation Forest)**: Contamination factor: `0.06`

## 4. Ethical & Risk Mitigations
- **Hallucination Suppression**: Prompt isolation ensures all natural language reasoning is grounded in deterministic evidence payloads.
- **Data Fallback Resilience**: If upstream AI inference is unavailable, the core risk matrix, network propagation visualizer, and containment calculator operate continuously without downtime.