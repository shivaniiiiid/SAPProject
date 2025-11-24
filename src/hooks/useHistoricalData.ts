import { useQuery } from '@tanstack/react-query';
import { getHistoricalReadings, getReadingsByDateRange } from '@/lib/api';

interface IoTReading {
  id: string;
  created_at: string;
  n_value: number | null;
  p_value: number | null;
  k_value: number | null;
  soil_ph: number | null;
  soil_moisture: number | null;
  temperature: number | null;
  humidity: number | null;
  latitude: number | null;
  longitude: number | null;
}

export function useHistoricalData(limit: number = 200) {
  return useQuery<IoTReading[]>({
    queryKey: ['historical-readings', limit],
    queryFn: () => getHistoricalReadings(limit),
    staleTime: 60000, // 1 minute
    retry: 2,
  });
}

export function useHistoricalDataByDate(startDate: string, endDate: string, enabled: boolean = true) {
  return useQuery<IoTReading[]>({
    queryKey: ['historical-readings-date', startDate, endDate],
    queryFn: () => getReadingsByDateRange(startDate, endDate),
    staleTime: 60000,
    enabled,
    retry: 2,
  });
}
