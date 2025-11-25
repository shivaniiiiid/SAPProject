import FarmMap from '@/components/dashboard/FarmMap';
import { motion } from 'framer-motion';

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-blue-50 dark:from-amber-900 dark:via-green-900 dark:to-blue-900">
      <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">🗺️ Farm Map</h1>
          <p className="text-lg text-foreground/70">Visualize and manage your farm fields</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="farm-card"
        >
          <FarmMap />
        </motion.div>
      </div>
    </div>
  );
}
