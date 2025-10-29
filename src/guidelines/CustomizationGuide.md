# Customization Guide for Virtual Lab: Computational Thinking ITB

This guide provides detailed instructions for customizing key aspects of the application.

---

## 1. Changing the Logo (Scholar Hat Icon)

The GraduationCap icon appears in **4 files**. Replace it with your preferred icon.

### Files to Modify:

#### **A. `/components/SplashScreen.tsx`**
```tsx
// LINE 2: Change the import
import { GraduationCap, Cpu, Lightbulb } from 'lucide-react';
// CHANGE TO (example with School icon):
import { School, Cpu, Lightbulb } from 'lucide-react';

// LINE 83: Change the icon component
<GraduationCap className="w-12 h-12 text-blue-600" />
// CHANGE TO:
<School className="w-12 h-12 text-blue-600" />
```

#### **B. `/components/Navigation.tsx`**
```tsx
// LINE 2: Change the import
import { GraduationCap, Trophy, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
// CHANGE TO:
import { School, Trophy, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';

// LINE 37: Change the icon component
<GraduationCap className="w-6 h-6 text-white" />
// CHANGE TO:
<School className="w-6 h-6 text-white" />
```

#### **C. `/components/HomePage.tsx`**
```tsx
// LINE 1: Change the import
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Mail, GraduationCap } from 'lucide-react';
// CHANGE TO:
import { ArrowRight, BookOpen, Mail, School } from 'lucide-react';

// LINE 45: Change the ITB badge icon
<GraduationCap className="w-4 h-4" />
// CHANGE TO:
<School className="w-4 h-4" />

// LINE 178: Change the "Meet the Instructors" section icon
<GraduationCap className="w-8 h-8 text-blue-600" />
// CHANGE TO:
<School className="w-8 h-8 text-blue-600" />

// LINES 209-1000+: Change ALL instructor card icons
// Find all instances of:
icon: GraduationCap,
// CHANGE TO:
icon: School,
```

#### **D. `/components/AuthPage.tsx`**
```tsx
// LINE 7: Change the import
import { GraduationCap, Chrome, Shield } from 'lucide-react';
// CHANGE TO:
import { School, Chrome, Shield } from 'lucide-react';

// LINE 66: Change the icon component
<GraduationCap className="w-8 h-8 text-white" />
// CHANGE TO:
<School className="w-8 h-8 text-white" />
```

### Alternative: Using a Custom Image/SVG Logo

If you want to use a custom logo image instead of a Lucide icon:

```tsx
// 1. Import your logo image at the top of the file
import CustomLogo from '../assets/logo.svg'; // or .png, .jpg

// 2. Replace the icon component with an img tag
<GraduationCap className="w-6 h-6 text-white" />
// CHANGE TO:
<img src={CustomLogo} alt="Logo" className="w-6 h-6" />

// OR use the ImageWithFallback component:
import { ImageWithFallback } from './figma/ImageWithFallback';
<ImageWithFallback src={CustomLogo} alt="Logo" className="w-6 h-6" />
```

---

## 2. Changing Instructor Data

All instructor data is stored in `/components/HomePage.tsx`.

### Location: `/components/HomePage.tsx` (Lines 206-1000+)

#### Structure of Each Instructor Entry:
```tsx
{
  name: 'Dr. Rini Anggraini, S.Si., M.Kom.',    // Instructor's full name
  role: 'Dosen of Kelas 1 (FMIPA)',            // Class and Faculty
  icon: GraduationCap,                          // Icon component (keep as is)
  bgColor: 'bg-blue-50',                        // Background color
  borderColor: 'border-blue-200',               // Border color
  iconColor: 'text-blue-600',                   // Icon color
},
```

#### To Modify Instructors:

**Option 1: Edit Existing Instructors**
```tsx
// Find the instructor you want to change (around line 206+)
{
  name: 'Dr. Rini Anggraini, S.Si., M.Kom.',
  role: 'Dosen of Kelas 1 (FMIPA)',
  // ... modify the name and role as needed
}
```

**Option 2: Add New Instructors**
```tsx
// Add a new entry to the instructors array
{
  name: 'Your New Instructor Name',
  role: 'Dosen of Kelas X (Faculty)',
  icon: GraduationCap,
  bgColor: 'bg-purple-50',
  borderColor: 'border-purple-200',
  iconColor: 'text-purple-600',
},
```

**Option 3: Remove Instructors**
```tsx
// Simply delete the entire instructor object from the array
// Make sure to remove the comma if it's the last item
```

#### Color Options for Faculty-Based Styling:
```tsx
// Blue theme
bgColor: 'bg-blue-50',
borderColor: 'border-blue-200',
iconColor: 'text-blue-600',

// Orange theme
bgColor: 'bg-orange-50',
borderColor: 'border-orange-200',
iconColor: 'text-orange-600',

// Green theme
bgColor: 'bg-green-50',
borderColor: 'border-green-200',
iconColor: 'text-green-600',

// Purple theme
bgColor: 'bg-purple-50',
borderColor: 'border-purple-200',
iconColor: 'text-purple-600',

// Available colors: blue, orange, green, purple, pink, teal, indigo, 
// cyan, amber, rose, violet, fuchsia, sky, emerald, lime, yellow, 
// red, stone, zinc, neutral, slate
```

### Moving Instructors to Separate Data File (Recommended)

For better organization, create `/data/instructors.ts`:

```tsx
// /data/instructors.ts
import { GraduationCap } from 'lucide-react';

export const instructors = [
  {
    name: 'Dr. Rini Anggraini, S.Si., M.Kom.',
    role: 'Dosen of Kelas 1 (FMIPA)',
    icon: GraduationCap,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
  },
  // ... add all instructors here
];

// Then in HomePage.tsx, import and use:
import { instructors } from '../data/instructors';
// Replace the inline array with: {instructors.map((instructor) => ...)}
```

---

## 3. Implementing Backend for User Authentication

Currently, the app uses **mock authentication**. To implement real backend:

### Current Authentication System Location

**File: `/App.tsx`**

#### Mock Authentication Code (Lines 20-60):
```tsx
// CURRENT MOCK IMPLEMENTATION - REPLACE THIS SECTION
const mockLogin = async (email: string, password: string) => {
  // This is fake authentication - replace with real API call
  if (email.endsWith('@std.stei.itb.ac.id')) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: '1',
      email: email,
      name: email.split('@')[0],
      completedChallenges: []
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  } else {
    throw new Error('Only @std.stei.itb.ac.id emails are allowed');
  }
};
```

### Implementation Steps:

#### **Step 1: Connect to Supabase (Recommended)**

Supabase provides authentication, database, and real-time features.

```tsx
// 1. Install Supabase
// Run in terminal: npm install @supabase/supabase-js

// 2. Create /src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 3. Replace mockLogin in App.tsx
import { supabase } from './lib/supabase';

const login = async (email: string, password: string) => {
  // Check email domain
  if (!email.endsWith('@std.stei.itb.ac.id')) {
    throw new Error('Only @std.stei.itb.ac.id emails are allowed');
  }

  // Sign in with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Fetch user profile from database
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();

  const user = {
    id: data.user.id,
    email: data.user.email!,
    name: profile?.name || data.user.email!.split('@')[0],
    completedChallenges: profile?.completed_challenges || []
  };

  setUser(user);
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

// 4. Create database tables in Supabase
// Table: users
// Columns:
//   - id (uuid, primary key, references auth.users)
//   - name (text)
//   - email (text)
//   - completed_challenges (jsonb)
//   - created_at (timestamp)
```

#### **Step 2: Google OAuth Implementation**

```tsx
// In /components/AuthPage.tsx, replace handleGoogleLogin function:

const handleGoogleLogin = async () => {
  try {
    // Use Supabase OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          hd: 'std.stei.itb.ac.id', // Restrict to ITB domain
        },
      },
    });

    if (error) throw error;

    // The redirect happens automatically
    // Handle the callback in App.tsx useEffect
  } catch (error: any) {
    toast.error(error.message);
  }
};

// In App.tsx, add OAuth callback handler:
useEffect(() => {
  // Listen for auth state changes
  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const email = session.user.email!;
        
        // Verify email domain
        if (!email.endsWith('@std.stei.itb.ac.id')) {
          await supabase.auth.signOut();
          toast.error('Only @std.stei.itb.ac.id emails are allowed');
          return;
        }

        // Create/update user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!profile) {
          // Create new user profile
          await supabase.from('users').insert({
            id: session.user.id,
            email: email,
            name: session.user.user_metadata.full_name || email.split('@')[0],
            completed_challenges: [],
          });
        }

        // Update app state
        const user = {
          id: session.user.id,
          email: email,
          name: profile?.name || session.user.user_metadata.full_name || email.split('@')[0],
          completedChallenges: profile?.completed_challenges || []
        };
        
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('user');
      }
    }
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);
```

#### **Step 3: Save User Progress to Database**

```tsx
// In /components/ExerciseDetailPage.tsx
// Replace the local state update with database save:

const handleSubmitAnswers = async () => {
  // ... existing validation code ...

  try {
    // Calculate score (existing code)
    const score = Math.round((correctCount / challenge.questions.length) * 100);

    // Save to database
    const { error } = await supabase
      .from('completed_challenges')
      .insert({
        user_id: user.id,
        challenge_id: challenge.id,
        score: score,
        answers: selectedAnswers,
        completed_at: new Date().toISOString(),
      });

    if (error) throw error;

    // Update local state
    const newCompletion = {
      challengeId: challenge.id,
      score: score,
      date: new Date().toISOString()
    };

    const updatedUser = {
      ...user,
      completedChallenges: [...(user.completedChallenges || []), newCompletion]
    };

    authContext.setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    toast.success(`Exercise completed! Score: ${score}/100`);
  } catch (error: any) {
    toast.error('Failed to save progress: ' + error.message);
  }
};

// Database table: completed_challenges
// Columns:
//   - id (uuid, primary key)
//   - user_id (uuid, foreign key to users.id)
//   - challenge_id (text)
//   - score (integer)
//   - answers (jsonb)
//   - completed_at (timestamp)
```

#### **Step 4: Alternative - Custom Backend API**

If you prefer to build your own backend:

```tsx
// Create API endpoints:
// POST /api/auth/login
// POST /api/auth/google
// GET /api/user/profile
// POST /api/challenges/complete

// In App.tsx:
const login = async (email: string, password: string) => {
  const response = await fetch('YOUR_API_URL/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  const user = data.user;
  
  setUser(user);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', data.token); // Store JWT token
  
  return user;
};

// Add Authorization header to all API requests:
const authFetch = (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
};
```

---

## 4. Adding and Editing Exercises

All exercise data is stored in `/data/mockData.ts`.

### File: `/data/mockData.ts`

#### Current Exercise Structure:
```tsx
export const challenges: Challenge[] = [
  {
    id: '1',                          // Unique identifier
    title: 'Pattern Recognition',     // Exercise title
    description: 'Identify patterns...', // Short description
    difficulty: 'Easy',               // 'Easy', 'Medium', or 'Hard'
    category: 'Pattern Recognition',  // Category name
    totalPoints: 100,                 // Total points (usually 100)
    questions: [                      // Array of questions
      {
        id: 'q1',                     // Unique question ID
        question: 'What is the next number?', // Question text
        image: 'https://...',         // Optional image URL
        options: [                    // Multiple choice options
          'Option A',
          'Option B',
          'Option C',
          'Option D',
        ],
        correctAnswer: 0,             // Index of correct answer (0-based)
        explanation: 'Explanation text', // Explanation shown after submission
      },
      // ... more questions
    ],
  },
  // ... more challenges
];
```

### Adding a New Exercise:

```tsx
// Add this to the challenges array in /data/mockData.ts
{
  id: 'new-exercise-1',  // Make sure this is unique!
  title: 'Your New Exercise Title',
  description: 'A brief description of what students will learn',
  difficulty: 'Medium',  // Choose: 'Easy', 'Medium', or 'Hard'
  category: 'Algorithm Design',  // Categories: Pattern Recognition, Algorithm Design, 
                                 // Decomposition, Abstraction, Logical Thinking, Data Representation
  totalPoints: 100,
  questions: [
    {
      id: 'q1',
      question: 'What is the correct algorithm to sort these numbers?',
      // Optional: Add an image
      // image: 'https://images.unsplash.com/photo-example',
      options: [
        'Bubble Sort',
        'Quick Sort',
        'Merge Sort',
        'Selection Sort',
      ],
      correctAnswer: 1,  // 0 = first option, 1 = second option, etc.
      explanation: 'Quick Sort is the most efficient for this case because...',
    },
    {
      id: 'q2',
      question: 'Second question here',
      options: [
        'Option A',
        'Option B',
        'Option C',
        'Option D',
      ],
      correctAnswer: 2,
      explanation: 'Explanation for question 2',
    },
    // Add more questions as needed (recommended: 3-5 questions per exercise)
  ],
},
```

### Editing an Existing Exercise:

```tsx
// Find the exercise by ID in /data/mockData.ts
// Example: Editing exercise with id: '1'

{
  id: '1',
  title: 'New Title Here',  // CHANGE THIS
  description: 'Updated description',  // CHANGE THIS
  difficulty: 'Hard',  // CHANGE THIS if needed
  category: 'Algorithm Design',  // CHANGE THIS if needed
  totalPoints: 100,
  questions: [
    {
      id: 'q1',
      question: 'Updated question text?',  // CHANGE THIS
      options: [
        'New Option A',  // CHANGE THESE
        'New Option B',
        'New Option C',
        'New Option D',
      ],
      correctAnswer: 1,  // CHANGE THIS if needed (0-based index)
      explanation: 'Updated explanation',  // CHANGE THIS
    },
    // Edit or add more questions
  ],
},
```

### Removing an Exercise:

```tsx
// Simply delete the entire exercise object from the challenges array
// in /data/mockData.ts

// BEFORE:
export const challenges: Challenge[] = [
  { id: '1', ... },
  { id: '2', ... },  // ← Delete this entire object
  { id: '3', ... },
];

// AFTER:
export const challenges: Challenge[] = [
  { id: '1', ... },
  { id: '3', ... },
];
```

### Exercise Categories:

Available categories (you can add more):
- Pattern Recognition
- Algorithm Design
- Decomposition
- Abstraction
- Logical Thinking
- Data Representation

### Tips for Creating Good Exercises:

1. **Question Quality**
   - Keep questions clear and concise
   - Avoid ambiguous wording
   - Test with real students before deploying

2. **Difficulty Levels**
   - Easy: Basic concepts, straightforward questions
   - Medium: Multi-step thinking, some complexity
   - Hard: Advanced concepts, require deep understanding

3. **Options**
   - Always provide 4 options
   - Make distractors plausible but clearly incorrect
   - Avoid "all of the above" or "none of the above"

4. **Explanations**
   - Explain WHY the answer is correct
   - Reference the concept being tested
   - Keep it educational, not just "this is the right answer"

5. **Images (Optional)**
   - Use Unsplash URLs for diagrams or visual questions
   - Format: `https://images.unsplash.com/photo-...`
   - Or import local images: `import diagram from '../assets/diagram.png'`

### Adding Images to Questions:

```tsx
{
  id: 'q1',
  question: 'Based on the diagram below, which algorithm is shown?',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', // Add image URL
  options: [...],
  correctAnswer: 0,
  explanation: '...',
}
```

### Moving Exercises to Database (Future Implementation):

When you implement the backend, you can move exercises to a database:

```tsx
// Database table: challenges
// Columns:
//   - id (uuid, primary key)
//   - title (text)
//   - description (text)
//   - difficulty (text)
//   - category (text)
//   - total_points (integer)
//   - questions (jsonb)
//   - created_at (timestamp)
//   - updated_at (timestamp)
//   - is_active (boolean)

// Then fetch in ChallengePage.tsx:
useEffect(() => {
  const fetchChallenges = async () => {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (!error) {
      setChallenges(data);
    }
  };
  
  fetchChallenges();
}, []);
```

---

## Quick Reference Summary

| Task | Files to Modify | Lines |
|------|----------------|-------|
| **Change Logo** | `SplashScreen.tsx`, `Navigation.tsx`, `HomePage.tsx`, `AuthPage.tsx` | Import & component usage |
| **Edit Instructors** | `HomePage.tsx` | Lines 206-1000+ |
| **Backend Auth** | `App.tsx`, `AuthPage.tsx` | Lines 20-60 (App.tsx) |
| **Add/Edit Exercises** | `data/mockData.ts` | Entire file |

---

## Need More Help?

- **Lucide Icons**: Browse all available icons at https://lucide.dev/icons
- **Tailwind Colors**: See all color options at https://tailwindcss.com/docs/customizing-colors
- **Supabase Docs**: https://supabase.com/docs/guides/auth
- **Motion (Framer Motion) Docs**: https://motion.dev/docs

---

**Last Updated**: October 29, 2025
