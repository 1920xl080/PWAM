import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Trophy, LayoutDashboard, LogOut, Menu, X, Home } from 'lucide-react';
import { Button } from './ui/button';
import { AuthContextType } from '../App';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type NavigationProps = {
  authContext: AuthContextType;
};

export function Navigation({ authContext }: NavigationProps) {
  const location = useLocation();
  const { user, logout } = authContext;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
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

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-600">Hello, {user.name}</span>
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden py-4 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
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
              {user ? (
                <button
                  disabled={authContext.isLoggingOut}
                  onClick={async () => {
                    if (authContext.isLoggingOut) return;
                    try {
                      setMobileMenuOpen(false);
                      await logout();
                    } catch (error) {
                      console.error('Logout error:', error);
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-4 h-4" />
                  {authContext.isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg text-center"
                >
                  Login
                </Link>
              )}
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
