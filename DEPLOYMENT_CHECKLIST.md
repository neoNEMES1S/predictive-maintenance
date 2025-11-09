# 🚀 Vercel Deployment Checklist

## Pre-Deployment Steps

### 1. Git Repository Setup
- [ ] Commit all changes: `git add .`
- [ ] Commit: `git commit -m "Prepare for Vercel deployment"`
- [ ] Push to GitHub: `git push origin main`

### 2. Environment Variables to Configure

You'll need these 3 environment variables in Vercel:

| Variable | Where to Find |
|----------|---------------|
| `VITE_API_URL` | Your backend API URL (Railway/Render/etc.) |
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → Project API keys → anon public |

### 3. Vercel Configuration

The project is already configured with:
- ✅ `vercel.json` - Build and routing configuration
- ✅ `.vercelignore` - Ignores backend files

## Deployment Steps

### Option A: Vercel Dashboard (Easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository
4. Configure settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add the 3 environment variables listed above
6. Click **"Deploy"**
7. Wait 2-3 minutes ☕
8. Your app is live! 🎉

### Option B: Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

When prompted, configure:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No (first time)
- **Project name?** → semiconductor-insights (or your choice)
- **In which directory?** → `frontend`
- **Override settings?** → No

## Post-Deployment Verification

After deployment, verify these:

### ✅ Homepage Check
- [ ] Visit your Vercel URL
- [ ] Login page loads correctly
- [ ] No console errors (press F12 to check)

### ✅ API Connection
- [ ] Try logging in or signing up
- [ ] Check if API calls are working
- [ ] If errors, verify `VITE_API_URL` environment variable

### ✅ Supabase Connection
- [ ] Authentication works
- [ ] User data is stored
- [ ] If errors, verify Supabase environment variables

## Common Issues & Quick Fixes

### Issue: "Failed to load resource" or API errors
**Fix:** Verify your backend API is deployed and `VITE_API_URL` is correct

### Issue: Environment variables not working
**Fix:** 
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify all 3 variables are set
3. **Important:** After adding/changing variables, redeploy the project

### Issue: 404 on page refresh
**Fix:** Already handled by `vercel.json` rewrites. If still happening, check that `vercel.json` exists in project root.

### Issue: CORS errors
**Fix:** Configure CORS on your backend API to allow your Vercel domain

## Continuous Deployment

After initial setup, Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches

## Next Steps

After successful deployment:

1. **Custom Domain** (Optional)
   - Vercel Dashboard → Your Project → Settings → Domains
   - Add your custom domain

2. **Analytics** (Free on Vercel)
   - Vercel Dashboard → Your Project → Analytics
   - Monitor page views and performance

3. **Monitoring**
   - Check deployment logs regularly
   - Set up error tracking (Sentry, LogRocket, etc.)

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Detailed Guide**: See `VERCEL_DEPLOYMENT.md`
- **Project README**: See `README.md`

---

**Good luck with your deployment! 🚀**

