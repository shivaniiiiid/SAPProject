import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { AIRecommendations } from '@/types/agriculture';
import { FunctionsHttpError } from '@supabase/supabase-js';
import OpenAI from 'openai';

interface RecommendationRequest {
  cropType: string;
  soilType: string;
  area?: number;
  season?: string;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Real ML Model: AI Recommendations using OpenAI
async function getMLRecommendations(request: RecommendationRequest): Promise<AIRecommendations> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `You are an expert agricultural advisor. Provide comprehensive farming recommendations:

Crop: ${request.cropType}
Soil Type: ${request.soilType}
Area: ${request.area || 'not specified'} hectares
Season: ${request.season || 'current'}

Return ONLY valid JSON with this structure:
{
  "fertilizerRecommendations": {
    "nitrogen": {"amount": number, "unit": "kg/ha", "timing": "string"},
    "phosphorus": {"amount": number, "unit": "kg/ha", "timing": "string"},
    "potassium": {"amount": number, "unit": "kg/ha", "timing": "string"},
    "micronutrients": ["nutrient1", "nutrient2"]
  },
  "pestManagement": {
    "commonPests": ["pest1", "pest2"],
    "preventiveMeasures": ["measure1", "measure2"],
    "treatmentOptions": ["option1", "option2"]
  },
  "irrigationPlan": {
    "frequency": "times per week",
    "waterAmount": "mm per irrigation",
    "bestTime": "morning/evening",
    "soilMoistureTarget": "percentage"
  },
  "seasonalTips": ["tip1", "tip2"],
  "yieldPrediction": {
    "expectedYield": number,
    "unit": "kg/ha",
    "factors": ["factor1", "factor2"]
  }
}`
        }
      ],
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error('ML Recommendations Error:', error);
    throw new Error('Failed to get ML recommendations');
  }
}

export function useAIRecommendations() {
  return useMutation({
    mutationFn: async (request: RecommendationRequest): Promise<AIRecommendations> => {
      // Try ML model first
      try {
        return await getMLRecommendations(request);
      } catch (mlError) {
        console.warn('ML model failed, falling back to Edge Functions:', mlError);
        // Fallback to Supabase Edge Functions
        const { data, error } = await supabase.functions.invoke('ai-recommendations', {
          body: request,
        });

        if (error) {
          let errorMessage = error.message;
          if (error instanceof FunctionsHttpError) {
            try {
              const statusCode = error.context?.status ?? 500;
              const textContent = await error.context?.text();
              errorMessage = `[Code: ${statusCode}] ${textContent || error.message || 'Unknown error'}`;
            } catch {
              errorMessage = `${error.message || 'Failed to get AI recommendations'}`;
            }
          }
          throw new Error(errorMessage);
        }

        return data as AIRecommendations;
      }
    },
  });
}
