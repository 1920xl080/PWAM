# Backend Setup Status - Virtual Lab ITB

**Last Updated:** November 5, 2025  
**Status:** 🟡 FRONTEND ONLY - Backend Configuration Required

---

## 📍 Current State: What You Have

### ✅ Frontend - Complete (100%)
- ✅ React application with all UI pages
- ✅ Google OAuth integration (frontend logic)
- ✅ Challenge quiz system (using mock data)
- ✅ Student dashboard (using mock data)
- ✅ Navigation and routing
- ✅ Animations and interactions
- ✅ Responsive design

### ⚠️ Backend - Not Set Up (0%)
- ❌ Supabase database tables (don't exist yet)
- ❌ Row Level Security policies (not configured)
- ❌ Google OAuth in Supabase (not connected)
- ❌ Email domain validation (frontend only - can be bypassed)
- ❌ Rate limiting (none)
- ❌ Data persistence (currently using mock data)

---

## 🎯 Answer to Your Questions

### Q1: "Is the backend set up by Supabase or do I have to set it up myself?"

**Answer: You need to set up the backend yourself, BUT Supabase makes it easy!**

Here's what you DON'T need to do:
- ❌ Write backend API code (Supabase auto-generates REST API)
- ❌ Set up servers (Supabase hosts everything)
- ❌ Configure database infrastructure (Supabase manages it)
- ❌ Handle authentication flows (Supabase provides OAuth)

Here's what you DO need to do:
- ✅ Create database tables (using SQL or Supabase UI)
- ✅ Configure Row Level Security policies (using SQL)
- ✅ Connect Google OAuth to Supabase (configuration only)
- ✅ Set up email domain restrictions (using database triggers)
- ✅ Test and verify security

**Time Required:** 2-4 hours for basic setup

---

### Q2: "Will it be easily ruined by bad users hitting the database with a lot of requests?"

**Answer: YES, in the current state! But it's fixable.**

#### Current Vulnerabilities (WITHOUT Backend Setup):

##### 1. 🔴 CRITICAL: No Database = No Persistence
**Problem:**
- Your app currently uses `/data/mockData.ts` (hardcoded data in frontend)
- Data doesn't save anywhere
- Everything resets on page refresh

**Impact:**
- ❌ User progress is lost
- ❌ Challenge submissions don't save
- ❌ No real user accounts

**Fix:** Set up Supabase database tables

---

##### 2. 🔴 CRITICAL: No Row Level Security
**Problem:**
- Once you connect to Supabase, ANYONE can access ALL data
- Users can read/write other users' data
- No database-level protection

**Example Attack:**
```javascript
// User opens browser console and runs:
const { data } = await supabase
  .from('user_challenge_submissions')
  .select('*'); // Gets EVERYONE's submissions, not just theirs!

// Or worse:
await supabase
  .from('user_challenge_submissions')
  .update({ score: 100 })
  .eq('user_id', 'someone-else'); // Changes other users' scores!
```

**Impact:**
- ❌ Complete data breach
- ❌ Users can cheat
- ❌ Users can access private information

**Fix:** Enable Row Level Security (see SECURITY-GUIDE.md)

---

##### 3. 🔴 HIGH: Email Validation Only in Frontend
**Problem:**
```typescript
// In AuthPage.tsx (frontend code - users can modify this!)
const allowedDomain = import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN;
if (!email.endsWith(`@${allowedDomain}`)) {
  toast.error('Only @std.stei.itb.ac.id emails allowed');
  return; // User can just delete this check in browser DevTools!
}
```

**How it can be bypassed:**
1. User opens browser DevTools (F12)
2. Finds this code in sources
3. Deletes the email check
4. Signs in with any email

**Impact:**
- ❌ Non-ITB students can access the system
- ❌ Unauthorized users can see content
- ❌ Defeats the whole purpose of email restriction

**Fix:** Server-side validation using database triggers

---

##### 4. 🟡 MEDIUM: No Rate Limiting
**Problem:**
- No limit on requests per user
- User can spam the database

**Example Attack:**
```javascript
// User opens browser console and runs:
for (let i = 0; i < 10000; i++) {
  await supabase
    .from('user_challenge_submissions')
    .insert({ user_id: userId, challenge_id: '1', score: 100 });
}
// Sends 10,000 database inserts in seconds!
```

**Impact:**
- ❌ Database gets flooded
- ❌ Free tier quota exhausted quickly
- ❌ Costs increase (on paid tier)
- ❌ App slows down for everyone
- ❌ Potential denial of service

**Fix:** Implement rate limiting

---

##### 5. 🟡 MEDIUM: No Input Validation
**Problem:**
```typescript
// No validation - user can submit anything!
await submitChallengeScore(userId, challengeId, -999999);
await submitChallengeScore(userId, challengeId, 999999999);
await submitChallengeScore(userId, 'hacked', '"><script>alert("xss")</script>');
```

**Impact:**
- ❌ Invalid data in database
- ❌ Negative scores, huge scores
- ❌ Potential XSS attacks
- ❌ Data integrity compromised

**Fix:** Add validation layers

---

## 🛠️ What You Need to Set Up

### Phase 1: Basic Backend (Required - 2 hours)

This gets your app working with real data persistence:

1. **Create Supabase Project** (10 minutes)
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get your project URL and anon key

2. **Create Database Tables** (30 minutes)
   
   See `guidelines/03-SupabaseSetup.md` for full SQL schema. Here's the summary:

   ```sql
   -- Create tables
   CREATE TABLE users (
     id UUID REFERENCES auth.users PRIMARY KEY,
     email TEXT NOT NULL,
     name TEXT,
     role TEXT DEFAULT 'student',
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE challenges (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     description TEXT,
     difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
     category TEXT,
     total_points INTEGER,
     questions JSONB,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE user_challenge_submissions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) NOT NULL,
     challenge_id UUID REFERENCES challenges(id) NOT NULL,
     score INTEGER NOT NULL,
     submitted_at TIMESTAMP DEFAULT NOW(),
     UNIQUE(user_id, challenge_id)
   );

   CREATE TABLE enrolled_classes (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) NOT NULL,
     class_name TEXT NOT NULL,
     faculty TEXT NOT NULL,
     enrolled_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Enable Row Level Security** (30 minutes)
   
   **CRITICAL - DO NOT SKIP THIS!**

   ```sql
   -- Enable RLS
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_challenge_submissions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE enrolled_classes ENABLE ROW LEVEL SECURITY;

   -- Create policies (see SECURITY-GUIDE.md for full policies)
   ```

4. **Set Up Google OAuth** (30 minutes)
   
   See `guidelines/04-GoogleOAuthSetup.md`

5. **Add Environment Variables** (10 minutes)
   
   Create `.env` file:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   VITE_ALLOWED_EMAIL_DOMAIN=std.stei.itb.ac.id
   ```

6. **Seed Database with Challenges** (20 minutes)
   
   Convert your mock data to database records:
   ```sql
   INSERT INTO challenges (title, description, difficulty, category, total_points, questions)
   VALUES 
     ('Sorting Algorithm', 'Understand sorting...', 'Easy', 'Algorithms', 20, '[...]'::jsonb),
     -- ... etc
   ```

**Result:** App works with real data persistence! ✅

---

### Phase 2: Security Hardening (Critical - 2 hours)

This protects your app from attacks:

7. **Server-Side Email Validation** (30 minutes)
   
   ```sql
   -- Create validation function
   CREATE OR REPLACE FUNCTION validate_email_domain()
   RETURNS TRIGGER AS $$
   BEGIN
     IF NEW.email NOT LIKE '%@std.stei.itb.ac.id' THEN
       RAISE EXCEPTION 'Only @std.stei.itb.ac.id emails allowed';
     END IF;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   -- Create trigger
   CREATE TRIGGER validate_email_on_insert
   BEFORE INSERT ON users
   FOR EACH ROW
   EXECUTE FUNCTION validate_email_domain();
   ```

8. **Add Database Constraints** (15 minutes)
   
   ```sql
   -- Ensure valid scores
   ALTER TABLE user_challenge_submissions
   ADD CONSTRAINT score_range CHECK (score >= 0 AND score <= 100);

   -- Add indexes
   CREATE INDEX idx_submissions_user_id ON user_challenge_submissions(user_id);
   ```

9. **Add Frontend Rate Limiting** (30 minutes)
   
   See SECURITY-GUIDE.md Step 3, Option C (basic frontend debouncing)

10. **Add Input Validation** (30 minutes)
    
    Create `lib/validation.ts` (see SECURITY-GUIDE.md Step 4)

11. **Test Security** (15 minutes)
    
    - Try accessing other users' data (should fail)
    - Try signing in with non-ITB email (should fail)
    - Try submitting invalid scores (should fail)

**Result:** App is protected from common attacks! ✅

---

### Phase 3: Optional Enhancements (Nice to Have - varies)

12. **Advanced Rate Limiting with Upstash Redis**
    - More robust protection
    - Cost: Free tier available
    - Time: 1 hour

13. **Monitoring & Alerts**
    - Set up Supabase logs monitoring
    - Get alerts for suspicious activity
    - Time: 30 minutes

14. **Performance Optimization**
    - Add database indexes
    - Optimize queries
    - Enable caching
    - Time: 1-2 hours

---

## 📊 Current vs. After Setup

| Feature | Current State | After Phase 1 | After Phase 2 |
|---------|---------------|---------------|---------------|
| **Data Persistence** | ❌ Mock data only | ✅ Real database | ✅ Real database |
| **User Accounts** | ❌ Fake (frontend only) | ✅ Real Google OAuth | ✅ Real + validated |
| **Security** | 🔴 None | 🟡 Basic | ✅ Production-ready |
| **Email Restriction** | 🟡 Frontend only (bypassable) | 🟡 Frontend only | ✅ Server-side |
| **Data Protection** | ❌ None | ⚠️ RLS required | ✅ RLS enabled |
| **Rate Limiting** | ❌ None | ❌ None | ✅ Basic protection |
| **Input Validation** | ⚠️ Frontend only | ⚠️ Frontend only | ✅ Multi-layer |

---

## 🎯 What Happens If You Deploy Without Backend Setup?

### Scenario 1: Deploy Current Code (No Supabase)
**Result:**
- ✅ App loads and looks nice
- ❌ No data saves (everything resets on refresh)
- ❌ Fake user accounts (not real authentication)
- ❌ Can't actually use the app

**Use Case:** Demo/prototype only

---

### Scenario 2: Deploy with Supabase but NO Security
**Result:**
- ✅ App loads and works
- ✅ Data persists
- ✅ Real user accounts
- 🔴 **CRITICAL VULNERABILITIES:**
  - Anyone can access all data
  - Users can modify other users' scores
  - Database can be spammed
  - Non-ITB emails can sign in

**Use Case:** ⚠️ NEVER do this!

---

### Scenario 3: Deploy with Supabase + Phase 1 + Phase 2
**Result:**
- ✅ App loads and works
- ✅ Data persists securely
- ✅ Real user accounts with validation
- ✅ Protected from common attacks
- ✅ Production-ready

**Use Case:** ✅ This is what you want!

---

## 🔐 Security Impact Summary

### Without Backend Security (Current):

**Ease of Attack:** 🔴 TRIVIAL (no technical skills needed)

**Example Attacks:**
1. **Bypass email restriction:** Open DevTools, delete validation code (30 seconds)
2. **Access all data:** Open console, run `supabase.from('users').select('*')` (10 seconds)
3. **Spam database:** Write a simple loop (2 minutes)
4. **Cheat scores:** Modify local storage or Supabase calls (1 minute)

**Who can attack:**
- ❌ Anyone with basic web development knowledge
- ❌ Anyone who can Google "how to bypass frontend validation"
- ❌ Anyone using browser DevTools

---

### With Backend Security (After Phase 1 + 2):

**Ease of Attack:** ✅ VERY DIFFICULT (requires advanced skills)

**Protected Against:**
- ✅ Email bypass (server-side validation)
- ✅ Unauthorized data access (RLS policies)
- ✅ Data tampering (database constraints)
- ✅ Basic spam/DoS (rate limiting)
- ✅ Invalid inputs (validation layers)

**Who can still attack:**
- ⚠️ Advanced hackers with database expertise (very rare)
- ⚠️ Determined attackers with Supabase knowledge (uncommon)

**Risk Level:** ✅ Acceptable for most production applications

---

## 📋 Quick Setup Checklist

### Before You Deploy:

- [ ] **Read SECURITY-GUIDE.md** (understand the risks)
- [ ] **Create Supabase project** (get URL and keys)
- [ ] **Run table creation SQL** (create database schema)
- [ ] **Enable RLS on ALL tables** (critical!)
- [ ] **Create RLS policies** (protect data access)
- [ ] **Set up Google OAuth in Supabase** (real authentication)
- [ ] **Add email validation trigger** (server-side restriction)
- [ ] **Add database constraints** (data integrity)
- [ ] **Add environment variables** (configure app)
- [ ] **Test all security measures** (verify protection)
- [ ] **Seed database with challenges** (initial data)
- [ ] **Deploy to Vercel** (go live!)

---

## 💡 Summary: The Bottom Line

### What You Have Now:
- ✅ Beautiful, functional frontend
- ❌ No real backend
- ❌ No security
- ❌ No data persistence

### What You Need:
- ✅ 4 hours of setup (2 hours basic + 2 hours security)
- ✅ Supabase free tier account
- ✅ Google Cloud project (for OAuth)
- ✅ Follow the guides in `/guidelines` folder

### Is It Hard?
**No!** It's mostly:
- Copy-pasting SQL commands
- Following step-by-step guides
- Clicking buttons in web interfaces
- No coding skills required (it's all configuration)

### Is It Worth It?
**Absolutely!** Without it:
- Your app is a pretty demo
- Can't be used in production
- Will be hacked immediately if exposed

With it:
- Production-ready application
- Secure user data
- Real authentication
- Protected from attacks

---

## 🚀 Next Steps

1. **Read this document** ✅ (you are here)
2. **Read `/SECURITY-GUIDE.md`** (understand the risks)
3. **Follow `/guidelines/03-SupabaseSetup.md`** (create backend)
4. **Follow `/guidelines/04-GoogleOAuthSetup.md`** (set up OAuth)
5. **Implement security measures from SECURITY-GUIDE.md** (protect your app)
6. **Test thoroughly** (verify everything works)
7. **Follow `/guidelines/05-DeploymentGuide.md`** (deploy to production)

---

## 📞 Need Help?

Check these resources in order:

1. **`/guidelines/README.md`** - Overview of all guides
2. **`/guidelines/06-Troubleshooting.md`** - Common issues and fixes
3. **`/SECURITY-GUIDE.md`** - Detailed security instructions
4. **Supabase Documentation** - [supabase.com/docs](https://supabase.com/docs)
5. **ITB Community** - Ask your classmates or instructors

---

**Remember:** The frontend is done, but the backend is just configuration. You've got this! 💪
