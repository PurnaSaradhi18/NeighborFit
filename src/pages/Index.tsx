
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, Users, TrendingUp, Star, ArrowRight, Instagram, Linkedin, Github, User, LogOut } from "lucide-react";
import LifestyleQuiz from "@/components/LifestyleQuiz";
import NeighborhoodResults from "@/components/NeighborhoodResults";
import { calculateNeighborhoodMatch } from "@/utils/matchingAlgorithm";
import { neighborhoods } from "@/data/neighborhoods";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export interface UserPreferences {
  priorities: string[];
  budget: string;
  lifestyle: string;
  commute: string;
  familyStatus: string;
  interests: string[];
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'quiz' | 'results'>('landing');
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [matchedNeighborhoods, setMatchedNeighborhoods] = useState<any[]>([]);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users away from auth page if they somehow end up there
  useEffect(() => {
    if (user && currentStep === 'landing') {
      // User is authenticated, they can use the app normally
    }
  }, [user, currentStep]);

  const handleQuizComplete = (preferences: UserPreferences) => {
    setUserPreferences(preferences);

    // Calculate matches using our algorithm
    const matches = neighborhoods.map(neighborhood => ({
      ...neighborhood,
      matchScore: calculateNeighborhoodMatch(neighborhood, preferences)
    })).sort((a, b) => b.matchScore - a.matchScore);
    setMatchedNeighborhoods(matches);
    setCurrentStep('results');
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentStep('landing');
    setUserPreferences(null);
    setMatchedNeighborhoods([]);
  };

  const features = [{
    icon: MapPin,
    title: "Real Neighborhood Data",
    description: "Access comprehensive data on safety, amenities, and demographics"
  }, {
    icon: Heart,
    title: "Lifestyle Matching",
    description: "Algorithm considers your personal preferences and lifestyle needs"
  }, {
    icon: Users,
    title: "Community Insights",
    description: "Understand the local culture and community dynamics"
  }, {
    icon: TrendingUp,
    title: "Market Trends",
    description: "Stay informed about property values and neighborhood growth"
  }];

  if (currentStep === 'quiz') {
    return <LifestyleQuiz onComplete={handleQuizComplete} />;
  }

  if (currentStep === 'results') {
    return <NeighborhoodResults neighborhoods={matchedNeighborhoods} preferences={userPreferences!} onStartOver={() => setCurrentStep('landing')} />;
  }

  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              NeighborFit
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
            {loading ? (
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.email?.split('@')[0]}</span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
            🏠 Find Your Perfect Neighborhood
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent leading-tight">
            Discover Neighborhoods That Match Your Lifestyle
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Use our data-driven matching algorithm to find neighborhoods that align with your priorities, 
            budget, and lifestyle preferences. Make informed decisions about where to call home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-6 text-lg group" 
              onClick={() => user ? setCurrentStep('quiz') : navigate('/auth')}
            >
              {user ? 'Start Matching' : 'Sign In to Start'}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
              View Sample Results
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose NeighborFit?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform combines real-world data with sophisticated algorithms to provide 
            personalized neighborhood recommendations.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/60 backdrop-blur-sm border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>)}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white/60 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to find your perfect neighborhood match
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[{
            step: "01",
            title: "Take the Quiz",
            description: "Tell us about your lifestyle, priorities, and preferences through our comprehensive questionnaire."
          }, {
            step: "02",
            title: "Get Matched",
            description: "Our algorithm analyzes real neighborhood data to find areas that align with your criteria."
          }, {
            step: "03",
            title: "Explore Results",
            description: "Browse your personalized matches with detailed insights and data visualizations."
          }].map((item, index) => <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Neighborhood?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who have found their ideal home location using NeighborFit's 
            data-driven approach.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-6 text-lg" 
            onClick={() => user ? setCurrentStep('quiz') : navigate('/auth')}
          >
            {user ? 'Get Started Now' : 'Sign Up to Get Started'}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">NeighborFit</span>
          </div>
          
          {/* Social Media Links */}
          <div className="flex justify-center space-x-6 mb-6">
            <a 
              href="https://www.instagram.com/me_purna_18/?hl=en" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a 
              href="https://www.linkedin.com/in/purna-chinthapalli18122003/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href="https://github.com/PurnaSaradhi18" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
          
          <div className="text-center text-gray-400">
            <p>Helping you find your perfect neighborhood with data-driven insights.</p>
            <p>© 2025 NeighborFit. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};

export default Index;
