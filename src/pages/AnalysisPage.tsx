import CropHealthAnalyzer from '@/components/dashboard/CropHealthAnalyzer';
import SmartAgriAI from '@/components/dashboard/SmartAgriAI';
import AIRecommendations from '@/components/dashboard/AIRecommendations';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<'health' | 'smart' | 'recommendations'>('health');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-blue-50 dark:from-amber-900 dark:via-green-900 dark:to-blue-900">
      <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">🔍 Farm Analysis & AI</h1>
          <p className="text-lg text-foreground/70">AI-powered predictions and recommendations</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-6 sm:mb-8"
        >
          <button
            onClick={() => setActiveTab('health')}
            className={`text-lg sm:text-xl font-bold px-6 py-3 rounded-2xl transition-all ${
              activeTab === 'health'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            🌾 Crop Health
          </button>
          <button
            onClick={() => setActiveTab('smart')}
            className={`text-lg sm:text-xl font-bold px-6 py-3 rounded-2xl transition-all ${
              activeTab === 'smart'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            🤖 Smart AI
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`text-lg sm:text-xl font-bold px-6 py-3 rounded-2xl transition-all ${
              activeTab === 'recommendations'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            💡 Recommendations
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="farm-card"
        >
          {activeTab === 'health' && <CropHealthAnalyzer />}
          {activeTab === 'smart' && <SmartAgriAI />}
          {activeTab === 'recommendations' && <AIRecommendations />}
        </motion.div>
      </div>
    </div>
  );
}
