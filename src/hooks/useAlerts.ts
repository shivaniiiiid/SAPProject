import { useQuery } from '@tanstack/react-query';
import { Alert, AlertSeverity, AlertType } from '@/types/alerts';
import { useSmartAgriData } from './useSmartAgriData';
import { useSatelliteData } from './useSatelliteData';
import { useWeatherData } from './useWeatherData';

// Generate alerts based on sensor data, satellite data, and weather
export function useAlerts() {
  const { data: agriData } = useSmartAgriData();
  
  // Default coordinates for Mogdumpur
  const lat = agriData?.latitude || 18.475;
  const lon = agriData?.longitude || 79.22;
  
  const { data: weatherData } = useWeatherData(lat, lon);
  
  const bbox = [lon - 0.03, lat - 0.03, lon + 0.03, lat + 0.03];
  const now = new Date();
  const toDate = now.toISOString().replace(/\.\d+Z$/, "Z");
  const past = new Date();
  past.setDate(now.getDate() - 7);
  const fromDate = past.toISOString().replace(/\.\d+Z$/, "Z");
  
  const { data: satelliteData } = useSatelliteData(bbox, fromDate, toDate);

  return useQuery({
    queryKey: ['alerts', agriData, weatherData, satelliteData],
    queryFn: async (): Promise<Alert[]> => {
      const alerts: Alert[] = [];

      // Weather-based alerts
      if (weatherData) {
        if (weatherData.temp > 38) {
          alerts.push({
            id: `weather-temp-${Date.now()}`,
            type: 'weather',
            severity: 'danger',
            title: 'High Temperature Alert',
            message: `Temperature is ${weatherData.temp}°C. Consider extra irrigation.`,
            timestamp: new Date(),
            isRead: false,
          });
        }

        if (weatherData.wind > 15) {
          alerts.push({
            id: `weather-wind-${Date.now()}`,
            type: 'weather',
            severity: 'warning',
            title: 'Strong Wind Warning',
            message: `Wind speed is ${weatherData.wind} m/s. Protect delicate crops.`,
            timestamp: new Date(),
            isRead: false,
          });
        }
      }

      // Soil moisture alerts
      if (agriData) {
        if (agriData.moisture < 35) {
          alerts.push({
            id: `irrigation-${Date.now()}`,
            type: 'irrigation',
            severity: 'danger',
            title: 'Irrigation Needed',
            message: `Soil moisture is ${agriData.moisture}%. Water your crops immediately.`,
            timestamp: new Date(),
            isRead: false,
          });
        }

        // pH alerts
        if (agriData.ph < 5.5 || agriData.ph > 8.0) {
          alerts.push({
            id: `soil-ph-${Date.now()}`,
            type: 'soil',
            severity: 'warning',
            title: 'Soil pH Issue',
            message: `Soil pH is ${agriData.ph.toFixed(1)}. Consider pH correction.`,
            timestamp: new Date(),
            isRead: false,
          });
        }

        // NPK alerts
        if (agriData.n < 35) {
          alerts.push({
            id: `soil-n-${Date.now()}`,
            type: 'soil',
            severity: 'warning',
            title: 'Low Nitrogen',
            message: `Nitrogen level is ${agriData.n} ppm. Add urea fertilizer.`,
            timestamp: new Date(),
            isRead: false,
          });
        }
      }

      // NDVI-based crop health alerts
      if (satelliteData && satelliteData.length > 0) {
        const latestNDVI = satelliteData[satelliteData.length - 1].ndvi;
        
        if (latestNDVI < 0.4) {
          alerts.push({
            id: `ndvi-low-${Date.now()}`,
            type: 'ndvi',
            severity: 'danger',
            title: 'Poor Crop Health',
            message: `NDVI is ${latestNDVI.toFixed(2)}. Crops are stressed. Check irrigation and nutrients.`,
            timestamp: new Date(),
            isRead: false,
          });
        } else if (latestNDVI < 0.6) {
          alerts.push({
            id: `ndvi-medium-${Date.now()}`,
            type: 'ndvi',
            severity: 'warning',
            title: 'Crop Health Monitoring',
            message: `NDVI is ${latestNDVI.toFixed(2)}. Crops need attention.`,
            timestamp: new Date(),
            isRead: false,
          });
        }
      }

      // Pest risk alerts (based on temperature and humidity)
      if (agriData && agriData.temperature > 25 && agriData.humidity > 70) {
        alerts.push({
          id: `pest-risk-${Date.now()}`,
          type: 'pest',
          severity: 'warning',
          title: 'Pest Risk Alert',
          message: 'High temperature and humidity create favorable conditions for pests. Monitor closely.',
          timestamp: new Date(),
          isRead: false,
        });
      }

      return alerts.sort((a, b) => {
        const severityOrder = { danger: 0, warning: 1, info: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });
    },
    refetchInterval: 60000, // Refresh every minute
    enabled: !!agriData || !!weatherData || !!satelliteData,
  });
}
