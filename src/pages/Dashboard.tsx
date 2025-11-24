import { Activity, TrendingUp, Droplets, ThermometerSun } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import LiveSensorDashboard from '@/components/dashboard/LiveSensorDashboard';
import LiveCharts from '@/components/dashboard/LiveCharts';
import SatelliteMonitoring from '@/components/dashboard/SatelliteMonitoring';
import WeatherMonitoring from '@/components/dashboard/WeatherMonitoring';
import CropHealthAnalyzer from '@/components/dashboard/CropHealthAnalyzer';
import IrrigationRecommendations from '@/components/dashboard/IrrigationRecommendations';
import AIRecommendations from '@/components/dashboard/AIRecommendations';
import SmartAgriAI from '@/components/dashboard/SmartAgriAI';
import AlertsPanel from '@/components/dashboard/AlertsPanel';
import CropCalendar from '@/components/dashboard/CropCalendar';
import FarmMap from '@/components/dashboard/FarmMap';
import CropSuggestionTool from '@/components/dashboard/CropSuggestionTool';
import VoiceAssistant from '@/components/VoiceAssistant';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { motion } from 'framer-motion';
import { useRealtimeSensors } from '@/hooks/useRealtimeSensors';

export default function Dashboard() {
  const { language } = useLanguage();
  const { data: sensorData } = useRealtimeSensors();

  return (
    <div className="min-h-screen bg-earth-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t(language, 'dashboard.welcome')} <span className="gradient-text">{t(language, 'header.title')}</span>
          </h2>
          <p className="text-muted-foreground">
            {t(language, 'dashboard.description')}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
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

        {/* Main Content Grid */}
        <div className="space-y-8">
          {/* Live Sensor Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <LiveSensorDashboard />
          </motion.div>

          {/* Live Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <LiveCharts />
          </motion.div>

          {/* Alerts Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AlertsPanel />
          </motion.div>

          {/* Farm Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <FarmMap />
          </motion.div>

          {/* Satellite Monitoring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <SatelliteMonitoring />
          </motion.div>

          {/* Weather & Irrigation Row */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <WeatherMonitoring />
            <IrrigationRecommendations />
          </motion.div>

          {/* Smart Agriculture AI System */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <SmartAgriAI />
          </motion.div>

          {/* Crop Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <CropCalendar />
          </motion.div>

          {/* Crop Suggestion Tool */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <CropSuggestionTool />
          </motion.div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <AIRecommendations />
          </motion.div>

          {/* Crop Health Analyzer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <CropHealthAnalyzer />
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          <p>
            {language === 'en' 
              ? 'Real-time data from ESP32 sensors, Sentinel-2 satellite, OpenWeather API, and AI-powered recommendations'
              : 'ESP32 సెన్సార్లు, Sentinel-2 ఉపగ్రహం, OpenWeather API మరియు AI-ఆధారిత సిఫార్సుల నుండి రియల్-టైం డేటా'}
          </p>
        </motion.div>
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant />
    </div>
  );
}
