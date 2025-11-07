import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';
import { AuthContextType } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BookOpen, Trophy, Target, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { challenges } from '../data/mockData';
import { motion } from 'framer-motion';

type DashboardPageProps = {
  authContext: AuthContextType;
};

const difficultyColors = {
  Easy: 'bg-green-100 text-green-700 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Hard: 'bg-red-100 text-red-700 border-red-200'
};

export function DashboardPage({ authContext }: DashboardPageProps) {
  const { user } = authContext;

  if (!user) return null;

  const totalChallenges = challenges.length;
  const completedChallenges = user.completedChallenges?.length || 0;
  const totalScore = user.completedChallenges?.reduce((sum, c) => sum + c.score, 0) || 0;
  const averageScore = completedChallenges > 0 ? Math.round(totalScore / completedChallenges) : 0;
  const progressPercentage = (completedChallenges / totalChallenges) * 100;

  // Get completed challenges details
  const completedChallengesDetails = user.completedChallenges?.map(cc => ({
    ...cc,
    challenge: challenges.find(c => c.id === cc.challengeId)
  })).filter(cc => cc.challenge) || [];

  // Calculate max possible score
  const maxPossibleScore = challenges.reduce((sum, c) => sum + c.totalPoints, 0);

  // Get remaining challenges
  const completedIds = user.completedChallenges?.map(c => c.challengeId) || [];
  const remainingChallenges = challenges.filter(c => !completedIds.includes(c.id));

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Navigation authContext={authContext} />

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 md:py-12 px-2 sm:px-4 overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div 
            className="flex items-center gap-3 md:gap-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Avatar className="w-12 h-12 md:w-16 md:h-16 border-4 border-white/20">
                <AvatarFallback className="bg-white text-blue-600 text-lg md:text-xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-3xl lg:text-4xl truncate">Welcome back, {user.name}!</h1>
              <p className="text-blue-100 text-sm md:text-base truncate">{user.email}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="px-2 sm:px-4 -mt-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
            <motion.div
              className="w-full min-w-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white w-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 whitespace-nowrap">Total Score</p>
                    <div className="text-2xl sm:text-3xl text-blue-600">{totalScore}</div>
                    <p className="text-xs text-gray-500 mt-1 truncate">of {maxPossibleScore} possible</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>

            <motion.div
              className="w-full min-w-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white w-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 whitespace-nowrap">Completed</p>
                    <div className="text-2xl sm:text-3xl text-green-600">{completedChallenges}</div>
                    <p className="text-xs text-gray-500 mt-1 truncate">of {totalChallenges} exercises</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>

            <motion.div
              className="w-full min-w-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white w-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 whitespace-nowrap">Average Score</p>
                    <div className="text-2xl sm:text-3xl text-purple-600">{averageScore}%</div>
                    <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">per exercise</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>

            <motion.div
              className="w-full min-w-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white w-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 whitespace-nowrap">Remaining</p>
                    <div className="text-2xl sm:text-3xl text-orange-600">{remainingChallenges.length}</div>
                    <p className="text-xs text-gray-500 mt-1 truncate">exercises to complete</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-2 sm:px-4 py-6 md:py-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full">
            {/* Left Column - Progress */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6 min-w-0">
              {/* Overall Progress */}
              <motion.div
                className="w-full min-w-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="w-full">
                <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Target className="w-4 h-4 md:w-5 md:h-5" />
                    Overall Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="space-y-3 md:space-y-4 w-full">
                    <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                      <span className="text-gray-600">Exercises Completed</span>
                      <span className="text-gray-900 whitespace-nowrap">{completedChallenges} / {totalChallenges}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <p className="text-xs sm:text-sm text-gray-500">
                      {progressPercentage.toFixed(1)}% complete - Keep up the great work!
                    </p>
                  </div>
                </CardContent>
              </Card>
              </motion.div>

              {/* Recent Submissions */}
              <motion.div
                className="w-full min-w-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="w-full overflow-hidden">
                <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      <Trophy className="w-4 h-4 md:w-5 md:h-5" />
                      Recent Submissions
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="overflow-hidden px-4 sm:px-6">
                  {completedChallengesDetails.length > 0 ? (
                    <div className="overflow-x-auto -mx-4 sm:-mx-6">
                      <div className="min-w-[600px] px-4 sm:px-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[35%] min-w-[140px]">Exercise</TableHead>
                              <TableHead className="w-[20%] min-w-[90px]">Difficulty</TableHead>
                              <TableHead className="w-[20%] min-w-[80px]">Score</TableHead>
                              <TableHead className="w-[25%] min-w-[100px]">Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {completedChallengesDetails.slice().reverse().map((item) => (
                              <TableRow key={item.challengeId}>
                                <TableCell className="py-3">
                                  <div className="max-w-[200px]">
                                    <div className="text-gray-900 truncate text-sm">{item.challenge?.title}</div>
                                    <div className="text-xs text-gray-500 truncate">{item.challenge?.category}</div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-3">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${item.challenge ? difficultyColors[item.challenge.difficulty] : ''}`}
                                  >
                                    {item.challenge?.difficulty}
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-3">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-sm ${item.score === 100 ? 'text-green-600' : 'text-gray-900'}`}>
                                      {item.score}/100
                                    </span>
                                    {item.score === 100 && (
                                      <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                      >
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                      </motion.div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="py-3 text-xs text-gray-500">
                                  {new Date(item.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No submissions yet</p>
                      <p className="text-sm mt-1">Start solving exercises to see your progress here!</p>
                      <Link to="/challenges">
                        <Button className="mt-4">
                          Browse Exercises
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              </motion.div>
            </div>

            {/* Right Column - Quick Actions & Recommendations */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6 min-w-0">
              {/* Quick Actions */}
              <motion.div
                className="w-full min-w-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="w-full">
                <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
                  <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-4 sm:px-6">
                  <Link to="/challenges" className="block">
                    <Button className="w-full justify-center" variant="default">
                      <Trophy className="w-4 h-4 mr-2" />
                      <span className="truncate">Browse All Exercises</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              </motion.div>

              {/* Performance by Difficulty */}
              <motion.div
                className="w-full min-w-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Card className="w-full">
                <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
                  <CardTitle className="text-base md:text-lg">Performance by Difficulty</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 px-4 sm:px-6">
                  <div className="w-full">
                  {['Easy', 'Medium', 'Hard'].map((difficulty) => {
                    const diffChallenges = challenges.filter(c => c.difficulty === difficulty);
                    const completed = completedChallengesDetails.filter(
                      cc => cc.challenge?.difficulty === difficulty
                    ).length;
                    const percentage = diffChallenges.length > 0 
                      ? (completed / diffChallenges.length) * 100 
                      : 0;
                    
                    return (
                      <div key={difficulty} className="w-full">
                        <div className="flex items-center justify-between text-xs sm:text-sm mb-2 gap-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}
                          >
                            {difficulty}
                          </Badge>
                          <span className="text-gray-600 whitespace-nowrap">{completed} / {diffChallenges.length}</span>
                        </div>
                        <Progress value={percentage} className="h-2 w-full" />
                      </div>
                    );
                  })}
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
