import { useEffect, useState } from "react";
import { Loader2, MapPin, Cloud, Droplets, Wind } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/translations";
import { motion } from "framer-motion";

export default function WeatherMonitoring() {
  const { language } = useLanguage();
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Get user's GPS location
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError(t(language, 'weather.noGPS'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        setGeoError(t(language, 'weather.locationDenied'));
      }
    );
  }, [language]);

  const { data, isLoading, error } = useWeatherData(coords?.lat ?? 18.475, coords?.lon ?? 79.22);

  if (geoError) {
    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle>{t(language, 'weather.title')}</CardTitle>
          <CardDescription>{geoError}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{geoError}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle>{t(language, 'weather.title')}</CardTitle>
          <CardDescription>{t(language, 'weather.loading')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-6">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle>{t(language, 'weather.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{t(language, 'weather.error')}: {error.message}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card className="data-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <CardTitle>{t(language, 'weather.title')}</CardTitle>
            <CardDescription>{t(language, 'weather.description')}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Cloud className="h-8 w-8 text-blue-500" />
              <p className="text-2xl font-bold">{data.weather}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-1">
                <Cloud className="h-4 w-4 text-orange-600" />
                <p className="text-xs text-muted-foreground">{t(language, 'weather.temperature')}</p>
              </div>
              <p className="text-xl font-bold">{data.temp}°C</p>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="h-4 w-4 text-blue-600" />
                <p className="text-xs text-muted-foreground">{t(language, 'weather.humidity')}</p>
              </div>
              <p className="text-xl font-bold">{data.humidity}%</p>
            </div>

            <div className="p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border border-cyan-200 dark:border-cyan-800 col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <Wind className="h-4 w-4 text-cyan-600" />
                <p className="text-xs text-muted-foreground">{t(language, 'weather.wind')}</p>
              </div>
              <p className="text-xl font-bold">{data.wind} m/s</p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
