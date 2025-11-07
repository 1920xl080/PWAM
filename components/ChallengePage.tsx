import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Navigation } from './Navigation';
import { AuthContextType } from '../App';
import { challenges } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Trophy, Brain, Target, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';

type ChallengePageProps = {
  authContext: AuthContextType;
};

const difficultyColors = {
  Easy: 'bg-green-100 text-green-700 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Hard: 'bg-red-100 text-red-700 border-red-200'
};

export function ChallengePage({ authContext }: ChallengePageProps) {
  const navigate = useNavigate();
  const { user } = authContext;

  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  const handleStartChallenge = (challengeId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/exercise/${challengeId}`);
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation authContext={authContext} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              className="bg-blue-600 p-3 rounded-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Trophy className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl text-gray-900">Computational Thinking Exercises</h1>
              <p className="text-gray-600">Test your knowledge with multiple-choice questions</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl text-gray-900">{challenges.length}</div>
                  <div className="text-sm text-gray-500">Total Exercises</div>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl text-gray-900">{challenges.filter(c => c.difficulty === 'Easy').length}</div>
                  <div className="text-sm text-gray-500">Easy</div>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Brain className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl text-gray-900">{challenges.filter(c => c.difficulty === 'Medium').length}</div>
                  <div className="text-sm text-gray-500">Medium</div>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <FileCode className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl text-gray-900">{challenges.filter(c => c.difficulty === 'Hard').length}</div>
                  <div className="text-sm text-gray-500">Hard</div>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <Badge 
                    variant="outline" 
                    className={difficultyColors[challenge.difficulty]}
                  >
                    {challenge.difficulty}
                  </Badge>
                </div>
                <CardDescription>{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Brain className="w-4 h-4" />
                    <span>{challenge.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Trophy className="w-4 h-4" />
                    <span>{challenge.questions.length} questions • {challenge.totalPoints} points</span>
                  </div>
                  <Button 
                    onClick={() => handleStartChallenge(challenge.id)}
                    className="w-full"
                  >
                    Start Exercise
                  </Button>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
