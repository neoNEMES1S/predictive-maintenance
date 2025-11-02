# Semiconductor Data Insights Web App

## 🧭 Overview
An open-source web application that enables users to upload semiconductor manufacturing data (CSV format), process it automatically, and generate deep insights through Exploratory Data Analysis (EDA) and Machine Learning (ML) analytics. The app is designed for data scientists, process engineers, and analysts to extract patterns, detect anomalies, and improve yield quality.

---

## 🧱 Architecture

**Tech Stack:**
- **Frontend:** React (Vite + TailwindCSS)
- **Backend:** FastAPI (Python)
- **Database & Storage:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **ML/EDA Libraries:** pandas, numpy, scikit-learn, plotly, seaborn
- **Containerization:** Docker Compose
- **Deployment (Open Source Options):** Coolify, Render, Railway, or local VPS

### System Flow
```
User Upload → Supabase Storage → FastAPI Processing → EDA & ML Analysis → Insights Dashboard (React)
```

### Folder Structure
```
project/
├── backend/
│   ├── app/
│   │   ├── routers/ (upload, eda, ml, anomaly, optimize)
│   │   ├── services/ (supabase, eda, ml, anomaly, optimization)
│   │   └── utils/ (preprocessing, feature_engineering)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/ (api.js, supabaseClient.js)
│   │   └── App.jsx
│   └── package.json
└── docker-compose.yml
```

---

## ⚙️ Functional Modules (Detailed)

### 1. **Data Upload & Validation Module**
- **Frontend:**
  - Users upload CSV/Excel files through a drag-and-drop or file picker UI.
  - Display real-time upload progress bar and post-upload summary.
  - Use Supabase Auth to restrict uploads to logged-in users.
- **Backend (FastAPI):**
  - Endpoint `/upload/` handles multipart/form-data.
  - Reads CSV into pandas DataFrame.
  - Validates missing headers, duplicate rows, data types, and missing values.
  - Automatically detects categorical vs. numerical columns.
  - Uploads raw file to Supabase Storage under `/uploads/{user_id}/`.
  - Inserts metadata (filename, timestamp, shape, user_id) into `upload_history` table.
- **Database (Supabase):**
  - `upload_history` stores all uploaded file records.
  - Triggered function can notify frontend in real-time (via Supabase Realtime API).

### 2. **EDA (Exploratory Data Analysis) Module**
- **Frontend:**
  - Displays visual summaries using Plotly.js (interactive graphs).
  - Tabs for distributions, correlations, missing values, and summary tables.
- **Backend (FastAPI):**
  - Endpoint `/eda/summary` performs:
    - `.describe()` stats for numerical columns.
    - Count and percentage of missing/null values.
    - Correlation matrix computation and heatmap.
    - Feature distribution histograms and boxplots (base64 or temp URLs to Supabase Storage).
  - Endpoint `/eda/insights` computes key insights:
    - Top correlated variables.
    - Outliers count and summary.
    - Feature variance.
    - Recommendations for feature engineering.
  - Results are cached and stored in Supabase DB under `eda_results`.
- **Database (Supabase):**
  - Table `eda_results` stores summaries, correlation maps, and visualization links for each upload.

### 3. **ML Analytics Pipeline Module**
- **Frontend:**
  - Allows user to select target variable and define prediction goal (classification/regression).
  - Shows model comparison charts (accuracy, F1-score, etc.).
- **Backend (FastAPI):**
  - Endpoint `/ml/train` triggers model training:
    - Auto detects problem type (classification vs regression).
    - Performs preprocessing (encoding, scaling, null handling).
    - Splits data (train/test 80-20).
    - Tests multiple algorithms (RandomForest, XGBoost, Logistic Regression, LightGBM).
    - Selects best-performing model based on metric.
    - Computes feature importance and SHAP values.
    - Saves model artifact to Supabase Storage (`/models/{user_id}/model.pkl`).
  - Endpoint `/ml/predict` allows predictions on new uploads using stored model.
- **Database (Supabase):**
  - `ml_results` table stores model type, accuracy, metrics, feature importances, and training timestamp.

### 4. **Anomaly Detection Module**
- **Frontend:**
  - Interactive scatter plots showing anomaly points.
  - Option to download anomalies as CSV.
- **Backend (FastAPI):**
  - Endpoint `/anomaly/run` executes Isolation Forest or DBSCAN.
  - Detects outliers and clusters, marks anomaly scores.
  - Saves results (anomaly indices, scores, visualizations) in `anomaly_results`.
- **Database (Supabase):**
  - `anomaly_results` table contains outlier summaries, count, and visualization links.

### 5. **Optimization & Parameter Suggestion Module**
- **Frontend:**
  - Panel to display recommended parameter ranges.
  - Sliders for interactive tuning.
- **Backend (FastAPI):**
  - Endpoint `/optimize/run` uses grid-based search or Bayesian optimization.
  - Identifies features with high correlation to the target.
  - Suggests optimal ranges based on top 10% performing records.
  - Returns recommendations for improving yield or process metrics.
- **Database (Supabase):**
  - `optimization_suggestions` table stores parameter recommendations.

### 6. **Report Generation Module**
- **Backend (FastAPI):**
  - Endpoint `/report/generate` compiles EDA, ML, and anomaly findings.
  - Generates professional PDF via ReportLab or pypandoc.
  - Uploads PDF to Supabase Storage and stores link in `reports`.
- **Frontend:**
  - Lists previous reports with download and re-run options.
  - Allows sharing reports via Supabase Auth roles.

### 7. **User Authentication & Management Module**
- Uses Supabase Auth for email/password or OAuth login.
- Assigns each user a unique `user_id` used for all DB and storage operations.
- Role-based access: `admin`, `analyst`, `viewer`.
- Restricts visibility of uploads, models, and reports per user.
- Enables audit logs using Supabase RLS (Row-Level Security).

### 8. **Realtime Notifications Module**
- Uses Supabase Realtime API for push updates:
  - Notify user when EDA/ML/anomaly processing is complete.
  - Update dashboard dynamically without manual refresh.
  - Display toast notifications in React frontend.

### 9. **API Gateway & Integration Module**
- Expose REST APIs for integration with external manufacturing or analytics systems.
- Key Endpoints:
  - `/upload/` → Upload data
  - `/eda/summary` → EDA insights
  - `/ml/train` → Train model
  - `/ml/predict` → Run predictions
  - `/anomaly/run` → Detect anomalies
  - `/optimize/run` → Generate optimization insights
  - `/report/generate` → Generate final report
- Use Supabase service keys for authentication with external clients.

---

## 🧩 Database Schema (Supabase PostgreSQL)

| Table | Description |
|--------|--------------|
| `upload_history` | Logs uploaded datasets with shape, file path, timestamp |
| `eda_results` | Stores EDA summaries, correlation matrices, and visuals URLs |
| `ml_results` | Stores model metrics, best model details, and feature importances |
| `anomaly_results` | Contains anomaly indices and descriptive info |
| `optimization_suggestions` | Stores process optimization outputs |
| `reports` | Tracks generated report files and storage links |
| `users` | Managed by Supabase Auth (email, user_id, role) |

---

## 💡 Suggested Advanced Features

| Category | Feature | Description |
|-----------|----------|-------------|
| **AI Insight** | Root Cause Analysis | Correlate yield drop or anomaly spikes to specific process parameters. |
| **Collaboration** | Shared Dashboards | Allow users to share insights or results with others via Supabase Auth roles. |
| **Realtime Update** | Live Stream Integration | Integrate Supabase Realtime to show ongoing data uploads or ML job completion notifications. |
| **Explainable AI** | SHAP-based Insights | Provide explainability for model predictions using SHAP or LIME. |
| **Model Registry** | Version Control | Track ML models, their training parameters, and accuracy trends. |
| **Predictive Alerts** | Email/Webhook Notifications | Send alerts for anomalies or performance drops automatically. |
| **Data Lineage** | Traceability | Map relationships between datasets, models, and generated reports. |
| **Interactive Notebook Mode** | On-Demand EDA Code | Allow exporting auto-generated analysis code for reproducibility. |
| **API Integration** | REST + Supabase APIs | Enable third-party systems to fetch insights programmatically. |

---

## ⚙️ Deployment
- Use **Docker Compose** for unified build & deployment.
- Host **Supabase** on self-hosted Docker or managed Supabase Cloud.
- Run backend and frontend as separate containers.
- Enable HTTPS with Caddy or Traefik reverse proxy.
- Use CI/CD pipelines via GitHub Actions, Drone CI, or Jenkins.

---

## ✅ Outcome
This architecture ensures a **fully open-source, automated, and scalable** analytics ecosystem. Each module is independently testable and integrates seamlessly through Supabase, reducing manual work and enabling deep process intelligence.

---

**Next Step:** Initialize the project in Cursor using this file. Cursor will automatically generate the folder structure, APIs, Supabase configuration, and frontend components for EDA + ML integration.

