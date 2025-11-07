import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { AuthContextType } from '../App';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { GraduationCap, Chrome, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';

type AuthPageProps = {
  authContext: AuthContextType;
};

export function AuthPage({ authContext }: AuthPageProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (isLoading) return; // ✅ Prevents multiple clicks
    setIsLoading(true);

    try {
      const success = await authContext.loginWithGoogle();
      if (success) {
        navigate('/dashboard');
      } else {
        toast.error('Login failed. Please use a valid STEI ITB student email (@std.stei.itb.ac.id)');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation authContext={authContext} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            {/* Logo and Welcome */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <GraduationCap className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-4xl text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-lg text-gray-600">Sign in to continue your learning journey</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl">Sign in to your account</CardTitle>
                  <CardDescription className="text-base">
                    Use your STEI ITB student Google account to access the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={handleGoogleLogin} 
                      className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 hover:border-blue-400 transition-all shadow-md hover:shadow-lg"
                      disabled={isLoading}
                      size="lg"
                    >
                      <Chrome className="w-6 h-6 mr-3" />
                      <span className="text-base">
                        {isLoading ? 'Signing in...' : 'Sign in with Google'}
                      </span>
                    </Button>
                  </motion.div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-5">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-900 mb-1">
                          <strong>Secure Authentication</strong>
                        </p>
                        <p className="text-sm text-blue-800">
                          Only STEI ITB student accounts (@std.stei.itb.ac.id) are allowed to access this platform.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-xs text-gray-500 pt-2">
                    <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Right Side - Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            {/* Hero Image */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1716625862188-f421d41bfb66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5kdW5nJTIwaW5kb25lc2lhJTIwY2FtcHVzfGVufDF8fHx8MTc2MTY0ODMzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Institut Teknologi Bandung campus"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}