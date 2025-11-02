# 🏭 Semiconductor Data Insights Platform

A comprehensive full-stack web application for semiconductor manufacturing data analysis, featuring automated EDA, machine learning model training, anomaly detection, and parameter optimization.

## ✨ Features

### 📊 Core Capabilities

- **Data Upload & Validation** - Support for CSV and Excel files with automatic validation
- **Exploratory Data Analysis (EDA)** - Automated statistical analysis, correlation matrices, and interactive visualizations
- **Machine Learning Pipeline** - Train multiple models (XGBoost, LightGBM, RandomForest, CatBoost) with automatic model selection
- **Anomaly Detection** - Isolation Forest and DBSCAN algorithms for outlier detection
- **Parameter Optimization** - Identify optimal operating ranges to maximize/minimize target metrics
- **PDF Report Generation** - Comprehensive reports with all analysis results
- **Data Management** - Configurable data expiry and secure deletion with password confirmation

### 🎯 Technical Highlights

- **Backend**: FastAPI with async/await for high performance
- **Frontend**: React + Vite with shadcn/ui for premium UI/UX
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **ML Stack**: scikit-learn, XGBoost, LightGBM, CatBoost, SHAP
- **Visualization**: Plotly for interactive charts
- **Deployment**: Docker Compose (local) + Vercel (production)

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- Docker & Docker Compose (optional, for containerized development)
- Supabase account (for production features)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/semiconductor-insights.git
cd semiconductor-insights
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Run backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000

API Documentation: http://localhost:8000/api/docs

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with API and Supabase URLs

# Run frontend
npm run dev
```

Frontend will be available at: http://localhost:5173

### 4. Docker Compose (Alternative)

```bash
# From project root
docker-compose up --build

# Access:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:8000
# - API Docs: http://localhost:8000/api/docs
```

---

## 🔧 Configuration

### Backend (.env)

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT
SECRET_KEY=your-secret-key-generate-with-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application
ENVIRONMENT=development
DEBUG=True
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# File Upload
MAX_UPLOAD_SIZE=1073741824  # 1GB
ALLOWED_EXTENSIONS=csv,xlsx,xls

# ML
MODEL_CACHE_DIR=./models
TEST_SIZE=0.2
RANDOM_STATE=42

# Storage Buckets
UPLOADS_BUCKET=uploads
MODELS_BUCKET=models
REPORTS_BUCKET=reports
```

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📦 Supabase Setup

### 1. Create Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create new project
3. Wait for provisioning (~2 minutes)

### 2. Create Storage Buckets

In Supabase Dashboard → Storage:

- Create bucket: `uploads` (public or private)
- Create bucket: `models` (private)
- Create bucket: `reports` (private)

### 3. Create Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Upload History
CREATE TABLE upload_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    rows INTEGER NOT NULL,
    columns INTEGER NOT NULL,
    column_names TEXT[],
    numerical_cols TEXT[],
    categorical_cols TEXT[],
    storage_path TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW(),
    expiry_date TIMESTAMP
);

-- EDA Results
CREATE TABLE eda_results (
    id TEXT PRIMARY KEY,
    upload_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    summary_stats JSONB,
    correlation_matrix JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ML Results
CREATE TABLE ml_results (
    id TEXT PRIMARY KEY,
    upload_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    target_column TEXT NOT NULL,
    problem_type TEXT NOT NULL,
    best_model TEXT NOT NULL,
    models_trained TEXT[],
    best_score FLOAT NOT NULL,
    metrics JSONB,
    feature_importance JSONB,
    shap_values_url TEXT,
    model_path TEXT,
    trained_at TIMESTAMP DEFAULT NOW()
);

-- Anomaly Results
CREATE TABLE anomaly_results (
    id TEXT PRIMARY KEY,
    upload_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    method TEXT NOT NULL,
    anomaly_count INTEGER NOT NULL,
    anomaly_percentage FLOAT NOT NULL,
    anomaly_indices INTEGER[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Optimization Suggestions
CREATE TABLE optimization_suggestions (
    id TEXT PRIMARY KEY,
    upload_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    target_column TEXT NOT NULL,
    optimization_goal TEXT NOT NULL,
    optimal_ranges JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
    id TEXT PRIMARY KEY,
    upload_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    report_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Get API Keys

From Project Settings → API:

- Copy `Project URL` → `SUPABASE_URL`
- Copy `anon public` key → `SUPABASE_ANON_KEY`
- Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

## 📊 Usage Guide

### 1. Upload Data

1. Navigate to **Upload** page
2. Drag & drop your CSV/Excel file or click to select
3. Click **Upload & Analyze**
4. View upload summary with row/column counts

### 2. Exploratory Data Analysis

1. From Dashboard, click **EDA** on any uploaded dataset
2. Click **Generate EDA**
3. View:
   - Summary statistics (mean, std, min, max)
   - Correlation heatmap
   - Outlier detection
   - Key insights and recommendations

### 3. Train ML Model

1. Navigate to **Machine Learning** for a dataset
2. Enter target column name (e.g., `failure_mode`, `quality_score`)
3. Click **Train Models**
4. Monitor training progress
5. View results:
   - Best model selection
   - Accuracy, F1-score, other metrics
   - Feature importance rankings
   - SHAP values for explainability

### 4. Anomaly Detection

1. Go to **Anomaly Detection** for a dataset
2. Choose method: Isolation Forest or DBSCAN
3. Click **Detect Anomalies**
4. Review anomaly count and percentage
5. Export anomalies for further investigation

### 5. Parameter Optimization

1. Navigate to **Optimization** for a dataset
2. Enter target column
3. Choose goal: Maximize or Minimize
4. Click **Optimize Parameters**
5. View:
   - Improvement potential
   - Optimal parameter ranges
   - Actionable recommendations

### 6. Generate Reports

1. Go to **Reports** page
2. Select a dataset
3. Click **Generate PDF Report**
4. Download completed report with all analyses

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest -v

# With coverage
pytest --cov=app --cov-report=html
```

### Frontend Tests (Optional)

```bash
cd frontend
npm run test
```

---

## 🚢 Deployment

### Vercel (Frontend)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables:
   - `VITE_API_URL`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Backend Deployment Options

**Option 1: Railway**
1. Connect GitHub repository
2. Deploy from `backend` directory
3. Add environment variables
4. Railway auto-detects Python and installs dependencies

**Option 2: Render**
1. Create new Web Service
2. Connect repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Option 3: Docker on VPS**
```bash
docker build -t semiconductor-backend ./backend
docker run -p 8000:8000 --env-file backend/.env semiconductor-backend
```

---

## 📁 Project Structure

```
semiconductor-insights/
├── backend/
│   ├── app/
│   │   ├── routers/          # API endpoints
│   │   ├── services/         # Business logic
│   │   ├── models/           # Pydantic schemas
│   │   ├── config.py         # Configuration
│   │   └── main.py           # FastAPI app
│   ├── tests/                # Unit tests
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API clients
│   │   ├── store/            # Zustand state
│   │   ├── lib/              # Utilities
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml
├── vercel.json
└── README.md
```

---

## 🔒 Security Notes

- **Never commit `.env` files** to version control
- Use environment variables for all secrets
- Enable Row-Level Security (RLS) in Supabase for production
- Implement rate limiting for API endpoints
- Validate all user inputs
- Use HTTPS in production
- Regular security audits and dependency updates

---

## 🐛 Troubleshooting

### Backend Issues

**Import Errors:**
```bash
# Ensure all dependencies are installed
pip install -r requirements.txt

# Verify Python version
python --version  # Should be 3.11+
```

**Supabase Connection:**
- Verify credentials in `.env`
- Check Supabase project is active
- Ensure storage buckets exist

**Storage Issues:**
```bash
# Create required directories
mkdir -p storage/{uploads,data,visualizations,anomaly,shap,reports} models
```

### Frontend Issues

**Module Not Found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build Errors:**
- Ensure Node.js version is 20+
- Check all environment variables are set
- Clear Vite cache: `rm -rf node_modules/.vite`

---

## 📈 Performance Optimization

- **ML Training**: Use background tasks for long-running operations
- **File Uploads**: Stream large files instead of loading into memory
- **Database**: Index frequently queried columns
- **Caching**: Implement Redis for API response caching
- **CDN**: Serve static assets via CDN

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

- **FastAPI** for the excellent async framework
- **Supabase** for BaaS platform
- **shadcn/ui** for beautiful UI components
- **Plotly** for interactive visualizations
- **XGBoost, LightGBM, CatBoost** for powerful ML algorithms

---

## 📞 Support

For questions or issues:

- Open an issue on GitHub
- Email: your-email@example.com
- Documentation: [Link to docs]

---

**Built with ❤️ for the semiconductor industry**

# predictive-maintenance
