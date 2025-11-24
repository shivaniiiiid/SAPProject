import { Sprout, Cloud, Satellite, Image, Calendar as CalendarIcon, AlertTriangle, MapIcon, History } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

export default function Header() {
  const { language } = useLanguage();
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md"></div>
              <div className="relative bg-agri-gradient p-2 rounded-lg">
                <Sprout className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">{t(language, 'header.title')}</h1>
              <p className="text-xs text-muted-foreground">{t(language, 'header.subtitle')}</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <NavItem icon={Satellite} label={t(language, 'header.satellite')} to="/" active={location.pathname === '/'} />
              <NavItem icon={Cloud} label={t(language, 'header.weather')} to="/" active={location.pathname === '/'} />
              <NavItem icon={Image} label={t(language, 'header.analysis')} to="/" active={location.pathname === '/'} />
              <NavItem icon={MapIcon} label={t(language, 'header.map')} to="/" active={location.pathname === '/'} />
              <NavItem icon={AlertTriangle} label={t(language, 'header.alerts')} to="/" active={location.pathname === '/'} />
              <NavItem icon={CalendarIcon} label={t(language, 'header.calendar')} to="/" active={location.pathname === '/'} />
              <NavItem icon={History} label="Historical" to="/historical" active={location.pathname === '/historical'} />
            </nav>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavItem({ icon: Icon, label, to, active }: { icon: any; label: string; to: string; active: boolean }) {
  return (
    <Link 
      to={to}
      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
        active ? 'text-primary' : 'text-muted-foreground hover:text-primary'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}
