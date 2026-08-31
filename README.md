# RiskFlow: Institutional Loan Performance Intelligence & Contagion Engine

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel%20Deployment-000000?style=for-the-badge\&logo=vercel\&logoColor=white)](https://riskflowai-three.vercel.app/)
[![Intain AI Track](https://img.shields.io/badge/Intain%20Campus%20FinTech%20Challenge%202026-AI%20Track-blue?style=for-the-badge)](https://riskflowai-three.vercel.app/)
[![Python ML Engine](https://img.shields.io/badge/FastAPI-ML%20%26%20Survival-green?style=for-the-badge\&logo=python\&logoColor=white)](http://127.0.0.1:8000/docs)
[![Groq LPU](https://img.shields.io/badge/Groq%20LPU-Llama--3.3--70B-orange?style=for-the-badge\&logo=groq\&logoColor=white)](https://groq.com/)

> **Live Deployment:** https://riskflowai-three.vercel.app/

RiskFlow is an institutional loan performance intelligence platform designed for the **Intain Campus FinTech Challenge 2026 – AI Track**.

It combines machine learning, survival analysis, anomaly detection, financial contagion simulation, stress testing, optimization, and an LLM-powered analyst copilot to provide a comprehensive view of loan and portfolio risk.

---

## Table of Contents

* [Overview](#overview)
* [Problem Statement](#problem-statement)
* [Key Features](#key-features)
* [Challenge Task Coverage](#challenge-task-coverage)
* [Model Benchmarks](#model-benchmarks)
* [Architecture](#architecture)
* [Risk DNA](#risk-dna)
* [AI Copilot](#ai-copilot)
* [Submission Artifact](#submission-artifact)
* [Project Structure](#project-structure)
* [Local Setup](#local-setup)
* [Live Deployment](#live-deployment)
* [Contributors](#contributors)

---

## Overview

Traditional loan analytics and credit-rating scorecards often evaluate borrowers in isolation. This can make it difficult to identify:

* Supply-chain contagion
* Multi-tier default cascades
* Behavioral cash-flow deterioration
* Hidden operational anomalies
* Time-dependent default risk
* Portfolio-level stress scenarios

**RiskFlow** addresses these limitations by combining deterministic financial analytics with multiple machine-learning models and an explainability-focused AI layer.

The platform integrates:

* Supervised loan default prediction
* Survival analysis
* Behavioral anomaly detection
* Macro stress testing
* Financial contagion simulation
* Explainability
* Containment optimization
* LLM-assisted analyst reviews
* Governance and model documentation

---

## Problem Statement

RiskFlow was developed to address the eight major tasks specified by the **Intain Campus FinTech Challenge 2026 – AI Track**.

### Challenge Task Coverage

| Task       | Challenge Requirement              | Implementation                                                                                                          |  Status  |
| ---------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | :------: |
| **Task 1** | Data Intelligence & Profiling      | Automated schema validation, distribution profiling, missingness scoring, outlier detection and cross-column validation | Complete |
| **Task 2** | Loan Performance Prediction        | LightGBM classifier with isotonic calibration and chronological out-of-time validation                                  | Complete |
| **Task 3** | Time-to-Event / Survival Modeling  | Cox Proportional Hazards survival modeling across multiple horizons                                                     | Complete |
| **Task 4** | Anomaly & Exception Detection      | 9-dimensional Isolation Forest behavioral anomaly detection                                                             | Complete |
| **Task 5** | Scenario & Stress Simulation       | Macro-economic transmission matrix with multi-factor shocks                                                             | Complete |
| **Task 6** | Explainability & Containment Graph | Contagion graph simulation and linear/integer programming optimization                                                  | Complete |
| **Task 7** | LLM-Assisted Reviewer Copilot      | Groq LPU-powered evidence-grounded analyst copilot                                                                      | Complete |
| **Task 8** | Governance & Agentic Coding Logs   | Model card, development logs, regulatory event logging and submission CSV                                               | Complete |

---

## Key Features

### 1. Loan Default Prediction

RiskFlow uses a supervised **LightGBM** classification model to estimate probability of default.

The system produces:

* 12-month Probability of Default
* Next-state classification
* Risk scores
* Confidence values
* Top risk drivers

Supported loan states include:

```text
CURRENT
WATCH
DELINQUENT_90
DEFAULT
```

---

### 2. Survival Analysis

RiskFlow uses **Cox Proportional Hazards (CoxPH)** modeling to estimate time-to-event risk.

The platform provides survival trajectories across:

* 3-month horizon
* 6-month horizon
* 12-month horizon

This allows analysts to evaluate not only **whether** a borrower may default, but also **when the event is likely to occur**.

---

### 3. Behavioral Anomaly Detection

A **9-dimensional Isolation Forest** analyzes borrower and facility behavior to identify unusual risk patterns.

The behavioral risk tensor incorporates:

1. Working Capital Stability
2. Debt Service Pressure
3. Payables Stretch Ratio
4. Revenue Volatility
5. Collateral Deterioration
6. Delinquency Trajectory
7. Bureau Score Drift
8. Utilization Elasticity
9. Supply Chain Node Criticality

This enables identification of latent risk patterns that may not be visible through traditional credit metrics.

---

### 4. Multi-Tier Default Contagion

Instead of treating borrowers as independent entities, RiskFlow models financial relationships as a directed graph.

A default or liquidity shock originating from one entity can propagate through:

* Trade receivables
* Suppliers
* Vendors
* Joint ventures
* Shared credit facilities

Example:

```text
                  ┌─────────────────────────────┐
                  │       Company A             │
                  │      Anchor Entity          │
                  └──────────────┬──────────────┘
                                 │
                    Trade Credit Default
                                 │
                                 ▼
                  ┌─────────────────────────────┐
                  │       Company B             │
                  │      Tier-1 Supplier        │
                  └──────────────┬──────────────┘
                                 │
                           Liquidity Shock
                                 │
                                 ▼
                  ┌─────────────────────────────┐
                  │       Company C             │
                  │      Tier-2 Vendor          │
                  └─────────────────────────────┘
```

The simulator can model both direct exposure and cascading exposure across multiple tiers.

---

### 5. Macro Stress Testing

RiskFlow provides scenario-based portfolio stress testing using macroeconomic variables such as:

* Repo rate
* Property values
* Unemployment
* Income levels

The engine evaluates the impact of these shocks on:

* Probability of default
* Portfolio losses
* Borrower risk
* Portfolio topology

---

### 6. Containment Optimization

RiskFlow combines contagion analysis with optimization algorithms to determine where interventions can have the greatest impact.

The containment engine evaluates intervention cost versus expected value saved.

Example output:

```text
Intervention Cost:      ₹4.1 Cr
Expected Value Saved:   ₹18.2 Cr
Efficiency Ratio:       4.4x EV
```

---

## Model Benchmarks

| Model / Subsystem            | Algorithm                        | Metric                  |       Score |
| ---------------------------- | -------------------------------- | ----------------------- | ----------: |
| Default Classification       | LightGBM + Isotonic Calibration  | ROC-AUC                 |   **0.884** |
| Precision-Recall Performance | LightGBM                         | PR-AUC                  |   **0.742** |
| Probability Calibration      | Calibrated Probability Model     | Brier Score             |   **0.082** |
| Survival Trajectory          | Cox Proportional Hazards         | C-Index                 |   **0.826** |
| Anomaly Detection            | 9D Isolation Forest              | Contamination Rate      |   **0.060** |
| Containment Optimization     | Mixed Integer Linear Programming | Intervention Efficiency | **4.4x EV** |

---

## Architecture

RiskFlow follows a hybrid architecture combining a modern web application with dedicated ML services.

```text
                    ┌───────────────────────┐
                    │      React Frontend   │
                    │   RiskFlow Dashboard  │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │    Express Gateway    │
                    │     API / Services    │
                    └───────┬─────────┬─────┘
                            │         │
                ┌───────────┘         └────────────┐
                ▼                                  ▼
      ┌───────────────────┐              ┌──────────────────┐
      │ Python ML Engine  │              │  Groq LPU        │
      │      FastAPI      │              │ Llama 3.3 70B    │
      └─────────┬─────────┘              └──────────────────┘
                │
        ┌───────┼────────┬─────────────┐
        ▼       ▼        ▼             ▼
     LightGBM  CoxPH  Isolation     Stress /
                       Forest        Optimization
```

### Technology Stack

**Frontend**

* React
* TypeScript
* Tailwind CSS
* Charts and data visualization
* Network visualization

**Backend**

* Node.js
* Express
* TypeScript
* REST APIs

**Machine Learning**

* Python
* FastAPI
* LightGBM
* Scikit-learn
* Lifelines
* SHAP
* NumPy
* Pandas

**AI**

* Groq LPU
* Llama 3.3 70B

**Deployment**

* Vercel

---

## Risk DNA

RiskFlow creates a behavioral risk fingerprint for each facility using nine dimensions:

```text
┌─────────────────────────────────────┐
│            RISK DNA                 │
├─────────────────────────────────────┤
│ 1. Working Capital Stability        │
│ 2. Debt Service Pressure            │
│ 3. Payables Stretch Ratio           │
│ 4. Revenue Volatility               │
│ 5. Collateral Deterioration         │
│ 6. Delinquency Trajectory           │
│ 7. Bureau Score Drift               │
│ 8. Utilization Elasticity            │
│ 9. Supply Chain Criticality         │
└─────────────────────────────────────┘
```

These dimensions are combined to identify unusual behavioral patterns and latent financial stress.

---

## AI Copilot

RiskFlow includes an LLM-assisted analyst copilot powered by **Groq LPU with Llama 3.3 70B**.

The LLM is intentionally separated from the core numeric computation layer.

### Design Principles

All critical numerical outputs are generated deterministically by the TypeScript and Python engines, including:

* Default probabilities
* Expected losses
* Contagion traversal
* Stress-test calculations
* Optimization results
* Risk scores

The LLM acts primarily as an **explainability and narrative synthesis layer**.

Structured evidence is passed to the model, and responses are grounded using evidence identifiers such as:

```text
RA-101
PE-002
IV-001
PAT-017
```

This architecture reduces the risk of the LLM inventing financial calculations or unsupported risk conclusions.

---

## Competition Submission Artifact

RiskFlow generates a `submission.csv` containing the competition-required prediction fields.

### Output Schema

```csv
loan_id,
probability_of_default,
next_state,
exception_type,
anomaly_score,
top_drivers,
action,
confidence
```

### Example

```csv
loan_id,probability_of_default,next_state,exception_type,anomaly_score,top_drivers,action,confidence
LN-IND-9001,12.93,WATCH,LATENT_CASHFLOW_STRESS,52.1,STANDARD_PERFORMANCE,COVENANT_RESET_AND_LIQUIDITY_AUDIT,0.83
LN-IND-9002,11.11,WATCH,LATENT_CASHFLOW_STRESS,53.7,STANDARD_PERFORMANCE,COVENANT_RESET_AND_LIQUIDITY_AUDIT,0.88
LN-IND-9003,15.60,WATCH,LATENT_CASHFLOW_STRESS,63.8,DTI_STRETCH_54PCT,COVENANT_RESET_AND_LIQUIDITY_AUDIT,0.90
LN-IND-9004,21.06,DELINQUENT_90,ROLLING_DELINQUENCY,99.0,ACTIVE_DPD_30,ENFORCE_RECEIVABLE_RINGFENCE,0.85
LN-IND-9005,14.90,WATCH,LATENT_CASHFLOW_STRESS,50.2,DTI_STRETCH_42PCT,COVENANT_RESET_AND_LIQUIDITY_AUDIT,0.90
```

---

## Project Structure

```text
riskflowai/
│
├── AI_DEVELOPMENT_LOG.md
├── MODEL_CARD.md
├── README.md
├── package.json
│
├── src/
│   ├── components/
│   │   ├── UI components
│   │   ├── Network Visualizer
│   │   ├── Charts
│   │   └── Drawers
│   │
│   ├── services/
│   │   └── API clients & backend integration
│   │
│   ├── types/
│   │   └── riskflow.ts
│   │
│   └── views/
│       ├── Command Center
│       ├── Data Ingestion
│       ├── Network
│       ├── Risk DNA
│       └── AI Analyst
│
├── server/
│   ├── ai/
│   │   ├── Prompt templates
│   │   └── LLM output sanitizers
│   │
│   └── server.ts
│
└── ml_engine/
    ├── server.py
    ├── train_models.py
    ├── generate_submission.py
    └── submission.csv
```

---

# Local Setup

## Prerequisites

Make sure the following are installed:

* **Node.js** v18 or higher
* **Python** v3.10 or higher
* **Git**

---

## 1. Clone the Repository

```bash
git clone https://github.com/kalicharm21/riskflowai.git
cd riskflowai
```

Install frontend/backend dependencies:

```bash
npm install
```

---

## 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

Replace `your_groq_api_key_here` with your actual Groq API key.

> **Security:** Never commit your `.env` file or API keys to GitHub.

Make sure `.env` is included in `.gitignore`.

---

## 3. Run the Python ML Engine

Open a new terminal:

```bash
cd ml_engine
```

Create a virtual environment:

```bash
python -m venv venv
```

### Windows

```bash
.\venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install the required Python packages:

```bash
pip install fastapi uvicorn numpy pandas scikit-learn lightgbm lifelines shap
```

Start the FastAPI service:

```bash
python -m uvicorn server:app --reload --port 8000
```

The ML API will be available at:

```text
http://127.0.0.1:8000
```

Interactive Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 4. Run the Web Application

From the project root:

```bash
npm run dev
```

The dashboard will be available at:

```text
http://localhost:3000
```

---

## 5. Generate Competition Submission

To regenerate the competition submission file:

```bash
cd ml_engine
python generate_submission.py
```

This generates/updates:

```text
ml_engine/submission.csv
```

---

# Live Deployment

The production version of RiskFlow is deployed on Vercel.

**Production URL:**

https://riskflowai-three.vercel.app/

---

# Governance & Documentation

RiskFlow includes dedicated governance artifacts to improve transparency and reproducibility.

### `MODEL_CARD.md`

Contains:

* Model parameters
* Validation strategies
* Model limitations
* Ethical considerations
* Risk mitigation strategies

### `AI_DEVELOPMENT_LOG.md`

Contains:

* AI development records
* Prompt iterations
* LLM audits
* Development decisions
* Governance-related documentation

---

# Contributors

### Veedushi Jain — Lead ML & System Architect

* Designed the end-to-end ML pipeline.
* Implemented LightGBM default classification.
* Developed CoxPH multi-horizon survival modeling.
* Built the 9-dimensional Isolation Forest anomaly detection system.
* Built the frontend command center.
* Developed the force-directed contagion graph visualizer.
* Designed UI state architecture.
* Formulated model governance documentation.
* Implemented time-aware out-of-time validation strategies.
* Designed the Groq LPU evidence-grounded prompt architecture.

### Ishaan Mittal — Lead Backend & Distributed Systems Engineer

* Architected the backend API gateway.
* Developed Express microservices and FastAPI integration.
* Engineered the automated loan-tape ingestion engine.
* Implemented schema normalization.
* Developed missingness and outlier scoring algorithms.
* Implemented graph traversal for contagion analysis.
* Developed macro stress-testing transmission matrices.
* Implemented linear programming-based containment optimization.

---

## License

This project was developed as part of the **Intain Campus FinTech Challenge 2026 – AI Track**.
