import { supabase } from './lib/supabase';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
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
  isLoggingOut?: boolean;
};

// Removed ProtectedRoute - no longer needed

function AppRoutes({ authContext }: { authContext: AuthContextType }) {
  const navigate = useNavigate();

  // Redirect to dashboard only when on auth page after login
  useEffect(() => {
    if (authContext.user) {
      const currentPath = window.location.pathname;
      // Only redirect if on auth page (not home page - user should be able to visit home)
      if (currentPath === '/auth') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [authContext.user, navigate]);

  // Use authContext directly (logout now handles navigation internally)
  const enhancedAuthContext: AuthContextType = {
    ...authContext
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
        
        {/* Routes - no protection, just redirect after login */}
        <Route
          path="/challenges"
          element={<ChallengePage authContext={enhancedAuthContext} />}
        />
        <Route
          path="/exercise/:id"
          element={<ExerciseDetailPage authContext={enhancedAuthContext} />}
        />
        <Route
          path="/dashboard"
          element={<DashboardPage authContext={enhancedAuthContext} />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isLoggingOutRef = useRef(false);
  const isHandlingAuthRef = useRef(false);
  const handledUserIdRef = useRef<string | null>(null);

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
    // Listen for auth state changes FIRST (this handles OAuth callbacks automatically)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email || 'no user');
      
      if (session?.user) {
        // Prevent duplicate handling for the same user (only skip if we're already handling this exact user)
        if (handledUserIdRef.current === session.user.id && isHandlingAuthRef.current) {
          console.log('⏭️ Skipping duplicate auth handling for user:', session.user.email);
          return;
        }
        console.log('✅ User authenticated:', session.user.email);
        await handleAuthUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log('✅ User signed out via Supabase');
        handledUserIdRef.current = null;
        isHandlingAuthRef.current = false;
        // Clear state (logout function handles the rest)
        setUser(null);
        localStorage.removeItem('virtualLabUser');
      }
    });

    // Check for existing session (this also processes OAuth hash tokens automatically)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Only handle if not already handled
        if (handledUserIdRef.current !== session.user.id) {
          console.log('✅ Existing session found:', session.user.email);
          handleAuthUser(session.user);
        } else {
          console.log('⏭️ Session already handled');
        }
      } else {
        console.log('ℹ️ No existing session');
      }
    });

    // Clean up URL hash after a short delay (Supabase processes it first)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get('access_token')) {
      setTimeout(() => {
        if (window.location.hash.includes('access_token')) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }, 1000);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthUser = async (authUser: any) => {
    // Prevent multiple simultaneous calls for the same user
    if (isHandlingAuthRef.current && handledUserIdRef.current === authUser.id) {
      console.log('⏭️ Auth handling already in progress for user:', authUser.id);
      return;
    }

    isHandlingAuthRef.current = true;
    const email = authUser.email || '';
    
    // Check email domain restriction
    const allowedDomain = import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN;
    if (allowedDomain && !email.endsWith(`@${allowedDomain}`)) {
      isHandlingAuthRef.current = false;
      await supabase.auth.signOut();
      toast.error(`Only @${allowedDomain} emails are allowed`);
      setUser(null);
      handledUserIdRef.current = null;
      return;
    }

    // Create base user data (always set this, even if database queries fail)
    const baseUserData: User = {
      id: authUser.id,
      name: authUser.user_metadata?.full_name || email.split('@')[0],
      email: email,
      role: 'student',
      enrolledClasses: [],
      completedChallenges: []
    };

    try {
      // Try to check if user exists in database
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.warn('Error fetching user from database:', fetchError);
        // Continue with base user data - database might not be set up yet
      } else if (!existingUser) {
        // Create new user in database (non-blocking)
        const { error: insertError } = await supabase.from('users').insert({
          id: authUser.id,
          email: email,
          name: authUser.user_metadata?.full_name || email.split('@')[0],
          role: 'student'
        });
        
        if (insertError) {
          console.warn('Error creating user in database (non-critical):', insertError);
          // Continue anyway - user can still use the app
        }
      }

      // Try to fetch user's completed challenges from database (non-blocking)
      const { data: submissions, error: submissionsError } = await supabase
        .from('user_challenge_submissions')
        .select('challenge_id, score, submitted_at')
        .eq('user_id', authUser.id);

      if (submissionsError) {
        console.warn('Error fetching submissions (non-critical):', submissionsError);
        // Continue with empty completedChallenges
      } else if (submissions && submissions.length > 0) {
        // Convert submissions to match User type
        baseUserData.completedChallenges = submissions.map((sub: any) => ({
          challengeId: sub.challenge_id,
          score: sub.score,
          date: sub.submitted_at
        }));
      }
    } catch (error) {
      console.error('Error during database operations (non-critical):', error);
      // Continue with base user data - app can work without database
    }

    // Always set user state (even if database operations failed)
    setUser(baseUserData);
    localStorage.setItem('virtualLabUser', JSON.stringify(baseUserData));
    handledUserIdRef.current = authUser.id;
    isHandlingAuthRef.current = false;
    
    console.log('User authenticated:', baseUserData.email);
    
    // Navigate to dashboard after successful authentication
    // Only redirect if on auth page (not home - user can visit home while logged in)
    const currentPath = window.location.pathname;
    if (currentPath === '/auth') {
      // Use window.location for immediate redirect
      window.location.href = '/dashboard';
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
    // Prevent multiple simultaneous logout attempts using ref (immediate check)
    if (isLoggingOutRef.current) {
      console.log('Logout already in progress');
      return;
    }

    isLoggingOutRef.current = true;
    setIsLoggingOut(true);
    
    console.log('Starting logout process...');
    
    // Clear user state and localStorage FIRST (before Supabase call)
    // This ensures user is logged out locally even if Supabase call fails
    setUser(null);
    localStorage.removeItem('virtualLabUser');
    sessionStorage.removeItem('splashShown');
    
    // Sign out from Supabase (fire and forget - don't wait for it)
    supabase.auth.signOut().catch((error) => {
      console.error('Supabase logout error (non-blocking):', error);
    });
    
    console.log('✅ Logout successful, redirecting to home page...');
    
    // IMMEDIATE redirect to home page (don't wait for anything)
    // Use window.location.replace to prevent back button issues
    window.location.replace('/');
  };

  const saveCompletedChallenge = async (challengeId: string, score: number, totalPoints: number) => {
    if (!user) {
      toast.error('You must be logged in to save progress');
      return;
    }

    try {
      // Use upsert instead of insert to handle duplicate submissions (409 error)
      // This will update if the record exists, or insert if it doesn't
      const { error } = await supabase
        .from('user_challenge_submissions')
        .upsert({
          user_id: user.id,
          challenge_id: challengeId,
          score: score,
          total_points: totalPoints,
          submitted_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,challenge_id' // Update if user already submitted this challenge
        });

      // Handle 409 conflict error gracefully (record already exists)
      if (error) {
        // If it's a 409 conflict, the record already exists - this is okay, just update local state
        if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('409')) {
          console.log('Submission already exists, updating score...');
          // Try to update the existing record
          const { error: updateError } = await supabase
            .from('user_challenge_submissions')
            .update({
              score: score,
              total_points: totalPoints,
              submitted_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('challenge_id', challengeId);
          
          if (updateError) {
            console.error('Error updating submission:', updateError);
            // Continue anyway - local state will be updated
          }
        } else {
          console.error('Database error:', error);
          throw error;
        }
      }

      // Update local state - check if challenge already exists to avoid duplicates
      const existingIndex = user.completedChallenges?.findIndex(
        c => c.challengeId === challengeId
      ) ?? -1;
      
      const updatedCompletedChallenges = existingIndex >= 0
        ? user.completedChallenges!.map((c, index) =>
            index === existingIndex
              ? { challengeId, score, date: new Date().toISOString() }
              : c
          )
        : [
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

  const authContext: AuthContextType = { 
    user, 
    loginWithGoogle, 
    logout, 
    saveCompletedChallenge,
    isLoggingOut 
  };

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