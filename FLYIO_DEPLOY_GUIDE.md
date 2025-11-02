# ✈️ Fly.io Backend Deployment Guide

## 📋 Why Fly.io?

- ✅ **Free tier with 3 VMs** (generous!)
- ✅ **No cold starts** (always running)
- ✅ **Global deployment** (fast worldwide)
- ✅ **Docker-based** (flexible)
- ⚠️ CLI-based deployment (not just dashboard)

---

## 🚀 Deploy Backend to Fly.io (15 minutes)

### Step 1: Install Fly.io CLI

**macOS:**
```bash
brew install flyctl
```

**Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Windows:**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

### Step 2: Sign Up and Login

```bash
# Create account and login
flyctl auth signup

# Or if you already have an account
flyctl auth login
```

### Step 3: Launch Your App

Navigate to your project backend directory:

```bash
cd /Users/ankitjohri/Developer/PredictiveMaintenance/backend
```

Launch the app (Fly will auto-generate configuration):

```bash
flyctl launch
```

**Answer the prompts:**
```
App Name: semiconductor-insights-api (or choose your own)
Region: Choose closest to you (e.g., sjc for San Jose)
PostgreSQL: No (we're using Supabase)
Redis: No
Deploy now: No (we'll set env vars first)
```

This creates a `fly.toml` file.

### Step 4: Configure fly.toml

Fly.io created a `fly.toml` file. Let me update it:

```toml
app = "semiconductor-insights-api"
primary_region = "sjc"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8000"
  ENVIRONMENT = "production"
  DEBUG = "False"
  ALGORITHM = "HS256"
  ACCESS_TOKEN_EXPIRE_MINUTES = "30"
  MAX_UPLOAD_SIZE = "1073741824"
  ALLOWED_EXTENSIONS = "csv,xlsx,xls"
  MODEL_CACHE_DIR = "/app/models"
  TEST_SIZE = "0.2"
  RANDOM_STATE = "42"
  UPLOADS_BUCKET = "uploads"
  MODELS_BUCKET = "models"
  REPORTS_BUCKET = "reports"

[http_service]
  internal_port = 8000
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256

[checks]
  [checks.health]
    grace_period = "10s"
    interval = "30s"
    method = "GET"
    path = "/api/health"
    port = 8000
    timeout = "5s"
    type = "http"
```

### Step 5: Set Secret Environment Variables

Set sensitive variables as secrets (encrypted):

```bash
# Generate SECRET_KEY first
SECRET_KEY=$(openssl rand -hex 32)

# Set secrets
flyctl secrets set SECRET_KEY="$SECRET_KEY"
flyctl secrets set SUPABASE_URL="https://your-project.supabase.co"
flyctl secrets set SUPABASE_ANON_KEY="your-anon-key"
flyctl secrets set SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
flyctl secrets set CORS_ORIGINS="https://predictive-maintenance-ochre.vercel.app"
```

**Get Supabase values from:** Supabase Dashboard → Settings → API

### Step 6: Deploy

```bash
flyctl deploy
```

This will:
1. Build Docker image
2. Push to Fly.io registry
3. Deploy to your VM
4. Takes 2-3 minutes

### Step 7: Get Your URL

```bash
flyctl status
```

Your app URL will be: `https://semiconductor-insights-api.fly.dev`

---

## 🔗 Update Vercel with Backend URL

### Step 1: Copy Fly.io URL

Your URL: `https://semiconductor-insights-api.fly.dev`

### Step 2: Update Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Update `VITE_API_URL`:
   - Name: `VITE_API_URL`
   - Value: `https://semiconductor-insights-api.fly.dev`
   - Environment: Production, Preview, Development

4. **Save** and **Redeploy**

---

## ✅ Verify Deployment

### 1. Check Backend Health

```bash
curl https://semiconductor-insights-api.fly.dev/api/health
```

**Expected:**
```json
{
  "status": "healthy",
  "environment": "production"
}
```

### 2. Check API Docs

Visit: `https://semiconductor-insights-api.fly.dev/api/docs`

### 3. View Logs

```bash
flyctl logs
```

---

## 📊 Monitor Your Fly.io App

### View Status

```bash
flyctl status
```

Shows:
- VM status
- Regions
- Health checks
- IP addresses

### View Logs (Real-time)

```bash
flyctl logs -f
```

### View Metrics

```bash
flyctl metrics
```

Shows:
- CPU usage
- Memory usage
- Network I/O

### SSH into VM (for debugging)

```bash
flyctl ssh console
```

---

## 🔧 Useful Commands

### Redeploy

```bash
flyctl deploy
```

### Restart App

```bash
flyctl apps restart
```

### Scale Resources

```bash
# Increase memory
flyctl scale memory 512

# Add more VMs
flyctl scale count 2
```

### Update Secrets

```bash
flyctl secrets set KEY=VALUE
```

### View Secrets (names only)

```bash
flyctl secrets list
```

### Open App in Browser

```bash
flyctl open
```

### Open Dashboard

```bash
flyctl dashboard
```

---

## 🔧 Troubleshooting

### Issue 1: Build Fails

**Error:** Docker build fails

**Fix:**
1. Check `backend/Dockerfile` exists
2. View build logs: `flyctl logs`
3. Try local Docker build: `docker build -t test .`

### Issue 2: App Crashes After Deploy

**Fix:**
1. View logs: `flyctl logs`
2. Check secrets: `flyctl secrets list`
3. Verify all required secrets are set
4. Check Dockerfile CMD matches your app

### Issue 3: CORS Errors

**Fix:**
```bash
# Update CORS_ORIGINS secret
flyctl secrets set CORS_ORIGINS="https://predictive-maintenance-ochre.vercel.app"

# Restart
flyctl apps restart
```

### Issue 4: Health Check Fails

**Fix:**
1. Verify `/api/health` endpoint exists
2. Check port binding (should be 8000)
3. View logs for errors: `flyctl logs`

### Issue 5: Out of Memory

**Fix:**
```bash
# Increase to 512 MB (still free tier)
flyctl scale memory 512
```

---

## 💰 Fly.io Pricing

### Free Tier (Generous!)

**Includes:**
- 3 shared-cpu-1x VMs (256MB RAM each)
- 160GB outbound data transfer
- Up to 3GB persistent volume storage

**What this means:**
- Run 1 VM for your app (always on)
- 2 VMs left for other projects
- No cold starts!
- Perfect for production

### Paid Options

**Hobby Plan** (Pay-as-you-go):
- $0.0000007/sec per 256MB VM (~$1.82/month if always on)
- Still very cheap!

---

## 🔄 Continuous Deployment

### Manual Deploy

```bash
flyctl deploy
```

### Automatic Deploy with GitHub Actions

Create `.github/workflows/fly-deploy.yml`:

```yaml
name: Deploy to Fly.io
on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
        working-directory: backend
```

**Get FLY_API_TOKEN:**
```bash
flyctl auth token
```

Add to GitHub Secrets: Settings → Secrets → New repository secret

---

## 🔐 Security Best Practices

### 1. Use Secrets for Sensitive Data

Never put sensitive values in `fly.toml`:
```bash
flyctl secrets set KEY=VALUE  # ✅ Encrypted
```

### 2. Limit CORS

Only allow your production domain:
```bash
flyctl secrets set CORS_ORIGINS="https://your-vercel-app.vercel.app"
```

### 3. Enable Health Checks

Already configured in `fly.toml` - monitors your app health.

### 4. Review Access Tokens

```bash
flyctl auth tokens list
```

Revoke unused tokens.

---

## 📞 Need Help?

### Fly.io Support
- [Documentation](https://fly.io/docs)
- [Community Forum](https://community.fly.io)
- [Discord](https://fly.io/discord)

### Status
- [Status Page](https://status.flyio.net)

---

## 🎉 Success Checklist

- [ ] Fly.io CLI installed
- [ ] Account created and logged in
- [ ] App launched with `flyctl launch`
- [ ] fly.toml configured
- [ ] Secrets set
- [ ] App deployed
- [ ] Health check passing
- [ ] Vercel updated with Fly.io URL
- [ ] Frontend redeployed
- [ ] Registration/login works
- [ ] No CORS errors

---

## 💡 Pro Tips

### Faster Deploys

Deploy only when backend changes:
```bash
# Only deploy if backend changed
git diff --quiet backend/ || flyctl deploy
```

### Multiple Regions

Deploy globally for faster access:
```bash
flyctl regions add lhr  # London
flyctl regions add syd  # Sydney
flyctl scale count 3    # 1 VM per region
```

### Persistent Storage

If you need file storage:
```bash
flyctl volumes create data --size 1  # 1GB
```

Add to `fly.toml`:
```toml
[mounts]
  source = "data"
  destination = "/app/storage"
```

---

## 🆚 Fly.io vs Render

| Feature | Fly.io | Render |
|---------|--------|--------|
| Free Tier | 3 VMs | 1 Service |
| Cold Starts | ❌ None | ⚠️ Yes (15 min) |
| Always On | ✅ Yes | ❌ No (free tier) |
| Deploy Method | CLI | Dashboard/CLI |
| Learning Curve | Medium | Easy |
| Docker Required | ✅ Yes | ❌ No |
| Best For | Production | Quick prototypes |

**Recommendation:**
- **Use Render** if you want dashboard-based deployment
- **Use Fly.io** if you want always-on, no cold starts

---

*Last updated: November 2025*
*Estimated deployment time: 15 minutes*
*Cost: Free (3 VMs included)*

