import { Activity, TrendingUp, Droplets, ThermometerSun } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { motion } from 'framer-motion';
import { useRealtimeSensors } from '@/hooks/useRealtimeSensors';

export default function Home() {
  const { language } = useLanguage();
  const { data: sensorData } = useRealtimeSensors();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-blue-50 dark:from-amber-900 dark:via-green-900 dark:to-blue-900">
      <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-3">
            🌾 {t(language, 'dashboard.welcome')}
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70">
            {t(language, 'dashboard.description')}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8"
        >
          <StatCard
            title={t(language, 'dashboard.cropHealth')}
            value={sensorData?.soil_moisture ? ((sensorData.soil_moisture / 100) * 0.9).toFixed(2) : "0.78"}
            icon={Activity}
            trend="up"
            trendValue="+5.2%"
            status="success"
          />
          <StatCard
            title={t(language, 'dashboard.soilMoisture')}
            value={sensorData?.soil_moisture?.toFixed(0) ?? "42"}
            unit="%"
            icon={Droplets}
            trend={sensorData && sensorData.soil_moisture && sensorData.soil_moisture < 40 ? "down" : "up"}
            trendValue={sensorData && sensorData.soil_moisture && sensorData.soil_moisture < 40 ? "-3.1%" : "+1.2%"}
            status={sensorData && sensorData.soil_moisture && sensorData.soil_moisture < 40 ? "warning" : "success"}
          />
          <StatCard
            title={t(language, 'dashboard.avgTemp')}
            value={sensorData?.temperature?.toFixed(0) ?? "26"}
            unit="°C"
            icon={ThermometerSun}
            trend="up"
            trendValue="+2.4°C"
            status="info"
          />
          <StatCard
            title={t(language, 'dashboard.growthRate')}
            value="94"
            unit="%"
            icon={TrendingUp}
            trend="up"
            trendValue="+8.5%"
            status="success"
          />
        </motion.div>

        {/* Navigation Cards to Other Pages */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <a href="/#/alerts" className="farm-card hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-black mb-2">⚠️ Alerts</h3>
            <p className="text-muted-foreground">Monitor critical farm alerts</p>
          </a>
          <a href="/#/weather" className="farm-card hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-black mb-2">🌤️ Weather</h3>
            <p className="text-muted-foreground">Real-time weather data</p>
          </a>
          <a href="/#/sensors" className="farm-card hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-black mb-2">📊 Sensors</h3>
            <p className="text-muted-foreground">Live sensor readings</p>
          </a>
          <a href="/#/satellite" className="farm-card hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-black mb-2">🛰️ Satellite</h3>
            <p className="text-muted-foreground">Crop health via NDVI</p>
          </a>
          <a href="/#/analysis" className="farm-card hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-black mb-2">🔍 Analysis</h3>
            <p className="text-muted-foreground">AI predictions & insights</p>
          </a>
          <a href="/#/map" className="farm-card hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-black mb-2">🗺️ Farm Map</h3>
            <p className="text-muted-foreground">Visualize your fields</p>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
