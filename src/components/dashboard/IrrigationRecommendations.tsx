import { Droplets, Calendar, Clock, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

export default function IrrigationRecommendations() {
  const { language } = useLanguage();
  
  const recommendation = {
    waterNeeded: 25,
    nextIrrigation: language === 'en' ? 'Tomorrow, 6:00 AM' : 'రేపు, ఉదయం 6:00',
    frequency: language === 'en' ? 'Every 3 days' : 'ప్రతి 3 రోజులకు',
    reason: language === 'en' 
      ? 'Based on current soil moisture (35%) and upcoming weather forecast'
      : 'ప్రస్తుత నేల తేమ (35%) మరియు రాబోయే వాతావరణ అంచనా ఆధారంగా',
  };

  const tips = language === 'en' ? [
    'Water early morning to reduce evaporation losses',
    'Monitor soil moisture levels after each irrigation',
    'Adjust schedule based on rainfall predictions',
  ] : [
    'ఆవిరి నష్టాలను తగ్గించడానికి ఉదయాన్నే నీరు ఇవ్వండి',
    'ప్రతి నీటిపారుదల తర్వాత నేల తేమ స్థాయిలను పర్యవేక్షించండి',
    'వర్షపాతం అంచనాల ఆధారంగా షెడ్యూల్‌ను సర్దుబాటు చేయండి',
  ];

  return (
    <Card className="data-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Droplets className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle>{t(language, 'irrigation.title')}</CardTitle>
            <CardDescription>{t(language, 'irrigation.description')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <RecommendationCard
            icon={Droplets}
            label={t(language, 'irrigation.waterRequired')}
            value={`${recommendation.waterNeeded} mm`}
            color="text-blue-500"
          />
          <RecommendationCard
            icon={Calendar}
            label={t(language, 'irrigation.nextSchedule')}
            value={recommendation.nextIrrigation}
            color="text-green-500"
          />
          <RecommendationCard
            icon={Clock}
            label={language === 'en' ? 'Frequency' : 'ఫ్రీక్వెన్సీ'}
            value={recommendation.frequency}
            color="text-purple-500"
          />
        </div>

        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">
              {language === 'en' ? 'Analysis' : 'విశ్లేషణ'}
            </h4>
            <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {tips.map((tip, index) => (
            <IrrigationTip key={index} tip={tip} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendationCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-5 w-5 ${color}`} />
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}

function IrrigationTip({ tip }: { tip: string }) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
      <span>{tip}</span>
    </div>
  );
}
