export interface IoTReading {
  id: string;
  created_at: string;
  n_value?: number;
  p_value?: number;
  k_value?: number;
  soil_ph?: number;
  soil_moisture?: number;
  temperature?: number;
  humidity?: number;
  latitude?: number;
  longitude?: number;
  ndvi?: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rain_chance: number;
  wind_speed: number;
  condition: string;
}

export interface SatelliteData {
  ndvi: number;
}

export interface UnifiedAgriData {
  n: number;
  p: number;
  k: number;
  ph: number;
  moisture: number;
  temperature: number;
  humidity: number;
  ndvi: number;
  latitude: number;
  longitude: number;
  dataSource: {
    sensors: boolean;
    weather: boolean;
    satellite: boolean;
  };
}

export interface AIRecommendation {
  fertilizer_plan: string;
  soil_advice: string;
  irrigation: string;
  pest_warning: string;
  crop_health_status: string;
  two_day_action_plan: string[];
}

export type NPKStatus = 'good' | 'low' | 'high';
export type pHStatus = 'good' | 'acidic' | 'alkaline';
export type MoistureStatus = 'dry' | 'normal' | 'wet';
export type HealthStatus = 'healthy' | 'improving' | 'stress';
