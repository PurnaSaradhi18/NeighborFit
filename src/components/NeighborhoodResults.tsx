
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { MapPin, Star, DollarSign, Users, Shield, GraduationCap, Car, ArrowLeft, Filter, Heart } from "lucide-react";
import { UserPreferences } from "@/pages/Index";

interface Neighborhood {
  id: number;
  name: string;
  city: string;
  state: string;
  matchScore: number;
  safetyScore: number;
  walkabilityScore: number;
  schoolRating: number;
  medianRent: number;
  transitScore: number;
  amenities: string[];
  demographics: {
    averageAge: number;
    familyFriendly: number;
    diversity: number;
  };
  highlights: string[];
}

interface NeighborhoodResultsProps {
  neighborhoods: Neighborhood[];
  preferences: UserPreferences;
  onStartOver: () => void;
}

const NeighborhoodResults = ({ neighborhoods, preferences, onStartOver }: NeighborhoodResultsProps) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  const [minMatchScore, setMinMatchScore] = useState([70]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredNeighborhoods = neighborhoods.filter(n => n.matchScore >= minMatchScore[0]);

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getMatchText = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                NeighborFit
              </span>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {filteredNeighborhoods.length} matches found
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
            <Button
              variant="outline"
              onClick={onStartOver}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Start Over</span>
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="border-t border-white/20 bg-white/60 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium">Min Match Score:</span>
                  <div className="w-32">
                    <Slider
                      value={minMatchScore}
                      onValueChange={setMinMatchScore}
                      max={100}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <span className="text-sm text-gray-600">{minMatchScore[0]}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Results Summary */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Your Neighborhood Matches</h1>
          <p className="text-gray-600 mb-4">
            Based on your preferences for <strong>{preferences.priorities?.join(', ')}</strong> and lifestyle as a <strong>{preferences.lifestyle}</strong>.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Neighborhoods List */}
          <div className="lg:col-span-2 space-y-6">
            {filteredNeighborhoods.map((neighborhood) => (
              <Card 
                key={neighborhood.id} 
                className={`p-6 cursor-pointer transition-all hover:shadow-lg bg-white/80 backdrop-blur-sm border-white/20 ${
                  selectedNeighborhood?.id === neighborhood.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedNeighborhood(neighborhood)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{neighborhood.name}</h3>
                    <p className="text-gray-600">{neighborhood.city}, {neighborhood.state}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getMatchColor(neighborhood.matchScore)}`}>
                      {neighborhood.matchScore}% Match
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{getMatchText(neighborhood.matchScore)}</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <Shield className="w-5 h-5 mx-auto mb-1 text-green-600" />
                    <div className="text-sm font-medium">{neighborhood.safetyScore}/10</div>
                    <div className="text-xs text-gray-500">Safety</div>
                  </div>
                  <div className="text-center">
                    <GraduationCap className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <div className="text-sm font-medium">{neighborhood.schoolRating}/10</div>
                    <div className="text-xs text-gray-500">Schools</div>
                  </div>
                  <div className="text-center">
                    <Car className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                    <div className="text-sm font-medium">{neighborhood.transitScore}/100</div>
                    <div className="text-xs text-gray-500">Transit</div>
                  </div>
                  <div className="text-center">
                    <DollarSign className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                    <div className="text-sm font-medium">${neighborhood.medianRent.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Median Rent</div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2">
                  {neighborhood.highlights.slice(0, 3).map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                      {highlight}
                    </Badge>
                  ))}
                  {neighborhood.highlights.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{neighborhood.highlights.length - 3} more
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Detailed View */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {selectedNeighborhood ? (
                <Card className="p-6 bg-white/90 backdrop-blur-sm border-white/20">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold">{selectedNeighborhood.name}</h3>
                    <p className="text-gray-600">{selectedNeighborhood.city}, {selectedNeighborhood.state}</p>
                    <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium mt-2 ${getMatchColor(selectedNeighborhood.matchScore)}`}>
                      {selectedNeighborhood.matchScore}% Match
                    </div>
                  </div>

                  {/* Detailed Scores */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Safety Score</span>
                        <span className="text-sm">{selectedNeighborhood.safetyScore}/10</span>
                      </div>
                      <Progress value={selectedNeighborhood.safetyScore * 10} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Walkability</span>
                        <span className="text-sm">{selectedNeighborhood.walkabilityScore}/100</span>
                      </div>
                      <Progress value={selectedNeighborhood.walkabilityScore} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">School Rating</span>
                        <span className="text-sm">{selectedNeighborhood.schoolRating}/10</span>
                      </div>
                      <Progress value={selectedNeighborhood.schoolRating * 10} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Transit Score</span>
                        <span className="text-sm">{selectedNeighborhood.transitScore}/100</span>
                      </div>
                      <Progress value={selectedNeighborhood.transitScore} className="h-2" />
                    </div>
                  </div>

                  {/* Demographics */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Demographics</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Average Age</div>
                        <div className="font-medium">{selectedNeighborhood.demographics.averageAge} years</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Family Score</div>
                        <div className="font-medium">{selectedNeighborhood.demographics.familyFriendly}/10</div>
                      </div>
                    </div>
                  </div>

                  {/* All Highlights */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Key Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNeighborhood.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="font-semibold mb-3">Nearby Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNeighborhood.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    <Heart className="w-4 h-4 mr-2" />
                    Save to Favorites
                  </Button>
                </Card>
              ) : (
                <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-white/20">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-semibold mb-2">Select a Neighborhood</h3>
                  <p className="text-gray-600 text-sm">Click on any neighborhood to see detailed information and scores.</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodResults;
