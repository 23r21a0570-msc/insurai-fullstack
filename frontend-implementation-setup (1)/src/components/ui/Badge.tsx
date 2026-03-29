import { RiskLevel, ClaimStatus } from '@/types';
import { cn } from '@/utils/cn';
import { getRiskColor, getRiskBgColor, getStatusColor, getStatusBgColor, formatStatus } from '@/utils/formatters';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
}

export const RiskBadge = ({ level, size = 'md' }: RiskBadgeProps) => {
  const color = getRiskColor(level);
  const bg = getRiskBgColor(level);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded font-bold uppercase tracking-wider border',
        size === 'sm' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'
      )}
      style={{ color, backgroundColor: bg, borderColor: `${color}33` }}
    >
      <span
        className={cn('rounded-full shrink-0', size === 'sm' ? 'h-1 w-1' : 'h-1.5 w-1.5')}
        style={{ backgroundColor: color }}
      />
      {level}
    </span>
  );
};

interface StatusBadgeProps {
  status: ClaimStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const color = getStatusColor(status);
  const bg = getStatusBgColor(status);

  return (
    <span
      className={cn(
        'inline-flex items-center rounded font-semibold border',
        size === 'sm' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[11px]'
      )}
      style={{ color, backgroundColor: bg, borderColor: `${color}30` }}
    >
      {formatStatus(status)}
    </span>
  );
};
