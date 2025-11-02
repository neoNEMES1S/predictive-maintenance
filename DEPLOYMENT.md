# 🚀 Deployment Guide

Complete guide to deploying Semiconductor Insights Platform to production.

## 📋 Pre-Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Environment variables documented
- [ ] Database tables created
- [ ] Storage buckets configured
- [ ] SSL certificates ready (production)
- [ ] Domain name configured (if applicable)

---

## 🌐 Deployment Strategy

### Recommended Setup

**Frontend → Vercel**
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Free tier available

**Backend → Railway/Render**
- Easy Python deployment
- Auto-scaling
- Free tier for testing
- Persistent storage

**Database → Supabase**
- Managed PostgreSQL
- Built-in auth & storage
- Realtime capabilities
- Generous free tier

---

## 1️⃣ Supabase Setup (Required)

### Step 1: Create Project

```bash
1. Visit https://supabase.com
2. Sign in / Create account
3. Click "New Project"
4. Fill in:
   - Name: semiconductor-insights
   - Database Password: [Generate strong password]
   - Region: [Closest to users]
5. Wait ~2 minutes for provisioning
```

### Step 2: Create Storage Buckets

```bash
Navigation: Storage → Create New Bucket

Bucket 1: uploads
- Name: uploads
- Public: false (recommended)
- Allowed MIME types: text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

Bucket 2: models
- Name: models  
- Public: false
- Allowed MIME types: application/octet-stream

Bucket 3: reports
- Name: reports
- Public: false
- Allowed MIME types: application/pdf
```

### Step 3: Execute SQL Schema

```sql
-- Go to: SQL Editor → New Query
-- Copy and paste from README.md database schema section
-- Click "Run" to execute

-- Verify tables created:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Step 4: Get API Keys

```bash
Navigation: Settings → API

Copy these values:
1. Project URL → SUPABASE_URL
2. anon public key → SUPABASE_ANON_KEY  
3. service_role key → SUPABASE_SERVICE_ROLE_KEY

⚠️ NEVER commit service_role key to git!
```

---

## 2️⃣ Backend Deployment (Railway)

### Option A: Railway (Recommended)

```bash
1. Visit https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Configure:
   - Root Directory: backend
   - Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   
6. Add Environment Variables:
```

**Required Environment Variables:**

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
SECRET_KEY=[Generate with: openssl rand -hex 32]
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
DEBUG=False
CORS_ORIGINS=https://your-frontend-domain.vercel.app
MAX_UPLOAD_SIZE=1073741824
ALLOWED_EXTENSIONS=csv,xlsx,xls
MODEL_CACHE_DIR=/app/models
TEST_SIZE=0.2
RANDOM_STATE=42
UPLOADS_BUCKET=uploads
MODELS_BUCKET=models
REPORTS_BUCKET=reports
```

```bash
7. Click "Deploy"
8. Wait for build to complete
9. Copy the generated URL (e.g., https://your-app.up.railway.app)
10. Test: https://your-app.up.railway.app/api/health
```

### Option B: Render

```bash
1. Visit https://render.com
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect repository
5. Configure:
   - Name: semiconductor-backend
   - Environment: Python
   - Root Directory: backend
   - Build Command: pip install -r requirements.txt
   - Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   - Instance Type: Free (for testing)
   
6. Add Environment Variables (same as Railway)
7. Click "Create Web Service"
8. Wait for deployment
9. Test endpoint: https://your-service.onrender.com/api/health
```

---

## 3️⃣ Frontend Deployment (Vercel)

### Step 1: Prepare Repository

```bash
# Ensure frontend builds locally
cd frontend
npm run build

# Should see dist/ folder created
```

### Step 2: Deploy to Vercel

```bash
1. Visit https://vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
   
6. Add Environment Variables:
```

**Required Environment Variables:**

```bash
VITE_API_URL=https://your-backend.up.railway.app
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
```

```bash
7. Click "Deploy"
8. Wait for build (2-3 minutes)
9. Visit generated URL: https://your-project.vercel.app
10. Test login and upload functionality
```

### Step 3: Configure Custom Domain (Optional)

```bash
1. In Vercel Dashboard → Settings → Domains
2. Add custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)
5. Update CORS_ORIGINS in backend to include new domain
```

---

## 4️⃣ Post-Deployment Configuration

### Update Backend CORS

```bash
# In Railway/Render environment variables, update:
CORS_ORIGINS=https://your-app.vercel.app,https://custom-domain.com

# Redeploy backend
```

### Test All Endpoints

```bash
# Health Check
curl https://your-backend.com/api/health

# API Docs
https://your-backend.com/api/docs

# Frontend Login
https://your-frontend.vercel.app/login
```

### Enable Supabase Row-Level Security (Production)

```sql
-- In Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE upload_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE eda_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomaly_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies (example for upload_history)
CREATE POLICY "Users can view their own uploads"
  ON upload_history FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own uploads"
  ON upload_history FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Repeat for other tables
```

---

## 5️⃣ Monitoring & Maintenance

### Setup Logging

**Backend (Railway):**
```bash
# View logs
railway logs --tail

# In code, use structured logging
import logging
logging.basicConfig(level=logging.INFO)
```

**Frontend (Vercel):**
```bash
# View logs in Vercel Dashboard → Deployments → [Click deployment] → Function Logs
```

### Setup Alerts

**Uptime Monitoring:**
- Use UptimeRobot (free)
- Monitor: /api/health endpoint
- Alert on downtime

**Error Tracking:**
- Integrate Sentry (optional)
- Track frontend errors
- Monitor API exceptions

### Database Backups

```bash
Supabase Dashboard → Settings → Database → Backups
- Enable automatic daily backups
- Keep 7 days of backups minimum
```

---

## 6️⃣ Scaling Considerations

### When to Scale

**Indicators:**
- Response time > 2 seconds
- CPU usage > 80%
- Memory usage > 90%
- Request rate > 1000/min

### Scaling Options

**Railway:**
```bash
Settings → Resources
- Upgrade to Pro plan
- Increase memory (2GB → 8GB)
- Add replicas for load balancing
```

**Render:**
```bash
Settings → Instance Type
- Upgrade from Free → Starter → Standard
```

**Supabase:**
```bash
Settings → Billing
- Upgrade to Pro for:
  - More storage
  - Better performance
  - Priority support
```

---

## 7️⃣ Troubleshooting

### Common Issues

**CORS Errors:**
```bash
Solution: Add frontend domain to backend CORS_ORIGINS
Check: Browser console for exact domain
```

**Database Connection Failed:**
```bash
Solution: Verify Supabase credentials in environment variables
Check: Supabase project is active and not paused
```

**File Upload Fails:**
```bash
Solution: Check storage buckets exist and are accessible
Verify: MAX_UPLOAD_SIZE environment variable
```

**ML Training Timeout:**
```bash
Solution: Increase timeout in Railway/Render settings
Consider: Moving to background jobs with Celery + Redis
```

---

## 8️⃣ Security Hardening

### Production Checklist

- [ ] Change all default passwords
- [ ] Enable 2FA on all accounts
- [ ] Use strong JWT secret key
- [ ] Enable Supabase RLS
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Implement CSRF protection
- [ ] Regular dependency updates
- [ ] Audit logs enabled

### Rate Limiting (Optional)

```python
# backend/app/main.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/api/upload/")
@limiter.limit("10/minute")
async def upload_endpoint():
    pass
```

---

## 9️⃣ Cost Optimization

### Free Tier Limits

**Vercel:**
- 100 GB bandwidth/month
- 100 GB-hours compute
- Unlimited deployments

**Railway:**
- $5 credit/month (Free tier)
- ~500 hours uptime

**Supabase:**
- 500 MB database
- 1 GB file storage
- 50,000 monthly active users

### Tips to Stay in Free Tier

1. **Optimize images** - Use WebP format
2. **Enable caching** - Reduce API calls
3. **Lazy loading** - Load data on demand
4. **Compress responses** - Enable gzip
5. **Clean old data** - Implement data expiry

---

## 🎉 Deployment Complete!

Your application is now live at:
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.railway.app/api/docs
- **Database**: Supabase Dashboard

Next steps:
1. Test all features end-to-end
2. Upload your semiconductor dataset
3. Share with stakeholders
4. Monitor logs for issues
5. Collect feedback and iterate

---

**Questions?** Check the main README.md or open an issue on GitHub!

