import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { AuthContextType } from '../App';
import { challenges, Question } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Trophy, CheckCircle2, XCircle, ChevronLeft, Brain, Save } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

type ExerciseDetailPageProps = {
  authContext: AuthContextType;
};

type Answer = {
  questionId: string;
  selectedOptionId: string;
};

const difficultyColors = {
  Easy: 'bg-green-100 text-green-700 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Hard: 'bg-red-100 text-red-700 border-red-200'
};

export function ExerciseDetailPage({ authContext }: ExerciseDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const challenge = challenges.find(c => c.id === id);

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [attemptKey, setAttemptKey] = useState(0); // Key to force RadioGroup re-render
  const [draftSaved, setDraftSaved] = useState(false);

  // Load draft answers from localStorage on mount
  useEffect(() => {
    if (!challenge) return;
    
    const draftKey = `exercise-draft-${challenge.id}`;
    const savedDraft = localStorage.getItem(draftKey);
    
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setAnswers(draft.answers || []);
        toast.info('Your previous progress has been restored!');
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [challenge?.id]);

  // Save draft answers to localStorage whenever they change
  useEffect(() => {
    if (!challenge || answers.length === 0 || isSubmitted) return;
    
    const draftKey = `exercise-draft-${challenge.id}`;
    const draft = {
      answers,
      timestamp: Date.now()
    };
    
    localStorage.setItem(draftKey, JSON.stringify(draft));
    setDraftSaved(true);
    
    // Hide the "saved" indicator after 2 seconds
    const timer = setTimeout(() => setDraftSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [answers, challenge?.id, isSubmitted]);

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation authContext={authContext} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl text-gray-900 mb-4">Exercise not found</h1>
            <Button onClick={() => navigate('/challenges')}>Back to Exercises</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingIndex] = { questionId, selectedOptionId: optionId };
        return newAnswers;
      }
      return [...prev, { questionId, selectedOptionId: optionId }];
    });
  };

  const handleSubmit = () => {
    if (answers.length < challenge.questions.length) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    let totalScore = 0;
    challenge.questions.forEach(question => {
      const answer = answers.find(a => a.questionId === question.id);
      if (answer) {
        const selectedOption = question.options.find(o => o.id === answer.selectedOptionId);
        if (selectedOption?.isCorrect) {
          totalScore += question.points;
        }
      }
    });

    setScore(totalScore);
    setIsSubmitted(true);
    
    // Save the completed challenge
    authContext.saveCompletedChallenge(challenge.id, totalScore, challenge.totalPoints);
    
    // Clear the draft from localStorage since exercise is completed
    const draftKey = `exercise-draft-${challenge.id}`;
    localStorage.removeItem(draftKey);
    
    const percentage = (totalScore / challenge.totalPoints) * 100;
    if (percentage === 100) {
      toast.success(`Perfect score! You got ${totalScore}/${challenge.totalPoints} points!`);
    } else if (percentage >= 70) {
      toast.success(`Great job! You scored ${totalScore}/${challenge.totalPoints} points!`);
    } else {
      toast.info(`You scored ${totalScore}/${challenge.totalPoints} points. Keep practicing!`);
    }

    // Scroll to top to see results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setAnswers([]);
    setIsSubmitted(false);
    setScore(0);
    setAttemptKey(prev => prev + 1); // Force RadioGroup to remount with new key
    
    // Clear the draft from localStorage when retrying
    const draftKey = `exercise-draft-${challenge.id}`;
    localStorage.removeItem(draftKey);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getQuestionResult = (question: Question): 'correct' | 'incorrect' | 'unanswered' => {
    if (!isSubmitted) return 'unanswered';
    
    const answer = answers.find(a => a.questionId === question.id);
    if (!answer) return 'unanswered';
    
    const selectedOption = question.options.find(o => o.id === answer.selectedOptionId);
    return selectedOption?.isCorrect ? 'correct' : 'incorrect';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation authContext={authContext} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/challenges">Exercises</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{challenge.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/challenges')}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                    <Badge variant="outline" className={difficultyColors[challenge.difficulty]}>
                      {challenge.difficulty}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {challenge.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                  <p className="text-gray-600 mt-2">{challenge.description}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg text-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm text-blue-600">Total Points</div>
                  <div className="text-2xl text-blue-900">{challenge.totalPoints}</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Score Display (if submitted) */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg text-blue-900 mb-1">Your Score</h3>
                      <div className="text-4xl text-blue-900">
                        {score} / {challenge.totalPoints}
                      </div>
                      <div className="text-sm text-blue-600 mt-1">
                        {((score / challenge.totalPoints) * 100).toFixed(0)}% Correct
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleRetry} variant="outline">
                        Try Again
                      </Button>
                      <Button onClick={() => navigate('/challenges')}>
                        Back to Exercises
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {challenge.questions.map((question, index) => {
            const result = getQuestionResult(question);
            const answer = answers.find(a => a.questionId === question.id);
            
            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card className={`${
                  isSubmitted
                    ? result === 'correct'
                      ? 'border-green-300 bg-green-50'
                      : result === 'incorrect'
                      ? 'border-red-300 bg-red-50'
                      : ''
                    : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                            {index + 1}
                          </div>
                          <h3 className="text-lg text-gray-900">{question.question}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {question.points} pts
                        </Badge>
                        {isSubmitted && result === 'correct' && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                        {isSubmitted && result === 'incorrect' && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      key={attemptKey}
                      value={answer?.selectedOptionId}
                      onValueChange={(value) => handleAnswerChange(question.id, value)}
                      disabled={isSubmitted}
                      className="space-y-3"
                    >
                      {question.options.map((option) => {
                        const isSelected = answer?.selectedOptionId === option.id;
                        const showCorrect = isSubmitted && option.isCorrect;
                        const showIncorrect = isSubmitted && isSelected && !option.isCorrect;
                        
                        return (
                          <div
                            key={option.id}
                            onClick={() => !isSubmitted && handleAnswerChange(question.id, option.id)}
                            className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                              showCorrect
                                ? 'border-green-400 bg-green-50'
                                : showIncorrect
                                ? 'border-red-400 bg-red-50'
                                : isSelected
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            } ${!isSubmitted ? 'cursor-pointer' : ''}`}
                          >
                            <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                            <Label
                              htmlFor={`${question.id}-${option.id}`}
                              className="flex-1 cursor-pointer"
                            >
                              {option.text}
                            </Label>
                            {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                            {showIncorrect && <XCircle className="w-5 h-5 text-red-600" />}
                          </div>
                        );
                      })}
                    </RadioGroup>

                    {/* Show explanation after submission */}
                    {isSubmitted && question.explanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex items-start gap-2">
                          <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm text-blue-900 mb-1">Explanation</div>
                            <div className="text-sm text-blue-700">{question.explanation}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Submit Button */}
        {!isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="sticky bottom-4"
          >
            <Card className="bg-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600">
                      {answers.length} of {challenge.questions.length} questions answered
                    </div>
                    {answers.length > 0 && (
                      <AnimatePresence>
                        {draftSaved && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded"
                          >
                            <Save className="w-3 h-3" />
                            <span>Progress saved</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                  <Button
                    onClick={handleSubmit}
                    size="lg"
                    disabled={answers.length < challenge.questions.length}
                    className="min-w-[200px]"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Submit Answers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
