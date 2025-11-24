// Supabase REST API Service for IoT Readings
import { supabase } from './supabase';

const SUPABASE_REST_URL = 'https://eowxrsshilywfttqykey.supabase.co/rest/v1';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

// Fetch latest sensor reading
export async function getLatestReading(): Promise<IoTReading | null> {
  try {
    const response = await fetch(
      `${SUPABASE_REST_URL}/iot_readings?select=*&order=created_at.desc&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Failed to fetch latest reading:', error);
    throw error;
  }
}

// Fetch historical readings (last N records)
export async function getHistoricalReadings(limit: number = 200): Promise<IoTReading[]> {
  try {
    const response = await fetch(
      `${SUPABASE_REST_URL}/iot_readings?select=*&order=created_at.desc&limit=${limit}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch historical readings:', error);
    throw error;
  }
}

// Fetch readings by date range
export async function getReadingsByDateRange(
  startDate: string,
  endDate: string
): Promise<IoTReading[]> {
  try {
    const response = await fetch(
      `${SUPABASE_REST_URL}/iot_readings?select=*&created_at=gte.${startDate}&created_at=lte.${endDate}&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch readings by date:', error);
    throw error;
  }
}

// Export data as CSV
export function exportToCSV(readings: IoTReading[], filename: string = 'sensor_data.csv') {
  if (readings.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = [
    'Timestamp',
    'Temperature (°C)',
    'Humidity (%)',
    'Soil Moisture (%)',
    'Soil pH',
    'Nitrogen (N)',
    'Phosphorus (P)',
    'Potassium (K)',
    'Latitude',
    'Longitude',
  ];

  const csvContent = [
    headers.join(','),
    ...readings.map((reading) =>
      [
        new Date(reading.created_at).toLocaleString(),
        reading.temperature ?? '',
        reading.humidity ?? '',
        reading.soil_moisture ?? '',
        reading.soil_ph ?? '',
        reading.n_value ?? '',
        reading.p_value ?? '',
        reading.k_value ?? '',
        reading.latitude ?? '',
        reading.longitude ?? '',
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Check if API is online
export async function checkAPIStatus(): Promise<boolean> {
  try {
    const response = await fetch(
      `${SUPABASE_REST_URL}/iot_readings?select=id&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}
