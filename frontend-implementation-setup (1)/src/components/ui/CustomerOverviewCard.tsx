import { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { ArrowUpRight } from 'lucide-react';

interface CustomerOverviewCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  accent?: 'emerald' | 'blue' | 'amber' | 'red';
  onClick?: () => void;
  trend?: { value: number; label: string };
}

const accentMap = {
  emerald: {
    icon: 'bg-[#10B981]/15 text-[#10B981]',
    border: 'border-[#10B981]/15 hover:border-[#10B981]/30',
    value: 'text-[#10B981]',
  },
  blue: {
    icon: 'bg-blue-500/15 text-blue-400',
    border: 'border-blue-500/15 hover:border-blue-500/30',
    value: 'text-blue-400',
  },
  amber: {
    icon: 'bg-amber-500/15 text-amber-400',
    border: 'border-amber-500/15 hover:border-amber-500/30',
    value: 'text-amber-400',
  },
  red: {
    icon: 'bg-red-500/15 text-red-400',
    border: 'border-red-500/15 hover:border-red-500/30',
    value: 'text-red-400',
  },
};

export const CustomerOverviewCard = ({
  title,
  value,
  description,
  icon,
  accent = 'emerald',
  onClick,
  trend,
}: CustomerOverviewCardProps) => {
  const colors = accentMap[accent];

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative rounded-xl border bg-white/[0.03] p-5 transition-all duration-200',
        colors.border,
        onClick && 'cursor-pointer hover:bg-white/[0.05]'
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', colors.icon)}>
            {icon}
          </div>
        )}
        {onClick && (
          <ArrowUpRight
            size={16}
            className="text-gray-600 group-hover:text-gray-400 transition-colors ml-auto"
          />
        )}
      </div>

      {/* Value */}
      <p className={cn('text-3xl font-bold tabular-nums', colors.value)}>{value}</p>

      {/* Title */}
      <p className="mt-1 text-sm font-semibold text-gray-300">{title}</p>

      {/* Description / trend */}
      {description && (
        <p className="mt-1 text-xs text-gray-500 leading-relaxed">{description}</p>
      )}

      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={cn(
              'text-xs font-semibold',
              trend.value >= 0 ? 'text-[#10B981]' : 'text-red-400'
            )}
          >
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs text-gray-600">{trend.label}</span>
        </div>
      )}
    </div>
  );
};
