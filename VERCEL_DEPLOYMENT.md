# Deploying PWAM to Vercel

This guide will walk you through deploying your PWAM (Progressive Web App) to Vercel.

## Prerequisites

- A Vercel account ([sign up here](https://vercel.com/signup))
- Your PWAM project ready to deploy
- Supabase credentials (if using Supabase)

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to the PWAM directory**:
   ```bash
   cd PWAM
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

   Or deploy to preview first:
   ```bash
   vercel
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub/GitLab/Bitbucket**:
   - Make sure your PWAM folder is in a git repository
   - Push to your remote repository

2. **Import project in Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your repository
   - **Important**: Set the root directory to `PWAM` (not the repo root)
   - Configure the project:
     - **Framework Preset**: Vite
     - **Root Directory**: `PWAM`
     - **Build Command**: `npm run build` (should auto-detect)
     - **Output Directory**: `dist` (should auto-detect)
     - **Install Command**: `npm install`

3. **Configure Environment Variables**:
   - In the project settings, go to "Environment Variables"
   - Add the following variables:
     - `VITE_SUPABASE_URL` - Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - Make sure to add them for **Production**, **Preview**, and **Development** environments

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your app automatically

## Configuration

The `vercel.json` file has been configured with:
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Client-side routing support (React Router)
- ✅ Asset caching headers

## Environment Variables

Your app requires these environment variables in Vercel:

1. **VITE_SUPABASE_URL**: Your Supabase project URL
   - Example: `https://your-project.supabase.co`

2. **VITE_SUPABASE_ANON_KEY**: Your Supabase anonymous/public key
   - Found in your Supabase project settings → API

### Setting Environment Variables in Vercel:

1. Go to your project in Vercel Dashboard
2. Click on "Settings"
3. Go to "Environment Variables"
4. Add each variable:
   - Name: `VITE_SUPABASE_URL`
   - Value: `your-supabase-url`
   - Environments: Select Production, Preview, and Development
5. Repeat for `VITE_SUPABASE_ANON_KEY`
6. After adding, redeploy your project for changes to take effect

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

## Quick Deploy Command

For quick deployments after initial setup:
```bash
cd PWAM && vercel --prod
```

