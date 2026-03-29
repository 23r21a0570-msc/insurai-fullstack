import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  border?: boolean;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
  border = true,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center rounded-xl',
        border && 'border border-dashed border-white/[0.08] bg-white/[0.01]',
        className
      )}
      role="status"
      aria-label={title}
    >
      {icon && (
        <div className="mb-4 text-gray-700 opacity-60">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-gray-400">{title}</p>
      {description && (
        <p className="text-xs text-gray-600 mt-1.5 max-w-xs leading-relaxed">{description}</p>
      )}
      {action && (
        <div className="mt-5">{action}</div>
      )}
    </div>
  );
};
