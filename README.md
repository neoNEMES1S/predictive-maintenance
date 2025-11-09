# 🏭 Semiconductor Data Insights Platform - Frontend

A modern React application for semiconductor manufacturing data analysis, featuring automated EDA, machine learning model training, anomaly detection, and parameter optimization.

## ✨ Features

- **Data Upload & Validation** - Support for CSV and Excel files
- **Exploratory Data Analysis (EDA)** - Statistical analysis and interactive visualizations
- **Machine Learning Pipeline** - Model training and predictions
- **Anomaly Detection** - Outlier detection with multiple algorithms
- **Parameter Optimization** - Identify optimal operating ranges
- **PDF Report Generation** - Comprehensive analysis reports

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Visualization**: Plotly.js + Recharts
- **Authentication**: Supabase Auth
- **API Client**: Axios

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for authentication and storage)
- Backend API deployed (FastAPI backend on Railway/Render or similar)

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd PredictiveMaintenance
```

2. **Install dependencies**
```bash
cd frontend
npm install
```

3. **Configure environment variables**

Create a `.env` file in the `frontend` directory:

```bash
VITE_API_URL=https://your-backend-api.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. **Run development server**
```bash
npm run dev
```

Visit http://localhost:5173

## 📦 Deploy to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Configure build settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   - `VITE_API_URL`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

For detailed deployment instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_RAILWAY_API_URL` | Alternative Railway API URL | No |

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.jsx
│   │   └── ui/           # shadcn/ui components
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Upload.jsx
│   │   ├── EDA.jsx
│   │   ├── MachineLearning.jsx
│   │   ├── Anomaly.jsx
│   │   ├── Optimization.jsx
│   │   └── Reports.jsx
│   ├── services/         # API clients
│   │   ├── api.js
│   │   └── supabaseClient.js
│   ├── store/           # Zustand state management
│   │   └── authStore.js
│   ├── lib/             # Utilities
│   │   └── utils.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔒 Security

- Never commit `.env` files
- Use environment variables for all API keys
- Enable HTTPS in production (automatic on Vercel)
- Configure CORS on your backend API

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues
- Verify `VITE_API_URL` is correct
- Check backend API is deployed and accessible
- Ensure CORS is configured on backend

### Supabase Connection Issues
- Verify Supabase credentials in environment variables
- Check Supabase project is active
- Ensure storage buckets are created

## 📄 License

MIT License

## 🙏 Acknowledgments

- **React** + **Vite** for blazing fast development
- **shadcn/ui** for beautiful UI components
- **Supabase** for authentication and storage
- **Plotly** for interactive visualizations

---

**Built for semiconductor manufacturing excellence** 🔬✨
