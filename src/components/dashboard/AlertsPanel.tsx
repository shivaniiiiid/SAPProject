import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert as AlertUI, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Cloud, Bug, Droplets, Leaf, Info, X, Loader2 } from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { Alert, AlertType } from '@/types/alerts';
import { motion, AnimatePresence } from 'framer-motion';

const alertIcons: Record<AlertType, React.ElementType> = {
  weather: Cloud,
  pest: Bug,
  soil: Leaf,
  ndvi: Leaf,
  irrigation: Droplets,
};

export default function AlertsPanel() {
  const { language } = useLanguage();
  const { data: alerts, isLoading, error } = useAlerts();
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const activeAlerts = alerts?.filter((alert) => !dismissedAlerts.includes(alert.id)) || [];

  const dismissAlert = (id: string) => {
    setDismissedAlerts((prev) => [...prev, id]);
  };

  const clearAll = () => {
    setDismissedAlerts(alerts?.map((a) => a.id) || []);
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    const colors = {
      danger: 'border-red-500 bg-red-50 dark:bg-red-950/20',
      warning: 'border-amber-500 bg-amber-50 dark:bg-amber-950/20',
      info: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
    };
    return colors[severity];
  };

  const getSeverityBadge = (severity: Alert['severity']) => {
    const variants: Record<Alert['severity'], 'destructive' | 'default' | 'secondary'> = {
      danger: 'destructive',
      warning: 'default',
      info: 'secondary',
    };
    return variants[severity];
  };

  if (isLoading) {
    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle>{t(language, 'alerts.title')}</CardTitle>
          <CardDescription>{t(language, 'alerts.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle>{t(language, 'alerts.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <AlertUI variant="destructive">
            <AlertDescription>{error.message}</AlertDescription>
          </AlertUI>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="data-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {t(language, 'alerts.title')}
            </CardTitle>
            <CardDescription>{t(language, 'alerts.description')}</CardDescription>
          </div>
          {activeAlerts.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAll}>
              {t(language, 'alerts.clear')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {activeAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Info className="h-12 w-12 mb-4 opacity-50" />
            <p>{t(language, 'alerts.noAlerts')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {activeAlerts.map((alert) => {
                const Icon = alertIcons[alert.type];
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)} relative`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{alert.title}</h4>
                          <Badge variant={getSeverityBadge(alert.severity)} className="text-xs">
                            {t(language, `alerts.${alert.severity}`)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {alert.timestamp.toLocaleTimeString(language === 'te' ? 'te-IN' : 'en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
