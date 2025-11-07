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

function ProtectedRoute({ children, authContext }: { children: React.ReactNode; authContext: AuthContextType }) {
  // Simply check authContext - navigation is handled by AppRoutes and route definitions
  if (!authContext.user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppRoutes({ authContext }: { authContext: AuthContextType }) {
  const navigate = useNavigate();

  // Handle OAuth redirect and navigation after login
  useEffect(() => {
    // Check for OAuth tokens in hash
    const hasAccessToken = window.location.hash.includes('access_token');
    const currentPath = window.location.pathname;
    
    if (hasAccessToken) {
      // Clean up hash immediately (Supabase has already processed it)
      const cleanUrl = currentPath + window.location.search;
      window.history.replaceState(null, '', cleanUrl);
    }
    
    // Navigate to dashboard if user is authenticated
    if (authContext.user) {
      // If on auth page, redirect to dashboard
      if (currentPath === '/auth') {
        navigate('/dashboard', { replace: true });
      }
      // If on root with OAuth token (just completed login), redirect to dashboard
      else if (currentPath === '/' && hasAccessToken) {
        navigate('/dashboard', { replace: true });
      }
    }
    // If no user but we have access token, wait a bit for auth state to update
    else if (hasAccessToken) {
      // Wait for user state to update (handled by onAuthStateChange)
      const timeout = setTimeout(() => {
        // Fallback: check again after delay
        const savedUser = localStorage.getItem('virtualLabUser');
        if (savedUser) {
          navigate('/dashboard', { replace: true });
        }
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [authContext.user, navigate]);

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
          element={
            authContext.user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage authContext={enhancedAuthContext} />
            )
          } 
        />
        
        {/* Protected Routes */}
        <Route
          path="/challenges"
          element={
            <ProtectedRoute authContext={enhancedAuthContext}>
              <ChallengePage authContext={enhancedAuthContext} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercise/:id"
          element={
            <ProtectedRoute authContext={enhancedAuthContext}>
              <ExerciseDetailPage authContext={enhancedAuthContext} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute authContext={enhancedAuthContext}>
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
    // Check for OAuth callback - Supabase automatically processes hash tokens
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hasAccessToken = hashParams.get('access_token');
    
    // Check for existing Supabase session (this also processes OAuth hash tokens automatically)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleAuthUser(session.user);
      }
    });

    // Listen for auth state changes (fires when OAuth tokens are processed)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        await handleAuthUser(session.user);
        
        // Clean up URL hash after successful authentication
        if (hasAccessToken || window.location.hash.includes('access_token')) {
          setTimeout(() => {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }, 100);
        }
        
        // If we just signed in via OAuth, the user state will update and AppRoutes will handle navigation
      } else {
        setUser(null);
        localStorage.removeItem('virtualLabUser');
      }
    });

    // Also clean up hash after a short delay (fallback)
    if (hasAccessToken) {
      setTimeout(() => {
        if (window.location.hash.includes('access_token')) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }, 500);
    }

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

    try {
      // Check if user exists in database
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (!existingUser) {
        // Create new user in database
        const { error: insertError } = await supabase.from('users').insert({
          id: authUser.id,
          email: email,
          name: authUser.user_metadata?.full_name || email.split('@')[0],
          role: 'student'
        });
        
        if (insertError) {
          console.error('Error creating user:', insertError);
        }
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
      
      console.log('User authenticated:', userData.email);
    } catch (error) {
      console.error('Error handling auth user:', error);
      toast.error('Error setting up user session');
    }
  };

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Always redirect to production Vercel URL (not localhost)
      const redirectUrl = import.meta.env.VITE_PRODUCTION_URL || 'https://logiclabberkom.vercel.app';
      const redirectTo = `${redirectUrl}/dashboard`;
      
      console.log('OAuth redirect to:', redirectTo);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
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