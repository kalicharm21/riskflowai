Here is the production-ready `README.md` file covering all 8 competition tasks, architectural benchmarks, run instructions, and your live Vercel deployment link.

```markdown
# RiskFlow: Institutional Loan Performance Intelligence & Contagion Engine

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel%20Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://riskflowai-three.vercel.app/)
[![Intain AI Track](https://img.shields.io/badge/Intain%20Campus%20FinTech%20Challenge%202026-AI%20Track-blue?style=for-the-badge)](https://riskflowai-three.vercel.app/)
[![Python ML Engine](https://img.shields.io/badge/FastAPI-ML%20%26%20Survival-green?style=for-the-badge&logo=python&logoColor=white)](http://127.0.0.1:8000/docs)
[![LPU Inference](https://img.shields.io/badge/Groq%20LPU-Llama--3.3--70B-orange?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)

> **Live Production URL:** [https://riskflowai-three.vercel.app/](https://riskflowai-three.vercel.app/)

---

## 1. Executive Summary

Traditional loan analytics and credit rating scorecards operate on static silos, overlooking supply-chain contagion, non-linear multi-tier default cascades, and latent behavioral cash-flow drift. 

**RiskFlow** is an enterprise-grade Loan Performance Intelligence Engine designed specifically for the **Intain Campus FinTech Challenge 2026 (AI Track)**. Moving beyond simple LLM wrappers, RiskFlow integrates **supervised decision trees, survival analysis, high-dimensional unsupervised anomaly detection, and linear programming containment algorithms** with a strictly grounded, zero-hallucination **Groq LPU copilot**.

---

## 2. Problem Statement Task Coverage Matrix

| Task # | Challenge Task Name | Implementation & Architecture | Key Outputs & Verification Artifacts | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Task 1** | **Data Intelligence & Profiling** | Automated schema validation, column distribution profiling, missingness scoring, outlier detection, cross-column constraint validation. | `DataIngestionView.tsx`, dynamic quality scoring, schema checks. | **Complete** |
| **Task 2** | **Loan Performance Prediction** | Non-LLM Supervised LightGBM classifier with isotonic calibration; chronological out-of-time (OOT) validation split. | 12-month PD, Next-State (`CURRENT`, `WATCH`, `DELINQUENT_90`, `DEFAULT`), ROC-AUC: **0.884**, PR-AUC: **0.742**. | **Complete** |
| **Task 3** | **Time-to-Event / Survival Modeling** | Semi-parametric Cox Proportional Hazards (CoxPH) survival trajectory modeling across multi-horizon event windows. | 3-month, 6-month, 12-month survival curves, **C-Index: 0.826**. | **Complete** |
| **Task 4** | **Anomaly & Exception Detection** | 9-Dimensional Isolation Forest constructing behavioral operational tensors (Cash Flow Stability, Payables Stretch, Debt Pressure). | Identification of *Risk DNA #017* (+8.6 pp gap between observed & expected defaults across 2,140+ facilities). | **Complete** |
| **Task 5** | **Scenario & Stress Simulation** | Macroeconomic transmission matrix applying multi-factor shocks (Repo rate, property values, unemployment, income). | Stressed PD deltas, portfolio loss surges, baseline vs. adverse topography comparison. | **Complete** |
| **Task 6** | **Explainability & Containment Graph** | Force-directed cascade simulator + linear integer programming containment optimization. | Global/local feature attribution, **4.4x EV** containment efficiency ratio (saving ₹18.2 Cr for ₹4.1 Cr cost). | **Complete** |
| **Task 7** | **LLM-Assisted Reviewer Copilot** | Server-side Groq LPU proxy (`llama-3.3-70b-versatile`) enforcing strict RFC-8259 JSON output formats and explicit citation anchoring. | Natural-language analyst reviews grounded in deterministic evidence IDs (`RA-*`, `PE-*`, `IV-*`) with zero math hallucination. | **Complete** |
| **Task 8** | **Governance & Agentic Coding Logs** | Complete model card, immutable regulatory event logging, and human-in-the-loop validation controls. | `MODEL_CARD.md`, `AI_DEVELOPMENT_LOG.md`, `submission.csv` with all 8 competition columns. | **Complete** |

---

## 3. Quantitative Model Benchmarks

| Model / Subsystem | Underlying Algorithm | Metric | Benchmark Score |
| :--- | :--- | :--- | :---: |
| **Default Classification** | Supervised LightGBM + Isotonic Calibration | **ROC-AUC** | `0.884` |
| **Precision-Recall Performance** | LightGBM (Class Imbalance Handled) | **PR-AUC** | `0.742` |
| **Probability Calibration** | Calibrated Sigmoid / Brier Minimizer | **Brier Score** | `0.082` |
| **Survival Trajectory** | Cox Proportional Hazards ($3\text{m}, 6\text{m}, 12\text{m}$) | **Concordance Index ($C$)** | `0.826` |
| **Anomaly Discovery** | 9D Unsupervised Isolation Forest | **Contamination Rate** | `0.060` |
| **Containment ROI** | Mixed Integer Linear Programming | **Intervention Efficiency** | `4.4x EV` |

---

## 4. Key Architectural Highlights

### Multi-Tier Default Contagion Simulator
Rather than treating counterparties as isolated risks, RiskFlow builds a directed financial interaction graph. A simulated shock or working capital failure on an anchor borrower (e.g., **Company A**) propagates downstream across trade receivables and shared credit facilities, modeling the direct loss (₹8.7 Cr) and total cascading exposure (₹26.4 Cr) in real time.


```

[ Anchor Entity: Company A ] ---> (Trade Credit Default: ₹8.7 Cr)
│
├───> [ Tier-1 Supplier: Company B ] (Liquidity Shock: ₹12.3 Cr)
│               │
│               └───> [ Tier-2 Vendor: Company C ] (Contagion Collapse: ₹5.4 Cr)
│
└───> [ Joint Venture Partner ] (Covenant Breach)

```

### 9-Dimensional Risk DNA
Constructs real-time behavioral tensors per facility:
1. Working Capital Stability
2. Debt Service Pressure
3. Payables Stretch Ratio
4. Revenue Volatility
5. Collateral Deterioration
6. Delinquency Trajectory
7. Bureau Score Drift
8. Utilization Elasticity
9. Supply Chain Node Criticality

### Zero-Hallucination AI Copilot (Groq LPU)
To adhere to regulatory financial requirements, RiskFlow strictly decouples LLM generation from numeric computation:
* All numbers, default probabilities, contagion traversals, and expected loss figures are computed **deterministically** by TypeScript and Python engines.
* The Groq LPU (`llama-3.3-70b-versatile`) acts as an explainability and narrative synthesis layer, accepting structured evidence JSON payloads and outputting verified evidence IDs (`RA-101`, `PE-002`, `IV-001`, `PAT-017`).

---

## 5. Competition Submission Artifact (`submission.csv`)

The system exports predictions matching all 8 competition-specified columns:

```csv
loan_id,probability_of_default,next_state,exception_type,anomaly_score,top_drivers,action,confidence
LN-IND-9001,12.93,WATCH,LATENT_CASHFLOW_STRESS,52.1,STANDARD_PERFORMANCE,COVENANT_RESET_AND_LIQUIDITY_AUDIT,0.83
LN-IND-9002,11.11,WATCH,LATENT_CASHFLOW_STRESS,53.7,STANDARD_PERFORMANCE,COVENANT_RESET_AND_LIQUIDITY_AUDIT,0.88
LN-IND-9003,15.60,WATCH,LATENT_CASHFLOW_STRESS,63.8,DTI_STRETCH_54PCT,COVENANT_RESET_AND_LIQUIDITY_AUDIT,0.90
LN-IND-9004,21.06,DELINQUENT_90,ROLLING_DELINQUENCY,99.0,ACTIVE_DPD_30,ENFORCE_RECEIVABLE_RINGFENCE,0.85
LN-IND-9005,14.90,WATCH,LATENT_CASHFLOW_STRESS,50.2,DTI_STRETCH_42PCT,COVENANT_RESET_AND_LIQUIDITY_AUDIT,0.90

```

---

## 6. Project Structure

```
riskflow/
├── AI_DEVELOPMENT_LOG.md       # Governance records, prompt iterations & LLM audits
├── MODEL_CARD.md               # Model parameters, validation strategies & ethical mitigations
├── package.json                # Frontend dependencies & scripts
├── src/                        # Full-stack React + Tailwind application
│   ├── components/             # UI widgets, Network Visualizer, Charts, Drawers
│   ├── services/               # API clients & backend integration
│   ├── types/                  # TypeScript domain interfaces (riskflow.ts)
│   └── views/                  # Command Center, Ingestion, Network, Risk DNA, AI Analyst
├── server/                     # Backend proxy & Groq AI analyst integration
│   ├── ai/                     # Prompt templates & LLM output sanitizers
│   └── server.ts               # Express API gateway & deterministic calculation fallback
├── ml_engine/                  # Core Python Machine Learning Engine
│   ├── server.py               # FastAPI microservice for survival & ML predictions
│   ├── train_models.py         # LightGBM, CoxPH & Isolation Forest pipeline
│   ├── generate_submission.py  # Competition validation & CSV generation script
│   └── submission.csv          # Final Task 8 output deliverable
└── README.md

```

---

## 7. Local Setup & Execution Guide

### Prerequisites

* **Node.js** (v18.0.0 or higher)
* **Python** (v3.10 or higher)
* **Git**

### Step 1: Clone Repository & Install Dependencies

```bash
git clone [https://github.com/kalicharm21/riskflowai.git](https://github.com/kalicharm21/riskflowai.git)
cd riskflowai
npm install

```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

```

### Step 3: Run Python ML & Survival Service

Open a new terminal:

```bash
cd ml_engine
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install fastapi uvicorn numpy pandas scikit-learn lightgbm lifelines shap
python -m uvicorn server:app --reload --port 8000

```

* Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

### Step 4: Run Web Platform

In your main terminal (root directory):

```bash
npm run dev

```

* Web Dashboard: `http://localhost:3000`

### Step 5: Regenerate Competition Submission CSV

```bash
cd ml_engine
python generate_submission.py

```

---

## 8. Live Deployment

The frontend and API gateway are deployed live on Vercel:

* **Production URL:** [https://riskflowai-three.vercel.app/](https://riskflowai-three.vercel.app/)

---

## 9. Contributors

* **Veedushi Jain** — *Lead ML & System Architect*
  * Designed the end-to-end multi-stage ML pipeline (LightGBM default classification, CoxPH multi-horizon survival modeling, and 9D Isolation Forest behavioral anomaly discovery).
  * Built the frontend command center, force-directed contagion graph visualizer, and UI state architecture.
  * Formulated the model governance card, time-aware OOT validation splits, and Groq LPU zero-hallucination prompt schema.

* **Ishaan Mittal** — *Lead Backend & Distributed Systems Engineer*
  * Architected the backend API gateway, Express microservices, and FastAPI integration pipelines for real-time ML inference.
  * Engineered the automated loan tape ingestion engine, schema normalization rules, and missingness/outlier scoring algorithms.
  * Implemented the graph traversal contagion engine, macro stress-testing transmission matrices, and linear programming containment optimization algorithms.

```

```