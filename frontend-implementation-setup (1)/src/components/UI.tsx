import { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, ReactNode, forwardRef, Fragment, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2, X, ChevronDown, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Info, AlertTriangle, Ghost, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { cn, formatPercentage, getRiskColor, getRiskBgColor, getStatusColor, formatStatus } from '@/lib/utils';
import type { RiskLevel, ClaimStatus } from '@/types';

// ─── Button ───────────────────────────────────────────────────────────────────
const btnVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:   'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600',
        secondary: 'bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10',
        outline:   'border border-emerald-500 text-emerald-500 hover:bg-emerald-500/10',
        ghost:     'text-gray-400 hover:text-white hover:bg-white/5',
        danger:    'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
        success:   'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20',
      },
      size: {
        sm:   'h-8 px-3 text-xs',
        md:   'h-10 px-4 py-2',
        lg:   'h-12 px-8 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof btnVariants> {
  isLoading?: boolean; leftIcon?: ReactNode; rightIcon?: ReactNode;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, ...props }, ref) => (
    <button className={cn(btnVariants({ variant, size, className }))} ref={ref} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : leftIcon ? <span className="mr-2">{leftIcon}</span> : null}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  )
);
Button.displayName = 'Button';

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; hint?: string; leftIcon?: ReactNode; }
export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, hint, leftIcon, ...props }, ref) => (
  <div className="w-full space-y-1.5">
    {label && <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>}
    <div className="relative">
      {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{leftIcon}</div>}
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 disabled:opacity-50 transition-all',
          leftIcon && 'pl-9',
          error && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
    {hint  && !error && <p className="text-xs text-gray-500">{hint}</p>}
  </div>
));
Input.displayName = 'Input';

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { label?: string; options: { label: string; value: string }[]; error?: string; }
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, label, options, error, ...props }, ref) => (
  <div className="w-full space-y-1.5">
    {label && <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>}
    <div className="relative">
      <select ref={ref} className={cn('appearance-none flex h-10 w-full rounded-lg border border-white/10 bg-[#0F1629] px-3 py-2 text-sm text-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 transition-all', error && 'border-red-500', className)} {...props}>
        {options.map(o => <option key={o.value} value={o.value} className="bg-[#0F1629]">{o.label}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
    </div>
    {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
  </div>
));
Select.displayName = 'Select';

// ─── GlassPanel ───────────────────────────────────────────────────────────────
interface GlassPanelProps { children: ReactNode; className?: string; hoverable?: boolean; }
export const GlassPanel = ({ children, className, hoverable }: GlassPanelProps) => (
  <div className={cn('bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl p-5 transition-all duration-300', hoverable && 'hover:border-white/20 hover:bg-white/[0.05]', className)}>
    {children}
  </div>
);

// ─── Badges ───────────────────────────────────────────────────────────────────
export const RiskBadge = ({ level, size = 'sm' }: { level: RiskLevel; size?: 'sm' | 'md' }) => (
  <span className={cn('inline-flex items-center rounded-full border font-medium', size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs')}
    style={{ color: getRiskColor(level), backgroundColor: getRiskBgColor(level), borderColor: `${getRiskColor(level)}33` }}>
    <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: getRiskColor(level) }} />
    {level.toUpperCase()}
  </span>
);

export const StatusBadge = ({ status, size = 'sm' }: { status: ClaimStatus; size?: 'sm' | 'md' }) => {
  const color = getStatusColor(status);
  return (
    <span className={cn('inline-flex items-center rounded border font-bold uppercase tracking-wider', size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs')}
      style={{ color, backgroundColor: `${color}15`, borderColor: `${color}33` }}>
      {formatStatus(status)}
    </span>
  );
};

// ─── StatCard ─────────────────────────────────────────────────────────────────
interface StatCardProps { label: string; value: string | number; change?: number; icon?: ReactNode; onClick?: () => void; }
export const StatCard = ({ label, value, change, icon, onClick }: StatCardProps) => (
  <GlassPanel hoverable={!!onClick} className={cn('border-white/5', onClick && 'cursor-pointer')} {...(onClick ? { onClick } : {})}>
    <div className="flex items-start justify-between">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      {icon && <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">{icon}</div>}
    </div>
    <div className="mt-3 flex items-baseline justify-between">
      <h3 className="text-2xl font-bold text-gray-100 tabular-nums">{value}</h3>
      {change !== undefined && (
        <span className={cn('flex items-center text-xs font-medium', change >= 0 ? 'text-emerald-500' : 'text-red-400')}>
          {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {formatPercentage(Math.abs(change))}
        </span>
      )}
    </div>
  </GlassPanel>
);

// ─── CustomerOverviewCard ─────────────────────────────────────────────────────
interface CustomerOverviewCardProps { title: string; value: string | number; description?: string; icon?: ReactNode; accent?: string; onClick?: () => void; }
export const CustomerOverviewCard = ({ title, value, description, icon, accent = 'emerald', onClick }: CustomerOverviewCardProps) => {
  const colors: Record<string, string> = { emerald: 'bg-emerald-500/10 text-emerald-500', blue: 'bg-blue-500/10 text-blue-400', amber: 'bg-amber-500/10 text-amber-400', purple: 'bg-purple-500/10 text-purple-400' };
  return (
    <GlassPanel hoverable={!!onClick} className={cn('border-white/5', onClick && 'cursor-pointer')} {...(onClick ? { onClick } : {})}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        {icon && <div className={cn('p-2.5 rounded-xl', colors[accent] ?? colors.emerald)}>{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-gray-100 tabular-nums">{value}</p>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </GlassPanel>
  );
};

// ─── DataTable ────────────────────────────────────────────────────────────────
interface Column<T> { key: string; header: string; accessor: keyof T | ((item: T) => ReactNode); className?: string; }
interface DataTableProps<T> { data: T[]; columns: Column<T>[]; onRowClick?: (item: T) => void; emptyMessage?: string; }
export function DataTable<T extends Record<string, unknown>>({ data, columns, onRowClick, emptyMessage = 'No records found.' }: DataTableProps<T>) {
  if (!data.length) return <EmptyState message={emptyMessage} />;
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]" role="table" aria-label="Data table">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead role="rowgroup">
            <tr className="border-b border-white/5 bg-white/[0.03]" role="row">
              {columns.map(col => <th key={col.key} className={cn('px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500', col.className)} role="columnheader">{col.header}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5" role="rowgroup">
            {data.map((item, ri) => (
              <tr key={ri} onClick={() => onRowClick?.(item)} className={cn('transition-colors hover:bg-white/[0.04]', onRowClick && 'cursor-pointer')} role="row">
                {columns.map(col => (
                  <td key={col.key} className={cn('px-4 py-4 text-sm text-gray-300', col.className)} role="cell">
                    {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
interface PaginationProps { page: number; total: number; onChange: (p: number) => void; }
export const Pagination = ({ page, total, onChange }: PaginationProps) => {
  if (total <= 1) return null;
  const pages = Array.from({ length: Math.min(total, 7) }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 text-gray-400" aria-label="Previous page"><ChevronLeft size={16} /></button>
      {pages.map(p => (
        <button key={p} onClick={() => onChange(p)} className={cn('w-9 h-9 rounded-lg text-sm font-medium transition-colors', p === page ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:bg-white/5')} aria-current={p === page ? 'page' : undefined}>{p}</button>
      ))}
      {total > 7 && <span className="text-gray-600 px-2">…{total}</span>}
      <button onClick={() => onChange(page + 1)} disabled={page === total} className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 text-gray-400" aria-label="Next page"><ChevronRight size={16} /></button>
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps { isOpen: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; }
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  const sizes = { sm: 'max-w-sm', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className={cn('w-full transform overflow-hidden rounded-2xl bg-[#0F1629] border border-white/10 p-6 shadow-2xl transition-all', sizes[size])} role="dialog" aria-modal="true">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-bold text-gray-100">{title}</Dialog.Title>
                  <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors" aria-label="Close modal"><X size={18} /></button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// ─── Toast Container ──────────────────────────────────────────────────────────
import { useToast } from '@/lib/contexts';

const toastIcons = { success: <CheckCircle className="text-emerald-500" size={18} />, error: <AlertCircle className="text-red-400" size={18} />, warning: <AlertTriangle className="text-amber-400" size={18} />, info: <Info className="text-blue-400" size={18} /> };
const toastBorders = { success: 'border-emerald-500/20', error: 'border-red-500/20', warning: 'border-amber-500/20', info: 'border-blue-500/20' };

export const ToastContainer = () => {
  const { toasts, dismiss } = useToast();
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={cn('flex items-center gap-3 min-w-[300px] max-w-sm p-4 rounded-xl bg-[#0F1629] border shadow-2xl animate-slide-in-right', toastBorders[t.type])}>
          {toastIcons[t.type]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-100">{t.title}</p>
            {t.message && <p className="text-xs text-gray-400 mt-0.5 truncate">{t.message}</p>}
          </div>
          <button onClick={() => dismiss(t.id)} className="text-gray-600 hover:text-white flex-shrink-0" aria-label="Dismiss"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
};

// ─── EmptyState ───────────────────────────────────────────────────────────────
interface EmptyStateProps { message?: string; action?: ReactNode; icon?: ReactNode; }
export const EmptyState = ({ message = 'No records found.', action, icon }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center p-16 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
    <div className="text-gray-700 mb-4">{icon ?? <Ghost size={40} />}</div>
    <p className="text-gray-500 text-sm font-medium text-center max-w-xs">{message}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-lg bg-white/5', className)} />
);

export const SkeletonCard = () => (
  <GlassPanel className="border-white/5 space-y-3">
    <Skeleton className="h-3 w-1/3" />
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-2 w-2/3" />
  </GlassPanel>
);

// ─── Tooltip ──────────────────────────────────────────────────────────────────
interface TooltipProps { content: string; children: ReactNode; position?: 'top' | 'bottom' | 'left' | 'right'; }
export const Tooltip = ({ content, children, position = 'top' }: TooltipProps) => {
  const [show, setShow] = useState(false);
  const pos = { top: 'bottom-full mb-2 left-1/2 -translate-x-1/2', bottom: 'top-full mt-2 left-1/2 -translate-x-1/2', left: 'right-full mr-2 top-1/2 -translate-y-1/2', right: 'left-full ml-2 top-1/2 -translate-y-1/2' };
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && <div className={cn('absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 border border-white/10 rounded-lg whitespace-nowrap pointer-events-none shadow-xl', pos[position])}>{content}</div>}
    </div>
  );
};
