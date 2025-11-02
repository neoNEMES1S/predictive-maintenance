# 🚂 Railway Backend Deployment Guide

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code should be on GitHub
3. **Supabase Setup**: Database and storage configured

---

## 🚀 Deploy Backend to Railway

### Step 1: Create New Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `predictive-maintenance`
5. Railway will detect your project

### Step 2: Configure Service

1. Click **"Add variables"** to add environment variables
2. Set **Root Directory** to `backend`
3. Configure the following:

### Step 3: Add Environment Variables

Add all these variables in Railway dashboard:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT Configuration
SECRET_KEY=generate-a-strong-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# App Configuration
APP_NAME=Semiconductor Insights
ENVIRONMENT=production
DEBUG=False
CORS_ORIGINS=https://predictive-maintenance-ochre.vercel.app,https://your-custom-domain.com

# File Upload Configuration
MAX_UPLOAD_SIZE=1073741824
ALLOWED_EXTENSIONS=csv,xlsx,xls

# ML Configuration
MODEL_CACHE_DIR=/app/models
TEST_SIZE=0.2
RANDOM_STATE=42

# Supabase Buckets
UPLOADS_BUCKET=uploads
MODELS_BUCKET=models
REPORTS_BUCKET=reports
```

**Where to get values:**
- Supabase credentials: Supabase Dashboard → Settings → API
- SECRET_KEY: Generate with `openssl rand -hex 32`

### Step 4: Configure Build Settings

Railway should auto-detect, but verify:

```
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Railway will provide a URL like: `https://your-app.up.railway.app`

---

## 🔗 Update Vercel with Backend URL

### Step 1: Copy Railway URL

After deployment, Railway provides a URL:
```
https://predictive-maintenance-production.up.railway.app
```

### Step 2: Update Vercel Environment Variable

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Find or add `VITE_API_URL`
4. Set value to: `https://your-app.up.railway.app`
5. Click **"Save"**
6. Click **"Redeploy"** to apply changes

### Step 3: Update Backend CORS

Make sure your Railway backend allows your Vercel domain:

In Railway, ensure `CORS_ORIGINS` includes:
```
CORS_ORIGINS=https://predictive-maintenance-ochre.vercel.app
```

---

## ✅ Verify Deployment

### 1. Check Backend Health

Visit: `https://your-app.up.railway.app/api/health`

Should return:
```json
{
  "status": "healthy",
  "environment": "production"
}
```

### 2. Check API Docs

Visit: `https://your-app.up.railway.app/api/docs`

Should show FastAPI Swagger UI.

### 3. Test Registration

Try registering a new user from your Vercel app.

---

## 📊 Monitor Your Railway App

### View Logs

1. Railway Dashboard → Your Service
2. Click **"Deployments"**
3. Click on a deployment
4. View logs in real-time

### View Metrics

1. Railway Dashboard → Your Service
2. Click **"Metrics"**
3. View CPU, Memory, Network usage

---

## 🔧 Troubleshooting

### Issue 1: Build Fails

**Error:** `pip install fails` or `Module not found`

**Fix:**
1. Check `requirements.txt` is in `backend/` directory
2. Verify Python version (Railway uses Python 3.11 by default)
3. Check Railway build logs for specific errors

### Issue 2: App Crashes on Start

**Error:** `uvicorn: command not found` or app exits immediately

**Fix:**
1. Verify Start Command:
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
2. Check environment variables are set
3. Review Railway logs for errors

### Issue 3: CORS Errors

**Symptoms:** Frontend can't connect, CORS policy blocks requests

**Fix:**
1. Update `CORS_ORIGINS` in Railway:
```
CORS_ORIGINS=https://predictive-maintenance-ochre.vercel.app
```
2. Redeploy the backend
3. Test from browser console

### Issue 4: Supabase Connection Fails

**Error:** `Invalid API key` or `Connection refused`

**Fix:**
1. Verify Supabase credentials in Railway variables
2. Check Supabase project is active
3. Verify service role key has correct permissions

---

## 💰 Railway Pricing

**Free Tier:**
- $5 free credits per month
- No credit card required initially
- Perfect for development/testing

**Pro Plan:**
- $20/month
- More resources
- Better performance

Your app should run fine on free tier for testing!

---

## 🔐 Security Best Practices

### 1. Rotate Secrets

Generate a strong SECRET_KEY:
```bash
openssl rand -hex 32
```

### 2. Limit CORS Origins

Only allow your production domains:
```
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

### 3. Use Service Role Key Carefully

The Supabase service role key bypasses RLS. Store it securely in Railway environment variables.

### 4. Enable HTTPS Only

Railway automatically provides HTTPS - never use HTTP in production.

---

## 📞 Need Help?

### Railway Support
- [Documentation](https://docs.railway.app/)
- [Discord Community](https://discord.gg/railway)
- [Support](https://railway.app/help)

### Common Commands

**View logs:**
```bash
railway logs
```

**Redeploy:**
```bash
railway up
```

---

## 🎉 Success Checklist

- [ ] Railway account created
- [ ] Backend deployed to Railway
- [ ] All environment variables set
- [ ] Health endpoint responds
- [ ] API docs accessible
- [ ] Vercel updated with Railway URL
- [ ] Frontend successfully calls backend
- [ ] Registration/login works
- [ ] File upload works
- [ ] No CORS errors

---

*Last updated: November 2025*

