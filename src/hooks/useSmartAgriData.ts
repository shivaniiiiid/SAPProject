import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { UnifiedAgriData, IoTReading, WeatherData, SatelliteData } from '@/types/smartAgri';

export function useSmartAgriData() {
  return useQuery({
    queryKey: ['smart-agri-data'],
    queryFn: async (): Promise<UnifiedAgriData> => {
      // 1. Fetch latest IoT reading
      const { data: iotData, error: iotError } = await supabase
        .from('iot_readings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (iotError && iotError.code !== 'PGRST116') {
        console.error('IoT fetch error:', iotError);
      }

      const reading: IoTReading | null = iotData;
      
      // Determine what data we need from APIs
      const needsWeather = !reading || 
        reading.temperature === null || 
        reading.humidity === null;
      
      const needsSatellite = !reading || reading.ndvi === null;

      const lat = reading?.latitude || 17.385; // Default to Hyderabad
      const lon = reading?.longitude || 78.4867;

      // 2. Fetch weather data if needed
      let weatherData: WeatherData | null = null;
      if (needsWeather) {
        try {
          const { data, error } = await supabase.functions.invoke('weather-data', {
            body: { latitude: lat, longitude: lon }
          });

          if (error) throw error;
          weatherData = data;
        } catch (err) {
          console.error('Weather API error:', err);
        }
      }

      // 3. Fetch satellite NDVI if needed
      let satelliteData: { ndvi: number } | null = null;
      if (needsSatellite) {
        try {
          const { data, error } = await supabase.functions.invoke('satellite-data', {
            body: { latitude: lat, longitude: lon }
          });

          if (error) throw error;
          satelliteData = data;
        } catch (err) {
          console.error('Satellite API error:', err);
        }
      }

      // 4. Merge data with priority: Sensors > API
      const unified: UnifiedAgriData = {
        n: reading?.n_value ?? 45,
        p: reading?.p_value ?? 30,
        k: reading?.k_value ?? 35,
        ph: reading?.soil_ph ?? 6.5,
        moisture: reading?.soil_moisture ?? 55,
        temperature: reading?.temperature ?? weatherData?.temperature ?? 28,
        humidity: reading?.humidity ?? weatherData?.humidity ?? 65,
        ndvi: reading?.ndvi ?? satelliteData?.ndvi ?? 0.65,
        latitude: lat,
        longitude: lon,
        dataSource: {
          sensors: !!reading,
          weather: needsWeather && !!weatherData,
          satellite: needsSatellite && !!satelliteData,
        }
      };

      return unified;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 15000,
  });
}
