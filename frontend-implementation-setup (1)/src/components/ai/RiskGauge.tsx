import { cn } from '@/utils/cn';

interface RiskGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const getColor = (score: number) => {
  if (score >= 80) return '#EF4444';
  if (score >= 60) return '#F59E0B';
  if (score >= 40) return '#3B82F6';
  return '#10B981';
};

const getLabel = (score: number) => {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
};

const sizeMap = {
  sm: { r: 32, size: 80, strokeWidth: 5, textSize: 'text-lg', labelSize: 'text-[8px]' },
  md: { r: 52, size: 120, strokeWidth: 7, textSize: 'text-2xl', labelSize: 'text-[10px]' },
  lg: { r: 70, size: 160, strokeWidth: 9, textSize: 'text-4xl', labelSize: 'text-xs' },
};

export const RiskGauge = ({ score, size = 'md', showLabel = true }: RiskGaugeProps) => {
  const cfg = sizeMap[size];
  const center = cfg.size / 2;
  const circumference = 2 * Math.PI * cfg.r;
  const offset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference;
  const color = getColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={cfg.size}
        height={cfg.size}
        className="transform -rotate-90"
        viewBox={`0 0 ${cfg.size} ${cfg.size}`}
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={cfg.r}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={cfg.strokeWidth}
          fill="transparent"
        />
        {/* Progress */}
        <circle
          cx={center}
          cy={center}
          r={cfg.r}
          stroke={color}
          strokeWidth={cfg.strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-bold tabular-nums leading-none', cfg.textSize)} style={{ color }}>
          {score}
        </span>
        {showLabel && (
          <span className={cn('font-bold uppercase tracking-widest mt-0.5 text-gray-500', cfg.labelSize)}>
            {getLabel(score)}
          </span>
        )}
      </div>
    </div>
  );
};
