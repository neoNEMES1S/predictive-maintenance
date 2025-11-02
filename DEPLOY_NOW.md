# 🚀 DEPLOY BACKEND NOW - Quick Guide

## 🔴 Current Issue

Your frontend is live on Vercel but trying to connect to:
```
https://your-backend-url.com ❌ (placeholder)
```

You need to deploy the backend and update Vercel!

---

## 🎯 FREE DEPLOYMENT OPTIONS

### Option 1: **Render** (Easiest - 10 min)
- ✅ Free tier available
- ✅ Dashboard-based (no CLI needed)
- ⚠️ Cold starts after 15 min inactivity

### Option 2: **Fly.io** (Best - 15 min)
- ✅ Free tier (3 VMs)
- ✅ No cold starts (always on!)
- ⚠️ Requires CLI setup

---

## ⚡ RECOMMENDED: Render (Dashboard Deploy)

### Step 1: Deploy Backend to Render (5 min)

1. **Go to** [render.com](https://render.com) and sign in with GitHub

2. **Click** "New +" → "Web Service"

3. **Connect** your `predictive-maintenance` repository

4. **Configure Service:**
   - Name: `semiconductor-insights-api`
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Instance Type: **Free**

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):

```bash
# Copy these from Supabase Dashboard → Settings → API
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Generate SECRET_KEY by running: openssl rand -hex 32
SECRET_KEY=your-generated-secret-key-here

# Copy your Vercel URL
CORS_ORIGINS=https://predictive-maintenance-ochre.vercel.app

# These can stay as-is
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
DEBUG=False
MAX_UPLOAD_SIZE=1073741824
ALLOWED_EXTENSIONS=csv,xlsx,xls
MODEL_CACHE_DIR=/app/models
UPLOADS_BUCKET=uploads
MODELS_BUCKET=models
REPORTS_BUCKET=reports
```

6. **Click** "Create Web Service" and wait ~3-5 minutes

7. **Copy your Render URL** (looks like: `https://semiconductor-insights-api.onrender.com`)

### Step 2: Update Vercel (2 min)

1. **Go to** Vercel Dashboard → Your Project

2. **Click** Settings → Environment Variables

3. **Find** `VITE_API_URL` or add it:
   - Name: `VITE_API_URL`
   - Value: `https://semiconductor-insights-api.onrender.com` (your Render URL)
   - Environment: Production (and Preview, Development)

4. **Click** "Save"

5. **Go to** Deployments → Click "⋯" on latest → "Redeploy"

6. **Wait** 2 minutes for redeployment

### Step 3: Test (1 min)

1. **Visit** your Vercel app: `https://predictive-maintenance-ochre.vercel.app`

2. **Try** signing up with a new email/password

3. **Should work!** ✅

---

## 🔧 Generate SECRET_KEY

Run this in your terminal:

```bash
openssl rand -hex 32
```

Copy the output and use it as `SECRET_KEY` in Railway.

---

## 📋 Supabase Setup Checklist

Before deploying, make sure Supabase is configured:

### 1. Create Storage Buckets

Go to Supabase Dashboard → Storage → Create these buckets:
- `uploads` (for CSV/Excel files)
- `models` (for trained ML models)
- `reports` (for generated PDF reports)

**Bucket Settings:**
- Public: No (keep private)
- File size limit: 50 MB (or higher)

### 2. Set Bucket Policies

For each bucket, add this policy (Storage → Policies):

**Policy Name:** "Allow authenticated users to upload and read"
**Target roles:** authenticated
**Operations:** SELECT, INSERT, UPDATE, DELETE

**SQL:**
```sql
-- For uploads bucket
create policy "Allow authenticated uploads"
on storage.objects for all
to authenticated
using (bucket_id = 'uploads')
with check (bucket_id = 'uploads');

-- Repeat for 'models' and 'reports' buckets
```

### 3. Database Tables (Optional - using Supabase DB)

If you want to use Supabase PostgreSQL instead of local storage:

Go to SQL Editor and run:
```sql
-- This is optional - the app works without it
-- Only needed if you want to persist data in Supabase DB
```

For now, **skip this** - the app uses Supabase Storage only.

---

## ✅ Verification Steps

After deployment, test these:

### 1. Backend Health Check

Visit: `https://your-railway-url.up.railway.app/api/health`

**Expected:**
```json
{
  "status": "healthy",
  "environment": "production"
}
```

### 2. API Documentation

Visit: `https://your-railway-url.up.railway.app/api/docs`

**Expected:** FastAPI Swagger UI should load

### 3. Frontend Connection

1. Open your Vercel app
2. Open browser console (F12)
3. Try registering a user
4. Should see successful API calls in Network tab

### 4. Check CORS

If you see CORS errors:
1. Go to Railway → Variables
2. Update `CORS_ORIGINS` to include your Vercel URL
3. Redeploy

---

## 🐛 Troubleshooting

### Issue: Render build fails

**Check:**
- `backend/requirements.txt` exists
- Render root directory is set to `backend`
- Build command is correct: `pip install -r requirements.txt`
- No syntax errors in Python files

**View logs:** Render Dashboard → Logs tab

### Issue: App crashes after deploy

**Check:**
- All environment variables are set in Render
- `SECRET_KEY` is generated (not empty)
- Supabase credentials are correct
- Start command is correct: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**View logs:** Render Dashboard → Logs tab

### Issue: Frontend still shows "your-backend-url.com"

**Fix:**
1. Clear browser cache
2. Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. Verify `VITE_API_URL` is set in Vercel
4. Verify you redeployed after changing env vars

### Issue: CORS errors

**Fix:**
1. Render Dashboard → Environment → Update `CORS_ORIGINS`
2. Must include full URL: `https://predictive-maintenance-ochre.vercel.app`
3. No trailing slash
4. Click "Manual Deploy" → "Deploy latest commit"

---

## 🎯 Alternative: Local Backend with Ngrok

If you want to test locally first:

```bash
# Terminal 1: Start backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2: Expose with ngrok
brew install ngrok  # if not installed
ngrok http 8000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and use it as `VITE_API_URL` in Vercel.

**Note:** Ngrok URLs change on restart - Render/Fly.io are better for persistent deployment.

---

## 📚 Detailed Guides

For more detailed instructions, check these guides:
- **`RENDER_DEPLOY_GUIDE.md`** - Complete Render deployment guide
- **`FLYIO_DEPLOY_GUIDE.md`** - Fly.io deployment (no cold starts!)
- **`VERCEL_DEPLOYMENT.md`** - Frontend deployment details

---

## 📞 Get Help

**Render Issues:**
- [Render Docs](https://render.com/docs)
- [Render Community](https://community.render.com)

**Fly.io Issues:**
- [Fly.io Docs](https://fly.io/docs)
- [Fly.io Discord](https://fly.io/discord)

**Vercel Issues:**
- [Vercel Docs](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)

**Supabase Issues:**
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)

---

## 🎉 You're Done!

After completing these steps:
- ✅ Backend running on Render (or Fly.io)
- ✅ Frontend connected to backend
- ✅ Registration/login working
- ✅ Full MVP functional

**Next Steps:**
- Upload a CSV file
- Run EDA analysis
- Train ML models
- Generate reports

---

## 🆚 Which Option to Choose?

### Choose **Render** if:
- ✅ You want dashboard-based deployment (easier)
- ✅ You're okay with cold starts (30-60s delay after inactivity)
- ✅ You want to get started quickly

### Choose **Fly.io** if:
- ✅ You want no cold starts (always on)
- ✅ You're comfortable with CLI
- ✅ You want better free tier (3 VMs vs 1 service)
- ✅ You want global deployment

### My Recommendation:
**Start with Render** (easier), then migrate to Fly.io if cold starts become annoying.

---

*Estimated time: 10-15 minutes (Render) or 15-20 minutes (Fly.io)*
*Cost: Free*

