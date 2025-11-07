# Virtual Lab ITB - Architecture Overview

**Visual guide to understand how the application works**

---

## 🏗️ Current Architecture (What You Have)

```
┌─────────────────────────────────────────┐
│         USER'S BROWSER                  │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   React Frontend App              │ │
│  │   • HomePage.tsx                  │ │
│  │   • ChallengePage.tsx             │ │
│  │   • DashboardPage.tsx             │ │
│  │   • ExerciseDetailPage.tsx        │ │
│  │   • AuthPage.tsx                  │ │
│  └───────────────────────────────────┘ │
│            ▼                            │
│  ┌───────────────────────────────────┐ │
│  │   Mock Data (Frontend Only)       │ │
│  │   • /data/mockData.ts             │ │
│  │   • Hardcoded challenges          │ │
│  │   • Fake user data                │ │
│  │   • Lost on page refresh          │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘

❌ No real backend
❌ No data persistence  
❌ No real authentication
❌ No security
```

---

## 🎯 Target Architecture (What You Need)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                              │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │   React Frontend (Vite + TypeScript)                        │  │
│  │   Deployed on: Vercel                                       │  │
│  │                                                             │  │
│  │   Pages:                                                    │  │
│  │   • HomePage - Hero, faculties, team, contact              │  │
│  │   • ChallengePage - Browse challenges                      │  │
│  │   • ExerciseDetailPage - Take quiz, submit answers         │  │
│  │   • DashboardPage - View progress, enrolled classes        │  │
│  │   • AuthPage - Google OAuth login                          │  │
│  │                                                             │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                ▲                                   │
│                                │ HTTPS/WebSocket                   │
│                                │                                   │
└────────────────────────────────┼───────────────────────────────────┘
                                 │
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND (Cloud)                         │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │   Authentication Service                                  │    │
│  │   • Google OAuth 2.0 provider                             │    │
│  │   • Email domain validation (@std.stei.itb.ac.id)         │    │
│  │   • JWT token generation                                  │    │
│  │   • Session management                                    │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                ▲                                   │
│                                │                                   │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │   PostgreSQL Database                                     │    │
│  │                                                           │    │
│  │   Tables:                                                 │    │
│  │   ┌─────────────────────────────────────────────────┐    │    │
│  │   │ users                                           │    │    │
│  │   │ - id, email, name, role, created_at            │    │    │
│  │   │ RLS: Users can only access their own profile   │    │    │
│  │   └─────────────────────────────────────────────────┘    │    │
│  │   ┌─────────────────────────────────────────────────┐    │    │
│  │   │ challenges                                      │    │    │
│  │   │ - id, title, description, difficulty, category  │    │    │
│  │   │ RLS: All authenticated users can read          │    │    │
│  │   └─────────────────────────────────────────────────┘    │    │
│  │   ┌─────────────────────────────────────────────────┐    │    │
│  │   │ user_challenge_submissions                      │    │    │
│  │   │ - id, user_id, challenge_id, score, date       │    │    │
│  │   │ RLS: Users can only see/edit their submissions │    │    │
│  │   └─────────────────────────────────────────────────┘    │    │
│  │   ┌─────────────────────────────────────────────────┐    │    │
│  │   │ enrolled_classes                                │    │    │
│  │   │ - id, user_id, class_name, faculty, date       │    │    │
│  │   │ RLS: Users can only see their enrollments      │    │    │
│  │   └─────────────────────────────────────────────────┘    │    │
│  │                                                           │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │   Auto-Generated REST API                                │    │
│  │   • GET  /rest/v1/challenges                             │    │
│  │   • POST /rest/v1/user_challenge_submissions             │    │
│  │   • GET  /rest/v1/enrolled_classes?user_id=eq.{id}       │    │
│  │   Protected by: RLS policies + JWT authentication        │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │   Security Features                                       │    │
│  │   • Row Level Security (RLS) - Database-level protection  │    │
│  │   • Database triggers - Email validation                  │    │
│  │   • Constraints - Valid score ranges (0-100)              │    │
│  │   • Indexes - Fast queries                                │    │
│  │   • Rate limiting - Prevent spam (60 req/min default)     │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

✅ Real backend
✅ Data persistence
✅ Secure authentication  
✅ Protected data access
```

---

## 🔄 Data Flow Examples

### Example 1: User Login

```
1. User clicks "Sign in with Google"
   │
   ▼
2. Frontend redirects to Google OAuth
   │
   ▼
3. User authorizes with Google
   │
   ▼
4. Google returns to Supabase with user info
   │
   ▼
5. Supabase validates email domain
   │
   ├─ ✅ @std.stei.itb.ac.id → Allow
   │   │
   │   ▼
   │   6. Create user in database (if new)
   │   │
   │   ▼
   │   7. Generate JWT token
   │   │
   │   ▼
   │   8. Return to frontend with token
   │   │
   │   ▼
   │   9. Frontend stores token, redirects to dashboard
   │
   └─ ❌ Other domain → Reject
       │
       ▼
       Show error: "Only ITB emails allowed"
```

---

### Example 2: Taking a Challenge

```
1. User clicks challenge on ChallengePage
   │
   ▼
2. Navigate to ExerciseDetailPage
   │
   ▼
3. Frontend fetches challenge questions
   │
   ▼
   API Call: GET /rest/v1/challenges?id=eq.{challengeId}
   Headers: Authorization: Bearer {JWT_TOKEN}
   │
   ▼
4. Supabase checks:
   - Is user authenticated? ✓
   - Does RLS allow reading challenges? ✓
   │
   ▼
5. Return challenge data to frontend
   │
   ▼
6. User answers questions
   │
   ▼
7. User clicks "Submit"
   │
   ▼
8. Frontend validates answers (calculate score)
   │
   ▼
9. Submit score to backend
   │
   ▼
   API Call: POST /rest/v1/user_challenge_submissions
   Body: { user_id, challenge_id, score }
   Headers: Authorization: Bearer {JWT_TOKEN}
   │
   ▼
10. Supabase checks:
    - Is user authenticated? ✓
    - Is user_id same as JWT user? ✓ (RLS policy)
    - Is score valid (0-100)? ✓ (database constraint)
    - Has user submitted too many times? ✓ (rate limit)
    │
    ▼
11. Insert/update submission in database
    │
    ▼
12. Return success to frontend
    │
    ▼
13. Show success message, update UI
```

---

### Example 3: Viewing Dashboard

```
1. User navigates to /dashboard
   │
   ▼
2. Frontend fetches user's submissions
   │
   ▼
   API Call: GET /rest/v1/user_challenge_submissions
   Headers: Authorization: Bearer {JWT_TOKEN}
   │
   ▼
3. Supabase RLS policy enforces:
   WHERE user_id = auth.uid()
   │
   ▼
   (User can ONLY see their own submissions,
    even if they try to hack the query)
   │
   ▼
4. Return only user's submissions
   │
   ▼
5. Frontend calculates statistics:
   - Total challenges completed
   - Average score
   - Recent activity
   │
   ▼
6. Display on dashboard
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Frontend Validation (User Experience)        │
│  • Email domain check                                  │
│  • Input formatting                                    │
│  • Button debouncing                                   │
│  ⚠️ Can be bypassed by tech-savvy users!              │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 2: Authentication (Who are you?)                │
│  • Google OAuth verification                           │
│  • JWT token validation                                │
│  • Session management                                  │
│  ✅ Handled by Supabase + Google                      │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Authorization (What can you access?)         │
│  • Row Level Security (RLS) policies                   │
│  • User can only see/edit their own data               │
│  • Enforced at database level                          │
│  ✅ Cannot be bypassed by frontend hacking            │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 4: Data Validation (Is the data valid?)         │
│  • Database triggers (email domain)                    │
│  • Check constraints (score 0-100)                     │
│  • Foreign key constraints                             │
│  ✅ Database-level enforcement                        │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 5: Rate Limiting (Are you spamming?)            │
│  • Supabase built-in (60 req/min)                      │
│  • Optional: Custom Upstash Redis limiting             │
│  ✅ Prevents abuse                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Where Things Live

### Frontend Files (Your Computer / Vercel)
```
/
├── components/           ← React components (UI)
│   ├── HomePage.tsx
│   ├── ChallengePage.tsx
│   ├── DashboardPage.tsx
│   ├── ExerciseDetailPage.tsx
│   └── AuthPage.tsx
│
├── data/
│   └── mockData.ts      ← ⚠️ Temporary! Replace with Supabase
│
├── lib/
│   └── supabase.ts      ← Supabase client + helper functions
│
└── .env                 ← Environment variables (local only)
    VITE_SUPABASE_URL=...
    VITE_SUPABASE_ANON_KEY=...
```

### Backend (Supabase Cloud)
```
Supabase Project
│
├── Database (PostgreSQL)
│   ├── users table
│   ├── challenges table
│   ├── user_challenge_submissions table
│   └── enrolled_classes table
│
├── Authentication
│   ├── Google OAuth provider
│   └── Email domain settings
│
├── API (Auto-generated)
│   ├── REST endpoints
│   └── WebSocket (realtime)
│
├── Storage (Optional)
│   └── User avatars, challenge images
│
└── Edge Functions (Optional)
    └── Custom server-side logic
```

---

## 🔑 Key Concepts

### 1. What is Row Level Security (RLS)?

**Without RLS:**
```sql
-- Anyone can run this and see ALL users' data
SELECT * FROM user_challenge_submissions;

-- Returns:
-- user_1's submissions
-- user_2's submissions  
-- user_3's submissions
-- ⚠️ Privacy breach!
```

**With RLS:**
```sql
-- Same query, but RLS adds invisible WHERE clause
SELECT * FROM user_challenge_submissions;
-- Automatically becomes:
SELECT * FROM user_challenge_submissions 
WHERE user_id = auth.uid(); -- Only YOUR data

-- Returns:
-- user_1's submissions ONLY (if you're user_1)
-- ✅ Protected!
```

---

### 2. What is JWT Token?

```
When you login:
┌─────────────────────────────────────────┐
│ JWT Token (Stored in browser)           │
│                                         │
│ Header:                                 │
│   { "alg": "HS256", "typ": "JWT" }      │
│                                         │
│ Payload:                                │
│   {                                     │
│     "sub": "user-uuid-here",            │
│     "email": "you@std.stei.itb.ac.id",  │
│     "exp": 1699999999                   │
│   }                                     │
│                                         │
│ Signature: (cryptographic proof)        │
└─────────────────────────────────────────┘

Sent with every API request:
Authorization: Bearer eyJhbGc...

Supabase verifies this to know:
- Who you are (user_id)
- If you're allowed (RLS uses this)
- If token is expired
```

---

### 3. Frontend vs Backend Validation

**Frontend Validation:**
```typescript
// In browser (users can modify this!)
if (score < 0 || score > 100) {
  toast.error('Invalid score');
  return; // User can delete this in DevTools
}
```

**Backend Validation:**
```sql
-- In database (users CANNOT modify this!)
ALTER TABLE user_challenge_submissions
ADD CONSTRAINT score_range CHECK (score >= 0 AND score <= 100);

-- If someone tries: INSERT INTO ... VALUES (-999)
-- Database rejects: "violates check constraint"
```

**Both are needed:**
- Frontend = Better user experience (instant feedback)
- Backend = Real security (cannot be bypassed)

---

## 🎯 What You Need to Understand

### 1. The Anon Key is Public (And That's OK!)

```
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Common Question:** "Wait, this is in my frontend code! Isn't that insecure?"

**Answer:** No! It's designed to be public. Security comes from:
- ✅ Row Level Security (RLS) policies
- ✅ Authentication (who you are)
- ✅ Database-level protection

Think of it like a hotel lobby:
- Anon key = Anyone can enter the lobby
- RLS = You can only enter YOUR room (not others' rooms)

---

### 2. Mock Data vs. Real Data

**Mock Data (Current):**
```typescript
// In /data/mockData.ts
export const challenges = [
  { id: '1', title: 'Sorting', ... },
  { id: '2', title: 'Searching', ... },
];

// Problems:
// ❌ Hardcoded in frontend
// ❌ Lost on page refresh
// ❌ Can't add new challenges without redeploying
// ❌ Every user sees the same data
```

**Real Data (After Setup):**
```typescript
// In lib/supabase.ts
const { data: challenges } = await supabase
  .from('challenges')
  .select('*');

// Benefits:
// ✅ Stored in database
// ✅ Persists forever
// ✅ Can add challenges via admin panel
// ✅ Each user has their own submissions
```

---

## 📊 Cost Analysis

### Supabase Free Tier (What You Get for FREE)
- ✅ 500 MB database storage
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth
- ✅ 50,000 monthly active users
- ✅ Social OAuth (Google, GitHub, etc.)
- ✅ Row Level Security
- ✅ Automatic API generation
- ✅ Realtime subscriptions
- ✅ 60 requests per minute rate limiting

**For ITB student project:** More than enough!

**If you exceed limits:**
- Paid tier starts at $25/month
- But you'll likely graduate before needing it 😄

---

## 🛠️ Development vs Production

### Development (Local)
```
Your Computer
├── npm run dev (Vite dev server)
├── localhost:5173
├── .env (local environment variables)
└── Connects to: Supabase (cloud database)
```

### Production (Deployed)
```
Vercel Servers
├── npm run build → Static files
├── your-app.vercel.app
├── Environment variables (Vercel dashboard)
└── Connects to: Supabase (cloud database)
```

**Same backend, different frontends!**

---

## 📚 Summary

**What you have:**
- ✅ Complete React frontend
- ❌ No real backend setup

**What you need:**
- ✅ Supabase project (2 hours setup)
- ✅ Database tables (copy-paste SQL)
- ✅ Row Level Security (critical!)
- ✅ Google OAuth connection
- ✅ Security measures

**Is it hard?**
- ❌ No coding required
- ✅ Mostly configuration
- ✅ Step-by-step guides available
- ✅ 4 hours total

**Next step:**
Read `/BACKEND-SETUP-STATUS.md` for detailed instructions!

---

**Remember:** You're 80% done! The frontend is complete. Backend is just configuration. 🚀
