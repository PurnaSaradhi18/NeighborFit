
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { UserPreferences } from "@/pages/Index";

interface LifestyleQuizProps {
  onComplete: (preferences: UserPreferences) => void;
}

const LifestyleQuiz = ({ onComplete }: LifestyleQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserPreferences>>({
    priorities: [],
    interests: []
  });

  const questions = [
    {
      id: 'priorities',
      title: 'What are your top priorities in a neighborhood?',
      subtitle: 'Select up to 3 that matter most to you',
      type: 'checkbox',
      options: [
        'Safety & Low Crime',
        'Good Schools',
        'Public Transportation',
        'Walkability',
        'Nightlife & Entertainment',
        'Parks & Recreation',
        'Affordable Housing',
        'Cultural Diversity',
        'Job Opportunities',
        'Shopping & Dining'
      ]
    },
    {
      id: 'budget',
      title: 'What\'s your housing budget range?',
      subtitle: 'This helps us filter appropriate neighborhoods',
      type: 'radio',
      options: [
        'Under $1,500/month',
        '$1,500 - $2,500/month',
        '$2,500 - $4,000/month',
        '$4,000 - $6,000/month',
        'Over $6,000/month'
      ]
    },
    {
      id: 'lifestyle',
      title: 'How would you describe your lifestyle?',
      subtitle: 'Choose the option that best fits you',
      type: 'radio',
      options: [
        'Urban Professional - Love city energy',
        'Suburban Family - Prefer quiet communities',
        'Young Professional - Active social life',
        'Retiree - Seeking peaceful environment',
        'Student - Budget-conscious, social'
      ]
    },
    {
      id: 'commute',
      title: 'How important is your commute?',
      subtitle: 'Consider your work and daily travel needs',
      type: 'radio',
      options: [
        'Very Important - Under 30 minutes',
        'Somewhat Important - Under 45 minutes',
        'Flexible - Under 60 minutes',
        'Not Important - Work remotely'
      ]
    },
    {
      id: 'familyStatus',
      title: 'What\'s your family situation?',
      subtitle: 'This affects school districts and amenities',
      type: 'radio',
      options: [
        'Single, no children',
        'Couple, no children',
        'Young family with children',
        'Family with teenagers',
        'Empty nesters'
      ]
    },
    {
      id: 'interests',
      title: 'What activities do you enjoy?',
      subtitle: 'Select all that apply',
      type: 'checkbox',
      options: [
        'Outdoor Activities',
        'Arts & Culture',
        'Fitness & Sports',
        'Food & Dining',
        'Music & Concerts',
        'Shopping',
        'Community Events',
        'Nightlife',
        'Reading & Libraries',
        'Technology & Innovation'
      ]
    }
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(answers as UserPreferences);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const isAnswered = () => {
    const question = questions[currentQuestion];
    const answer = answers[question.id as keyof UserPreferences];
    
    if (question.type === 'checkbox') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return !!answer;
  };

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              NeighborFit
            </span>
          </div>
          <Badge variant="outline" className="bg-white/60">
            {currentQuestion + 1} of {questions.length}
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{question.title}</h2>
            <p className="text-gray-600">{question.subtitle}</p>
          </div>

          {question.type === 'radio' ? (
            <RadioGroup
              value={answers[question.id as keyof UserPreferences] as string}
              onValueChange={(value) => handleAnswer(question.id, value)}
              className="space-y-4"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                  <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id={`${question.id}-${index}`}
                    checked={(answers[question.id as keyof UserPreferences] as string[] || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const currentAnswers = (answers[question.id as keyof UserPreferences] as string[]) || [];
                      if (checked) {
                        const maxSelections = question.id === 'priorities' ? 3 : 10;
                        if (currentAnswers.length < maxSelections) {
                          handleAnswer(question.id, [...currentAnswers, option]);
                        }
                      } else {
                        handleAnswer(question.id, currentAnswers.filter(a => a !== option));
                      }
                    }}
                  />
                  <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
              {question.id === 'priorities' && (
                <p className="text-sm text-gray-500 mt-2">
                  Selected: {(answers.priorities || []).length}/3
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isAnswered()}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 flex items-center space-x-2"
          >
            <span>{currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LifestyleQuiz;
