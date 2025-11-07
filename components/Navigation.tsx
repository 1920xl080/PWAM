import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Trophy, LayoutDashboard, LogOut, Home } from 'lucide-react';
import { Button } from './ui/button';
import { AuthContextType } from '../App';
import { motion } from 'framer-motion';

type NavigationProps = {
  authContext: AuthContextType;
};

export function Navigation({ authContext }: NavigationProps) {
  const location = useLocation();
  const { user, logout } = authContext;

  const isActive = (path: string) => location.pathname === path;

  const navLinks: { path: string; label: string; icon: any }[] = [
    { path: '/', label: 'Home', icon: Home }
  ];

  if (user) {
    navLinks.push({ path: '/challenges', label: 'Exercises', icon: Trophy });
    navLinks.push({ path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard });
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 flex-wrap gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <motion.div 
              className="bg-blue-600 p-2 rounded-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-gray-900">Virtual Lab</span>
              <span className="text-xs text-gray-500">ITB Computational Thinking</span>
            </div>
          </Link>

          {/* Navigation - Same on all screen sizes */}
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                    isActive(link.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons - Same on all screen sizes */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {user ? (
              <>
                <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Hello, {user.name}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={authContext.isLoggingOut}
                  onClick={async () => {
                    if (authContext.isLoggingOut) return;
                    try {
                      await logout();
                    } catch (error) {
                      console.error('Logout error:', error);
                    }
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {authContext.isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
