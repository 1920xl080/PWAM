# Security Guide - Virtual Lab ITB

**⚠️ CRITICAL: Read this before deploying to production!**

This guide addresses security vulnerabilities in the current setup and how to fix them.

---

## 🔴 Current Security Status: VULNERABLE

### What You Have Now
- ✅ Frontend application (React)
- ✅ Supabase client setup (`lib/supabase.ts`)
- ⚠️ **NO backend API protection**
- ⚠️ **NO rate limiting**
- ⚠️ **NO Row Level Security configured**
- ⚠️ **Email validation only in frontend (can be bypassed)**

### What This Means
❌ **Anyone can spam your database**  
❌ **Users can access/modify other users' data**  
❌ **No protection against malicious requests**  
❌ **Email domain restriction can be bypassed**  

---

## 🎯 Backend Setup: What You MUST Do

### Answer to Your Question: "Do I need to set up the backend?"

**YES and NO:**

- **NO** - You don't need to create custom API endpoints (Supabase provides the API)
- **YES** - You MUST configure Supabase security (Row Level Security, Auth policies)
- **RECOMMENDED** - Add Supabase Edge Functions for sensitive operations

### What Supabase Provides (Out of the Box)
✅ PostgreSQL database (API included)  
✅ Authentication system (Google OAuth)  
✅ Real-time subscriptions  
✅ Storage for files  
✅ Auto-generated REST API  

### What You MUST Configure (Not Done Yet)
❌ Row Level Security (RLS) policies  
❌ Database triggers for validation  
❌ Rate limiting  
❌ Email domain validation (server-side)  
❌ Input sanitization  

---

## 🛡️ Critical Security Vulnerabilities

### 1. ⚠️ No Row Level Security (RLS) - CRITICAL

**Problem:**
```typescript
// Current code in lib/supabase.ts
const { data, error } = await supabase
  .from('user_challenge_submissions')
  .select('*')
  .eq('user_id', userId);
```

**Vulnerability:**
- Anyone can modify the frontend code to access ANY user's data
- Users can submit scores for other users
- No database-level protection

**Impact:** 🔴 HIGH - Complete data breach possible

**Fix:** Configure RLS policies (see section below)

---

### 2. ⚠️ Email Domain Validation Only in Frontend - CRITICAL

**Problem:**
```typescript
// In AuthPage.tsx (frontend only!)
const allowedDomain = import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN;
if (!email.endsWith(`@${allowedDomain}`)) {
  // Reject
}
```

**Vulnerability:**
- Users can modify frontend code or use browser DevTools
- Can bypass domain restriction by editing JavaScript
- Can call Supabase auth API directly

**Impact:** 🔴 HIGH - Unauthorized users can access the system

**Fix:** Server-side validation using Supabase triggers (see section below)

---

### 3. ⚠️ No Rate Limiting - HIGH RISK

**Problem:**
- No limit on how many requests a user can make
- No protection against spam or DoS attacks

**Vulnerability:**
- Malicious user can spam database with thousands of requests
- Can exhaust Supabase free tier quota
- Can slow down application for legitimate users

**Impact:** 🟡 MEDIUM-HIGH - Service disruption, cost overruns

**Fix:** Implement rate limiting (see section below)

---

### 4. ⚠️ No Input Validation/Sanitization - MEDIUM RISK

**Problem:**
```typescript
// No validation on user inputs
const { data, error } = await supabase
  .from('user_challenge_submissions')
  .insert({ score: score }); // What if score is -9999 or 999999?
```

**Vulnerability:**
- Users can submit invalid data (negative scores, huge numbers)
- Potential for SQL injection if building custom queries
- XSS if displaying user-generated content

**Impact:** 🟡 MEDIUM - Data integrity issues, potential exploits

**Fix:** Add validation layers (see section below)

---

### 5. ⚠️ Exposed Anon Key - LOW RISK (Expected)

**Current:**
```env
VITE_SUPABASE_ANON_KEY=eyJhbGc... (exposed in frontend)
```

**Is this bad?** 
NO - This is **expected and safe** IF you have RLS enabled!

**Why it's safe:**
- Anon key is designed to be public
- RLS protects data at database level
- Even with the key, users can't access protected data

**Why it's NOT safe WITHOUT RLS:**
- Without RLS, anyone with the anon key can access ALL data
- This is why RLS is CRITICAL

**Impact:** ✅ OK if RLS is configured, 🔴 CRITICAL if not

---

## 🔧 How to Fix: Step-by-Step Security Hardening

### Step 1: Enable Row Level Security (RLS) - CRITICAL

**What is RLS?**
Database-level security that restricts access to rows based on user identity.

**How to enable:**

1. **Go to Supabase Dashboard** → Your Project → SQL Editor

2. **Run this SQL to enable RLS on all tables:**

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrolled_classes ENABLE ROW LEVEL SECURITY;
```

3. **Create RLS Policies:**

```sql
-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Anyone authenticated can insert their profile (on signup)
CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- CHALLENGES TABLE POLICIES
-- ============================================

-- All authenticated users can read challenges
CREATE POLICY "Authenticated users can view challenges"
ON challenges FOR SELECT
USING (auth.role() = 'authenticated');

-- Only admins can insert/update/delete challenges
-- (You'll need to add an 'is_admin' column to users table for this)
CREATE POLICY "Only admins can modify challenges"
ON challenges FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  )
);

-- ============================================
-- USER_CHALLENGE_SUBMISSIONS TABLE POLICIES
-- ============================================

-- Users can only view their own submissions
CREATE POLICY "Users can view own submissions"
ON user_challenge_submissions FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own submissions
CREATE POLICY "Users can insert own submissions"
ON user_challenge_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own submissions
CREATE POLICY "Users can update own submissions"
ON user_challenge_submissions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users cannot delete submissions (preserve audit trail)
-- No DELETE policy = DELETE is blocked

-- ============================================
-- ENROLLED_CLASSES TABLE POLICIES
-- ============================================

-- Users can view their own enrollments
CREATE POLICY "Users can view own enrollments"
ON enrolled_classes FOR SELECT
USING (auth.uid() = user_id);

-- Users can enroll themselves
CREATE POLICY "Users can enroll themselves"
ON enrolled_classes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can unenroll themselves
CREATE POLICY "Users can unenroll themselves"
ON enrolled_classes FOR DELETE
USING (auth.uid() = user_id);
```

4. **Test RLS:**

```typescript
// Try to access another user's data (should fail)
const { data, error } = await supabase
  .from('user_challenge_submissions')
  .select('*')
  .eq('user_id', 'someone-elses-id'); // Should return empty or error

// Should only return YOUR submissions
const { data, error } = await supabase
  .from('user_challenge_submissions')
  .select('*');
```

---

### Step 2: Server-Side Email Domain Validation - CRITICAL

**Problem:** Frontend validation can be bypassed.

**Solution:** Use Supabase Database Webhook or Trigger.

**Option A: Database Trigger (Recommended)**

```sql
-- Create a function to validate email domain
CREATE OR REPLACE FUNCTION validate_email_domain()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if email ends with allowed domain
  IF NEW.email NOT LIKE '%@std.stei.itb.ac.id' THEN
    RAISE EXCEPTION 'Only @std.stei.itb.ac.id email addresses are allowed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on users table
CREATE TRIGGER validate_email_on_insert
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION validate_email_domain();

CREATE TRIGGER validate_email_on_update
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION validate_email_domain();
```

**Option B: Supabase Auth Hook (Better for Auth flows)**

1. Go to **Supabase Dashboard** → Authentication → Hooks
2. Enable **"Send Email" hook** or use **Edge Functions**
3. Create an Edge Function to validate email:

```typescript
// supabase/functions/validate-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { user } = await req.json()
  
  const allowedDomain = 'std.stei.itb.ac.id'
  const email = user.email
  
  if (!email.endsWith(`@${allowedDomain}`)) {
    return new Response(
      JSON.stringify({ 
        error: 'Only @std.stei.itb.ac.id email addresses are allowed' 
      }),
      { status: 400 }
    )
  }
  
  return new Response(JSON.stringify({ success: true }), { status: 200 })
})
```

---

### Step 3: Add Rate Limiting

**Supabase provides some rate limiting, but you should add more layers.**

**Option A: Supabase Built-in (Basic)**

Supabase automatically rate limits:
- 60 requests per minute per IP (on free tier)
- More on paid tiers

**Option B: Custom Rate Limiting with Upstash Redis (Recommended)**

1. **Install Upstash Redis:**

```bash
npm install @upstash/ratelimit @upstash/redis
```

2. **Create rate limiter:**

```typescript
// lib/ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter that allows 10 requests per 10 seconds
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});
```

3. **Use in your code:**

```typescript
// Before submitting challenge
const { success } = await ratelimit.limit(userId);
if (!success) {
  toast.error('Too many requests. Please wait a moment.');
  return;
}

// Proceed with submission
await submitChallengeScore(userId, challengeId, score);
```

**Option C: Frontend Debouncing (Basic protection)**

```typescript
import { useState } from 'react';

// Add cooldown to submit button
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  if (isSubmitting) {
    toast.error('Please wait...');
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    await submitChallengeScore(userId, challengeId, score);
  } finally {
    setTimeout(() => setIsSubmitting(false), 3000); // 3 second cooldown
  }
};
```

---

### Step 4: Input Validation

**Add validation to all user inputs:**

```typescript
// lib/validation.ts
export function validateScore(score: number): boolean {
  // Score must be between 0 and 100
  if (score < 0 || score > 100) {
    throw new Error('Invalid score: must be between 0 and 100');
  }
  return true;
}

export function validateChallengeId(challengeId: string): boolean {
  // Must be a valid UUID or numeric ID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const numericRegex = /^[0-9]+$/;
  
  if (!uuidRegex.test(challengeId) && !numericRegex.test(challengeId)) {
    throw new Error('Invalid challenge ID format');
  }
  return true;
}

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
    .substring(0, 1000); // Limit length
}
```

**Use in your submission code:**

```typescript
// lib/supabase.ts - Updated submitChallengeScore
import { validateScore, validateChallengeId } from './validation';

export async function submitChallengeScore(
  userId: string,
  challengeId: string,
  score: number
) {
  // Validate inputs
  validateScore(score);
  validateChallengeId(challengeId);
  
  // Proceed with submission
  const { data, error } = await supabase
    .from('user_challenge_submissions')
    .upsert({
      user_id: userId,
      challenge_id: challengeId,
      score: score,
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting score:', error);
    throw error;
  }

  return data;
}
```

---

### Step 5: Add Database Constraints

**Add constraints at database level:**

```sql
-- Add check constraints to ensure data integrity
ALTER TABLE user_challenge_submissions
ADD CONSTRAINT score_range CHECK (score >= 0 AND score <= 100);

-- Prevent duplicate submissions (if needed)
ALTER TABLE user_challenge_submissions
ADD CONSTRAINT unique_user_challenge UNIQUE (user_id, challenge_id);

-- Ensure user_id is always set
ALTER TABLE user_challenge_submissions
ALTER COLUMN user_id SET NOT NULL;

-- Add indexes for performance
CREATE INDEX idx_submissions_user_id ON user_challenge_submissions(user_id);
CREATE INDEX idx_submissions_challenge_id ON user_challenge_submissions(challenge_id);
```

---

### Step 6: Protect Against XSS

**Use React's built-in XSS protection + sanitization:**

```typescript
// For displaying user-generated content
import DOMPurify from 'dompurify';

function DisplayUserContent({ content }: { content: string }) {
  // Sanitize HTML before rendering
  const sanitized = DOMPurify.sanitize(content);
  
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

**Install:**
```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

---

## 📋 Security Checklist

### Before Deploying to Production

- [ ] **Row Level Security (RLS) enabled** on all tables
- [ ] **RLS policies created** for all tables
- [ ] **Email domain validation** added (database trigger or Edge Function)
- [ ] **Rate limiting** implemented (at least basic frontend debouncing)
- [ ] **Input validation** added for all user inputs
- [ ] **Database constraints** added (score ranges, NOT NULL, etc.)
- [ ] **XSS protection** implemented (DOMPurify for user content)
- [ ] **Test RLS policies** - try to access other users' data (should fail)
- [ ] **Test email validation** - try to signup with non-ITB email (should fail)
- [ ] **Test rate limiting** - spam submit button (should block)
- [ ] **HTTPS enabled** in production (Vercel does this automatically)
- [ ] **Environment variables** secured (not in Git)
- [ ] **Supabase service_role key** NEVER exposed in frontend
- [ ] **Enable Supabase email confirmations** (optional but recommended)
- [ ] **Set up monitoring** (Supabase Dashboard → Logs)
- [ ] **Configure CORS** properly in Supabase
- [ ] **Regular backups** enabled (Supabase does this, but verify)

---

## 🎯 Security Levels

### Level 1: Minimum Viable Security (MVP)
**Time: 1-2 hours**

✅ Enable RLS on all tables  
✅ Create basic RLS policies  
✅ Add frontend input validation  
✅ Add database constraints  

**Risk:** Still vulnerable to rate limit abuse and email bypass

---

### Level 2: Production Ready (Recommended)
**Time: 3-4 hours**

✅ Everything in Level 1  
✅ Server-side email validation (database trigger)  
✅ Frontend rate limiting (debouncing)  
✅ XSS protection  
✅ Comprehensive testing  

**Risk:** Low risk for most applications

---

### Level 3: Enterprise Security (Paranoid)
**Time: 8-12 hours**

✅ Everything in Level 2  
✅ Upstash Redis rate limiting  
✅ Supabase Edge Functions for sensitive operations  
✅ Advanced monitoring and alerts  
✅ Penetration testing  
✅ Security audit  

**Risk:** Very low risk

---

## 🚨 Common Attack Vectors & Defenses

### Attack: SQL Injection
**Defense:** ✅ Supabase uses prepared statements (protected by default)

### Attack: XSS (Cross-Site Scripting)
**Defense:** ⚠️ Use DOMPurify for user-generated content

### Attack: CSRF (Cross-Site Request Forgery)
**Defense:** ✅ Supabase handles this with JWT tokens

### Attack: Rate Limit Abuse / DoS
**Defense:** ⚠️ Implement rate limiting (see Step 3)

### Attack: Unauthorized Data Access
**Defense:** ⚠️ Enable RLS (see Step 1) - CRITICAL!

### Attack: Email Domain Bypass
**Defense:** ⚠️ Server-side validation (see Step 2) - CRITICAL!

### Attack: Man-in-the-Middle
**Defense:** ✅ HTTPS (Vercel handles this automatically)

### Attack: Brute Force Login
**Defense:** ✅ Google OAuth has built-in protection

---

## 📊 Risk Assessment

| Vulnerability | Current Risk | After Fix | Priority |
|---------------|--------------|-----------|----------|
| No RLS | 🔴 CRITICAL | ✅ Safe | 1 |
| Frontend email validation only | 🔴 HIGH | ✅ Safe | 2 |
| No rate limiting | 🟡 MEDIUM | ✅ Safe | 3 |
| No input validation | 🟡 MEDIUM | ✅ Safe | 4 |
| Exposed anon key | ✅ OK (with RLS) | ✅ Safe | N/A |

---

## 💡 Summary: What You Need to Do

### Critical (Do Before Production)
1. ✅ Enable RLS on all tables
2. ✅ Create RLS policies
3. ✅ Add server-side email validation

### Important (Do Before Launch)
4. ✅ Add rate limiting (at least frontend debouncing)
5. ✅ Add input validation
6. ✅ Add database constraints

### Recommended (Do When Possible)
7. ✅ Implement advanced rate limiting (Upstash)
8. ✅ Add XSS protection
9. ✅ Set up monitoring and alerts

---

## 🔗 Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Hooks](https://supabase.com/docs/guides/auth/auth-hooks)
- [Rate Limiting with Upstash](https://upstash.com/docs/redis/features/ratelimiting)
- [OWASP Top 10 Security Risks](https://owasp.org/www-project-top-ten/)

---

**Next Steps:**
1. Read this guide completely
2. Follow Step 1 (RLS) immediately
3. Follow Step 2 (Email validation) before deploying
4. Test thoroughly
5. Monitor your Supabase dashboard for suspicious activity

**Remember:** Security is not a one-time task. Regularly review and update your security measures!
