import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  iconColor?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const StatCard = ({
  label,
  value,
  change,
  changeLabel = 'vs last month',
  icon,
  iconColor = '#10B981',
  prefix,
  suffix,
  className,
}: StatCardProps) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <GlassPanel hoverable className={cn('group', className)}>
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">{label}</p>
        {icon && (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${iconColor}18`, color: iconColor }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="flex items-baseline gap-1">
          {prefix && <span className="text-lg text-gray-400">{prefix}</span>}
          <span className="text-3xl font-bold text-white tabular-nums tracking-tight">{value}</span>
          {suffix && <span className="text-sm text-gray-400">{suffix}</span>}
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-semibold',
              isPositive ? 'text-[#10B981]' : 'text-red-400'
            )}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-[11px] text-gray-600">{changeLabel}</span>
        </div>
      )}
    </GlassPanel>
  );
};
