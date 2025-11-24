export type SoilType = 'clayey' | 'loamy' | 'sandy' | 'black' | 'red';
export type SuitabilityLevel = 'high' | 'medium' | 'low';

export interface CropSuggestionInput {
  soilType: SoilType;
  season: string;
  location: string;
  moisture: number;
}

export interface CropRecommendation {
  crop: string;
  suitability: SuitabilityLevel;
  expectedYield: string;
  estimatedCost: string;
  reason: string;
}

export interface CropSuggestionResult {
  recommendations: CropRecommendation[];
  analysis: string;
}
