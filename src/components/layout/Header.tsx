import { Sprout, Cloud, Satellite, Leaf, Bell, Calendar as CalendarIcon, MapPin, History } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface NavItemConfig {
  icon: any;
  label: string;
  to: string;
  color: string;
  bgColor: string;
}

export default function Header() {
  const { language } = useLanguage();
  const location = useLocation();
  
  const navItems: NavItemConfig[] = [
    { icon: Satellite, label: t(language, 'header.satellite'), to: '/', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900' },
    { icon: Cloud, label: t(language, 'header.weather'), to: '/', color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900' },
    { icon: Leaf, label: t(language, 'header.analysis'), to: '/', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900' },
    { icon: MapPin, label: t(language, 'header.map'), to: '/', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900' },
    { icon: Bell, label: t(language, 'header.alerts'), to: '/', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900' },
    { icon: CalendarIcon, label: t(language, 'header.calendar'), to: '/', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900' },
    { icon: History, label: 'Historical', to: '/historical', color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-3 py-3 sm:px-4 sm:py-4">
        {/* Top Row: Logo and Language */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
                <Sprout className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                {t(language, 'header.title')}
              </h1>
            </div>
          </Link>
          
          <LanguageSelector />
        </div>

        {/* Navigation Grid: Responsive layout */}
        <nav className="grid grid-cols-7 gap-1.5 sm:gap-2 w-full">
          {navItems.map((item) => (
            <NavItem 
              key={item.to} 
              {...item} 
              active={location.pathname === item.to}
            />
          ))}
        </nav>
      </div>
    </header>
  );
}

function NavItem({ 
  icon: Icon, 
  label, 
  to, 
  color, 
  bgColor,
  active 
}: NavItemConfig & { active: boolean }) {
  return (
    <Link 
      to={to}
      title={label}
      className={`flex flex-col items-center justify-center gap-1 p-2 sm:p-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${
        active 
          ? `${bgColor} ${color} shadow-md scale-105 font-semibold` 
          : `${bgColor} ${color} opacity-70 hover:opacity-100`
      }`}
    >
      <Icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
      <span className="text-xs sm:text-xs font-bold text-center leading-tight line-clamp-2 max-w-full">
        {label}
      </span>
    </Link>
  );
}
