import { supabase } from './lib/supabase';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { ChallengePage } from './components/ChallengePage';
import { ExerciseDetailPage } from './components/ExerciseDetailPage';
import { AuthPage } from './components/AuthPage';
import { DashboardPage } from './components/DashboardPage';
import { SplashScreen } from './components/SplashScreen';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer';
  enrolledClasses?: string[];
  completedChallenges?: { challengeId: string; score: number; date: string }[];
};

export type AuthContextType = {
  user: User | null;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  saveCompletedChallenge: (challengeId: string, score: number, totalPoints: number) => void;
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('virtualLabUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppRoutes({ authContext }: { authContext: AuthContextType }) {
  const navigate = useNavigate();

  // Create logout function with navigation
  const logoutWithNavigate = async () => {
    await authContext.logout();
    navigate('/', { replace: true });
  };

  const enhancedAuthContext: AuthContextType = {
    ...authContext,
    logout: logoutWithNavigate
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Routes>
        <Route path="/" element={<HomePage authContext={enhancedAuthContext} />} />
        <Route 
          path="/auth" 
          element={authContext.user ? <Navigate to="/dashboard" replace /> : <AuthPage authContext={enhancedAuthContext} />} 
        />
        
        {/* Protected Routes */}
        <Route
          path="/challenges"
          element={
            <ProtectedRoute>
              <ChallengePage authContext={enhancedAuthContext} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercise/:id"
          element={
            <ProtectedRoute>
              <ExerciseDetailPage authContext={enhancedAuthContext} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage authContext={enhancedAuthContext} />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
      setShowSplash(false);
    }

    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('virtualLabUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    // Check for existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleAuthUser(session.user);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleAuthUser(session.user);
      } else {
        setUser(null);
        localStorage.removeItem('virtualLabUser');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthUser = async (authUser: any) => {
    const email = authUser.email || '';
    
    // Check email domain restriction
    const allowedDomain = import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN;
    if (!email.endsWith(`@${allowedDomain}`)) {
      await supabase.auth.signOut();
      toast.error(`Only @${allowedDomain} emails are allowed`);
      setUser(null);
      return;
    }

    // Check if user exists in database
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (!existingUser) {
      // Create new user in database
      await supabase.from('users').insert({
        id: authUser.id,
        email: email,
        name: authUser.user_metadata?.full_name || email.split('@')[0],
        role: 'student'
      });
    }

    // Fetch user's completed challenges from database
    const { data: submissions } = await supabase
      .from('user_challenge_submissions')
      .select('challenge_id, score, submitted_at')
      .eq('user_id', authUser.id);

    // Convert submissions to match User type
    const completedChallenges = (submissions || []).map((sub: any) => ({
      challengeId: sub.challenge_id,
      score: sub.score,
      date: sub.submitted_at
    }));

    // Set user state
    const userData: User = {
      id: authUser.id,
      name: authUser.user_metadata?.full_name || email.split('@')[0],
      email: email,
      role: 'student',
      enrolledClasses: [], // TODO: Fetch from database later
      completedChallenges: completedChallenges
    };

    setUser(userData);
    localStorage.setItem('virtualLabUser', JSON.stringify(userData));
  };

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Determine redirect URL based on environment
      const redirectUrl = window.location.origin;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectUrl}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            hd: import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN // Domain restriction
          }
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        toast.error('Authentication failed. Please try again.');
        return false;
      }

      // OAuth redirect happens automatically
      // User will be redirected to Google, then back to /dashboard
      return true;

    } catch (error) {
      console.error('Unexpected error during login:', error);
      toast.error('An unexpected error occurred.');
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('virtualLabUser');
    toast.success('Logged out successfully');
    // Navigation will be handled by AppRoutes component
  };

  const saveCompletedChallenge = async (challengeId: string, score: number, totalPoints: number) => {
    if (!user) {
      toast.error('You must be logged in to save progress');
      return;
    }

    try {
      // Save to Supabase database
      const { error } = await supabase
        .from('user_challenge_submissions')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          score: score,
          total_points: totalPoints,
          submitted_at: new Date().toISOString()
        });

      if (error) {
        console.error('Database error:', error);  // ✅ Log the error
        throw error;
      }

      // Update local state
      const updatedCompletedChallenges = [
        ...(user.completedChallenges || []),
        { challengeId, score, date: new Date().toISOString() }
      ];

      const updatedUser = {
        ...user,
        completedChallenges: updatedCompletedChallenges
      };

      setUser(updatedUser);
      localStorage.setItem('virtualLabUser', JSON.stringify(updatedUser));

      toast.success('Progress saved!');
    } catch (error) {
      console.error('Error saving challenge:', error);
      toast.error('Failed to save progress');
    }
  };

  const authContext: AuthContextType = { user, loginWithGoogle, logout, saveCompletedChallenge};

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      <Router>
        <AppRoutes authContext={authContext} />
      </Router>
    </>
  );
}