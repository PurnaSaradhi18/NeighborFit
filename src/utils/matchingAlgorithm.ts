
import { UserPreferences } from "@/pages/Index";

export interface Neighborhood {
  id: number;
  name: string;
  city: string;
  state: string;
  safetyScore: number;
  walkabilityScore: number;
  schoolRating: number;
  medianRent: number;
  transitScore: number;
  amenities: string[];
  nightlifeScore: number;
  parksScore: number;
  diversityScore: number;
  jobOpportunities: number;
  demographics: {
    averageAge: number;
    familyFriendly: number;
    diversity: number;
  };
  highlights: string[];
}

export const calculateNeighborhoodMatch = (
  neighborhood: Neighborhood, 
  preferences: UserPreferences
): number => {
  let totalScore = 0;
  let maxPossibleScore = 0;

  // Priority-based scoring (heaviest weight)
  if (preferences.priorities) {
    preferences.priorities.forEach(priority => {
      maxPossibleScore += 25; // Each priority worth 25 points
      
      switch (priority) {
        case 'Safety & Low Crime':
          totalScore += neighborhood.safetyScore * 2.5;
          break;
        case 'Good Schools':
          totalScore += neighborhood.schoolRating * 2.5;
          break;
        case 'Public Transportation':
          totalScore += (neighborhood.transitScore / 100) * 25;
          break;
        case 'Walkability':
          totalScore += (neighborhood.walkabilityScore / 100) * 25;
          break;
        case 'Nightlife & Entertainment':
          totalScore += neighborhood.nightlifeScore * 2.5;
          break;
        case 'Parks & Recreation':
          totalScore += neighborhood.parksScore * 2.5;
          break;
        case 'Affordable Housing':
          // Inverse scoring - lower rent = higher score
          const affordabilityScore = Math.max(0, 10 - (neighborhood.medianRent / 1000));
          totalScore += affordabilityScore * 2.5;
          break;
        case 'Cultural Diversity':
          totalScore += neighborhood.diversityScore * 2.5;
          break;
        case 'Job Opportunities':
          totalScore += neighborhood.jobOpportunities * 2.5;
          break;
        default:
          totalScore += 15; // Default moderate score
      }
    });
  }

  // Budget compatibility (20 points max)
  maxPossibleScore += 20;
  if (preferences.budget) {
    const budgetScore = calculateBudgetMatch(neighborhood.medianRent, preferences.budget);
    totalScore += budgetScore;
  }

  // Lifestyle compatibility (15 points max)
  maxPossibleScore += 15;
  if (preferences.lifestyle) {
    const lifestyleScore = calculateLifestyleMatch(neighborhood, preferences.lifestyle);
    totalScore += lifestyleScore;
  }

  // Family status alignment (10 points max)
  maxPossibleScore += 10;
  if (preferences.familyStatus) {
    const familyScore = calculateFamilyMatch(neighborhood, preferences.familyStatus);
    totalScore += familyScore;
  }

  // Interest alignment (10 points max)
  maxPossibleScore += 10;
  if (preferences.interests && preferences.interests.length > 0) {
    const interestScore = calculateInterestMatch(neighborhood, preferences.interests);
    totalScore += interestScore;
  }

  // Convert to percentage and ensure it's between 0-100
  const matchPercentage = Math.min(100, Math.max(0, (totalScore / maxPossibleScore) * 100));
  
  return Math.round(matchPercentage);
};

const calculateBudgetMatch = (medianRent: number, budgetRange: string): number => {
  const budgetRanges = {
    'Under $1,500/month': { min: 0, max: 1500 },
    '$1,500 - $2,500/month': { min: 1500, max: 2500 },
    '$2,500 - $4,000/month': { min: 2500, max: 4000 },
    '$4,000 - $6,000/month': { min: 4000, max: 6000 },
    'Over $6,000/month': { min: 6000, max: Infinity }
  };

  const range = budgetRanges[budgetRange as keyof typeof budgetRanges];
  if (!range) return 10;

  if (medianRent >= range.min && medianRent <= range.max) {
    return 20; // Perfect match
  } else if (Math.abs(medianRent - range.min) <= 500 || Math.abs(medianRent - range.max) <= 500) {
    return 15; // Close match
  } else {
    return 5; // Poor match
  }
};

const calculateLifestyleMatch = (neighborhood: Neighborhood, lifestyle: string): number => {
  switch (lifestyle) {
    case 'Urban Professional - Love city energy':
      return (neighborhood.transitScore / 100) * 5 + neighborhood.nightlifeScore * 1.5;
    case 'Suburban Family - Prefer quiet communities':
      return neighborhood.demographics.familyFriendly * 1.5 + neighborhood.schoolRating * 1.5;
    case 'Young Professional - Active social life':
      return neighborhood.nightlifeScore * 2 + (neighborhood.walkabilityScore / 100) * 5;
    case 'Retiree - Seeking peaceful environment':
      return neighborhood.safetyScore * 1.5 + neighborhood.parksScore * 1.5;
    case 'Student - Budget-conscious, social':
      const affordability = Math.max(0, 10 - (neighborhood.medianRent / 800));
      return affordability + neighborhood.nightlifeScore;
    default:
      return 10;
  }
};

const calculateFamilyMatch = (neighborhood: Neighborhood, familyStatus: string): number => {
  switch (familyStatus) {
    case 'Single, no children':
      return neighborhood.nightlifeScore + (neighborhood.walkabilityScore / 100) * 5;
    case 'Couple, no children':
      return (neighborhood.safetyScore + neighborhood.nightlifeScore) / 2 * 2;
    case 'Young family with children':
      return neighborhood.schoolRating + neighborhood.demographics.familyFriendly;
    case 'Family with teenagers':
      return neighborhood.schoolRating * 1.2 + neighborhood.safetyScore * 0.8;
    case 'Empty nesters':
      return neighborhood.safetyScore + neighborhood.parksScore;
    default:
      return 7;
  }
};

const calculateInterestMatch = (neighborhood: Neighborhood, interests: string[]): number => {
  let score = 0;
  const maxScore = Math.min(10, interests.length * 2);

  interests.forEach(interest => {
    switch (interest) {
      case 'Outdoor Activities':
        score += neighborhood.parksScore * 0.5;
        break;
      case 'Arts & Culture':
        score += neighborhood.diversityScore * 0.4;
        break;
      case 'Fitness & Sports':
        score += neighborhood.parksScore * 0.4;
        break;
      case 'Food & Dining':
        score += neighborhood.nightlifeScore * 0.4;
        break;
      case 'Music & Concerts':
        score += neighborhood.nightlifeScore * 0.5;
        break;
      case 'Shopping':
        score += (neighborhood.walkabilityScore / 100) * 2;
        break;
      case 'Community Events':
        score += neighborhood.demographics.familyFriendly * 0.4;
        break;
      case 'Nightlife':
        score += neighborhood.nightlifeScore * 0.6;
        break;
      case 'Reading & Libraries':
        score += neighborhood.schoolRating * 0.3;
        break;
      case 'Technology & Innovation':
        score += neighborhood.jobOpportunities * 0.4;
        break;
      default:
        score += 1;
    }
  });

  return Math.min(maxScore, score);
};
