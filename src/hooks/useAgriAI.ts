import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { UnifiedAgriData, AIRecommendation } from '@/types/smartAgri';
import type { Language } from '@/contexts/LanguageContext';

export function useAgriAI(data: UnifiedAgriData | undefined, language: Language) {
  return useQuery({
    queryKey: ['agri-ai', data, language],
    queryFn: async (): Promise<AIRecommendation> => {
      if (!data) throw new Error('No data available');

      const { data: response, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          ...data,
          language,
        },
      });

      if (error) {
        console.error('AI recommendation error:', error);
        throw error;
      }

      return response;
    },
    enabled: !!data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
