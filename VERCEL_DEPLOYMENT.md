# 🚀 Vercel Deployment Guide

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Supabase Project**: Have your Supabase project ready
4. **Backend Deployed**: Your FastAPI backend should be deployed (Railway/Render/VPS)

---

## 🎯 Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your **GitHub repository**
4. Click **"Import"**

### Step 2: Configure Project Settings

**IMPORTANT:** Configure these settings before deployment:

```
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x
```

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value | Example |
|------|-------|---------|
| `VITE_API_URL` | Your backend URL | `https://api.yourproject.com` |
| `VITE_SUPABASE_URL` | Your Supabase URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJhbGc...` |

**Where to find these:**
- Backend URL: From Railway/Render/your VPS
- Supabase URL & Key: Supabase Dashboard → Settings → API

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your app will be live at `https://your-project.vercel.app`

---

## 🎯 Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Configure Project

Run from project root:

```bash
vercel
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No (first time) / Yes (subsequent)
- **Project name?** → semiconductor-insights
- **Directory?** → `frontend`
- **Override settings?** → No

### Step 4: Add Environment Variables

```bash
vercel env add VITE_API_URL production
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

Enter values when prompted.

### Step 5: Deploy

```bash
vercel --prod
```

---

## 🔧 Common Issues & Fixes

### Issue 1: Build Command Fails

**Error:** `Command "cd frontend && npm install && npm run build" exited with 1`

**Fix:** In Vercel Dashboard:
1. Go to **Settings** → **General**
2. Set **Root Directory** to `frontend`
3. Set **Build Command** to `npm run build`
4. Set **Output Directory** to `dist`
5. Redeploy

### Issue 2: Environment Variables Not Working

**Symptoms:** API calls fail, blank page, console errors

**Fix:**
1. Verify all environment variables are set in **Settings** → **Environment Variables**
2. Make sure variable names start with `VITE_`
3. After adding/changing variables, **redeploy** the project

### Issue 3: 404 on Page Refresh

**Error:** Refreshing any page except home shows 404

**Fix:** Already handled by `vercel.json` rewrites. If still an issue:

1. Check `vercel.json` exists in project root
2. Verify it contains:
```json
{
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ]
}
```

### Issue 4: API Calls Fail (CORS)

**Symptoms:** Network errors, CORS policy blocks

**Fix:**
1. Update `vercel.json` rewrites:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR_BACKEND_URL/api/:path*"
    }
  ]
}
```

2. **OR** configure CORS in your backend (`backend/app/main.py`):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-project.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## ✅ Verify Deployment

After deployment, test these:

### 1. Check Homepage
Visit `https://your-project.vercel.app`
- Should see login/landing page
- No console errors

### 2. Test API Connection
Open browser console:
```javascript
fetch('https://your-project.vercel.app/api/health')
  .then(r => r.json())
  .then(console.log)
```
- Should return: `{"status": "healthy"}`

### 3. Test Authentication
- Try logging in
- Check if tokens are stored
- Verify API calls include auth headers

### 4. Test File Upload
- Upload a small CSV
- Check if it appears in dashboard
- Verify Supabase storage shows the file

---

## 🔄 Continuous Deployment

After initial setup, Vercel automatically deploys:

- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches or PRs

**To manually redeploy:**
1. Vercel Dashboard → Select Project
2. Click **"Deployments"**
3. Find latest deployment → Click **"⋯"** → **"Redeploy"**

---

## 📊 Monitoring

### View Logs
1. Vercel Dashboard → Your Project
2. Click **"Deployments"**
3. Select a deployment
4. Click **"View Function Logs"** (if using serverless functions)

### Analytics
1. Vercel Dashboard → Your Project
2. Click **"Analytics"**
3. View page views, load times, etc.

---

## 🎨 Custom Domain (Optional)

### Add Domain
1. Vercel Dashboard → Your Project
2. Click **"Settings"** → **"Domains"**
3. Enter your domain: `app.yourdomain.com`
4. Follow DNS configuration instructions

### DNS Records (Example)
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

Wait 5-10 minutes for DNS propagation.

---

## 🔐 Security Best Practices

### 1. Secure Environment Variables
- Never commit `.env` files
- Use Vercel's encrypted environment variables
- Rotate keys regularly

### 2. Enable HTTPS Only
Already enabled by default on Vercel.

### 3. Configure CSP Headers
Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 📞 Need Help?

### Vercel Support
- [Documentation](https://vercel.com/docs)
- [Community Discord](https://vercel.com/discord)
- [Support](https://vercel.com/support)

### Project Issues
- Check `BUILD_INSTRUCTIONS.md` for setup
- Check backend logs for API errors
- Check Supabase dashboard for database/storage issues

---

## 🎉 Success Checklist

- [ ] Project deployed to Vercel
- [ ] Environment variables configured
- [ ] Homepage loads correctly
- [ ] Login/registration works
- [ ] API calls successful
- [ ] File upload functional
- [ ] All pages accessible
- [ ] Mobile responsive
- [ ] No console errors

**Deployment URL:** `https://your-project.vercel.app`

---

*Last updated: November 2025*

