import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Calendar, Loader2 } from 'lucide-react';
import { useHistoricalDataByDate } from '@/hooks/useHistoricalData';
import { exportToCSV } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function HistoricalData() {
  const { language } = useLanguage();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [queryEnabled, setQueryEnabled] = useState(false);

  const { data: readings, isLoading, refetch } = useHistoricalDataByDate(
    startDate,
    endDate,
    queryEnabled
  );

  const handleSearch = () => {
    if (!startDate || !endDate) {
      toast.error(language === 'en' ? 'Please select both dates' : 'దయచేసి రెండు తేదీలను ఎంచుకోండి');
      return;
    }
    setQueryEnabled(true);
    refetch();
  };

  const handleExport = () => {
    if (!readings || readings.length === 0) {
      toast.error(language === 'en' ? 'No data to export' : 'ఎగుమతి చేయడానికి డేటా లేదు');
      return;
    }
    exportToCSV(readings, `sensor_data_${startDate}_to_${endDate}.csv`);
    toast.success(language === 'en' ? 'Data exported successfully!' : 'డేటా విజయవంతంగా ఎగుమతి చేయబడింది!');
  };

  return (
    <div className="min-h-screen bg-earth-gradient">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t(language, 'dashboard.historicalData')}
          </h2>
          <p className="text-muted-foreground mb-8">
            {language === 'en'
              ? 'View and export historical sensor readings'
              : 'చారిత్రక సెన్సార్ రీడింగ్‌లను చూడండి మరియు ఎగుమతి చేయండి'}
          </p>
        </motion.div>

        <Card className="data-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t(language, 'dashboard.selectDateRange')}
            </CardTitle>
            <CardDescription>
              {language === 'en'
                ? 'Choose a date range to view historical data'
                : 'చారిత్రక డేటాను చూడటానికి తేదీ పరిధిని ఎంచుకోండి'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="start-date">{t(language, 'dashboard.startDate')}</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-date">{t(language, 'dashboard.endDate')}</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleSearch} className="flex-1">
                  {t(language, 'dashboard.search')}
                </Button>
                {readings && readings.length > 0 && (
                  <Button onClick={handleExport} variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="data-card">
          <CardHeader>
            <CardTitle>
              {t(language, 'dashboard.results')}
              {readings && ` (${readings.length} ${language === 'en' ? 'records' : 'రికార్డులు'})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : !readings || readings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {language === 'en'
                  ? 'No data found for the selected date range'
                  : 'ఎంచుకున్న తేదీ పరిధికి డేటా కనుగొనబడలేదు'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t(language, 'dashboard.timestamp')}</TableHead>
                      <TableHead>{t(language, 'weather.temperature')}</TableHead>
                      <TableHead>{t(language, 'weather.humidity')}</TableHead>
                      <TableHead>{t(language, 'smartAgri.soilMoisture')}</TableHead>
                      <TableHead>{t(language, 'smartAgri.soilPH')}</TableHead>
                      <TableHead>N</TableHead>
                      <TableHead>P</TableHead>
                      <TableHead>K</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {readings.map((reading) => (
                      <TableRow key={reading.id}>
                        <TableCell>
                          {new Date(reading.created_at).toLocaleString(
                            language === 'te' ? 'te-IN' : 'en-IN'
                          )}
                        </TableCell>
                        <TableCell>{reading.temperature?.toFixed(1) ?? '--'}°C</TableCell>
                        <TableCell>{reading.humidity?.toFixed(1) ?? '--'}%</TableCell>
                        <TableCell>{reading.soil_moisture?.toFixed(1) ?? '--'}%</TableCell>
                        <TableCell>{reading.soil_ph?.toFixed(2) ?? '--'}</TableCell>
                        <TableCell>{reading.n_value?.toFixed(1) ?? '--'}</TableCell>
                        <TableCell>{reading.p_value?.toFixed(1) ?? '--'}</TableCell>
                        <TableCell>{reading.k_value?.toFixed(1) ?? '--'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
