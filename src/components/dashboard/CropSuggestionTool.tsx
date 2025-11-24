import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, TrendingUp, DollarSign, Loader2, Sprout } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { useCropSuggestion } from '@/hooks/useCropSuggestion';
import { CropSuggestionInput, SoilType } from '@/types/cropSuggestion';
import { motion } from 'framer-motion';

export default function CropSuggestionTool() {
  const { language } = useLanguage();
  const { mutate, data, isLoading, error } = useCropSuggestion(language);

  const [formData, setFormData] = useState<CropSuggestionInput>({
    soilType: 'loamy',
    season: 'kharif',
    location: 'Telangana',
    moisture: 55,
  });

  const handleSubmit = () => {
    mutate(formData);
  };

  const getSuitabilityColor = (level: string) => {
    const colors = {
      high: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      low: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[level as keyof typeof colors] || colors.medium;
  };

  return (
    <Card className="data-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-amber-500" />
          <div>
            <CardTitle>{t(language, 'cropSuggestion.title')}</CardTitle>
            <CardDescription>{t(language, 'cropSuggestion.description')}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{t(language, 'cropSuggestion.soilType')}</Label>
            <Select 
              value={formData.soilType} 
              onValueChange={(value) => setFormData({ ...formData, soilType: value as SoilType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clayey">{t(language, 'cropSuggestion.clayey')}</SelectItem>
                <SelectItem value="loamy">{t(language, 'cropSuggestion.loamy')}</SelectItem>
                <SelectItem value="sandy">{t(language, 'cropSuggestion.sandy')}</SelectItem>
                <SelectItem value="black">{t(language, 'cropSuggestion.black')}</SelectItem>
                <SelectItem value="red">{t(language, 'cropSuggestion.red')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t(language, 'cropSuggestion.season')}</Label>
            <Select 
              value={formData.season} 
              onValueChange={(value) => setFormData({ ...formData, season: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kharif">{t(language, 'calendar.kharif')}</SelectItem>
                <SelectItem value="rabi">{t(language, 'calendar.rabi')}</SelectItem>
                <SelectItem value="summer">{t(language, 'calendar.summer')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t(language, 'cropSuggestion.location')}</Label>
            <Input 
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder={language === 'en' ? 'e.g., Telangana' : 'ఉదా: తెలంగాణ'}
            />
          </div>

          <div>
            <Label>{t(language, 'cropSuggestion.moisture')} (%)</Label>
            <Input 
              type="number"
              value={formData.moisture}
              onChange={(e) => setFormData({ ...formData, moisture: Number(e.target.value) })}
              min={0}
              max={100}
            />
          </div>
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t(language, 'common.loading')}
            </>
          ) : (
            <>
              <Sprout className="h-4 w-4 mr-2" />
              {t(language, 'cropSuggestion.getSuggestions')}
            </>
          )}
        </Button>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mt-6"
          >
            <h3 className="font-bold text-lg">{t(language, 'cropSuggestion.topCrops')}</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {data.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-xl">{rec.crop}</h4>
                    <Badge className={getSuitabilityColor(rec.suitability)}>
                      {t(language, `cropSuggestion.${rec.suitability}`)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t(language, 'cropSuggestion.expectedYield')}</p>
                        <p className="font-semibold">{rec.expectedYield}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-amber-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t(language, 'cropSuggestion.estimatedCost')}</p>
                        <p className="font-semibold">{rec.estimatedCost}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                </motion.div>
              ))}
            </div>

            {/* Overall Analysis */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">
                {language === 'en' ? 'Overall Analysis' : 'మొత్తం విశ్లేషణ'}
              </h4>
              <p className="text-sm whitespace-pre-line">{data.analysis}</p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
