# Complete Code Documentation

## Overview

This document provides comprehensive documentation for the entire Virtual Lab ITB codebase, including frontend components, utilities, types, and backend architecture.

---

## Table of Contents

1. [Frontend Architecture](#frontend-architecture)
2. [Component Documentation](#component-documentation)
3. [Type Definitions](#type-definitions)
4. [Utilities & Helpers](#utilities--helpers)
5. [Styling System](#styling-system)
6. [State Management](#state-management)
7. [Routing & Navigation](#routing--navigation)
8. [Backend API (Template)](#backend-api-template)

---

## Frontend Architecture

### Technology Stack

```typescript
{
  "framework": "React 18.3.1",
  "language": "TypeScript 5.x",
  "build": "Vite 6.0",
  "styling": "Tailwind CSS v4.0",
  "routing": "React Router v6",
  "animations": "Motion (motion/react)",
  "backend": "Supabase",
  "ui": "shadcn/ui"
}
```

### Application Entry Points

#### `/main.tsx`
**Purpose:** Application entry point  
**Responsibilities:**
- Initializes React application
- Renders root App component
- Applies global styles

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

#### `/App.tsx`
**Purpose:** Main application component  
**Responsibilities:**
- Route configuration
- Authentication state management
- Context provider
- Splash screen control

**Key Features:**
- Uses `BrowserRouter` for client-side routing
- Manages authentication context
- Controls splash screen display (4 seconds)
- Provides auth methods to all pages

**Routes:**
```typescript
/ → HomePage
/challenges → ChallengePage
/challenge/:id → ExerciseDetailPage
/dashboard → DashboardPage (protected)
/auth → AuthPage
```

**Authentication Context:**
```typescript
interface AuthContextType {
  user: User | null;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
}
```

---

## Component Documentation

### Page Components

#### 1. HomePage (`/components/HomePage.tsx`)

**Purpose:** Landing page with hero section, faculty exploration, and team showcase

**Props:**
```typescript
type HomePageProps = {
  authContext: AuthContextType;
};
```

**Key Features:**
- Hero section with call-to-action
- 8 faculty cards (color-coded)
- 85-instructor team carousel
- Contact form
- Responsive design

**Sections:**
1. **Hero Section**
   - Title, description, CTA button
   - Hero image
   - Gradient background (blue to indigo)

2. **Faculty Section**
   - 8 faculties (FTI, STEI, SITH, FTMD, FTSL, FMIPA, SAPPK, SBM)
   - Color-coded cards
   - Grid layout (1/2/3/4 columns)

3. **Team Section**
   - 85 instructors
   - Carousel with 1/2/3/4 items per view
   - Faculty color coding

4. **Contact Section**
   - Name, email, message fields
   - Form validation
   - Toast notification on submit

**Faculty Colors:**
```typescript
FTI: orange-50/200/600
STEI: blue-50/200/600
SITH: green-50/200/600
FTMD: purple-50/200/600
FTSL: teal-50/200/600
FMIPA: indigo-50/200/600
SAPPK: pink-50/200/600
SBM: yellow-50/200/600
```

**Animations:**
- Fade in on mount (hero, sections)
- Staggered faculty cards (0.1s delay per card)
- Hover effects on cards (scale 1.02, translate -2px)

---

#### 2. ChallengePage (`/components/ChallengePage.tsx`)

**Purpose:** Browse all available computational thinking challenges

**Props:**
```typescript
type ChallengePageProps = {
  authContext: AuthContextType;
};
```

**Key Features:**
- Displays all 5 challenges in grid
- Filter/search (planned)
- Difficulty badges
- Category tags
- Responsive grid (1/2/3 columns)

**Challenge Display:**
```typescript
{
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  totalPoints: number;
  questionCount: number;
}
```

**Difficulty Colors:**
```typescript
Easy: green-100/700/200
Medium: yellow-100/700/200
Hard: red-100/700/200
```

**Animations:**
- Fade in grid
- Staggered cards (0.1s delay)
- Hover scale (1.02) and lift (-4px)

**Navigation:**
- Click card → Navigate to `/challenge/:id`

---

#### 3. ExerciseDetailPage (`/components/ExerciseDetailPage.tsx`)

**Purpose:** Interactive quiz interface for individual challenges

**Props:**
```typescript
type ExerciseDetailPageProps = {
  authContext: AuthContextType;
};
```

**Key Features:**
- Multi-question quiz
- Radio button selection
- Instant feedback (correct/incorrect)
- Score calculation
- Progress tracking

**State Management:**
```typescript
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
const [showResults, setShowResults] = useState(false);
```

**Question Flow:**
1. Display question with options
2. User selects answer (radio group)
3. Click "Next" or "Submit"
4. Show results with explanations

**Score Calculation:**
```typescript
const score = questions.reduce((total, question) => {
  const selectedAnswer = selectedAnswers[question.id];
  const correctAnswer = question.options.find(o => o.isCorrect);
  return selectedAnswer === correctAnswer?.id 
    ? total + question.points 
    : total;
}, 0);
```

**UI Components Used:**
- Breadcrumb (navigation)
- Card (question container)
- RadioGroup (answer options)
- Button (navigation)
- Badge (difficulty, category)
- Progress (question progress)

**Animations:**
- Fade in content
- Question transition
- Result reveal

---

#### 4. DashboardPage (`/components/DashboardPage.tsx`)

**Purpose:** Student progress tracking and statistics

**Props:**
```typescript
type DashboardPageProps = {
  authContext: AuthContextType;
};
```

**Key Features:**
- User profile (avatar, name, email)
- Statistics cards
- Completed challenges list
- Progress tracking
- Responsive layout

**Protected Route:**
- Requires authentication
- Redirects to `/auth` if not logged in

**Statistics Displayed:**
```typescript
{
  totalChallenges: number;        // 5 total
  completedChallenges: number;    // User's completed count
  averageScore: number;           // Average of all scores
  totalPoints: number;            // Sum of all points earned
}
```

**Stats Cards:**
1. **Total Challenges** (blue icon)
2. **Completed** (green icon)
3. **Average Score** (yellow icon)
4. **Total Points** (purple icon)

**Completed Challenges Table:**
```typescript
columns: [
  'Challenge',      // Title
  'Category',       // e.g., "Abstraction"
  'Difficulty',     // Badge (Easy/Medium/Hard)
  'Score',          // X / Y points
  'Percentage'      // X%
]
```

**UI Components Used:**
- Avatar (user profile)
- Card (stats, profile)
- Table (submissions)
- Badge (difficulty)
- Progress (completion %)

---

#### 5. AuthPage (`/components/AuthPage.tsx`)

**Purpose:** Google OAuth authentication page

**Props:**
```typescript
type AuthPageProps = {
  authContext: AuthContextType;
};
```

**Key Features:**
- Google OAuth login
- Email domain restriction (@std.stei.itb.ac.id)
- Loading state
- Error handling
- Redirect after login

**Authentication Flow:**
1. User clicks "Sign in with Google"
2. Loading state shown
3. Call `authContext.loginWithGoogle()`
4. If success → Navigate to `/dashboard`
5. If failure → Show error toast

**Domain Restriction:**
```typescript
// Only allows: *@std.stei.itb.ac.id
// Rejects: Other email domains
```

**⚠️ Security Note:**
Current implementation uses frontend validation only.
**Must implement server-side validation before production!**
See: `/docs/reference/SECURITY-GUIDE.md`

**UI Components Used:**
- Button (Google sign-in)
- Card (auth container)

**Animations:**
- Fade in auth card
- Scale animation on logo
- Slide in from bottom

---

#### 6. Navigation (`/components/Navigation.tsx`)

**Purpose:** Top navigation bar (desktop & mobile)

**Props:**
```typescript
type NavigationProps = {
  authContext: AuthContextType;
};
```

**Key Features:**
- Logo and branding
- Navigation links
- Login/Logout button
- User avatar (when logged in)
- Mobile menu (hamburger)
- Responsive design

**Navigation Links:**
```typescript
const links = [
  { name: 'Home', path: '/' },
  { name: 'Challenges', path: '/challenges' },
  { name: 'Dashboard', path: '/dashboard' } // If authenticated
];
```

**Responsive Behavior:**
- **Desktop (≥768px):** Horizontal menu
- **Mobile (<768px):** Hamburger menu

**Active Link Styling:**
```typescript
active: 'bg-blue-50 text-blue-600'
inactive: 'text-gray-600 hover:bg-gray-50'
```

**User Menu (when authenticated):**
- User avatar with initials
- Dropdown menu (planned)
- Logout button

---

#### 7. SplashScreen (`/components/SplashScreen.tsx`)

**Purpose:** Animated loading screen on app start

**Props:**
```typescript
type SplashScreenProps = {
  onComplete: () => void;
};
```

**Key Features:**
- Auto-plays for 4 seconds
- Smooth fade out
- Logo animation
- Brand colors

**Animation Sequence:**
1. Logo scales in (0.8s)
2. Hold (2.2s)
3. Fade out (1s)
4. Call `onComplete()`

**Animations Used:**
```typescript
Logo: {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  transition: { type: 'spring', stiffness: 200, damping: 15 }
}

Container: {
  exit: { opacity: 0 },
  transition: { duration: 1 }
}
```

**Z-index:** 50 (appears above all content)

---

### Utility Components

#### ImageWithFallback (`/components/figma/ImageWithFallback.tsx`)

**Purpose:** Image component with fallback support

**⚠️ PROTECTED FILE - DO NOT MODIFY**

**Props:**
```typescript
type ImageWithFallbackProps = {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
};
```

**Features:**
- Automatic fallback on load error
- Lazy loading
- CSS class support
- Error handling

**Usage:**
```typescript
<ImageWithFallback
  src="https://images.unsplash.com/..."
  alt="Description"
  className="w-full h-full object-cover"
/>
```

**⚠️ Always use this instead of `<img>` tag**

---

## Type Definitions

### Core Types

#### User
```typescript
interface User {
  id: string;              // UUID from Supabase
  email: string;           // Must be @std.stei.itb.ac.id
  name: string;            // Full name
  createdAt?: string;      // ISO timestamp
  completedChallenges?: string[]; // Challenge IDs
}
```

#### Challenge
```typescript
interface Challenge {
  id: string;              // Unique identifier (e.g., 'challenge-1')
  title: string;           // Challenge name
  description: string;     // Full description
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;        // e.g., 'Abstraction', 'Algorithms'
  totalPoints: number;     // Maximum points
  questions: Question[];   // Array of questions
}
```

#### Question
```typescript
interface Question {
  id: string;              // Unique identifier
  question: string;        // Question text
  options: Option[];       // Answer choices
  points: number;          // Points for correct answer
  explanation: string;     // Why the answer is correct
}
```

#### Option
```typescript
interface Option {
  id: string;              // Unique identifier (e.g., 'a', 'b')
  text: string;            // Option text
  isCorrect: boolean;      // Whether this is the correct answer
}
```

#### Submission
```typescript
interface Submission {
  id: string;              // UUID
  userId: string;          // User ID (foreign key)
  challengeId: string;     // Challenge ID (foreign key)
  score: number;           // Points earned
  answers: Record<string, string>; // questionId: answerId
  submittedAt: string;     // ISO timestamp
}
```

#### AuthContextType
```typescript
interface AuthContextType {
  user: User | null;                      // Current user or null
  loginWithGoogle: () => Promise<boolean>; // Login function
  logout: () => void;                     // Logout function
}
```

---

## Utilities & Helpers

### Supabase Client (`/lib/supabase.ts`)

**Purpose:** Supabase client configuration

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Environment Variables Required:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Usage:**
```typescript
import { supabase } from '../lib/supabase';

// Fetch data
const { data, error } = await supabase
  .from('challenges')
  .select('*');

// Insert data
const { data, error } = await supabase
  .from('submissions')
  .insert({ ... });
```

---

### Mock Data (`/data/mockData.ts`)

**Purpose:** Temporary data for frontend development

**⚠️ DELETE THIS FILE AFTER SUPABASE SETUP**

**Contents:**
- 5 challenges with full questions
- Sample user data
- Sample submissions

**Structure:**
```typescript
export const challenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Pattern Recognition',
    difficulty: 'Easy',
    category: 'Abstraction',
    totalPoints: 20,
    questions: [...]
  },
  // ... 4 more challenges
];
```

**Current Challenges:**
1. Pattern Recognition (Easy, 20pts)
2. Efficient Sorting (Medium, 30pts)
3. Network Optimization (Hard, 40pts)
4. Data Security (Medium, 30pts)
5. Recursive Thinking (Hard, 40pts)

---

### UI Utilities (`/components/ui/utils.ts`)

**Purpose:** Utility functions for UI components

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Usage:**
```typescript
import { cn } from './utils';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)} />
```

---

### Mobile Detection Hook (`/components/ui/use-mobile.ts`)

**Purpose:** Detect mobile viewport

```typescript
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
}
```

**Usage:**
```typescript
const isMobile = useMobile();

{isMobile ? <MobileMenu /> : <DesktopMenu />}
```

---

## Styling System

### Global Styles (`/styles/globals.css`)

**Purpose:** Global CSS, Tailwind configuration, typography

**Structure:**
```css
/* 1. Tailwind Directives */
@import "tailwindcss";

/* 2. CSS Variables */
:root {
  --primary-color: ...;
  --secondary-color: ...;
}

/* 3. Typography System */
h1, h2, h3, h4, h5, h6 {
  /* Pre-defined font sizes, weights, line heights */
}

/* 4. Base Styles */
body {
  font-family: 'Inter', sans-serif;
}

/* 5. Utility Classes */
.gradient-text { ... }
```

**⚠️ Important Rules:**
1. **DO NOT** add font-size classes in components
2. **DO NOT** add font-weight classes in components
3. **DO NOT** add line-height classes in components
4. Typography is controlled here only

**Typography Scale:**
```css
h1: 2.5rem (40px)
h2: 2rem (32px)
h3: 1.75rem (28px)
h4: 1.5rem (24px)
h5: 1.25rem (20px)
h6: 1rem (16px)
p: 1rem (16px)
```

---

### Tailwind v4 Configuration

**Location:** Embedded in `/styles/globals.css`  
**⚠️ NO `tailwind.config.js` FILE**

**Custom Theme:**
```css
@theme {
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  /* Add custom colors, spacing, etc. */
}
```

---

## State Management

### Authentication State

**Location:** `/App.tsx`

**State:**
```typescript
const [user, setUser] = useState<User | null>(null);
```

**Methods:**
```typescript
// Login (currently mock - needs Supabase)
const loginWithGoogle = async () => {
  const mockUser = {
    name: "Test Student",
    email: "test@std.stei.itb.ac.id",
    completedChallenges: []
  };
  setUser(mockUser);
  return true;
};

// Logout
const logout = () => {
  setUser(null);
  navigate('/');
};
```

**Context Provided:**
```typescript
const authContext: AuthContextType = {
  user,
  loginWithGoogle,
  logout
};
```

**Passed to all page components:**
```typescript
<HomePage authContext={authContext} />
<ChallengePage authContext={authContext} />
// etc.
```

---

### Local State Patterns

**Quiz State (ExerciseDetailPage):**
```typescript
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
const [showResults, setShowResults] = useState(false);
```

**UI State (Navigation):**
```typescript
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
```

**Form State (HomePage):**
```typescript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: ''
});
```

---

## Routing & Navigation

### Routes Configuration

**Location:** `/App.tsx`

```typescript
<Routes>
  <Route path="/" element={<HomePage authContext={authContext} />} />
  <Route path="/challenges" element={<ChallengePage authContext={authContext} />} />
  <Route path="/challenge/:id" element={<ExerciseDetailPage authContext={authContext} />} />
  <Route path="/dashboard" element={<DashboardPage authContext={authContext} />} />
  <Route path="/auth" element={<AuthPage authContext={authContext} />} />
</Routes>
```

### Protected Routes

**Pattern:**
```typescript
// In component
useEffect(() => {
  if (!user) {
    navigate('/auth');
  }
}, [user, navigate]);

if (!user) return null;
```

**Applied to:**
- Dashboard page

---

### Navigation Methods

**Declarative (Link):**
```typescript
import { Link } from 'react-router-dom';

<Link to="/challenges">
  <Button>Browse Challenges</Button>
</Link>
```

**Imperative (useNavigate):**
```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const handleClick = () => {
  navigate('/dashboard');
};
```

**With Parameters:**
```typescript
// Navigate
navigate(`/challenge/${challengeId}`);

// Access
const { id } = useParams();
```

---

## Backend API (Template)

**⚠️ This section is a template. Fill in after Supabase setup.**

### Authentication API

#### Sign In with Google
```typescript
// Endpoint: Supabase Auth
// Method: OAuth

const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/dashboard`,
    queryParams: {
      hd: 'std.stei.itb.ac.id' // Domain restriction
    }
  }
});

// Response:
// - Success: { user, session }
// - Error: { message, code }
```

#### Get Current User
```typescript
// Endpoint: Supabase Auth
// Method: GET

const { data: { user } } = await supabase.auth.getUser();

// Response: User object or null
```

#### Sign Out
```typescript
// Endpoint: Supabase Auth
// Method: POST

const { error } = await supabase.auth.signOut();

// Response: Success or error
```

---

### Challenges API

#### Get All Challenges
```typescript
// Endpoint: /challenges
// Method: GET

const { data, error } = await supabase
  .from('challenges')
  .select('*')
  .order('difficulty');

// Response: Challenge[]
```

#### Get Challenge by ID
```typescript
// Endpoint: /challenges/:id
// Method: GET

const { data, error } = await supabase
  .from('challenges')
  .select('*')
  .eq('id', challengeId)
  .single();

// Response: Challenge or null
```

---

### Submissions API

#### Submit Challenge Answer
```typescript
// Endpoint: /submissions
// Method: POST

const { data, error } = await supabase
  .from('submissions')
  .upsert({
    user_id: user.id,
    challenge_id: challengeId,
    score: calculatedScore,
    answers: selectedAnswers,
    submitted_at: new Date().toISOString()
  })
  .select()
  .single();

// Request Body:
{
  user_id: string;
  challenge_id: string;
  score: number;
  answers: Record<string, string>;
  submitted_at: string;
}

// Response: Submission object
```

#### Get User Submissions
```typescript
// Endpoint: /submissions
// Method: GET

const { data, error } = await supabase
  .from('submissions')
  .select(`
    *,
    challenges (
      id,
      title,
      difficulty,
      category,
      totalPoints
    )
  `)
  .eq('user_id', user.id)
  .order('submitted_at', { ascending: false });

// Response: Submission[] with joined challenge data
```

---

### Users API

#### Get User Profile
```typescript
// Endpoint: /users/:id
// Method: GET

const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();

// Response: User object
```

#### Update User Profile
```typescript
// Endpoint: /users/:id
// Method: PATCH

const { data, error } = await supabase
  .from('users')
  .update({ name: newName })
  .eq('id', userId)
  .select()
  .single();

// Request Body:
{
  name?: string;
  // Other updatable fields
}

// Response: Updated user object
```

---

## Error Handling

### Frontend Error Patterns

**API Call Error:**
```typescript
try {
  const { data, error } = await supabase.from('table').select();
  
  if (error) throw error;
  
  // Success
  setData(data);
} catch (error) {
  console.error('Error:', error);
  toast.error('Failed to load data');
}
```

**Form Validation:**
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.email.endsWith('@std.stei.itb.ac.id')) {
    toast.error('Please use your ITB email');
    return;
  }
  
  // Submit
};
```

---

## Performance Optimization

### Code Splitting

**Route-based splitting:**
```typescript
// Currently: Direct imports
import HomePage from './components/HomePage';

// Future: Lazy loading
const HomePage = lazy(() => import('./components/HomePage'));

<Suspense fallback={<Loading />}>
  <HomePage />
</Suspense>
```

### Image Optimization

**Use ImageWithFallback:**
```typescript
<ImageWithFallback
  src="https://images.unsplash.com/..."
  alt="Description"
  loading="lazy" // Lazy load images
/>
```

### Memoization

**Expensive calculations:**
```typescript
const totalScore = useMemo(() => {
  return submissions.reduce((sum, s) => sum + s.score, 0);
}, [submissions]);
```

---

## Testing Guidelines

### Component Testing

**Test file pattern:**
```typescript
// Component.test.tsx
import { render, screen } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### API Testing

**Mock Supabase:**
```typescript
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        data: mockData,
        error: null
      }))
    }))
  }
}));
```

---

## Deployment

### Environment Variables

**Required:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Optional:**
```env
VITE_APP_URL=https://your-app.vercel.app
```

### Build Command

```bash
npm run build
```

**Output:** `/dist` folder

---

## Code Style Guidelines

### TypeScript

**Always type props:**
```typescript
✅ type Props = { authContext: AuthContextType };
❌ function Component(props: any)
```

**Use interfaces for objects:**
```typescript
✅ interface User { ... }
❌ type User = { ... }
```

### React

**Functional components only:**
```typescript
✅ export function Component() { }
❌ export class Component extends React.Component
```

**Use hooks:**
```typescript
✅ const [state, setState] = useState();
❌ this.state = { ... }
```

### Styling

**Tailwind classes only:**
```typescript
✅ className="text-blue-600 bg-gray-50"
❌ style={{ color: 'blue', background: 'gray' }}
```

**No font classes:**
```typescript
❌ className="text-2xl font-bold"
✅ <h1 className="text-blue-600">Title</h1>
```

---

## Security Considerations

See `/docs/reference/SECURITY-GUIDE.md` for detailed security documentation.

**Critical Issues:**
1. ⚠️ Email validation is frontend-only
2. ⚠️ No Row Level Security (RLS) policies
3. ⚠️ No rate limiting
4. ⚠️ Mock authentication in use

**Must implement before production!**

---

## Maintenance

### Adding a New Challenge

1. Edit `/data/mockData.ts` (temporary)
2. Add challenge object with questions
3. After Supabase: Insert into database

### Adding a New Page

1. Create component in `/components/`
2. Add route in `/App.tsx`
3. Add navigation link in `Navigation.tsx`
4. Update documentation

### Updating Styles

1. Edit `/styles/globals.css` for global changes
2. Use Tailwind classes for component-specific styles
3. Never add font-size/weight/line-height classes

---

## Additional Resources

- **Setup Guide:** `/guidelines/01-InitialSetup.md`
- **Backend Setup:** `/guidelines/03-SupabaseSetup.md`
- **Security Guide:** `/docs/reference/SECURITY-GUIDE.md`
- **Architecture:** `/docs/reference/ARCHITECTURE.md`
- **Deployment:** `/guidelines/05-DeploymentGuide.md`

---

**Last Updated:** November 5, 2025  
**Version:** 1.0  
**Status:** Frontend Complete, Backend Pending
