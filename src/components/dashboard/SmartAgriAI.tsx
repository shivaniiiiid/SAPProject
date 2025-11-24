import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Droplets, Thermometer, Wind, Leaf, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useSmartAgriData } from '@/hooks/useSmartAgriData';
import { useAgriAI } from '@/hooks/useAgriAI';
import { useLanguage } from '@/contexts/LanguageContext';
import type { NPKStatus, pHStatus, MoistureStatus, HealthStatus } from '@/types/smartAgri';

export default function SmartAgriAI() {
  const { language } = useLanguage();
  const { data: agriData, isLoading: dataLoading, error: dataError } = useSmartAgriData();
  const { data: aiRec, isLoading: aiLoading, error: aiError } = useAgriAI(agriData, language);

  // Status determination functions
  const getNPKStatus = (value: number, type: 'n' | 'p' | 'k'): NPKStatus => {
    const ranges = {
      n: { low: 40, high: 80 },
      p: { low: 25, high: 60 },
      k: { low: 30, high: 70 },
    };
    const range = ranges[type];
    if (value < range.low) return 'low';
    if (value > range.high) return 'high';
    return 'good';
  };

  const getpHStatus = (ph: number): pHStatus => {
    if (ph < 6.0) return 'acidic';
    if (ph > 7.5) return 'alkaline';
    return 'good';
  };

  const getMoistureStatus = (moisture: number): MoistureStatus => {
    if (moisture < 40) return 'dry';
    if (moisture > 70) return 'wet';
    return 'normal';
  };

  const getHealthStatus = (ndvi: number): HealthStatus => {
    if (ndvi >= 0.6) return 'healthy';
    if (ndvi >= 0.4) return 'improving';
    return 'stress';
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      good: 'bg-green-500',
      healthy: 'bg-green-500',
      normal: 'bg-green-500',
      improving: 'bg-yellow-500',
      low: 'bg-yellow-500',
      high: 'bg-yellow-500',
      acidic: 'bg-yellow-500',
      alkaline: 'bg-yellow-500',
      dry: 'bg-red-500',
      wet: 'bg-red-500',
      stress: 'bg-red-500',
    };
    return colorMap[status] || 'bg-gray-500';
  };

  const labels = {
    en: {
      title: 'AI-Powered Smart Agriculture',
      subtitle: 'Real-time sensor data + AI recommendations',
      soilNutrients: 'Soil Nutrients (NPK)',
      soilConditions: 'Soil Conditions',
      climate: 'Climate Data',
      cropHealth: 'Crop Health (NDVI)',
      aiRecommendations: 'AI Recommendations',
      actionPlan: '2-Day Action Plan',
      fertilizer: 'Fertilizer Plan',
      soilAdvice: 'Soil Advice',
      irrigation: 'Irrigation',
      pestWarning: 'Pest Warning',
      dataSource: 'Data Source',
      sensors: 'Sensors',
      apis: 'APIs',
    },
    te: {
      title: 'AI ఆధారిత స్మార్ట్ వ్యవసాయం',
      subtitle: 'రియల్-టైం సెన్సార్ డేటా + AI సిఫార్సులు',
      soilNutrients: 'నేల పోషకాలు (NPK)',
      soilConditions: 'నేల పరిస్థితులు',
      climate: 'వాతావరణ డేటా',
      cropHealth: 'పంట ఆరోగ్యం (NDVI)',
      aiRecommendations: 'AI సిఫార్సులు',
      actionPlan: '2-రోజుల కార్యాచరణ ప్రణాళిక',
      fertilizer: 'ఎరువుల ప్రణాళిక',
      soilAdvice: 'నేల సలహా',
      irrigation: 'నీటిపారుదల',
      pestWarning: 'పురుగుల హెచ్చరిక',
      dataSource: 'డేటా మూలం',
      sensors: 'సెన్సార్లు',
      apis: 'APIలు',
    },
  };

  const t = labels[language];

  if (dataLoading) {
    return (
      <Card className="data-card">
        <CardContent className="flex justify-center items-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (dataError) {
    return (
      <Card className="data-card">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>Error loading data: {dataError.message}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!agriData) return null;

  const nStatus = getNPKStatus(agriData.n, 'n');
  const pStatus = getNPKStatus(agriData.p, 'p');
  const kStatus = getNPKStatus(agriData.k, 'k');
  const phStatus = getpHStatus(agriData.ph);
  const moistureStatus = getMoistureStatus(agriData.moisture);
  const healthStatus = getHealthStatus(agriData.ndvi);

  return (
    <Card className="data-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">{t.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
          </div>
          <div className="flex gap-2 text-xs">
            <Badge variant={agriData.dataSource.sensors ? 'default' : 'secondary'}>
              {t.sensors} {agriData.dataSource.sensors ? '✓' : '✗'}
            </Badge>
            <Badge variant={agriData.dataSource.weather || agriData.dataSource.satellite ? 'default' : 'secondary'}>
              {t.apis} {agriData.dataSource.weather || agriData.dataSource.satellite ? '✓' : '✗'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* NPK Status */}
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            {t.soilNutrients}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <StatusCard
              label="N (Nitrogen)"
              value={agriData.n}
              unit="ppm"
              status={nStatus}
              color={getStatusColor(nStatus)}
            />
            <StatusCard
              label="P (Phosphorus)"
              value={agriData.p}
              unit="ppm"
              status={pStatus}
              color={getStatusColor(pStatus)}
            />
            <StatusCard
              label="K (Potassium)"
              value={agriData.k}
              unit="ppm"
              status={kStatus}
              color={getStatusColor(kStatus)}
            />
          </div>
        </div>

        {/* Soil Conditions */}
        <div>
          <h3 className="font-semibold text-lg mb-3">{t.soilConditions}</h3>
          <div className="grid grid-cols-2 gap-4">
            <StatusCard
              label="pH Level"
              value={agriData.ph.toFixed(1)}
              unit=""
              status={phStatus}
              color={getStatusColor(phStatus)}
            />
            <StatusCard
              label="Soil Moisture"
              value={agriData.moisture}
              unit="%"
              status={moistureStatus}
              color={getStatusColor(moistureStatus)}
              icon={<Droplets className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Climate */}
        <div>
          <h3 className="font-semibold text-lg mb-3">{t.climate}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Thermometer className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-xl font-bold">{agriData.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Wind className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-xl font-bold">{agriData.humidity}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Crop Health */}
        <div>
          <h3 className="font-semibold text-lg mb-3">{t.cropHealth}</h3>
          <StatusCard
            label="NDVI Score"
            value={agriData.ndvi.toFixed(2)}
            unit=""
            status={healthStatus}
            color={getStatusColor(healthStatus)}
            large
          />
        </div>

        {/* AI Recommendations */}
        {aiLoading && (
          <div className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {aiError && (
          <Alert variant="destructive">
            <AlertDescription>AI recommendations unavailable: {aiError.message}</AlertDescription>
          </Alert>
        )}

        {aiRec && (
          <div className="space-y-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
            <h3 className="font-bold text-xl text-primary flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6" />
              {t.aiRecommendations}
            </h3>

            <RecommendationSection title={t.fertilizer} content={aiRec.fertilizer_plan} />
            <RecommendationSection title={t.soilAdvice} content={aiRec.soil_advice} />
            <RecommendationSection title={t.irrigation} content={aiRec.irrigation} />
            <RecommendationSection 
              title={t.pestWarning} 
              content={aiRec.pest_warning} 
              warning 
            />

            {/* Action Plan */}
            <div className="mt-4 p-4 bg-background rounded-lg border">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                {t.actionPlan}
              </h4>
              <ul className="space-y-2">
                {aiRec.two_day_action_plan.map((action, idx) => (
                  <li key={idx} className="flex gap-2 items-start">
                    <span className="font-bold text-primary min-w-[24px]">{idx + 1}.</span>
                    <span className="text-base leading-relaxed">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper Components
function StatusCard({ 
  label, 
  value, 
  unit, 
  status, 
  color, 
  icon, 
  large = false 
}: { 
  label: string; 
  value: string | number; 
  unit: string; 
  status: string; 
  color: string; 
  icon?: React.ReactNode;
  large?: boolean;
}) {
  return (
    <div className={`p-4 bg-muted/30 rounded-lg border-l-4 ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className={`font-bold ${large ? 'text-3xl' : 'text-2xl'}`}>
        {value}{unit}
      </p>
      <Badge variant="outline" className="mt-2 capitalize">
        {status}
      </Badge>
    </div>
  );
}

function RecommendationSection({ 
  title, 
  content, 
  warning = false 
}: { 
  title: string; 
  content: string; 
  warning?: boolean;
}) {
  return (
    <div className={`p-3 rounded-lg ${warning ? 'bg-amber-50 dark:bg-amber-950/20' : 'bg-background'}`}>
      <h4 className={`font-semibold mb-2 ${warning ? 'text-amber-700 dark:text-amber-400' : ''}`}>
        {title}
      </h4>
      <p className="text-base leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  );
}
