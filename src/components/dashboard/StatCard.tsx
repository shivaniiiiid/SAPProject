import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'success' | 'warning' | 'danger' | 'info';
}

export default function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  status = 'info',
}: StatCardProps) {
  const statusColors = {
    success: 'bg-green-100 text-green-700 border-2 border-green-500 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-2 border-yellow-500 dark:bg-yellow-900 dark:text-yellow-200',
    danger: 'bg-red-100 text-red-700 border-2 border-red-500 dark:bg-red-900 dark:text-red-200',
    info: 'bg-blue-100 text-blue-700 border-2 border-blue-500 dark:bg-blue-900 dark:text-blue-200',
  };

  return (
    <div className={`stat-card group border-2 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${statusColors[status]}`}>
      <div className="flex items-start justify-between mb-6">
        <div className={`p-4 rounded-full ${statusColors[status]} group-hover:scale-125 transition-transform`}>
          <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>
        {trend && trendValue && (
          <div className={`text-sm sm:text-base font-bold px-3 py-2 rounded-full ${
            trend === 'up' ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' : 
            trend === 'down' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' : 
            'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          }`}>
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-base sm:text-lg font-bold mb-3 opacity-80">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-5xl sm:text-6xl font-black">{value}</p>
          {unit && <span className="text-2xl sm:text-3xl font-bold opacity-75">{unit}</span>}
        </div>
      </div>
    </div>
  );
}
