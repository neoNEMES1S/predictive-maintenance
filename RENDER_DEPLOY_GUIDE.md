# 🎨 Render Backend Deployment Guide

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com) (free)
2. **GitHub Repository**: Your code should be on GitHub
3. **Supabase Setup**: Database and storage configured

---

## 🚀 Deploy Backend to Render (10 minutes)

### Step 1: Create New Web Service

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `predictive-maintenance`
4. Click **"Connect"**

### Step 2: Configure Service

Fill in these settings:

**Basic Settings:**
```
Name: semiconductor-insights-api
Region: Oregon (or closest to you)
Branch: main
Root Directory: backend
Runtime: Python 3
```

**Build Settings:**
```
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Instance Type:**
```
Select: Free
```

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add all these variables:

```bash
# Supabase Configuration (get from Supabase Dashboard → Settings → API)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Generate with: openssl rand -hex 32
SECRET_KEY=your-generated-secret-key-here

# Your Vercel frontend URL
CORS_ORIGINS=https://predictive-maintenance-ochre.vercel.app

# Standard Configuration
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
DEBUG=False
MAX_UPLOAD_SIZE=1073741824
ALLOWED_EXTENSIONS=csv,xlsx,xls
MODEL_CACHE_DIR=/opt/render/project/src/models
TEST_SIZE=0.2
RANDOM_STATE=42
UPLOADS_BUCKET=uploads
MODELS_BUCKET=models
REPORTS_BUCKET=reports
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for initial build
3. Render will provide a URL like: `https://semiconductor-insights-api.onrender.com`

---

## 🔗 Update Vercel with Backend URL

### Step 1: Copy Render URL

After deployment, copy your Render URL:
```
https://semiconductor-insights-api.onrender.com
```

### Step 2: Update Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Update or add `VITE_API_URL`:
   - Name: `VITE_API_URL`
   - Value: `https://semiconductor-insights-api.onrender.com`
   - Apply to: Production, Preview, Development

4. Click **"Save"**
5. Go to **Deployments** → **"Redeploy"** latest deployment

### Step 3: Update Backend CORS

Make sure `CORS_ORIGINS` in Render includes your Vercel URL:
```
CORS_ORIGINS=https://predictive-maintenance-ochre.vercel.app
```

---

## ⚠️ Render Free Tier Limitations

### Auto-Spin Down
Free tier services spin down after **15 minutes of inactivity**.

**What this means:**
- First request after inactivity: 30-60 second delay (cold start)
- Subsequent requests: Normal speed
- No data loss (just slower first load)

### Workarounds:

**Option A: Accept Cold Starts** (Recommended for MVP)
- It's free!
- Good enough for demos/testing
- Users see a loading screen for first request

**Option B: Keep-Alive Service** (Ping your API)
Set up a free cron job to ping your API every 10 minutes:

1. Go to [cron-job.org](https://cron-job.org) (free)
2. Create account
3. Add new cron job:
   - URL: `https://your-render-url.onrender.com/api/health`
   - Interval: Every 10 minutes
   - Method: GET

**Option C: Upgrade to Paid** ($7/month)
- No spin-down
- Always fast
- 512 MB RAM → 2 GB RAM

---

## ✅ Verify Deployment

### 1. Check Backend Health

Visit: `https://your-render-url.onrender.com/api/health`

**Expected:**
```json
{
  "status": "healthy",
  "environment": "production"
}
```

⚠️ **Note:** First request might take 30-60 seconds if service was sleeping.

### 2. Check API Docs

Visit: `https://your-render-url.onrender.com/api/docs`

**Expected:** FastAPI Swagger UI

### 3. Test from Frontend

1. Visit your Vercel app
2. Try registering a new user
3. First attempt might be slow (cold start)
4. Subsequent requests should be fast

---

## 📊 Monitor Your Render Service

### View Logs

1. Render Dashboard → Your Service
2. Click **"Logs"** tab
3. View real-time logs
4. Filter by: Info, Warning, Error

### View Metrics

1. Click **"Metrics"** tab
2. View:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

### View Events

1. Click **"Events"** tab
2. See:
   - Deployments
   - Service starts/stops
   - Build logs

---

## 🔧 Troubleshooting

### Issue 1: Build Fails

**Error:** `pip install fails` or dependency errors

**Fix:**
1. Check **Logs** tab for specific error
2. Verify `requirements.txt` is in `backend/` directory
3. Ensure no incompatible package versions
4. Try manual redeploy: Dashboard → **"Manual Deploy"** → **"Deploy latest commit"**

### Issue 2: Service Starts Then Crashes

**Symptoms:** Build succeeds but service shows "Failed"

**Fix:**
1. Check **Logs** for error message
2. Common issues:
   - Missing environment variables
   - Wrong `PORT` binding (must use `$PORT`)
   - Database connection errors

**Verify Start Command:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Issue 3: 502 Bad Gateway

**Symptoms:** API returns 502 error

**Fix:**
1. Service might be spinning down (wait 60 seconds and retry)
2. Check if service is running (Render Dashboard → Status)
3. View logs for crash errors
4. Verify environment variables are set

### Issue 4: CORS Errors

**Symptoms:** Frontend can't connect, browser blocks requests

**Fix:**
1. Render Dashboard → Environment → Check `CORS_ORIGINS`
2. Must match exactly: `https://predictive-maintenance-ochre.vercel.app`
3. No trailing slash
4. After updating, click **"Manual Deploy"**

### Issue 5: Cold Starts Too Slow

**Options:**
1. Accept it (it's free!)
2. Set up keep-alive ping (cron-job.org)
3. Upgrade to paid plan ($7/month)
4. Use Fly.io instead (no cold starts)

---

## 💰 Render Pricing

### Free Tier
- ✅ 750 hours/month (enough for 1 service)
- ✅ 512 MB RAM
- ✅ 0.1 CPU
- ✅ Automatic HTTPS
- ⚠️ Spins down after 15 min inactivity
- ⚠️ 100 GB bandwidth/month

### Starter Plan ($7/month)
- ✅ No spin-down (always on)
- ✅ 512 MB RAM
- ✅ 0.5 CPU
- ✅ Better for production

Your free tier is perfect for MVP/testing!

---

## 🔐 Security Best Practices

### 1. Generate Strong SECRET_KEY

```bash
openssl rand -hex 32
```

Never reuse or commit this key!

### 2. Protect Service Role Key

The Supabase service role key is sensitive:
- Only set in Render environment variables
- Never commit to GitHub
- Rotate periodically

### 3. Limit CORS Origins

Only allow your production domain:
```
CORS_ORIGINS=https://predictive-maintenance-ochre.vercel.app
```

Don't use `*` in production!

### 4. Use Environment-Specific Settings

Set `DEBUG=False` in production to avoid exposing stack traces.

---

## 🔄 Continuous Deployment

Render automatically deploys when you push to GitHub!

**How it works:**
1. Push code to `main` branch
2. Render detects changes
3. Automatically builds and deploys
4. Takes 2-3 minutes

**Manual Deploy:**
- Render Dashboard → **"Manual Deploy"** → **"Clear build cache & deploy"**

**Disable Auto-Deploy:**
- Settings → **"Auto-Deploy"** → Off

---

## 📞 Need Help?

### Render Support
- [Documentation](https://render.com/docs)
- [Community Forum](https://community.render.com)
- [Support](https://render.com/support)

### Common Issues
- [Render Status Page](https://status.render.com)
- [Python Quickstart](https://render.com/docs/deploy-fastapi)

---

## 🎉 Success Checklist

- [ ] Render account created
- [ ] Backend deployed to Render
- [ ] All environment variables set
- [ ] Health endpoint responds
- [ ] API docs accessible
- [ ] Vercel updated with Render URL
- [ ] Frontend redeployed
- [ ] Registration/login works
- [ ] No CORS errors
- [ ] File upload works

---

## 💡 Pro Tips

### Faster Cold Starts

Add this to your `backend/app/main.py`:

```python
@app.on_event("startup")
async def startup_event():
    # Warm up critical services
    print("Service starting up...")
```

### Better Logging

Render shows all `print()` statements in logs. Use them for debugging:

```python
print(f"[INFO] Processing upload: {filename}")
```

### Health Check Optimization

Your health check is already configured at `/api/health`. Render uses this to verify service health.

---

*Last updated: November 2025*
*Estimated deployment time: 10 minutes*
*Cost: Free*

