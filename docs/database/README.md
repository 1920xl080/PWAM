# Database Documentation

## Overview

Virtual Lab ITB uses **Supabase** (PostgreSQL) for the backend database.

**Status:** ⚠️ Not yet implemented  
**See Setup Guide:** `/guidelines/03-SupabaseSetup.md`

---

## Table of Contents

1. [Schema Overview](#schema-overview)
2. [Table Definitions](#table-definitions)
3. [Relationships](#relationships)
4. [Row Level Security](#row-level-security)
5. [Indexes](#indexes)
6. [Triggers](#triggers)
7. [Functions](#functions)
8. [Migrations](#migrations)

---

## Schema Overview

```
┌─────────────┐
│    users    │
│  (auth.users)│
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────────┐
│  submissions    │
└──────┬──────────┘
       │
       │ N:1
       │
┌──────▼──────────┐
│   challenges    │
└─────────────────┘
```

---

## Table Definitions

### auth.users (Supabase Auth)

**Purpose:** Managed by Supabase Auth, stores user accounts

```sql
-- Managed by Supabase Auth
-- Access via: auth.users

Columns:
- id: UUID (PRIMARY KEY)
- email: TEXT (UNIQUE)
- encrypted_password: TEXT
- email_confirmed_at: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- raw_user_meta_data: JSONB
  └─ { name, avatar_url, etc. }
```

**⚠️ Do NOT modify this table directly**  
**⚠️ Use Supabase Auth API instead**

---

### public.users

**Purpose:** Extended user profile information

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id` (UUID, PK): References auth.users(id)
- `email` (TEXT, UNIQUE, NOT NULL): User's ITB email
- `name` (TEXT, NOT NULL): Full name
- `created_at` (TIMESTAMP): Account creation timestamp

**Constraints:**
- Email must end with '@std.stei.itb.ac.id' (enforced by trigger)
- Foreign key to auth.users with cascade delete

**Sample Data:**
```sql
INSERT INTO public.users (id, email, name) VALUES
  ('uuid-1', 'student1@std.stei.itb.ac.id', 'John Doe'),
  ('uuid-2', 'student2@std.stei.itb.ac.id', 'Jane Smith');
```

---

### challenges

**Purpose:** Store computational thinking challenges

```sql
CREATE TABLE challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  total_points INTEGER NOT NULL CHECK (total_points > 0),
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id` (TEXT, PK): Unique identifier (e.g., 'challenge-1')
- `title` (TEXT, NOT NULL): Challenge title
- `description` (TEXT, NOT NULL): Full description
- `category` (TEXT, NOT NULL): Category (e.g., 'Abstraction', 'Algorithms')
- `difficulty` (TEXT, NOT NULL): 'Easy', 'Medium', or 'Hard'
- `total_points` (INTEGER, NOT NULL): Maximum points (must be > 0)
- `questions` (JSONB, NOT NULL): Array of question objects
- `created_at` (TIMESTAMP): Creation timestamp

**Questions JSONB Structure:**
```json
[
  {
    "id": "q1",
    "question": "What is the pattern?",
    "options": [
      {
        "id": "a",
        "text": "Option A",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "Option B",
        "isCorrect": true
      }
    ],
    "points": 10,
    "explanation": "B is correct because..."
  }
]
```

**Sample Data:**
```sql
INSERT INTO challenges (id, title, description, category, difficulty, total_points, questions)
VALUES (
  'challenge-1',
  'Pattern Recognition',
  'Test your ability to recognize patterns in data.',
  'Abstraction',
  'Easy',
  20,
  '[
    {
      "id": "q1",
      "question": "Identify the pattern: 2, 4, 8, 16, ?",
      "options": [
        {"id": "a", "text": "24", "isCorrect": false},
        {"id": "b", "text": "32", "isCorrect": true},
        {"id": "c", "text": "20", "isCorrect": false},
        {"id": "d", "text": "18", "isCorrect": false}
      ],
      "points": 10,
      "explanation": "The pattern is powers of 2: 2^1, 2^2, 2^3, 2^4, 2^5 = 32"
    }
  ]'::jsonb
);
```

---

### submissions

**Purpose:** Store user challenge submissions and scores

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0),
  answers JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);
```

**Columns:**
- `id` (UUID, PK): Auto-generated unique identifier
- `user_id` (UUID, NOT NULL, FK): References users(id)
- `challenge_id` (TEXT, NOT NULL, FK): References challenges(id)
- `score` (INTEGER, NOT NULL): Points earned (must be >= 0)
- `answers` (JSONB, NOT NULL): User's answer selections
- `submitted_at` (TIMESTAMP): Submission timestamp

**Constraints:**
- One submission per user per challenge (UNIQUE constraint)
- Score must be >= 0
- Foreign keys with cascade delete

**Answers JSONB Structure:**
```json
{
  "q1": "b",
  "q2": "a",
  "q3": "c"
}
```

**Sample Data:**
```sql
INSERT INTO submissions (user_id, challenge_id, score, answers)
VALUES (
  'user-uuid',
  'challenge-1',
  20,
  '{"q1": "b", "q2": "a"}'::jsonb
);
```

---

## Relationships

### Entity Relationship Diagram

```
auth.users (1) ──────< (N) public.users
                            │
                            │ id
                            │
                            │
public.users (1) ─────────< (N) submissions
                                 │
                                 │ challenge_id
                                 │
                                 │
challenges (1) ───────────< (N) submissions
```

### Relationship Details

**auth.users → public.users**
- Type: One-to-One
- Foreign Key: public.users.id → auth.users.id
- On Delete: CASCADE (delete profile when auth user deleted)

**public.users → submissions**
- Type: One-to-Many
- Foreign Key: submissions.user_id → public.users.id
- On Delete: CASCADE (delete submissions when user deleted)

**challenges → submissions**
- Type: One-to-Many
- Foreign Key: submissions.challenge_id → challenges.id
- On Delete: CASCADE (delete submissions when challenge deleted)

---

## Row Level Security (RLS)

**⚠️ CRITICAL: Must be enabled before production!**

### Enable RLS on Tables

```sql
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
```

### public.users Policies

```sql
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create user profile on signup
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### challenges Policies

```sql
-- Everyone can read challenges (public access)
CREATE POLICY "Anyone can read challenges"
  ON challenges
  FOR SELECT
  USING (true);

-- Only service role can insert/update/delete
-- (Set in Supabase dashboard or use service_role key)
```

### submissions Policies

```sql
-- Users can read their own submissions
CREATE POLICY "Users can read own submissions"
  ON submissions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can insert own submissions"
  ON submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users cannot update or delete submissions
-- (Prevents cheating - submissions are immutable)
```

---

## Indexes

### Performance Indexes

```sql
-- Index on submissions.user_id (for user dashboard)
CREATE INDEX idx_submissions_user_id 
  ON submissions(user_id);

-- Index on submissions.challenge_id (for challenge stats)
CREATE INDEX idx_submissions_challenge_id 
  ON submissions(challenge_id);

-- Index on submissions.submitted_at (for recent submissions)
CREATE INDEX idx_submissions_submitted_at 
  ON submissions(submitted_at DESC);

-- Index on challenges.difficulty (for filtering)
CREATE INDEX idx_challenges_difficulty 
  ON challenges(difficulty);

-- Index on challenges.category (for filtering)
CREATE INDEX idx_challenges_category 
  ON challenges(category);
```

### Query Performance

**Before Indexes:**
```sql
-- Slow query (full table scan)
SELECT * FROM submissions WHERE user_id = 'uuid';
-- Execution time: ~500ms (with 10,000+ rows)
```

**After Indexes:**
```sql
-- Fast query (index scan)
SELECT * FROM submissions WHERE user_id = 'uuid';
-- Execution time: ~5ms (with 10,000+ rows)
```

---

## Triggers

### Email Domain Validation Trigger

**⚠️ CRITICAL: Enforce ITB email domain on database level**

```sql
-- Function to validate email domain
CREATE OR REPLACE FUNCTION validate_itb_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if email ends with @std.stei.itb.ac.id
  IF NEW.email NOT LIKE '%@std.stei.itb.ac.id' THEN
    RAISE EXCEPTION 'Only ITB STEI email addresses (@std.stei.itb.ac.id) are allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on public.users table
CREATE TRIGGER check_itb_email_users
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION validate_itb_email();
```

### Auto-Create User Profile Trigger

```sql
-- Function to auto-create user profile after signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();
```

### Updated Timestamp Trigger

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on tables with updated_at column
-- (Add updated_at column first if needed)
```

---

## Functions

### Get User Statistics

```sql
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_challenges', (SELECT COUNT(*) FROM challenges),
    'completed_challenges', (SELECT COUNT(*) FROM submissions WHERE user_id = user_uuid),
    'total_points', (SELECT COALESCE(SUM(score), 0) FROM submissions WHERE user_id = user_uuid),
    'average_score', (SELECT COALESCE(AVG(score), 0) FROM submissions WHERE user_id = user_uuid)
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Usage:**
```sql
SELECT get_user_stats('user-uuid');
```

**Response:**
```json
{
  "total_challenges": 5,
  "completed_challenges": 3,
  "total_points": 80,
  "average_score": 26.67
}
```

### Calculate Challenge Statistics

```sql
CREATE OR REPLACE FUNCTION get_challenge_stats(challenge_text TEXT)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_attempts', COUNT(*),
    'average_score', AVG(score),
    'max_score', MAX(score),
    'min_score', MIN(score),
    'completion_rate', (COUNT(*)::FLOAT / (SELECT COUNT(*) FROM users) * 100)
  ) INTO stats
  FROM submissions
  WHERE challenge_id = challenge_text;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Migrations

### Migration File Structure

```
supabase/
└── migrations/
    ├── 20240101000000_initial_schema.sql
    ├── 20240102000000_add_rls_policies.sql
    ├── 20240103000000_add_indexes.sql
    └── 20240104000000_add_triggers.sql
```

### Initial Schema Migration

**File:** `20240101000000_initial_schema.sql`

```sql
-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create challenges table
CREATE TABLE challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  total_points INTEGER NOT NULL CHECK (total_points > 0),
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0),
  answers JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);
```

### Run Migrations

```bash
# Local
supabase db reset
supabase db push

# Production
supabase db push --linked
```

---

## Seed Data

### Seed Challenges

**File:** `supabase/seed.sql`

```sql
-- Import challenges from mockData.ts
INSERT INTO challenges (id, title, description, category, difficulty, total_points, questions)
VALUES
  ('challenge-1', 'Pattern Recognition', '...', 'Abstraction', 'Easy', 20, '[...]'::jsonb),
  ('challenge-2', 'Efficient Sorting', '...', 'Algorithms', 'Medium', 30, '[...]'::jsonb),
  ('challenge-3', 'Network Optimization', '...', 'Optimization', 'Hard', 40, '[...]'::jsonb),
  ('challenge-4', 'Data Security', '...', 'Algorithms', 'Medium', 30, '[...]'::jsonb),
  ('challenge-5', 'Recursive Thinking', '...', 'Decomposition', 'Hard', 40, '[...]'::jsonb);
```

**Run Seed:**
```bash
psql -h db.your-project.supabase.co -U postgres -d postgres -f supabase/seed.sql
```

---

## Backup & Restore

### Backup Database

```bash
# Backup all data
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql

# Backup specific tables
pg_dump -h db.your-project.supabase.co -U postgres -d postgres \
  -t challenges -t submissions > backup_data.sql
```

### Restore Database

```bash
# Restore from backup
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql
```

---

## Performance Optimization

### Query Optimization Tips

1. **Use Indexes:**
   ```sql
   -- Good
   SELECT * FROM submissions WHERE user_id = 'uuid';
   
   -- Add index on user_id for better performance
   CREATE INDEX idx_submissions_user_id ON submissions(user_id);
   ```

2. **Avoid SELECT *:**
   ```sql
   -- Bad
   SELECT * FROM challenges;
   
   -- Good
   SELECT id, title, difficulty FROM challenges;
   ```

3. **Use LIMIT:**
   ```sql
   -- Good
   SELECT * FROM submissions ORDER BY submitted_at DESC LIMIT 10;
   ```

4. **Use Joins Wisely:**
   ```sql
   -- Good (with indexes)
   SELECT s.*, c.title
   FROM submissions s
   JOIN challenges c ON s.challenge_id = c.id
   WHERE s.user_id = 'uuid';
   ```

---

## Monitoring

### Useful Queries

**Active Connections:**
```sql
SELECT count(*) FROM pg_stat_activity;
```

**Table Sizes:**
```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Slow Queries:**
```sql
SELECT
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Run initial schema migration
3. ✅ Enable Row Level Security
4. ✅ Add indexes for performance
5. ✅ Create triggers for validation
6. ✅ Seed challenge data
7. ✅ Test all queries
8. ✅ Deploy to production

---

**Last Updated:** November 5, 2025  
**Status:** Template - Implementation required  
**Database:** PostgreSQL (via Supabase)
