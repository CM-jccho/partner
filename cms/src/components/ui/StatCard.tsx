import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'gold' | 'gray';
  className?: string;
}

const colorStyles = {
  blue: {
    icon: 'bg-blue-100 text-[#004399]',
    badge: 'text-[#004399]',
  },
  green: {
    icon: 'bg-emerald-100 text-emerald-600',
    badge: 'text-emerald-600',
  },
  red: {
    icon: 'bg-red-100 text-red-600',
    badge: 'text-red-600',
  },
  purple: {
    icon: 'bg-purple-100 text-purple-600',
    badge: 'text-purple-600',
  },
  gold: {
    icon: 'bg-amber-100 text-amber-600',
    badge: 'text-amber-600',
  },
  gray: {
    icon: 'bg-gray-100 text-gray-600',
    badge: 'text-gray-600',
  },
};

export default function StatCard({
  label,
  value,
  subValue,
  change,
  changeLabel,
  icon,
  color = 'blue',
  className,
}: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <div className={cn('bg-white rounded-xl p-5 border border-gray-100 shadow-sm', className)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        {icon && (
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', styles.icon)}>
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subValue && (
          <p className="text-sm text-gray-500">{subValue}</p>
        )}
      </div>

      {change !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1">
          {change > 0 ? (
            <TrendingUp size={14} className="text-emerald-500" />
          ) : change < 0 ? (
            <TrendingDown size={14} className="text-red-500" />
          ) : (
            <Minus size={14} className="text-gray-400" />
          )}
          <span
            className={cn(
              'text-xs font-medium',
              change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
            )}
          >
            {change > 0 ? '+' : ''}{change}%
          </span>
          {changeLabel && (
            <span className="text-xs text-gray-400">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
