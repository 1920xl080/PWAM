# Getting Started - Virtual Lab ITB

This guide will help you set up and run the Virtual Lab ITB project on your local machine in **15-20 minutes**.

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Database Configuration](#-database-configuration)
- [Authentication Setup](#-authentication-setup)
- [Running the Project](#-running-the-project)
- [Verify Installation](#-verify-installation)
- [Next Steps](#-next-steps)
- [Troubleshooting](#-troubleshooting)

---

## ✅ Prerequisites

### Required Software

| Software | Version | Check Command | Download |
|----------|---------|---------------|----------|
| **Node.js** | v18 or higher | `node --version` | [nodejs.org](https://nodejs.org) |
| **npm** | v9 or higher | `npm --version` | Comes with Node.js |
| **Git** | Any recent | `git --version` | [git-scm.com](https://git-scm.com) |

### Optional Tools

- **VS Code** - Recommended editor ([download](https://code.visualstudio.com))
- **GitHub Account** - For version control
- **Supabase Account** - For backend (free tier)
- **Google Cloud Account** - For OAuth (free)

### Knowledge Prerequisites

- Basic JavaScript/TypeScript
- React fundamentals
- Command line basics
- Git basics (clone, commit, push)

---

## 📥 Installation

### Step 1: Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/your-username/virtual-lab-itb.git

# OR clone via SSH (if configured)
git clone git@github.com:your-username/virtual-lab-itb.git

# Navigate to project directory
cd virtual-lab-itb
```

### Step 2: Install Dependencies

```bash
# Install all npm packages (takes 2-3 minutes)
npm install

# Verify installation
npm list --depth=0
```

**Expected output:**
```
virtual-lab-itb@0.0.0
├── @radix-ui/react-*
├── react@18.3.1
├── react-dom@18.3.1
├── typescript@5.6.2
├── vite@6.0.1
└── ... (17 packages total)
```

### Step 3: Verify Project Structure

```bash
# List main directories
ls -la

# You should see:
# - components/    (UI components)
# - data/          (mockData.ts)
# - lib/           (supabase.ts)
# - styles/        (globals.css)
# - guidelines/    (setup guides)
# - docs/          (documentation)
```

---

## 🔧 Environment Setup

### Step 1: Create Environment File

```bash
# Create .env file from example
cp .env.example .env

# OR create manually
touch .env
```

### Step 2: Add Environment Variables

Open `.env` and add:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Email Restriction (ITB only)
VITE_ALLOWED_EMAIL_DOMAIN=std.stei.itb.ac.id
```

**⚠️ Important:**
- Don't commit `.env` to Git (already in `.gitignore`)
- All variables must start with `VITE_` for Vite to expose them
- See [Environment Variables](./ENVIRONMENT.md) for details

### Step 3: Get Supabase Credentials

**Option A: Create New Project (10 minutes)**

1. Go to [supabase.com](https://supabase.com)
2. Sign in with GitHub
3. Click **"New Project"**
4. Fill in:
   - **Name:** `virtual-lab-itb`
   - **Database Password:** (save this securely!)
   - **Region:** Choose closest to Indonesia
5. Wait for project creation (2-3 minutes)
6. Go to **Settings** → **API**
7. Copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`

**Option B: Use Existing Project**

1. Open your Supabase project
2. Settings → API → Copy credentials

📖 **Detailed guide:** [03-SupabaseSetup.md](../guidelines/03-SupabaseSetup.md)

---

## 🗄️ Database Configuration

### Step 1: Open SQL Editor

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"New query"**

### Step 2: Run Database Schema

Copy the entire SQL script from [03-SupabaseSetup.md Step 7](../guidelines/03-SupabaseSetup.md#step-7-set-up-database-schema) and paste into the SQL editor.

**Or use this quick version:**

```sql
-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create challenges table
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  total_points INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_challenge_submissions table
CREATE TABLE public.user_challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- Create enrolled_classes table
CREATE TABLE public.enrolled_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL,
  faculty TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrolled_classes ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only see their own data)
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Authenticated users can view challenges"
  ON public.challenges FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Users can view their own submissions"
  ON public.user_challenge_submissions FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own submissions"
  ON public.user_challenge_submissions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);
```

Click **RUN** to execute.

✅ **Success:** You should see "Success. No rows returned"

### Step 3: Add Sample Data (Optional)

```sql
-- Insert sample challenges
INSERT INTO public.challenges (title, category, difficulty, total_points)
VALUES
  ('Algorithmic Thinking Basics', 'Algorithmic Thinking', 'Easy', 100),
  ('Sorting and Searching', 'Algorithms', 'Easy', 100),
  ('Data Structures Fundamentals', 'Data Structures', 'Medium', 100),
  ('Problem Decomposition', 'Problem Solving', 'Easy', 100),
  ('Pattern Recognition', 'Pattern Recognition', 'Medium', 100);
```

---

## 🔐 Authentication Setup

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: **"Virtual Lab ITB"**
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth Client ID**
5. Configure:
   - **Application type:** Web application
   - **Name:** Virtual Lab ITB
   - **Authorized JavaScript origins:**
     - `http://localhost:5173`
     - `https://your-project.supabase.co`
   - **Authorized redirect URIs:**
     - `http://localhost:5173`
     - `https://your-project.supabase.co/auth/v1/callback`
6. Copy **Client ID** → Add to `.env` as `VITE_GOOGLE_CLIENT_ID`

### Step 2: Configure Supabase Auth

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click **Edit**
3. Toggle **Enable Google provider**
4. Paste:
   - **Client ID** (from Google Cloud)
   - **Client Secret** (from Google Cloud)
5. Click **Save**

### Step 3: Test Authentication (Optional)

You can test auth after starting the dev server (next section).

📖 **Detailed guide:** [04-GoogleOAuthSetup.md](../guidelines/04-GoogleOAuthSetup.md)

---

## 🚀 Running the Project

### Start Development Server

```bash
# Start Vite dev server
npm run dev

# Server will start at:
# ➜  Local:   http://localhost:5173/
# ➜  Network: http://192.168.x.x:5173/
```

### Open in Browser

```bash
# Open automatically (macOS/Linux)
open http://localhost:5173

# Or manually:
# - Navigate to http://localhost:5173
# - Press Ctrl+Click on the terminal link
```

### Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint (if configured)
npm run lint
```

---

## ✅ Verify Installation

### Checklist

Run through this checklist to ensure everything works:

- [ ] **Development server starts** without errors
- [ ] **Homepage loads** at `http://localhost:5173`
- [ ] **No console errors** in browser DevTools (F12)
- [ ] **Navigation works** (Home, Challenges, Dashboard)
- [ ] **Challenges page** shows 10 challenges from mockData
- [ ] **Challenge detail** shows quiz questions
- [ ] **Google login button** appears on Auth page
- [ ] **TypeScript** compiles without errors
- [ ] **Hot reload works** (edit `App.tsx` and see changes)

### Test Scenarios

#### Test 1: Homepage

```
✅ Hero section displays
✅ Feature cards visible
✅ Navigation bar present
✅ Smooth scroll works
```

#### Test 2: Challenges

```
✅ 10 challenges load from mockData
✅ Filters work (category, difficulty)
✅ Challenge cards show correct info
✅ Click opens ExerciseDetailPage
```

#### Test 3: Quiz

```
✅ Questions display (4 per challenge)
✅ Options are selectable
✅ Submit button works
✅ Score calculation correct
✅ Explanation shows after submission
```

#### Test 4: Authentication

```
✅ Auth page loads
✅ Google button present
✅ Click redirects to Google
⚠️ Login requires Supabase + OAuth setup
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Port 5173 in use | Kill process: `kill -9 $(lsof -ti:5173)` |
| Module not found | Run `npm install` |
| TypeScript errors | Check `vite-env.d.ts` exists |
| Supabase errors | Verify `.env` credentials |
| OAuth not working | Check redirect URIs match |

📖 **Full troubleshooting:** [06-Troubleshooting.md](../guidelines/06-Troubleshooting.md)

---

## 🎯 Next Steps

### Recommended Order

1. ✅ **Complete Authentication**
   - Finish Google OAuth setup
   - Test login with ITB email
   - Verify user appears in database

2. ✅ **Test Full Flow**
   - Login → Browse challenges → Take quiz → Check dashboard
   - Submit scores and verify in Supabase

3. ✅ **Customize Content**
   - Edit `data/mockData.ts` to add challenges
   - Update faculty information
   - Modify instructor list

4. ✅ **Style Adjustments**
   - Customize colors in `styles/globals.css`
   - Adjust layouts in components
   - Add ITB branding (logos, colors)

5. ✅ **Deployment**
   - Deploy to Vercel/Netlify
   - Configure production environment
   - Test with real users

### Learning Resources

**Understand the Project:**
- [Architecture Overview](./ARCHITECTURE.md)
- [Database Schema](./database/)
- [Component Guide](./COMPONENT-GUIDE.md)

**Development:**
- [Development Workflow](./DEVELOPMENT.md)
- [Styling Guide](./STYLING.md)
- [Code Examples](./EXAMPLES.md)

**Deployment:**
- [Deployment Guide](./DEPLOYMENT.md)
- [Environment Setup](./ENVIRONMENT.md)

---

## 🐛 Troubleshooting

### Installation Issues

**Problem: npm install fails**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem: Port 5173 already in use**
```bash
# Find and kill process
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Environment Issues

**Problem: import.meta.env is undefined**
```typescript
// Check vite-env.d.ts exists with:
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // ...
}
```

**Problem: Supabase connection fails**
```bash
# Verify credentials
echo $VITE_SUPABASE_URL
# Should output your Supabase URL

# Check .env file
cat .env
# Ensure no quotes around values
```

### TypeScript Issues

**Problem: TypeScript errors everywhere**
```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Or reload window
# Cmd/Ctrl + Shift + P → "Developer: Reload Window"
```

### Authentication Issues

**Problem: Google login doesn't work**

1. Check redirect URIs in Google Cloud Console
2. Verify Google provider enabled in Supabase
3. Check `VITE_GOOGLE_CLIENT_ID` in `.env`
4. Clear browser cache/cookies
5. Try incognito mode

**Problem: Email restriction not working**

```typescript
// Check in lib/supabase.ts or auth component
// Should have email domain check:
if (!email.endsWith('@std.stei.itb.ac.id')) {
  // Show error
}
```

### Still Stuck?

1. **Check Documentation:**
   - [FAQ](./FAQ.md)
   - [Troubleshooting Guide](../guidelines/06-Troubleshooting.md)
   - [GitHub Issues](https://github.com/your-username/virtual-lab-itb/issues)

2. **Ask for Help:**
   - [Open an issue](https://github.com/your-username/virtual-lab-itb/issues/new)
   - [Join discussions](https://github.com/your-username/virtual-lab-itb/discussions)

3. **Review Setup Guides:**
   - [Supabase Setup](../guidelines/03-SupabaseSetup.md)
   - [OAuth Setup](../guidelines/04-GoogleOAuthSetup.md)

---

## 📚 Additional Resources

### Official Documentation
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Video Tutorials (Recommended)
- [React 18 Tutorial](https://www.youtube.com/watch?v=...)
- [Supabase Crash Course](https://www.youtube.com/watch?v=...)
- [TypeScript for Beginners](https://www.youtube.com/watch?v=...)

### Community
- [React Discord](https://discord.gg/react)
- [Supabase Discord](https://discord.supabase.com)
- [ITB Student Forums](https://forum.itb.ac.id)

---

## 🎉 Success!

If you've completed all steps, you should now have:

✅ Virtual Lab ITB running locally  
✅ Database configured with schema  
✅ Authentication working with Google OAuth  
✅ Understanding of project structure  
✅ Ready to develop and customize  

**Next:** [Learn the Architecture](./ARCHITECTURE.md) or [Start Developing](./DEVELOPMENT.md)

---

<div align="center">

**Need help?** [Open an issue](https://github.com/your-username/virtual-lab-itb/issues) or check the [FAQ](./FAQ.md)

[⬆ Back to Top](#getting-started---virtual-lab-itb) • [📖 Documentation Home](./README.md)

</div>
