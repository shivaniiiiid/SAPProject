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
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Dashboard() {
  const { language } = useLanguage();
  const { data: sensorData } = useRealtimeSensors();
  const location = useLocation();

  // Handle hash-based scrolling when navigating from other pages
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-blue-50 dark:from-amber-900 dark:via-green-900 dark:to-blue-900">
      <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
          id="home"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-3">
            🌾 {t(language, 'dashboard.welcome')}
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70">
            {t(language, 'dashboard.description')}
          </p>
        </motion.div>

        {/* Stats Grid - Large & Prominent */}
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

        {/* Main Content Grid */}
        <div className="space-y-8">
          {/* ALERTS FIRST - Most Important for Farmers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            id="alerts"
            className="order-first"
          >
            <div className="bg-red-50 dark:bg-red-950 border-4 border-red-500 rounded-3xl p-6 sm:p-8">
              <h3 className="text-2xl sm:text-3xl font-black text-red-700 dark:text-red-200 mb-4">⚠️ Important Alerts</h3>
              <AlertsPanel />
            </div>
          </motion.div>

          {/* Weather & Recommendations */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            id="weather"
          >
            <div className="farm-card">
              <h3 className="text-2xl font-black mb-4">🌤️ Weather Now</h3>
              <WeatherMonitoring />
            </div>
            <div className="farm-card">
              <h3 className="text-2xl font-black mb-4">💧 Irrigation Needs</h3>
              <IrrigationRecommendations />
            </div>
          </motion.div>

          {/* Live Sensor Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            id="analysis"
          >
            <div className="farm-card">
              <h3 className="text-2xl font-black mb-4">📊 Live Sensors</h3>
              <LiveSensorDashboard />
            </div>
          </motion.div>

          {/* Live Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="farm-card">
              <h3 className="text-2xl font-black mb-4">📈 Data Trends</h3>
              <LiveCharts />
            </div>
          </motion.div>

          {/* Farm Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            id="map"
          >
            <div className="farm-card">
              <h3 className="text-2xl font-black mb-4">🗺️ Your Farm</h3>
              <FarmMap />
            </div>
          </motion.div>

          {/* Satellite Monitoring */}
          <motion.div
            id="satellite"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="farm-card">
              <h3 className="text-2xl font-black mb-4">🛰️ Crop Health (Satellite)</h3>
              <SatelliteMonitoring />
            </div>
          </motion.div>

          {/* Crop Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            id="calendar"
          >
            <div className="farm-card">
              <h3 className="text-2xl font-black mb-4">📅 Seasonal Calendar</h3>
              <CropCalendar />
            </div>
          </motion.div>

          {/* Crop Suggestion Tool */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="farm-card">
              <h3 className="text-2xl font-black mb-4">🌱 Crop Suggestions</h3>
              <CropSuggestionTool />
            </div>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <div className="farm-card">
              <h3 className="text-2xl font-black mb-4">🤖 AI Advice</h3>
              <AIRecommendations />
            </div>
          </motion.div>

          {/* Smart Agriculture AI System */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="farm-card">
              <h3 className="text-2xl font-black mb-4">🎯 Smart AgriAI</h3>
              <SmartAgriAI />
            </div>
          </motion.div>

          {/* Crop Health Analyzer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <div className="farm-card">
              <h3 className="text-2xl font-black mb-4">🔍 Crop Health Analysis</h3>
              <CropHealthAnalyzer />
            </div>
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
