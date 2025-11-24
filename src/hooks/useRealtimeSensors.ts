import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLatestReading, checkAPIStatus } from '@/lib/api';

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

export function useRealtimeSensors(pollingInterval: number = 10000) {
  const [isOnline, setIsOnline] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const lastUpdateRef = useRef<Date>(new Date());

  // Check API status periodically
  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkAPIStatus();
      setIsOnline(status);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  // Fetch latest sensor data with polling
  const {
    data: latestReading,
    isLoading,
    error,
    refetch,
  } = useQuery<IoTReading | null>({
    queryKey: ['latest-sensor-reading'],
    queryFn: async () => {
      const reading = await getLatestReading();
      if (reading) {
        lastUpdateRef.current = new Date(reading.created_at);
      }
      return reading;
    },
    refetchInterval: autoRefresh ? pollingInterval : false,
    staleTime: 5000,
    retry: 3,
  });

  // Calculate time since last update
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - lastUpdateRef.current.getTime()) / 1000);
      
      if (diff < 60) {
        setTimeSinceUpdate(`${diff}s ago`);
      } else if (diff < 3600) {
        setTimeSinceUpdate(`${Math.floor(diff / 60)}m ago`);
      } else {
        setTimeSinceUpdate(`${Math.floor(diff / 3600)}h ago`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [latestReading]);

  return {
    data: latestReading,
    isLoading,
    error,
    isOnline,
    autoRefresh,
    setAutoRefresh,
    timeSinceUpdate,
    refetch,
  };
}
