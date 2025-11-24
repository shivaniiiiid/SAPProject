import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Droplets, Leaf, Sprout, Bug, Scissors } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { CropType, Region, Season } from '@/types/cropCalendar';
import { motion } from 'framer-motion';

const taskIcons = {
  sowing: Sprout,
  fertilizing: Leaf,
  irrigation: Droplets,
  pestControl: Bug,
  harvesting: Scissors,
};

const taskColors = {
  sowing: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  fertilizing: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  irrigation: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  pestControl: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  harvesting: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
};

// Mock calendar data generator
const generateCalendarData = (crop: CropType, region: Region, season: Season, language: string) => {
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];

  const templates: Record<CropType, any> = {
    rice: {
      kharif: [
        { month: 'june', tasks: [
          { type: 'sowing', description: language === 'en' ? 'Prepare nursery beds and sow seeds' : 'నర్సరీ పడకలు సిద్ధం చేసి విత్తనాలు విత్తండి' },
          { type: 'irrigation', description: language === 'en' ? 'Ensure adequate water supply' : 'తగినంత నీటి సరఫరా నిర్ధారించండి' }
        ]},
        { month: 'july', tasks: [
          { type: 'sowing', description: language === 'en' ? 'Transplant seedlings to main field' : 'మొక్కలను ప్రధాన పొలంలోకి బదిలీ చేయండి' },
          { type: 'fertilizing', description: language === 'en' ? 'Apply first dose of NPK fertilizer' : 'NPK ఎరువు మొదటి మోతాదు వేయండి' }
        ]},
        { month: 'august', tasks: [
          { type: 'irrigation', description: language === 'en' ? 'Maintain water level 2-3 inches' : 'నీటి స్థాయి 2-3 అంగుళాలు నిర్వహించండి' },
          { type: 'pestControl', description: language === 'en' ? 'Monitor for stem borer and leaf folder' : 'కాండం తొలచి, ఆకు మడతపురుగుల కోసం పర్యవేక్షించండి' }
        ]},
        { month: 'september', tasks: [
          { type: 'fertilizing', description: language === 'en' ? 'Apply second dose of fertilizer' : 'ఎరువు రెండవ మోతాదు వేయండి' },
          { type: 'irrigation', description: language === 'en' ? 'Continue regular irrigation' : 'క్రమమైన నీటిపారుదల కొనసాగించండి' }
        ]},
        { month: 'october', tasks: [
          { type: 'harvesting', description: language === 'en' ? 'Harvest when 80% grains are mature' : '80% ధాన్యాలు పక్వం అయినప్పుడు కోయండి' }
        ]}
      ]
    },
    wheat: {
      rabi: [
        { month: 'november', tasks: [
          { type: 'sowing', description: language === 'en' ? 'Sow wheat seeds at 100 kg/ha' : 'గోధుమ విత్తనాలు 100 కిలోలు/హెక్టారుకు విత్తండి' }
        ]},
        { month: 'december', tasks: [
          { type: 'fertilizing', description: language === 'en' ? 'Apply nitrogen and phosphorus' : 'నత్రజని మరియు భాస్వరం వేయండి' },
          { type: 'irrigation', description: language === 'en' ? 'First irrigation 20-25 days after sowing' : 'విత్తిన 20-25 రోజుల తర్వాత మొదటి నీటిపారుదల' }
        ]},
        { month: 'january', tasks: [
          { type: 'irrigation', description: language === 'en' ? 'Second irrigation during tillering' : 'పుట్టుట సమయంలో రెండవ నీటిపారుదల' },
          { type: 'pestControl', description: language === 'en' ? 'Control aphids and termites' : 'ఎఫిడ్స్ మరియు చెదలు నియంత్రించండి' }
        ]},
        { month: 'february', tasks: [
          { type: 'irrigation', description: language === 'en' ? 'Irrigation during flowering' : 'పుష్పించే సమయంలో నీటిపారుదల' }
        ]},
        { month: 'march', tasks: [
          { type: 'harvesting', description: language === 'en' ? 'Harvest when grains turn golden brown' : 'ధాన్యాలు బంగారు గోధుమ రంగులోకి మారినప్పుడు కోయండి' }
        ]}
      ]
    },
    cotton: {
      kharif: [
        { month: 'june', tasks: [
          { type: 'sowing', description: language === 'en' ? 'Sow cotton seeds 30-45 cm apart' : 'పత్తి విత్తనాలు 30-45 సెం.మీ దూరంలో విత్తండి' }
        ]},
        { month: 'july', tasks: [
          { type: 'fertilizing', description: language === 'en' ? 'Apply urea and DAP' : 'యూరియా మరియు DAP వేయండి' },
          { type: 'pestControl', description: language === 'en' ? 'Monitor for bollworm' : 'బోల్వార్మ్ కోసం పర్యవేక్షించండి' }
        ]},
        { month: 'august', tasks: [
          { type: 'irrigation', description: language === 'en' ? 'Critical irrigation during flowering' : 'పుష్పించే సమయంలో కీలకమైన నీటిపారుదల' }
        ]},
        { month: 'september', tasks: [
          { type: 'pestControl', description: language === 'en' ? 'Control whitefly and jassids' : 'వైట్ఫ్లై మరియు జాసిడ్స్ నియంత్రించండి' }
        ]},
        { month: 'october', tasks: [
          { type: 'harvesting', description: language === 'en' ? 'First picking when bolls open' : 'బొమ్మలు తెరుచుకున్నప్పుడు మొదటి పండించడం' }
        ]},
        { month: 'november', tasks: [
          { type: 'harvesting', description: language === 'en' ? 'Continue picking at 15-day intervals' : '15-రోజుల వ్యవధిలో పండించడం కొనసాగించండి' }
        ]}
      ]
    },
    sugarcane: {
      kharif: [
        { month: 'february', tasks: [
          { type: 'sowing', description: language === 'en' ? 'Plant sugarcane sets' : 'చెరకు పెంకులు నాటండి' }
        ]},
        { month: 'march', tasks: [
          { type: 'fertilizing', description: language === 'en' ? 'Apply organic manure' : 'సేంద్రీయ ఎరువులు వేయండి' }
        ]},
        { month: 'april', tasks: [
          { type: 'irrigation', description: language === 'en' ? 'Regular irrigation every 7-10 days' : 'ప్రతి 7-10 రోజులకు క్రమమైన నీటిపారుదల' }
        ]},
        { month: 'may', tasks: [
          { type: 'fertilizing', description: language === 'en' ? 'Apply nitrogen fertilizer' : 'నత్రజని ఎరువులు వేయండి' }
        ]},
        { month: 'october', tasks: [
          { type: 'pestControl', description: language === 'en' ? 'Control borers and rats' : 'తొలచేవారు మరియు ఎలుకలు నియంత్రించండి' }
        ]},
        { month: 'december', tasks: [
          { type: 'harvesting', description: language === 'en' ? 'Harvest at 10-12 months' : '10-12 నెలల్లో కోయండి' }
        ]}
      ]
    },
    maize: {
      kharif: [
        { month: 'june', tasks: [
          { type: 'sowing', description: language === 'en' ? 'Sow maize seeds 20 kg/ha' : 'మొక్కజొన్న విత్తనాలు 20 కిలోలు/హెక్టారు విత్తండి' }
        ]},
        { month: 'july', tasks: [
          { type: 'fertilizing', description: language === 'en' ? 'Apply NPK fertilizer' : 'NPK ఎరువులు వేయండి' },
          { type: 'irrigation', description: language === 'en' ? 'Irrigation at 20-25 days' : '20-25 రోజులకు నీటిపారుదల' }
        ]},
        { month: 'august', tasks: [
          { type: 'pestControl', description: language === 'en' ? 'Control stem borer and fall armyworm' : 'కాండం తొలచి మరియు ఫాల్ ఆర్మీవార్మ్ నియంత్రించండి' }
        ]},
        { month: 'september', tasks: [
          { type: 'harvesting', description: language === 'en' ? 'Harvest when kernels are hard' : 'గింజలు గట్టిగా ఉన్నప్పుడు కోయండి' }
        ]}
      ]
    },
    tomato: {
      rabi: [
        { month: 'september', tasks: [
          { type: 'sowing', description: language === 'en' ? 'Sow seeds in nursery' : 'నర్సరీలో విత్తనాలు విత్తండి' }
        ]},
        { month: 'october', tasks: [
          { type: 'sowing', description: language === 'en' ? 'Transplant seedlings' : 'మొక్కలను బదిలీ చేయండి' },
          { type: 'fertilizing', description: language === 'en' ? 'Apply basal fertilizer' : 'బేసల్ ఎరువులు వేయండి' }
        ]},
        { month: 'november', tasks: [
          { type: 'irrigation', description: language === 'en' ? 'Drip irrigation every 2-3 days' : 'ప్రతి 2-3 రోజులకు డ్రిప్ నీటిపారుదల' },
          { type: 'pestControl', description: language === 'en' ? 'Control whitefly and fruit borer' : 'వైట్ఫ్లై మరియు పండు తొలచి నియంత్రించండి' }
        ]},
        { month: 'december', tasks: [
          { type: 'fertilizing', description: language === 'en' ? 'Apply potassium for fruiting' : 'పండ్లు కాయడానికి పొటాషియం వేయండి' }
        ]},
        { month: 'january', tasks: [
          { type: 'harvesting', description: language === 'en' ? 'Harvest ripe fruits' : 'పండిన పండ్లను కోయండి' }
        ]},
        { month: 'february', tasks: [
          { type: 'harvesting', description: language === 'en' ? 'Continue harvesting' : 'కోత కొనసాగించండి' }
        ]}
      ]
    }
  };

  const cropData = templates[crop]?.[season] || [];
  return cropData;
};

export default function CropCalendar() {
  const { language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<CropType>('rice');
  const [selectedRegion, setSelectedRegion] = useState<Region>('telangana');
  const [selectedSeason, setSelectedSeason] = useState<Season>('kharif');

  const calendarData = generateCalendarData(selectedCrop, selectedRegion, selectedSeason, language);

  return (
    <Card className="data-card">
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>{t(language, 'calendar.title')}</CardTitle>
            <CardDescription>{t(language, 'calendar.description')}</CardDescription>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t(language, 'calendar.selectCrop')}</label>
            <Select value={selectedCrop} onValueChange={(value) => setSelectedCrop(value as CropType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rice">{t(language, 'calendar.rice')}</SelectItem>
                <SelectItem value="wheat">{t(language, 'calendar.wheat')}</SelectItem>
                <SelectItem value="cotton">{t(language, 'calendar.cotton')}</SelectItem>
                <SelectItem value="sugarcane">{t(language, 'calendar.sugarcane')}</SelectItem>
                <SelectItem value="maize">{t(language, 'calendar.maize')}</SelectItem>
                <SelectItem value="tomato">{t(language, 'calendar.tomato')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t(language, 'calendar.selectRegion')}</label>
            <Select value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as Region)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="telangana">{t(language, 'calendar.telangana')}</SelectItem>
                <SelectItem value="andhra">{t(language, 'calendar.andhra')}</SelectItem>
                <SelectItem value="karnataka">{t(language, 'calendar.karnataka')}</SelectItem>
                <SelectItem value="maharashtra">{t(language, 'calendar.maharashtra')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t(language, 'calendar.selectSeason')}</label>
            <Select value={selectedSeason} onValueChange={(value) => setSelectedSeason(value as Season)}>
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
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {calendarData.map((monthData: any, index: number) => (
            <motion.div
              key={monthData.month}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-muted/30 rounded-lg border"
            >
              <h3 className="font-bold text-lg mb-3 capitalize">
                {t(language, `calendar.${monthData.month}`)}
              </h3>
              <div className="space-y-2">
                {monthData.tasks.map((task: any, taskIndex: number) => {
                  const TaskIcon = taskIcons[task.type as keyof typeof taskIcons];
                  return (
                    <div
                      key={taskIndex}
                      className={`flex items-start gap-3 p-3 rounded-lg ${taskColors[task.type as keyof typeof taskColors]}`}
                    >
                      <TaskIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <Badge variant="outline" className="mb-2 capitalize">
                          {t(language, `calendar.${task.type}`)}
                        </Badge>
                        <p className="text-sm">{task.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
