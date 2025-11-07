# 🚀 Quick Deploy Guide - Follow These Steps

## Step 1: Create .env File (Local Development)

1. Create a file named `.env` in the `PWAM` folder
2. Copy and paste this content:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://sfyimxwzndyyvoracjzj.supabase.co

VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmeWlteHd6bmR5eXZvcmFjanpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MDIyNzQsImV4cCI6MjA3Nzk3ODI3NH0.u6Eo4o6KIoy50nnGRr1pDXFiSbQ1zxoXcmawbbRlFLs

# Google OAuth credentials
VITE_GOOGLE_CLIENT_ID=550719306467-oo5ngn0o5udo3p0v6mo4obdnpq19djol.apps.googleusercontent.com

VITE_ALLOWED_EMAIL_DOMAIN=std.stei.itb.ac.id

# Production URL for OAuth redirects
VITE_PRODUCTION_URL=https://logiclabberkom.vercel.app
```

✅ This file is for local development only (won't be committed to git)

---

## Step 2: Deploy to Vercel (Using Website Only)

### 📋 Step-by-Step Instructions

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Add Vercel configuration"
   git push
   ```

2. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign up or log in
   - Click **"Add New Project"**

3. **Import your repository**
   - Connect your GitHub/GitLab/Bitbucket account (if first time)
   - Select your repository that contains the PWAM folder
   - Click **"Import"**

4. **Configure Project Settings**
   - **⚠️ CRITICAL**: Click on **"Root Directory"** and change it to `PWAM`
   - Verify these settings are correct:
     - Framework: **Vite** (should auto-detect)
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

5. **Add Environment Variables** (BEFORE clicking Deploy!)
   - Scroll down to **"Environment Variables"** section
   - Click **"Add New"** for each variable:
   
     | Key | Value | Environments |
     |-----|-------|--------------|
     | `VITE_SUPABASE_URL` | `https://sfyimxwzndyyvoracjzj.supabase.co` | ✅ Prod, ✅ Preview, ✅ Dev |
     | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmeWlteHd6bmR5eXZvcmFjanpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MDIyNzQsImV4cCI6MjA3Nzk3ODI3NH0.u6Eo4o6KIoy50nnGRr1pDXFiSbQ1zxoXcmawbbRlFLs` | ✅ Prod, ✅ Preview, ✅ Dev |
     | `VITE_GOOGLE_CLIENT_ID` | `550719306467-oo5ngn0o5udo3p0v6mo4obdnpq19djol.apps.googleusercontent.com` | ✅ Prod, ✅ Preview, ✅ Dev |
     | `VITE_ALLOWED_EMAIL_DOMAIN` | `std.stei.itb.ac.id` | ✅ Prod, ✅ Preview, ✅ Dev |
     | `VITE_PRODUCTION_URL` | `https://logiclabberkom.vercel.app` | ✅ Prod, ✅ Preview, ✅ Dev |
   
   - For each variable:
     1. Enter the **Key** (name)
     2. Enter the **Value**
     3. Check all three environment boxes (Production, Preview, Development)
     4. Click **"Save"**

6. **Deploy!** 🚀
   - Scroll to bottom and click **"Deploy"** button
   - Wait 1-3 minutes for build to complete
   - Watch the build logs for progress
   - Once complete, click the link to visit your live app! 🎉

### 📝 Adding Environment Variables After Deployment

If you forgot to add them before deploying:

1. Go to your project → **Settings** → **Environment Variables**
2. Add all 4 variables (same as Step 5 above)
3. Go to **Deployments** tab
4. Click **⋯** (three dots) on latest deployment → **"Redeploy"**

---

## Step 3: Verify Deployment

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Test your app functionality
3. Check browser console for any errors

---

## ⚠️ Important Notes

- ✅ `.env` file is for local development only (already in `.gitignore`)
- ✅ Environment variables MUST be added in Vercel Dashboard for deployment
- ✅ Set Root Directory to `PWAM` when importing project (this is critical!)
- ✅ If you add environment variables AFTER deploying, you need to redeploy
- ✅ All future code pushes will automatically trigger new deployments

## 🎯 What Happens Next?

After deployment:
- Your app is live at `https://your-project-name.vercel.app`
- Any code you push to your repository will auto-deploy
- You can view all deployments in the "Deployments" tab
- Each deployment gets a preview URL for testing

---

## Need More Details?

See the full comprehensive guide: `VERCEL_DEPLOYMENT.md`

