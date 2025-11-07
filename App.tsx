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
  saveCompletedChallenge: (challengeId: string, score: number, totalPoints: number) => Promise<void>;
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

  // Sync backup submissions from localStorage to database
  const syncBackupSubmissions = async (userId: string) => {
    try {
      // Find all backup submission keys
      const backupKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('challenge_submission_backup_')) {
          backupKeys.push(key);
        }
      }

      if (backupKeys.length === 0) {
        return; // No backups to sync
      }

      console.log(`Found ${backupKeys.length} backup submission(s) to sync...`);

      for (const key of backupKeys) {
        try {
          const backupData = localStorage.getItem(key);
          if (!backupData) continue;

          const backup = JSON.parse(backupData);
          
          // Verify this backup belongs to the current user
          if (backup.userId !== userId) {
            continue;
          }

          // Try to save to database
          const { error } = await supabase
            .from('user_challenge_submissions')
            .upsert({
              user_id: userId,
              challenge_id: backup.challengeId,
              score: backup.score,
              total_points: backup.totalPoints,
              submitted_at: backup.timestamp || new Date().toISOString()
            }, {
              onConflict: 'user_id,challenge_id'
            });

          if (!error) {
            // Successfully synced, remove from backup
            localStorage.removeItem(key);
            console.log(`✅ Synced backup submission for challenge: ${backup.challengeId}`);
          } else {
            console.warn(`⚠️ Failed to sync backup for challenge ${backup.challengeId}:`, error);
          }
        } catch (error) {
          console.error(`Error processing backup ${key}:`, error);
        }
      }
    } catch (error) {
      console.error('Error syncing backup submissions:', error);
    }
  };

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

      // Sync any backup submissions first (before fetching from database)
      await syncBackupSubmissions(authUser.id);

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
    // Quick validation - fail fast if no user
    if (!user) {
      toast.error('You must be logged in to save progress');
      throw new Error('User not logged in');
    }

    // Get session - but don't block on it, start saving immediately
    // We'll handle session issues in the retry logic
    const sessionPromise = supabase.auth.getSession();
    
    // Update local state IMMEDIATELY (for instant UI feedback)
    // This happens in parallel with database save
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

    // Update state immediately (don't wait for database)
    setUser(updatedUser);
    localStorage.setItem('virtualLabUser', JSON.stringify(updatedUser));

    // Now check session (this happens in parallel with state update)
    const { data: { session }, error: sessionError } = await sessionPromise;
    let userId: string | null = null;
    
    if (sessionError || !session?.user) {
      console.warn('No active Supabase session, saving to localStorage only:', sessionError);
      userId = user.id;
      
      // Save to localStorage as backup
      const backupKey = `challenge_submission_backup_${challengeId}`;
      localStorage.setItem(backupKey, JSON.stringify({
        challengeId,
        score,
        totalPoints,
        userId: user.id,
        timestamp: new Date().toISOString()
      }));
      
      // Show info that it's saved locally
      toast.info('✅ Progress saved locally', {
        duration: 4000,
        description: 'Session expired. Progress is saved locally and will be synced when you log in again.'
      });
      
      console.log('✅ Progress saved to localStorage (session expired)');
      return; // Exit early - saved locally
    }
    
    // Session is valid, use session user ID
    userId = session.user.id;

    // Update user ID if mismatch (non-blocking)
    if (user.id !== userId) {
      console.warn('User ID mismatch, updating user state...', { storedId: user.id, sessionId: userId });
      const correctedUser = { ...updatedUser, id: userId };
      setUser(correctedUser);
      localStorage.setItem('virtualLabUser', JSON.stringify(correctedUser));
    }

    // INSTANT SAVE: Try database save immediately (no delays on first attempt)
    // Retry logic only kicks in if first attempt fails
    const maxRetries = 3;
    let lastError: any = null;
    let saveSuccess = false;

    for (let attempt = 0; attempt < maxRetries && !saveSuccess; attempt++) {
      try {
        // Only delay on retries (attempt > 0), first attempt is instant
        if (attempt > 0) {
          // Exponential backoff for retries only
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log(`Retrying save (attempt ${attempt + 1}/${maxRetries}) after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.log('🚀 Attempting instant database save...');
        }

        // Try upsert immediately (no delays on first attempt)
        const { error: upsertError } = await supabase
          .from('user_challenge_submissions')
          .upsert({
            user_id: userId,
            challenge_id: challengeId,
            score: score,
            total_points: totalPoints,
            submitted_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,challenge_id'
          });

        if (!upsertError) {
          // Success! Mark as saved and break
          lastError = null;
          saveSuccess = true;
          console.log('✅ Database save successful!');
          break;
        }

        // Handle specific error cases
        if (upsertError.code === '23505' || upsertError.message?.includes('duplicate') || upsertError.message?.includes('409')) {
          console.log('Submission exists, updating score...');
          // Try to update the existing record
          const { error: updateError } = await supabase
            .from('user_challenge_submissions')
            .update({
              score: score,
              total_points: totalPoints,
              submitted_at: new Date().toISOString()
            })
            .eq('user_id', userId)
            .eq('challenge_id', challengeId);
          
          if (!updateError) {
            // Update succeeded
            lastError = null;
            saveSuccess = true;
            console.log('✅ Database update successful!');
            break;
          } else {
            lastError = updateError;
            console.error('Error updating submission:', updateError);
          }
        } else {
          lastError = upsertError;
          console.error(`Database error (attempt ${attempt + 1}):`, upsertError);
        }

        // If this is the last attempt, we'll handle it after the loop
        if (attempt === maxRetries - 1) {
          lastError = upsertError;
        }

      } catch (error: any) {
        lastError = error;
        console.error(`Save attempt ${attempt + 1} failed:`, error);
      }
    }

    // If all retries failed, save to localStorage as backup
    if (!saveSuccess && lastError) {
      console.warn('Database save failed after all retries, saving to localStorage as backup');
      const backupKey = `challenge_submission_backup_${challengeId}`;
      localStorage.setItem(backupKey, JSON.stringify({
        challengeId,
        score,
        totalPoints,
        userId,
        timestamp: new Date().toISOString()
      }));
    }

    // CRITICAL: Always show feedback to user - User must know if progress was saved
    // This toast will ALWAYS appear, ensuring user knows their progress status
    if (!lastError) {
      // Success - show success message (this should ALWAYS appear if save succeeded)
      toast.success('✅ Progress saved!', {
        duration: 3000,
        position: 'top-center'
      });
    } else {
      // Failed after all retries - show error but inform about local backup
      console.error('Failed to save after all retries:', lastError);
      toast.error('⚠️ Progress saved locally only', {
        duration: 5000,
        position: 'top-center',
        description: 'Unable to save to server. Progress is saved locally and will sync on next login.'
      });
      // Re-throw error so caller knows it failed (but local state is already updated)
      throw lastError;
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