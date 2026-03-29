import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
  lines?: number;
  variant?: 'text' | 'card' | 'avatar' | 'button';
}

export const Skeleton = ({ className, variant = 'text' }: SkeletonProps) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-white/[0.06]',
        variant === 'text' && 'h-4 w-full',
        variant === 'card' && 'h-32 w-full rounded-xl',
        variant === 'avatar' && 'h-10 w-10 rounded-full shrink-0',
        variant === 'button' && 'h-9 w-24 rounded-lg',
        className
      )}
      aria-hidden="true"
    />
  );
};

export const SkeletonCard = () => (
  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3" aria-hidden="true">
    <div className="flex items-center gap-3">
      <Skeleton variant="avatar" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />
    <Skeleton className="h-3 w-2/3" />
  </div>
);

export const SkeletonRow = ({ cols = 5 }: { cols?: number }) => (
  <div
    className="flex items-center gap-4 border-b border-white/[0.04] px-4 py-4"
    aria-hidden="true"
  >
    {Array.from({ length: cols }).map((_, i) => (
      <Skeleton key={i} className={cn('h-4', i === 0 ? 'w-24' : i === cols - 1 ? 'w-16' : 'flex-1')} />
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) => (
  <div className="rounded-xl border border-white/[0.06] overflow-hidden" aria-busy="true" aria-label="Loading data">
    <div className="border-b border-white/[0.06] bg-white/[0.02] px-4 py-3 flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3', i === 0 ? 'w-16' : 'flex-1')} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonRow key={i} cols={cols} />
    ))}
  </div>
);

export const SkeletonStatCards = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4" aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>
    ))}
  </div>
);
