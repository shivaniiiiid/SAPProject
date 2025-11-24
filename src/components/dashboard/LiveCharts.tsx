import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useHistoricalData } from '@/hooks/useHistoricalData';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { Loader2 } from 'lucide-react';

export default function LiveCharts() {
  const { language } = useLanguage();
  const { data: readings, isLoading } = useHistoricalData(50);

  if (isLoading) {
    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle>{t(language, 'dashboard.charts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = readings?.reverse().map((reading) => ({
    time: new Date(reading.created_at).toLocaleTimeString(language === 'te' ? 'te-IN' : 'en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    temperature: reading.temperature,
    humidity: reading.humidity,
    moisture: reading.soil_moisture,
    ph: reading.soil_ph,
    n: reading.n_value,
    p: reading.p_value,
    k: reading.k_value,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Temperature & Humidity Chart */}
      <Card className="data-card">
        <CardHeader>
          <CardTitle>{t(language, 'dashboard.tempHumidity')}</CardTitle>
          <CardDescription>{t(language, 'dashboard.last50Readings')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#f97316"
                name={t(language, 'weather.temperature')}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#3b82f6"
                name={t(language, 'weather.humidity')}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Soil Moisture & pH Chart */}
      <Card className="data-card">
        <CardHeader>
          <CardTitle>{t(language, 'dashboard.soilConditions')}</CardTitle>
          <CardDescription>{t(language, 'dashboard.last50Readings')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="moisture"
                stroke="#06b6d4"
                name={t(language, 'smartAgri.soilMoisture')}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="ph"
                stroke="#a855f7"
                name={t(language, 'smartAgri.soilPH')}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* NPK Levels Chart */}
      <Card className="data-card">
        <CardHeader>
          <CardTitle>{t(language, 'smartAgri.npkTitle')}</CardTitle>
          <CardDescription>{t(language, 'dashboard.last50Readings')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.slice(-10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="n" fill="#22c55e" name={t(language, 'smartAgri.nitrogen')} />
              <Bar dataKey="p" fill="#f59e0b" name={t(language, 'smartAgri.phosphorus')} />
              <Bar dataKey="k" fill="#3b82f6" name={t(language, 'smartAgri.potassium')} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
