# Component Documentation

## Overview

This document provides detailed documentation for all React components in the Virtual Lab ITB application.

---

## Component Hierarchy

```
App.tsx (Root)
├── SplashScreen.tsx
└── Router
    ├── HomePage.tsx
    │   ├── Navigation.tsx
    │   ├── Hero Section
    │   ├── Faculty Section
    │   ├── Team Section (Carousel)
    │   └── Contact Section
    │
    ├── ChallengePage.tsx
    │   ├── Navigation.tsx
    │   └── Challenge Grid
    │
    ├── ExerciseDetailPage.tsx
    │   ├── Navigation.tsx
    │   ├── Breadcrumb
    │   ├── Question Display
    │   └── Results Section
    │
    ├── DashboardPage.tsx
    │   ├── Navigation.tsx
    │   ├── User Profile
    │   ├── Stats Cards
    │   └── Submissions Table
    │
    └── AuthPage.tsx
        └── Login Card
```

---

## Page Components

### App.tsx

**Location:** `/App.tsx`  
**Type:** Root Component  
**Purpose:** Application entry point, routing, and authentication

#### Props
```typescript
// No props (root component)
```

#### State
```typescript
const [showSplash, setShowSplash] = useState(true);
const [user, setUser] = useState<User | null>(null);
```

#### Key Features
- React Router setup
- Authentication context provider
- Splash screen control
- Route configuration

#### Auth Context
```typescript
interface AuthContextType {
  user: User | null;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
}
```

#### Routes
| Path | Component | Protected |
|------|-----------|-----------|
| `/` | HomePage | No |
| `/challenges` | ChallengePage | No |
| `/challenge/:id` | ExerciseDetailPage | No |
| `/dashboard` | DashboardPage | Yes |
| `/auth` | AuthPage | No |

#### Usage
```typescript
// Entry point - rendered in main.tsx
import App from './App'
createRoot(document.getElementById('root')!).render(<App />)
```

---

### HomePage.tsx

**Location:** `/components/HomePage.tsx`  
**Type:** Page Component  
**Purpose:** Landing page with hero, faculties, team, and contact

#### Props
```typescript
type HomePageProps = {
  authContext: AuthContextType;
};
```

#### Sections

**1. Hero Section**
- Title: "Virtual Lab: Computational Thinking ITB"
- Subtitle: Educational platform description
- CTA Button: "Get Started" → `/challenges`
- Hero Image: ITB campus or students

**2. Faculty Section**
- 8 Faculty Cards (grid layout)
- Each faculty:
  - Code (e.g., "FTI")
  - Full name (e.g., "Fakultas Teknologi Industri")
  - Description
  - Faculty-specific image
  - Color-coded design

**Faculty List:**
```typescript
const faculties = [
  {
    name: "Fakultas Teknologi Industri",
    code: "FTI",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    iconColor: "text-orange-600"
  },
  // ... 7 more faculties
];
```

**3. Team Section**
- 85 Instructors
- Carousel component
- Responsive: 1/2/3/4 items per view
- Each member:
  - Photo
  - Name
  - Faculty
  - Role
  - Color-coded by faculty

**4. Contact Section**
- Form fields:
  - Name (required)
  - Email (required, email validation)
  - Message (required, textarea)
- Submit button
- Toast notification on success

#### Animations
```typescript
// Hero fade-in
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}

// Faculty cards stagger
transition={{ duration: 0.4, delay: 0.1 * index }}

// Card hover
whileHover={{ scale: 1.02, y: -2 }}
```

#### Responsive Design
```css
Grid columns:
Mobile: 1 column
Tablet (md): 2 columns
Desktop (lg): 3-4 columns
```

---

### ChallengePage.tsx

**Location:** `/components/ChallengePage.tsx`  
**Type:** Page Component  
**Purpose:** Browse all available challenges

#### Props
```typescript
type ChallengePageProps = {
  authContext: AuthContextType;
};
```

#### State
```typescript
const [challenges, setChallenges] = useState<Challenge[]>([]);
const [loading, setLoading] = useState(true);
```

#### Challenge Card Display
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

#### Features
- Grid layout (1/2/3 columns responsive)
- Difficulty badge (color-coded)
- Category display
- Points display
- Click to navigate to exercise
- Loading state
- Empty state (no challenges)

#### Difficulty Colors
```typescript
Easy: 'bg-green-100 text-green-700 border-green-200'
Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200'
Hard: 'bg-red-100 text-red-700 border-red-200'
```

#### Navigation
```typescript
onClick={() => navigate(`/challenge/${challenge.id}`)}
```

---

### ExerciseDetailPage.tsx

**Location:** `/components/ExerciseDetailPage.tsx`  
**Type:** Page Component  
**Purpose:** Interactive quiz interface

#### Props
```typescript
type ExerciseDetailPageProps = {
  authContext: AuthContextType;
};
```

#### State
```typescript
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
const [showResults, setShowResults] = useState(false);
```

#### URL Parameters
```typescript
const { id } = useParams(); // challenge ID
```

#### Quiz Flow

**1. Question Display**
```
- Question number & total
- Question text
- Radio button options
- Next/Submit button
```

**2. Answer Selection**
```typescript
const handleAnswerSelect = (questionId: string, answerId: string) => {
  setSelectedAnswers(prev => ({
    ...prev,
    [questionId]: answerId
  }));
};
```

**3. Navigation**
```typescript
const handleNext = () => {
  if (currentQuestionIndex < questions.length - 1) {
    setCurrentQuestionIndex(prev => prev + 1);
  }
};

const handleSubmit = () => {
  calculateScore();
  setShowResults(true);
};
```

**4. Score Calculation**
```typescript
const score = questions.reduce((total, question) => {
  const selectedAnswer = selectedAnswers[question.id];
  const correctAnswer = question.options.find(o => o.isCorrect);
  return selectedAnswer === correctAnswer?.id 
    ? total + question.points 
    : total;
}, 0);
```

**5. Results Display**
```
- Total score
- Percentage
- Correct/incorrect per question
- Explanations
- Try again button
- Back to challenges button
```

#### UI Components
- **Breadcrumb:** Home → Challenges → Challenge Title
- **Card:** Question container
- **RadioGroup:** Answer options
- **Button:** Navigation
- **Badge:** Difficulty, category
- **Progress:** Question progress bar

#### Protected Content
```typescript
// Requires authentication to submit
if (!user) {
  // Show login prompt
  return <LoginPrompt />;
}
```

---

### DashboardPage.tsx

**Location:** `/components/DashboardPage.tsx`  
**Type:** Page Component  
**Purpose:** Student progress and statistics

#### Props
```typescript
type DashboardPageProps = {
  authContext: AuthContextType;
};
```

#### Protected Route
```typescript
useEffect(() => {
  if (!user) {
    navigate('/auth');
  }
}, [user, navigate]);

if (!user) return null;
```

#### Sections

**1. User Profile Card**
```typescript
- Avatar (with initials)
- Name
- Email
- Member since date
```

**2. Statistics Cards (4)**
```typescript
const stats = {
  totalChallenges: number;        // 5 total
  completedChallenges: number;    // User's count
  averageScore: number;           // Average %
  totalPoints: number;            // Sum of points
};
```

Each stat card:
- Icon (color-coded)
- Value (large number)
- Label (description)

**3. Progress Overview**
```typescript
- Completion percentage
- Progress bar
- Completed / Total challenges
```

**4. Completed Challenges Table**

Columns:
| Column | Type | Example |
|--------|------|---------|
| Challenge | Link | Pattern Recognition |
| Category | Text | Abstraction |
| Difficulty | Badge | Easy |
| Score | Text | 20 / 20 |
| Percentage | Text | 100% |
| Submitted | Date | 2 days ago |

#### Data Fetching
```typescript
// Get user submissions
const { data: submissions } = await supabase
  .from('submissions')
  .select(`
    *,
    challenges (
      id, title, category, difficulty, total_points
    )
  `)
  .eq('user_id', user.id);
```

#### Empty State
```typescript
if (submissions.length === 0) {
  return (
    <EmptyState 
      title="No challenges completed yet"
      description="Start your learning journey"
      action="Browse Challenges"
    />
  );
}
```

---

### AuthPage.tsx

**Location:** `/components/AuthPage.tsx`  
**Type:** Page Component  
**Purpose:** Google OAuth authentication

#### Props
```typescript
type AuthPageProps = {
  authContext: AuthContextType;
};
```

#### State
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

#### Features
- Google Sign-in button
- Loading state
- Error display
- Auto-redirect after login

#### Login Flow
```typescript
const handleGoogleLogin = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    const success = await authContext.loginWithGoogle();
    
    if (success) {
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } else {
      setError('Please use your ITB email (@std.stei.itb.ac.id)');
    }
  } catch (err) {
    setError('Login failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

#### UI Design
```typescript
- Centered card
- ITB logo
- "Sign in with Google" button
- Domain restriction notice
- Error message display
```

#### Redirect Logic
```typescript
useEffect(() => {
  if (user) {
    navigate('/dashboard');
  }
}, [user, navigate]);
```

---

## Shared Components

### Navigation.tsx

**Location:** `/components/Navigation.tsx`  
**Type:** Shared Component  
**Purpose:** Top navigation bar

#### Props
```typescript
type NavigationProps = {
  authContext: AuthContextType;
};
```

#### State
```typescript
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
```

#### Navigation Links
```typescript
const links = [
  { name: 'Home', path: '/', public: true },
  { name: 'Challenges', path: '/challenges', public: true },
  { name: 'Dashboard', path: '/dashboard', protected: true }
];
```

#### Responsive Behavior

**Desktop (≥768px):**
```
Logo | Home | Challenges | Dashboard | [Login/Avatar]
```

**Mobile (<768px):**
```
Logo | [☰ Menu]

[Dropdown Menu]
- Home
- Challenges  
- Dashboard
- Login/Logout
```

#### Active Link Styling
```typescript
const isActive = location.pathname === link.path;

className={`${
  isActive 
    ? 'bg-blue-50 text-blue-600' 
    : 'text-gray-600 hover:bg-gray-50'
}`}
```

#### User Menu
```typescript
{user ? (
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
    <Button onClick={logout} variant="outline">
      Logout
    </Button>
  </div>
) : (
  <Link to="/auth">
    <Button>Login</Button>
  </Link>
)}
```

---

### SplashScreen.tsx

**Location:** `/components/SplashScreen.tsx`  
**Type:** Shared Component  
**Purpose:** Animated loading screen

#### Props
```typescript
type SplashScreenProps = {
  onComplete: () => void;
};
```

#### Duration
```typescript
const SPLASH_DURATION = 4000; // 4 seconds
```

#### Animation Sequence
```typescript
1. Logo scales in (0.8s)
   - From: scale(0), rotate(-180deg)
   - To: scale(1), rotate(0deg)

2. Hold (2.2s)

3. Fade out (1s)
   - opacity: 1 → 0

4. Call onComplete()
```

#### Implementation
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    onComplete();
  }, SPLASH_DURATION);
  
  return () => clearTimeout(timer);
}, [onComplete]);
```

#### Styling
```typescript
- Full screen overlay
- Gradient background (blue to indigo)
- Centered content
- z-index: 50
```

---

## Utility Components

### ImageWithFallback.tsx

**Location:** `/components/figma/ImageWithFallback.tsx`  
**Type:** Utility Component  
**Purpose:** Image with error fallback

⚠️ **PROTECTED FILE - DO NOT MODIFY**

#### Props
```typescript
type ImageWithFallbackProps = {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
};
```

#### Features
- Automatic fallback on error
- Lazy loading support
- Error handling
- CSS class pass-through

#### Usage
```typescript
<ImageWithFallback
  src="https://images.unsplash.com/..."
  alt="Description"
  className="w-full h-full object-cover"
/>
```

⚠️ **Always use instead of `<img>` tag**

---

## shadcn/ui Components

### Used Components (13)

#### Avatar
```typescript
import { Avatar, AvatarFallback } from './ui/avatar';

<Avatar>
  <AvatarFallback>{initials}</AvatarFallback>
</Avatar>
```

#### Badge
```typescript
import { Badge } from './ui/badge';

<Badge variant="outline" className="bg-green-100">
  Easy
</Badge>
```

#### Breadcrumb
```typescript
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator 
} from './ui/breadcrumb';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

#### Button
```typescript
import { Button } from './ui/button';

<Button variant="default">Click Me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="lg">Large</Button>
```

#### Card
```typescript
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

#### Carousel
```typescript
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from './ui/carousel';

<Carousel>
  <CarouselContent>
    {items.map((item) => (
      <CarouselItem key={item.id}>
        {item.content}
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselNext />
  <CarouselPrevious />
</Carousel>
```

#### Input
```typescript
import { Input } from './ui/input';

<Input 
  type="email" 
  placeholder="Email" 
  required 
/>
```

#### Label
```typescript
import { Label } from './ui/label';

<Label htmlFor="email">Email Address</Label>
<Input id="email" />
```

#### Progress
```typescript
import { Progress } from './ui/progress';

<Progress value={75} className="h-3" />
```

#### RadioGroup
```typescript
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

<RadioGroup value={selected} onValueChange={setSelected}>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
</RadioGroup>
```

#### Table
```typescript
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Textarea
```typescript
import { Textarea } from './ui/textarea';

<Textarea 
  placeholder="Message" 
  rows={5} 
/>
```

#### Toast (Sonner)
```typescript
import { toast } from 'sonner';

toast.success('Success message');
toast.error('Error message');
toast.info('Info message');
```

---

## Component Patterns

### Authentication Check
```typescript
const { user } = authContext;

useEffect(() => {
  if (!user) {
    navigate('/auth');
  }
}, [user, navigate]);
```

### Loading State
```typescript
const [loading, setLoading] = useState(true);

if (loading) {
  return <LoadingSpinner />;
}
```

### Error Handling
```typescript
try {
  // API call
} catch (error) {
  console.error('Error:', error);
  toast.error('Something went wrong');
}
```

### Form Submission
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validation
  if (!formData.email) {
    toast.error('Email is required');
    return;
  }
  
  // Submit
  submitForm(formData);
};
```

---

## Testing Components

### Component Test Template
```typescript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Component from './Component';

describe('Component', () => {
  const mockAuthContext = {
    user: null,
    loginWithGoogle: jest.fn(),
    logout: jest.fn()
  };

  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <Component authContext={mockAuthContext} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

---

## Accessibility

### ARIA Labels
```typescript
<button aria-label="Close menu">
  <X className="w-6 h-6" />
</button>
```

### Keyboard Navigation
```typescript
<Link
  to="/challenges"
  className="..."
  tabIndex={0}
>
  Challenges
</Link>
```

### Alt Text
```typescript
<ImageWithFallback
  src="..."
  alt="Descriptive alt text for screen readers"
/>
```

---

## Performance Tips

### Memoization
```typescript
const expensiveValue = useMemo(() => {
  return calculateSomething(data);
}, [data]);
```

### Callback Optimization
```typescript
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### Code Splitting
```typescript
const LazyComponent = lazy(() => import('./LazyComponent'));

<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

---

**Last Updated:** November 5, 2025  
**Total Components:** 7 pages + 2 shared + 13 UI  
**Status:** Complete (frontend)
