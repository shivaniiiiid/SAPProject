import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Cloud, Leaf, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { useSmartAgriData } from '@/hooks/useSmartAgriData';
import { useWeatherData } from '@/hooks/useWeatherData';

declare global {
  interface Window {
    L: any;
  }
}

export default function FarmMap() {
  const { language } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { data: agriData } = useSmartAgriData();
  const lat = agriData?.latitude || 18.475;
  const lon = agriData?.longitude || 79.22;
  const { data: weatherData } = useWeatherData(lat, lon);

  useEffect(() => {
    // Dynamically load Leaflet CSS and JS
    const loadLeaflet = async () => {
      if (window.L) {
        setMapLoaded(true);
        return;
      }

      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setMapLoaded(true);
      document.body.appendChild(script);
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;

    // Initialize map
    const map = L.map(mapRef.current).setView([lat, lon], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="background-color: #10b981; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    // Add marker
    const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);

    // Popup content
    const ndviStatus = agriData ? 
      (agriData.ndvi >= 0.6 ? t(language, 'map.healthy') : 
       agriData.ndvi >= 0.4 ? t(language, 'map.moderate') : 
       t(language, 'map.stressed')) : '-';

    const popupContent = `
      <div style="font-family: system-ui, sans-serif; padding: 4px;">
        <h3 style="margin: 0 0 8px 0; font-weight: bold;">${t(language, 'map.yourLocation')}</h3>
        ${weatherData ? `
          <p style="margin: 4px 0; display: flex; align-items: center; gap: 4px;">
            <strong>${t(language, 'map.weather')}:</strong> ${weatherData.weather} - ${weatherData.temp}°C
          </p>
        ` : ''}
        ${agriData ? `
          <p style="margin: 4px 0; display: flex; align-items: center; gap: 4px;">
            <strong>${t(language, 'map.ndvi')}:</strong> ${agriData.ndvi.toFixed(2)} (${ndviStatus})
          </p>
        ` : ''}
      </div>
    `;

    marker.bindPopup(popupContent).openPopup();

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapLoaded, lat, lon, weatherData, agriData, language]);

  const ndviStatus = agriData ? 
    (agriData.ndvi >= 0.6 ? 'healthy' : 
     agriData.ndvi >= 0.4 ? 'moderate' : 
     'stressed') : null;

  const ndviColor = ndviStatus === 'healthy' ? 'bg-green-500' : 
                    ndviStatus === 'moderate' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <Card className="data-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {t(language, 'map.title')}
            </CardTitle>
            <CardDescription>{t(language, 'map.description')}</CardDescription>
          </div>
          <div className="flex gap-2">
            {weatherData && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Cloud className="h-3 w-3" />
                {weatherData.temp}°C
              </Badge>
            )}
            {ndviStatus && (
              <Badge variant="outline" className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${ndviColor}`} />
                <Leaf className="h-3 w-3" />
                {t(language, `map.${ndviStatus}`)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!mapLoaded ? (
          <div className="flex justify-center items-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div ref={mapRef} className="h-[400px] rounded-lg border" />
        )}
      </CardContent>
    </Card>
  );
}
