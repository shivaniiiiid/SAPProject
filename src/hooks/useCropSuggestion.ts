import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CropSuggestionInput, CropSuggestionResult } from '@/types/cropSuggestion';
import { Language } from '@/contexts/LanguageContext';
import { FunctionsHttpError } from '@supabase/supabase-js';

export function useCropSuggestion(language: Language) {
  return useMutation({
    mutationFn: async (input: CropSuggestionInput): Promise<CropSuggestionResult> => {
      const prompt = language === 'en' 
        ? `You are an agriculture expert. Based on the following farm conditions, suggest the top 3 best crops to grow:

Soil Type: ${input.soilType}
Season: ${input.season}
Location: ${input.location}
Soil Moisture: ${input.moisture}%

Return ONLY a JSON object with this exact structure:
{
  "recommendations": [
    {
      "crop": "Crop Name",
      "suitability": "high",
      "expectedYield": "X tons/acre",
      "estimatedCost": "₹X,XXX per acre",
      "reason": "Brief explanation"
    }
  ],
  "analysis": "Overall analysis and tips"
}

Provide practical Indian farming context. Keep it simple and actionable.`
        : `మీరు వ్యవసాయ నిపుణుడు. ఈ క్రింది వ్యవసాయ పరిస్థితుల ఆధారంగా, పండించడానికి టాప్ 3 ఉత్తమ పంటలను సూచించండి:

నేల రకం: ${input.soilType}
సీజన్: ${input.season}
స్థానం: ${input.location}
నేల తేమ: ${input.moisture}%

ఈ ఖచ్చితమైన నిర్మాణంతో JSON ఆబ్జెక్ట్ మాత్రమే రిటర్న్ చేయండి:
{
  "recommendations": [
    {
      "crop": "పంట పేరు",
      "suitability": "high",
      "expectedYield": "X టన్నులు/ఎకరా",
      "estimatedCost": "₹X,XXX ప్రతి ఎకరా",
      "reason": "సంక్షిప్త వివరణ"
    }
  ],
  "analysis": "మొత్తం విశ్లేషణ మరియు చిట్కాలు"
}

ప్రాక్టికల్ భారతీయ వ్యవసాయ సందర్భం అందించండి. సరళంగా మరియు ఆచరణాత్మకంగా ఉంచండి.`;

      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          model: 'google/gemini-2.5-flash',
          temperature: 0.7,
        },
      });

      if (error) {
        let errorMessage = error.message;
        if (error instanceof FunctionsHttpError) {
          try {
            const textContent = await error.context?.text();
            errorMessage = textContent || error.message;
          } catch {
            errorMessage = error.message || 'Failed to get crop suggestions';
          }
        }
        throw new Error(errorMessage);
      }

      try {
        const content = data.choices[0].message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          return result as CropSuggestionResult;
        }
        throw new Error('Invalid response format');
      } catch (parseError) {
        console.error('Parse error:', parseError);
        throw new Error('Failed to parse AI response');
      }
    },
  });
}
