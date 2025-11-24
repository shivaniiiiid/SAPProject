import { Thermometer, Droplets, Activity, Leaf, MapPin, RefreshCw, WifiOff, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRealtimeSensors } from '@/hooks/useRealtimeSensors';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { motion } from 'framer-motion';
import { exportToCSV, getHistoricalReadings } from '@/lib/api';
import { toast } from 'sonner';

export default function LiveSensorDashboard() {
  const { language } = useLanguage();
  const {
    data,
    isLoading,
    error,
    isOnline,
    autoRefresh,
    setAutoRefresh,
    timeSinceUpdate,
    refetch,
  } = useRealtimeSensors(10000);

  const handleExport = async () => {
    try {
      toast.loading(language === 'en' ? 'Exporting data...' : 'డేటాను ఎగుమతి చేస్తోంది...');
      const readings = await getHistoricalReadings(200);
      exportToCSV(readings);
      toast.success(language === 'en' ? 'Data exported successfully!' : 'డేటా విజయవంతంగా ఎగుమతి చేయబడింది!');
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to export data' : 'డేటా ఎగుమతి విఫలమైంది');
    }
  };

  const getStatusColor = (value: number | null, min: number, max: number, optimal?: [number, number]) => {
    if (value === null) return 'text-muted-foreground';
    if (optimal && value >= optimal[0] && value <= optimal[1]) return 'text-green-600 dark:text-green-400';
    if (value < min || value > max) return 'text-red-600 dark:text-red-400';
    return 'text-amber-600 dark:text-amber-400';
  };

  const getStatusBadge = (value: number | null, min: number, max: number, optimal?: [number, number]) => {
    if (value === null) return { label: t(language, 'dashboard.noData'), variant: 'secondary' as const };
    if (optimal && value >= optimal[0] && value <= optimal[1])
      return { label: t(language, 'dashboard.optimal'), variant: 'default' as const };
    if (value < min || value > max)
      return { label: t(language, 'dashboard.critical'), variant: 'destructive' as const };
    return { label: t(language, 'dashboard.warning'), variant: 'default' as const };
  };

  if (isLoading) {
    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle>{t(language, 'dashboard.liveSensors')}</CardTitle>
          <CardDescription>{t(language, 'dashboard.loading')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="h-12 w-12 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle>{t(language, 'dashboard.liveSensors')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>{t(language, 'dashboard.error')}: {error.message}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="data-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {t(language, 'dashboard.liveSensors')}
              </CardTitle>
              <CardDescription>
                {t(language, 'dashboard.lastUpdate')}: {timeSinceUpdate}
                {!isOnline && (
                  <Badge variant="destructive" className="ml-2">
                    <WifiOff className="h-3 w-3 mr-1" />
                    {t(language, 'dashboard.offline')}
                  </Badge>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
                <Label htmlFor="auto-refresh" className="text-sm cursor-pointer">
                  {t(language, 'dashboard.autoRefresh')}
                </Label>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t(language, 'dashboard.refresh')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                {t(language, 'dashboard.export')}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="data-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Thermometer className="h-8 w-8 text-orange-500" />
                <Badge {...getStatusBadge(data?.temperature ?? null, 10, 40, [20, 30])}>
                  {getStatusBadge(data?.temperature ?? null, 10, 40, [20, 30]).label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{t(language, 'weather.temperature')}</p>
              <p
                className={`text-3xl font-bold ${getStatusColor(
                  data?.temperature ?? null,
                  10,
                  40,
                  [20, 30]
                )}`}
              >
                {data?.temperature?.toFixed(1) ?? '--'}°C
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Humidity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="data-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Droplets className="h-8 w-8 text-blue-500" />
                <Badge {...getStatusBadge(data?.humidity ?? null, 30, 100, [50, 80])}>
                  {getStatusBadge(data?.humidity ?? null, 30, 100, [50, 80]).label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{t(language, 'weather.humidity')}</p>
              <p
                className={`text-3xl font-bold ${getStatusColor(
                  data?.humidity ?? null,
                  30,
                  100,
                  [50, 80]
                )}`}
              >
                {data?.humidity?.toFixed(1) ?? '--'}%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Soil Moisture */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="data-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Droplets className="h-8 w-8 text-cyan-500" />
                <Badge {...getStatusBadge(data?.soil_moisture ?? null, 20, 100, [40, 70])}>
                  {getStatusBadge(data?.soil_moisture ?? null, 20, 100, [40, 70]).label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{t(language, 'smartAgri.soilMoisture')}</p>
              <p
                className={`text-3xl font-bold ${getStatusColor(
                  data?.soil_moisture ?? null,
                  20,
                  100,
                  [40, 70]
                )}`}
              >
                {data?.soil_moisture?.toFixed(1) ?? '--'}%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Soil pH */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="data-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-8 w-8 text-purple-500" />
                <Badge {...getStatusBadge(data?.soil_ph ?? null, 4, 9, [6, 7.5])}>
                  {getStatusBadge(data?.soil_ph ?? null, 4, 9, [6, 7.5]).label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{t(language, 'smartAgri.soilPH')}</p>
              <p
                className={`text-3xl font-bold ${getStatusColor(
                  data?.soil_ph ?? null,
                  4,
                  9,
                  [6, 7.5]
                )}`}
              >
                {data?.soil_ph?.toFixed(2) ?? '--'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* NPK Values */}
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-500" />
            {t(language, 'smartAgri.npkTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nitrogen */}
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{t(language, 'smartAgri.nitrogen')}</p>
                <Badge {...getStatusBadge(data?.n_value ?? null, 20, 200, [80, 120])}>
                  {getStatusBadge(data?.n_value ?? null, 20, 200, [80, 120]).label}
                </Badge>
              </div>
              <p
                className={`text-2xl font-bold ${getStatusColor(
                  data?.n_value ?? null,
                  20,
                  200,
                  [80, 120]
                )}`}
              >
                {data?.n_value?.toFixed(1) ?? '--'} mg/kg
              </p>
            </div>

            {/* Phosphorus */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{t(language, 'smartAgri.phosphorus')}</p>
                <Badge {...getStatusBadge(data?.p_value ?? null, 10, 100, [30, 60])}>
                  {getStatusBadge(data?.p_value ?? null, 10, 100, [30, 60]).label}
                </Badge>
              </div>
              <p
                className={`text-2xl font-bold ${getStatusColor(
                  data?.p_value ?? null,
                  10,
                  100,
                  [30, 60]
                )}`}
              >
                {data?.p_value?.toFixed(1) ?? '--'} mg/kg
              </p>
            </div>

            {/* Potassium */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{t(language, 'smartAgri.potassium')}</p>
                <Badge {...getStatusBadge(data?.k_value ?? null, 50, 300, [100, 200])}>
                  {getStatusBadge(data?.k_value ?? null, 50, 300, [100, 200]).label}
                </Badge>
              </div>
              <p
                className={`text-2xl font-bold ${getStatusColor(
                  data?.k_value ?? null,
                  50,
                  300,
                  [100, 200]
                )}`}
              >
                {data?.k_value?.toFixed(1) ?? '--'} mg/kg
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GPS Location */}
      {data?.latitude && data?.longitude && (
        <Card className="data-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              {t(language, 'map.location')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t(language, 'map.latitude')}</p>
                <p className="text-xl font-bold">{data.latitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t(language, 'map.longitude')}</p>
                <p className="text-xl font-bold">{data.longitude.toFixed(6)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
