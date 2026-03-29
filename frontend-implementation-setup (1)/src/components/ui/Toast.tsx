import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useContext } from 'react';
import { ToastContext } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: { border: 'border-[#10B981]/25', icon: 'text-[#10B981]', bg: 'bg-[#10B981]/[0.06]' },
  error: { border: 'border-red-500/25', icon: 'text-red-400', bg: 'bg-red-500/[0.06]' },
  warning: { border: 'border-amber-500/25', icon: 'text-amber-400', bg: 'bg-amber-500/[0.06]' },
  info: { border: 'border-blue-500/25', icon: 'text-blue-400', bg: 'bg-blue-500/[0.06]' },
};

export const Toast = () => <ToastContainer />;

export const ToastContainer = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;
  const { toasts, dismiss } = ctx;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        const style = colors[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 w-full rounded-xl p-4 border shadow-2xl shadow-black/40',
              'bg-[#0F1629] backdrop-blur-xl',
              'animate-slide-in-right',
              style.border
            )}
          >
            <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5', style.bg)}>
              <Icon size={14} className={style.icon} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-100">{toast.title}</p>
              {toast.message && (
                <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="shrink-0 text-gray-600 hover:text-white transition-colors mt-0.5"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
