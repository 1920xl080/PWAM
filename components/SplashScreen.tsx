import { motion } from 'framer-motion';
import { GraduationCap, Cpu, Lightbulb } from 'lucide-react';

type SplashScreenProps = {
  onComplete: () => void;
};

export function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Rotating Geometric Shapes */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 border-4 border-white/20 rounded-lg"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 border-4 border-white/20 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-40 right-40 w-16 h-16 border-4 border-white/20"
        style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        {/* Logo Animation */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
        >
          <motion.div
            className="w-24 h-24 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-2xl"
            animate={{ 
              boxShadow: [
                '0 20px 60px rgba(255,255,255,0.3)',
                '0 20px 60px rgba(255,255,255,0.6)',
                '0 20px 60px rgba(255,255,255,0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <GraduationCap className="w-12 h-12 text-blue-600" />
          </motion.div>
        </motion.div>

        {/* Floating Icons */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="absolute -left-8 top-1/2 -translate-y-1/2"
            animate={{ 
              x: [0, -10, 0],
              rotate: [0, -5, 0, 5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.7 }}
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Cpu className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          <motion.div
            className="absolute -right-8 top-1/2 -translate-y-1/2"
            animate={{ 
              x: [0, 10, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.9 }}
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        </motion.div>

        {/* Title Animation */}
        <motion.h1
          className="text-5xl md:text-6xl text-white mb-4 mt-32"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Virtual Lab
        </motion.h1>

        <motion.div
          className="text-xl md:text-2xl text-blue-100 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Computational Thinking ITB
        </motion.div>

        <motion.div
          className="text-sm md:text-base text-blue-200/80 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Interactive Learning Platform
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mt-8 w-64 h-1 mx-auto bg-white/20 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.5, delay: 1.5, ease: 'easeInOut' }}
            onAnimationComplete={onComplete}
          />
        </motion.div>
      </div>

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-full"
          style={{
            background: 'linear-gradient(to top, rgba(255,255,255,0.1) 0%, transparent 100%)',
          }}
          animate={{
            x: [0, 100, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </motion.div>
  );
}
