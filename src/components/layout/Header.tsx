import { Sprout, Cloud, Satellite, Leaf, Bell, Calendar as CalendarIcon, MapPin, History } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  const navItems: NavItemConfig[] = [
    { icon: Satellite, label: t(language, 'header.satellite'), to: '/#satellite', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900' },
    { icon: Cloud, label: t(language, 'header.weather'), to: '/#weather', color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900' },
    { icon: Leaf, label: t(language, 'header.analysis'), to: '/#analysis', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900' },
    { icon: MapPin, label: t(language, 'header.map'), to: '/#map', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900' },
    { icon: Bell, label: t(language, 'header.alerts'), to: '/#alerts', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900' },
    { icon: CalendarIcon, label: t(language, 'header.calendar'), to: '/#calendar', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900' },
    { icon: History, label: 'Historical', to: '/historical', color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
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
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (to.startsWith('/#')) {
      e.preventDefault();
      const sectionId = to.substring(2);
      const hash = to.substring(1);
      
      // Navigate to dashboard with hash preserved
      if (location.pathname !== '/') {
        navigate('/' + hash);
        return;
      }
      
      // Already on dashboard - update hash and scroll directly
      window.location.hash = hash;
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <Link 
      to={to}
      onClick={handleClick}
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
