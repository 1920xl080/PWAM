import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { ChallengePage } from './components/ChallengePage';
import { ExerciseDetailPage } from './components/ExerciseDetailPage';
import { AuthPage } from './components/AuthPage';
import { DashboardPage } from './components/DashboardPage';
import { SplashScreen } from './components/SplashScreen';
import { Toaster } from './components/ui/sonner';
import { AnimatePresence } from 'motion/react';

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
  logout: () => void;
};

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

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    // Mock Google OAuth flow - in real app, this would use Google OAuth
    // Simulating Google login popup
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate user selecting their Google account
        // For demo purposes, we'll randomly select a valid or invalid email
        const mockGoogleEmails = [
          { name: 'Ahmad Pratama', email: 'ahmad.pratama@std.stei.itb.ac.id', valid: true },
          { name: 'Siti Nurhaliza', email: 'siti.nurhaliza@std.stei.itb.ac.id', valid: true },
          { name: 'Invalid User', email: 'user@gmail.com', valid: false }
        ];
        
        // For demo, let's always use the first valid email
        // In real implementation, this would be from Google OAuth
        const selectedAccount = mockGoogleEmails[0];
        
        // Validate email domain
        if (!selectedAccount.email.endsWith('@std.stei.itb.ac.id')) {
          resolve(false);
          return;
        }
        
        const mockUser: User = {
          id: '1',
          name: selectedAccount.name,
          email: selectedAccount.email,
          role: 'student',
          enrolledClasses: ['IF-101', 'IF-102', 'IF-201'],
          completedChallenges: [
            { challengeId: '1', score: 100, date: '2025-10-20' },
            { challengeId: '2', score: 85, date: '2025-10-22' },
            { challengeId: '3', score: 90, date: '2025-10-25' }
          ]
        };
        
        setUser(mockUser);
        localStorage.setItem('virtualLabUser', JSON.stringify(mockUser));
        resolve(true);
      }, 1000); // Simulate network delay
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('virtualLabUser');
  };

  const authContext: AuthContextType = { user, loginWithGoogle, logout };

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      <Router>
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<HomePage authContext={authContext} />} />
            <Route 
              path="/challenges" 
              element={user ? <ChallengePage authContext={authContext} /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/exercise/:id" 
              element={user ? <ExerciseDetailPage authContext={authContext} /> : <Navigate to="/auth" />} 
            />
            <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage authContext={authContext} />} />
            <Route 
              path="/dashboard" 
              element={user ? <DashboardPage authContext={authContext} /> : <Navigate to="/auth" />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </>
  );
}
