# Deploying PWAM to Vercel

This guide will walk you through deploying your PWAM (Progressive Web App) to Vercel.

## Prerequisites

- A Vercel account ([sign up here](https://vercel.com/signup))
- Your PWAM project ready to deploy
- Supabase credentials (if using Supabase)

## Deployment Steps

### 🚀 Deploy via Vercel Dashboard (Website Only)

Follow these step-by-step instructions to deploy your PWAM app using the Vercel website:

#### Step 1: Prepare Your Code

1. **Create Local .env File** (for local development):
   - Create a `.env` file in the `PWAM` folder (see Environment Variables section below for content)
   - This file is for local development only and won't be uploaded to Vercel

2. **Push your code to GitHub/GitLab/Bitbucket**:
   - Make sure your PWAM folder is in a git repository
   - Commit and push your changes (including `vercel.json`)
   - **Important**: Your `.env` file should NOT be committed (it's already in `.gitignore`)

#### Step 2: Import Project in Vercel

1. **Go to Vercel Dashboard**:
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign up or log in to your account

2. **Import Your Repository**:
   - Click **"Add New Project"** or **"Import Project"** button
   - If this is your first time, you may need to connect your GitHub/GitLab/Bitbucket account
   - Select your repository that contains the PWAM folder

3. **Configure Project Settings**:
   - In the "Configure Project" screen, you'll see several settings
   - **⚠️ CRITICAL**: Click on **"Root Directory"** and set it to `PWAM`
     - This tells Vercel where your app is located in the repository
   - **Framework Preset**: Should auto-detect as "Vite" (if not, select "Vite" from the dropdown)
   - **Build Command**: Should auto-detect as `npm run build` (verify it's correct)
   - **Output Directory**: Should auto-detect as `dist` (verify it's correct)
   - **Install Command**: Should auto-detect as `npm install` (verify it's correct)

#### Step 3: Add Environment Variables (IMPORTANT!)

**⚠️ Do this BEFORE clicking Deploy!**

1. **Find Environment Variables Section**:
   - In the "Configure Project" screen, scroll down to find **"Environment Variables"** section
   - You can also add them later in Project Settings, but it's easier to add them now

2. **Add Each Variable**:
   Click **"Add"** or **"Add New"** for each of the 4 variables below:

   **Variable 1:**
   - Click **"Add New"** or the **"+"** button
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `https://sfyimxwzndyyvoracjzj.supabase.co`
   - **Environments**: Check all three boxes ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

   **Variable 2:**
   - Click **"Add New"** again
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmeWlteHd6bmR5eXZvcmFjanpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MDIyNzQsImV4cCI6MjA3Nzk3ODI3NH0.u6Eo4o6KIoy50nnGRr1pDXFiSbQ1zxoXcmawbbRlFLs`
   - **Environments**: Check all three boxes ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

   **Variable 3:**
   - Click **"Add New"** again
   - **Key**: `VITE_GOOGLE_CLIENT_ID`
   - **Value**: `550719306467-oo5ngn0o5udo3p0v6mo4obdnpq19djol.apps.googleusercontent.com`
   - **Environments**: Check all three boxes ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

   **Variable 4:**
   - Click **"Add New"** again
   - **Key**: `VITE_ALLOWED_EMAIL_DOMAIN`
   - **Value**: `std.stei.itb.ac.id`
   - **Environments**: Check all three boxes ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

3. **Verify All Variables Added**:
   - You should see all 4 variables listed in the Environment Variables section
   - Each should have Production, Preview, and Development checked

#### Step 4: Deploy Your App

1. **Click Deploy Button**:
   - Scroll to the bottom of the "Configure Project" screen
   - Click the **"Deploy"** button
   - Vercel will now build and deploy your app

2. **Wait for Build to Complete**:
   - You'll see a build log showing the deployment progress
   - This typically takes 1-3 minutes
   - The build will show:
     - Installing dependencies
     - Running build command
     - Deploying to Vercel's CDN

3. **Deployment Complete!**:
   - Once complete, you'll see a success message
   - Your app will be live at `https://your-project-name.vercel.app`
   - Click the link to visit your deployed app

#### Step 5: Adding Environment Variables After Deployment

If you forgot to add environment variables before deploying, or need to add new ones:

1. **Go to Project Settings**:
   - In your Vercel Dashboard, click on your project
   - Go to **"Settings"** tab (top navigation)
   - Click **"Environment Variables"** in the left sidebar

2. **Add Variables**:
   - Follow the same process as Step 3 above
   - Add all required variables

3. **Redeploy**:
   - Go to the **"Deployments"** tab
   - Find your latest deployment
   - Click the three dots (⋯) menu next to the deployment
   - Click **"Redeploy"**
   - This will rebuild your app with the new environment variables

## Configuration

The `vercel.json` file has been configured with:
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Client-side routing support (React Router)
- ✅ Asset caching headers

## Environment Variables

### Step 1: Create Local .env File

**⚠️ IMPORTANT**: Create a `.env` file in the `PWAM` folder with your environment variables.

1. Navigate to the `PWAM` directory
2. Create a new file named `.env` (make sure it starts with a dot)
3. Add the following content:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://sfyimxwzndyyvoracjzj.supabase.co

VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmeWlteHd6bmR5eXZvcmFjanpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MDIyNzQsImV4cCI6MjA3Nzk3ODI3NH0.u6Eo4o6KIoy50nnGRr1pDXFiSbQ1zxoXcmawbbRlFLs

# Google OAuth credentials
VITE_GOOGLE_CLIENT_ID=550719306467-oo5ngn0o5udo3p0v6mo4obdnpq19djol.apps.googleusercontent.com

VITE_ALLOWED_EMAIL_DOMAIN=std.stei.itb.ac.id

# Optional: Add production URL when deploying
# VITE_PRODUCTION_URL=https://virtuallab-itb.vercel.app
```

**Note**: The `.env` file is already in `.gitignore`, so it won't be committed to git (this is correct for security).

### Step 2: Set Environment Variables in Vercel

Your app requires these environment variables in Vercel. **You MUST add these in Vercel** for your deployment to work:

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **Settings** → **Environment Variables**
3. Add the following variables one by one:

   **Variable 1:**
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://sfyimxwzndyyvoracjzj.supabase.co`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

   **Variable 2:**
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmeWlteHd6bmR5eXZvcmFjanpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MDIyNzQsImV4cCI6MjA3Nzk3ODI3NH0.u6Eo4o6KIoy50nnGRr1pDXFiSbQ1zxoXcmawbbRlFLs`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

   **Variable 3:**
   - **Name**: `VITE_GOOGLE_CLIENT_ID`
   - **Value**: `550719306467-oo5ngn0o5udo3p0v6mo4obdnpq19djol.apps.googleusercontent.com`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

   **Variable 4:**
   - **Name**: `VITE_ALLOWED_EMAIL_DOMAIN`
   - **Value**: `std.stei.itb.ac.id`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

   **Variable 5:**
   - **Name**: `VITE_PRODUCTION_URL`
   - **Value**: `https://logiclabberkom.vercel.app`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

4. **After adding all variables**, you need to **redeploy** your project for the changes to take effect

## Post-Deployment

After deployment:

1. **Verify the deployment**:
   - Visit the provided Vercel URL
   - Test all routes and functionality

2. **Custom Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

3. **Monitor deployments**:
   - Check the Vercel dashboard for deployment status
   - View logs if there are any issues

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version (Vercel auto-detects, but you can specify in `package.json`)

### Environment Variables Not Working
- Make sure variable names start with `VITE_` for Vite apps
- Redeploy after adding environment variables
- Check that variables are set for the correct environment (Production/Preview)

### Routing Issues
- The `vercel.json` includes rewrites for client-side routing
- All routes should serve `index.html` for React Router to work

### Supabase Connection Issues
- Verify environment variables are set correctly
- Check Supabase project settings and API keys
- Ensure your Supabase project allows connections from your Vercel domain

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [React Router Deployment](https://reactrouter.com/en/main/start/overview#deployment)

## Updating Your Deployment

After your initial deployment, any time you push changes to your repository:

1. Vercel will automatically detect the changes
2. A new deployment will be created automatically
3. You can view deployments in the **"Deployments"** tab
4. Each deployment gets a unique URL for preview
5. Production deployments update your main domain automatically

**Note**: If you change environment variables, remember to redeploy (see Step 5 above).

