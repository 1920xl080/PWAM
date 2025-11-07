# Frequently Asked Questions (FAQ)

Quick answers to common questions about Virtual Lab ITB.

---

## 📋 Table of Contents

- [General Questions](#-general-questions)
- [Setup & Installation](#-setup--installation)
- [Development](#-development)
- [Database & Backend](#-database--backend)
- [Authentication](#-authentication)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 General Questions

### What is Virtual Lab ITB?

Virtual Lab ITB is an interactive web-based learning platform designed for Institut Teknologi Bandung (ITB) students to practice computational thinking through hands-on challenges and quizzes.

### Who can use this platform?

Currently, only students with **@std.stei.itb.ac.id** email addresses can authenticate and use the platform. This restriction is enforced through Google OAuth.

### Is this project open source?

Yes! The project is licensed under MIT License. You can fork, modify, and use it for educational purposes.

### Can I use this for other universities?

Absolutely! Just modify:
1. Email domain restriction in `.env`: `VITE_ALLOWED_EMAIL_DOMAIN`
2. Branding (logos, colors, university name)
3. Faculty and course data in `data/mockData.ts`

### What technologies does it use?

- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **Backend:** Supabase (PostgreSQL, Auth)
- **UI Components:** shadcn/ui
- **Animations:** Motion (Framer Motion)
- **Charts:** Recharts

---

## 🔧 Setup & Installation

### How long does setup take?

- **Basic setup:** 10 minutes (clone + install + run)
- **With Supabase:** +10 minutes (create project + schema)
- **With Google OAuth:** +10 minutes (Google Cloud Console)
- **Total:** ~30 minutes for complete setup

### Do I need a Supabase account?

Yes, for:
- User authentication
- Progress tracking
- Database storage

The free tier is sufficient for development and small-scale deployment.

### Do I need Google Cloud Console access?

Yes, to create OAuth credentials for Google login. It's free and takes ~10 minutes.

### Can I run this without Supabase?

Yes, but with limitations:
- ✅ Quiz system works (uses mockData)
- ❌ No user authentication
- ❌ No progress tracking
- ❌ No dashboard data

For full functionality, Supabase is required.

### What are the environment variables needed?

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_ALLOWED_EMAIL_DOMAIN=std.stei.itb.ac.id
```

See [Environment Variables](./ENVIRONMENT.md) for details.

### Where do I find my Supabase credentials?

1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to **Settings** → **API**
4. Copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`

---

## 💻 Development

### How do I start the development server?

```bash
npm run dev
```

Opens at `http://localhost:5173`

### How do I add new challenges?

Edit `data/mockData.ts`:

```typescript
export const challenges: Challenge[] = [
  {
    id: '11',  // Unique ID
    title: 'Your Challenge Title',
    description: 'Challenge description',
    difficulty: 'Medium',
    category: 'Your Category',
    questions: [
      {
        id: 'q1',
        question: 'Your question?',
        options: [
          { id: 'a', text: 'Option A', isCorrect: false },
          { id: 'b', text: 'Option B', isCorrect: true },
          { id: 'c', text: 'Option C', isCorrect: false },
          { id: 'd', text: 'Option D', isCorrect: false }
        ],
        points: 25,
        explanation: 'Why B is correct'
      }
      // Add 3 more questions...
    ],
    totalPoints: 100
  }
];
```

### How do I customize the styling?

**Option 1: Tailwind Classes**
```typescript
<div className="bg-blue-500 text-white p-4">
```

**Option 2: CSS Variables** (in `styles/globals.css`)
```css
:root {
  --primary: 220 90% 56%;
  --secondary: 160 60% 45%;
}
```

**Option 3: Component-level** (not recommended)
```typescript
<div style={{ backgroundColor: '#3b82f6' }}>
```

See [Styling Guide](./STYLING.md) for best practices.

### How do I add a new page?

1. Create component: `components/NewPage.tsx`
2. Add route in `App.tsx`:
   ```typescript
   <Route path="/new-page" element={<NewPage />} />
   ```
3. Add navigation link in `Navigation.tsx`

### Can I use other UI libraries?

Yes, but be careful:
- ✅ Install: `npm install library-name`
- ✅ Import: `import { Component } from 'library'`
- ⚠️ Check compatibility with React 18
- ⚠️ Ensure TypeScript types available

Already installed:
- shadcn/ui (recommended)
- Lucide icons
- Recharts
- React Slick

### How do I run tests?

Tests are not set up yet. To add:

```bash
npm install --save-dev vitest @testing-library/react
```

Then create `*.test.tsx` files.

---

## 🗄️ Database & Backend

### Why aren't quiz questions stored in the database?

**Design decision for MVP:**

- ✅ **Faster:** No API calls to load questions
- ✅ **Simpler:** Easier to manage and edit
- ✅ **Good enough:** For learning platform with static content

**Database stores:**
- User profiles
- Progress/scores
- Class enrollment

**Frontend (`mockData.ts`) stores:**
- Quiz questions
- Options
- Correct answers
- Explanations

See [Architecture](./ARCHITECTURE.md) for details.

### Can I migrate questions to the database later?

Yes! See [DATABASE-SCHEMA-EXPLANATION.md](../DATABASE-SCHEMA-EXPLANATION.md) for the full schema with questions tables.

**When to migrate:**
- Need dynamic content updates
- Want detailed analytics per question
- Need randomized questions
- Want adaptive difficulty

### How do I view database tables?

**Option 1: Supabase Dashboard**
1. Go to **Table Editor** (left sidebar)
2. Click on table name
3. View/edit rows

**Option 2: SQL Editor**
```sql
SELECT * FROM users;
SELECT * FROM user_challenge_submissions;
```

**Option 3: API (in code)**
```typescript
const { data } = await supabase
  .from('users')
  .select('*');
console.log(data);
```

### What is Row Level Security (RLS)?

**RLS = Database-level access control**

Example policy:
```sql
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

**Means:**
- Users can ONLY see rows where `id` matches their `auth.uid()`
- Enforced at database level (cannot be bypassed)
- No need to write authorization logic in code

See [Security Guide](./SECURITY.md) for more.

### How do I backup the database?

**Automatic (Supabase Pro):**
- Daily backups included
- Point-in-time recovery

**Manual:**
1. Go to **Database** → **Backups**
2. Click **"Download backup"**

**Via SQL:**
```bash
pg_dump -h your-db-host -U postgres -d postgres > backup.sql
```

---

## 🔐 Authentication

### Why only Google OAuth?

**Reasons:**
1. ✅ **Security:** Google handles password management
2. ✅ **Convenience:** One-click login for ITB students
3. ✅ **Email verification:** Google already verified emails
4. ✅ **2FA support:** Users can enable on Google account

### Can I add other auth providers?

Yes! Supabase supports:
- GitHub
- GitLab
- Bitbucket
- Azure
- Email/Password

**To add:**
1. Enable provider in Supabase dashboard
2. Get OAuth credentials
3. Update auth flow in code

### How do I restrict to ITB emails only?

**Already implemented!**

1. In `.env`:
   ```env
   VITE_ALLOWED_EMAIL_DOMAIN=std.stei.itb.ac.id
   ```

2. In Google OAuth settings:
   ```typescript
   queryParams: {
     hd: 'std.stei.itb.ac.id'
   }
   ```

3. Check after login:
   ```typescript
   if (!email.endsWith('@std.stei.itb.ac.id')) {
     // Deny access
   }
   ```

### What if a user tries to login with non-ITB email?

They'll see an error message:
> "Only ITB students (@std.stei.itb.ac.id) can access this platform."

And will not be able to proceed.

### How long does a session last?

- **Access token:** 1 hour (default)
- **Refresh token:** 30 days (default)

Supabase automatically refreshes tokens.

**To customize:**
```sql
-- In Supabase SQL Editor
ALTER TABLE auth.refresh_tokens 
SET token_expiry = interval '7 days';
```

### Can users logout?

Yes! Click user menu → "Logout"

Or programmatically:
```typescript
await supabase.auth.signOut();
```

---

## 🚀 Deployment

### Where can I deploy this?

**Recommended:**
- **Vercel** - Best for React/Vite (free tier)
- **Netlify** - Good alternative (free tier)
- **Cloudflare Pages** - Fast CDN (free tier)

**Also works:**
- AWS Amplify
- GitHub Pages (with workarounds)
- Custom server (nginx)

### How do I deploy to Vercel?

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or connect GitHub repo:
# 1. Go to vercel.com
# 2. Import Git Repository
# 3. Configure (Vite preset auto-detected)
# 4. Deploy
```

See [Deployment Guide](./DEPLOYMENT.md) for detailed steps.

### Do I need to configure anything for deployment?

**Yes:**

1. **Environment variables** on hosting platform
2. **Redirect URIs** in Google Cloud Console
3. **Allowed origins** in Supabase dashboard

Example for Vercel:
```
Vercel Dashboard → Settings → Environment Variables
→ Add: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, etc.
```

### How much does hosting cost?

**Free tiers:**
- Vercel: Free (up to 100GB bandwidth/month)
- Netlify: Free (up to 100GB bandwidth/month)
- Supabase: Free (up to 500MB database, 2GB bandwidth)

**Paid tiers (if needed):**
- Vercel Pro: $20/month
- Supabase Pro: $25/month

For 1,000 students, **free tier is sufficient**.

### How do I set up a custom domain?

**In Vercel:**
1. Go to **Settings** → **Domains**
2. Add domain: `virtuallab.itb.ac.id`
3. Add DNS records (provided by Vercel)
4. Wait for SSL certificate (automatic)

**In Supabase:**
1. Update **Redirect URLs** with new domain
2. Update `VITE_SUPABASE_URL` if using custom Supabase domain

---

## 🐛 Troubleshooting

### Development server won't start

```bash
# Check if port 5173 is in use
lsof -ti:5173 | xargs kill -9

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try again
npm run dev
```

### TypeScript errors everywhere

```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Check vite-env.d.ts exists
ls vite-env.d.ts

# If missing, create it (see GETTING-STARTED.md)
```

### "Module not found" errors

```bash
# Make sure you're in the right directory
pwd

# Install missing dependency
npm install missing-package

# Check import path is correct
# ✅ import { Button } from './components/ui/button'
# ❌ import { Button } from 'components/ui/button'
```

### Supabase connection fails

**Check:**
1. `.env` file exists in root directory
2. Environment variables are correct (no typos)
3. No quotes around values in `.env`
4. Restart dev server after changing `.env`

```bash
# Verify env vars are loaded
console.log(import.meta.env.VITE_SUPABASE_URL);
```

### Google OAuth not working

**Common issues:**

1. **Redirect URI mismatch**
   - Google Cloud Console URIs must match exactly
   - Include `http://localhost:5173` for development

2. **Client ID wrong**
   - Double-check `VITE_GOOGLE_CLIENT_ID` in `.env`
   - Restart dev server after changing

3. **Google provider not enabled**
   - Check Supabase Dashboard → Authentication → Providers

4. **Wrong credentials in Supabase**
   - Re-enter Client ID and Secret in Supabase dashboard

### Quiz scores not saving

**Debug steps:**

1. **Check authentication:**
   ```typescript
   const user = supabase.auth.getUser();
   console.log('User:', user);
   // Should have user.id
   ```

2. **Check database connection:**
   ```typescript
   const { data, error } = await supabase
     .from('challenges')
     .select('*');
   console.log('Challenges:', data, error);
   ```

3. **Check RLS policies:**
   - Ensure policies allow INSERT on `user_challenge_submissions`

4. **Check error messages:**
   ```typescript
   const { error } = await supabase
     .from('user_challenge_submissions')
     .insert({...});
   console.error('Insert error:', error);
   ```

### Dashboard shows no data

**Possible reasons:**

1. **No submissions yet** - Take a quiz first!
2. **Wrong user ID** - Check `user_id` in database matches
3. **RLS blocking query** - Verify policies
4. **Database table empty** - Add sample data

### Build fails

```bash
# Check TypeScript errors
npm run type-check

# Check for syntax errors
npm run build

# Common issues:
# - Missing types: npm install @types/package-name
# - Import errors: Fix import paths
# - Env vars: Set in build environment
```

### Still stuck?

1. **Check documentation:** [Troubleshooting Guide](../guidelines/06-Troubleshooting.md)
2. **Search GitHub Issues:** [github.com/.../issues](https://github.com/your-username/virtual-lab-itb/issues)
3. **Open new issue:** Include error messages, screenshots, steps to reproduce
4. **Ask in discussions:** [github.com/.../discussions](https://github.com/your-username/virtual-lab-itb/discussions)

---

## 📚 More Questions?

### Documentation
- [Getting Started](./GETTING-STARTED.md)
- [Architecture](./ARCHITECTURE.md)
- [Development Guide](./DEVELOPMENT.md)
- [API Reference](./api/)

### External Resources
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Support
- [GitHub Issues](https://github.com/your-username/virtual-lab-itb/issues)
- [Discussions](https://github.com/your-username/virtual-lab-itb/discussions)

---

<div align="center">

**Didn't find your answer?** [Ask a question](https://github.com/your-username/virtual-lab-itb/discussions/new)

[⬆ Back to Top](#frequently-asked-questions-faq) • [📖 Documentation Home](./README.md)

</div>
