import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SatelliteData } from '@/types/agriculture';
import { FunctionsHttpError } from '@supabase/supabase-js';

export function useSatelliteData(bbox: number[], fromDate: string, toDate: string) {
  
  // ✅ FIX: ensure dates are ISO-8601 without milliseconds
  const cleanFrom = fromDate.replace(/\.\d+Z$/, "Z");
  const cleanTo = toDate.replace(/\.\d+Z$/, "Z");

  return useQuery({
    queryKey: ['satellite', bbox.join(','), cleanFrom, cleanTo],
    queryFn: async (): Promise<SatelliteData[]> => {
      console.log('🛰️ Fetching satellite data...', { bbox, cleanFrom, cleanTo });
      
      const { data, error } = await supabase.functions.invoke('satellite-data', {
        body: {
          bbox,
          fromDate: cleanFrom,
          toDate: cleanTo,
        },
      });

      if (error) {
        console.error('❌ Satellite API error:', error);
        let errorMessage = error.message;
        if (error instanceof FunctionsHttpError) {
          try {
            const statusCode = error.context?.status ?? 500;
            const textContent = await error.context?.text();
            errorMessage = `[Code: ${statusCode}] ${textContent || error.message || 'Unknown error'}`;
          } catch {
            errorMessage = `${error.message || 'Failed to fetch satellite data'}`;
          }
        }
        throw new Error(errorMessage);
      }

      console.log('✅ Satellite data received:', data);

      // Handle response format
      if (data && data.data && Array.isArray(data.data)) {
        return data.data as SatelliteData[];
      }
      
      // Fallback for empty or invalid data
      console.warn('⚠️ No valid satellite data received');
      return [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
    enabled: bbox.length === 4 && !!cleanFrom && !!cleanTo,
  });
}
