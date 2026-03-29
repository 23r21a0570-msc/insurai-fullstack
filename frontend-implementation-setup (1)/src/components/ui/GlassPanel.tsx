import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  elevated?: boolean;
  accent?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const GlassPanel = ({
  children,
  className,
  hoverable,
  elevated,
  accent,
  padding = 'md',
  ...props
}: GlassPanelProps) => {
  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200',
        // Base glass style
        'bg-white/[0.03] border-white/[0.07]',
        // Padding variants
        padding === 'none' && 'p-0',
        padding === 'sm' && 'p-4',
        padding === 'md' && 'p-5',
        padding === 'lg' && 'p-7',
        // Modifiers
        hoverable && 'cursor-pointer hover:bg-white/[0.05] hover:border-white/[0.12]',
        elevated && 'shadow-xl shadow-black/20',
        accent && 'border-[#10B981]/20 bg-[#10B981]/[0.04]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
