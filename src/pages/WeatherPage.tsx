import WeatherMonitoring from '@/components/dashboard/WeatherMonitoring';
import IrrigationRecommendations from '@/components/dashboard/IrrigationRecommendations';
import { motion } from 'framer-motion';

export default function WeatherPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-blue-50 dark:from-amber-900 dark:via-green-900 dark:to-blue-900">
      <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">🌤️ Weather & Irrigation</h1>
          <p className="text-lg text-foreground/70">Real-time weather data and irrigation recommendations</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="farm-card">
            <h3 className="text-2xl font-black mb-4">🌤️ Current Weather</h3>
            <WeatherMonitoring />
          </div>
          <div className="farm-card">
            <h3 className="text-2xl font-black mb-4">💧 Irrigation Needs</h3>
            <IrrigationRecommendations />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
