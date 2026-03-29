import { useState } from 'react';
import { AlertCircle, RefreshCw, CreditCard, Check, Clock, ChevronRight, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/formatters';
import { useToast } from '@/context/ToastContext';

interface FailedPayment {
  id: string;
  policyNumber: string;
  amount: number;
  attemptedAt: string;
  failureReason: 'insufficient_funds' | 'card_expired' | 'card_declined' | 'network_error' | 'bank_blocked';
  retryCount: number;
  nextRetryAt?: string;
}

const FAILURE_LABELS: Record<string, { label: string; tip: string; color: string }> = {
  insufficient_funds: { label: 'Insufficient Funds',  tip: 'Ensure your account has enough balance.',        color: 'text-red-400'    },
  card_expired:       { label: 'Card Expired',         tip: 'Update your card in Payment Methods.',           color: 'text-orange-400' },
  card_declined:      { label: 'Card Declined',        tip: 'Contact your bank or try another card.',         color: 'text-red-400'    },
  network_error:      { label: 'Network Error',        tip: 'Temporary issue — retry usually succeeds.',      color: 'text-amber-400'  },
  bank_blocked:       { label: 'Blocked by Bank',      tip: 'Contact your bank to authorize the payment.',    color: 'text-orange-400' },
};

const MOCK_FAILED: FailedPayment[] = [
  {
    id: 'fp_1', policyNumber: 'POL-7821', amount: 1200,
    attemptedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    failureReason: 'insufficient_funds', retryCount: 2,
    nextRetryAt: new Date(Date.now() + 1 * 86400000).toISOString(),
  },
  {
    id: 'fp_2', policyNumber: 'POL-4392', amount: 2400,
    attemptedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    failureReason: 'card_declined', retryCount: 1,
    nextRetryAt: new Date(Date.now() + 12 * 3600000).toISOString(),
  },
];

export const FailedPaymentRetry = () => {
  const [payments, setPayments] = useState<FailedPayment[]>(MOCK_FAILED);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const { success, error } = useToast();

  const visible = payments.filter(p => !dismissed.includes(p.id));

  const handleRetry = async (payment: FailedPayment) => {
    setRetrying(payment.id);
    await new Promise(r => setTimeout(r, 2000));
    setRetrying(null);

    // Simulate success after 2+ retries or random success
    if (payment.retryCount >= 2 || Math.random() > 0.4) {
      success('Payment Successful', `${formatCurrency(payment.amount)} collected for ${payment.policyNumber}`);
      setPayments(prev => prev.filter(p => p.id !== payment.id));
    } else {
      error('Payment Failed Again', 'Please update your payment method or contact your bank.');
      setPayments(prev =>
        prev.map(p => p.id === payment.id ? { ...p, retryCount: p.retryCount + 1, attemptedAt: new Date().toISOString() } : p)
      );
    }
  };

  if (visible.length === 0) return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
      <Check size={18} className="text-emerald-400 shrink-0" />
      <p className="text-sm text-emerald-300">All payments are up to date. No failed transactions.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertCircle size={16} className="text-red-400" />
        <h3 className="text-sm font-bold text-white">Failed Payments ({visible.length})</h3>
      </div>

      {visible.map(payment => {
        const info = FAILURE_LABELS[payment.failureReason];
        const isRetrying = retrying === payment.id;
        return (
          <div
            key={payment.id}
            className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-400 shrink-0">
                  <CreditCard size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">{payment.policyNumber}</span>
                    <span className="text-lg font-bold text-red-300 tabular-nums">{formatCurrency(payment.amount)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Failed {formatRelativeTime(payment.attemptedAt)} · Attempt {payment.retryCount + 1}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDismissed(d => [...d, payment.id])}
                className="p-1 rounded text-gray-600 hover:text-gray-400 transition-colors"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>

            {/* Failure reason */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <AlertCircle size={13} className={cn('shrink-0 mt-0.5', info.color)} />
              <div>
                <p className={cn('text-xs font-bold', info.color)}>{info.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{info.tip}</p>
              </div>
            </div>

            {/* Next auto-retry */}
            {payment.nextRetryAt && (
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <Clock size={11} />
                <span>Auto-retry scheduled: {formatDate(payment.nextRetryAt)}</span>
              </div>
            )}

            {/* Retry attempts indicator */}
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full',
                      i < payment.retryCount ? 'bg-red-500' : 'bg-white/10'
                    )}
                  />
                ))}
              </div>
              <p className="text-[10px] text-gray-600">
                {payment.retryCount}/3 attempts — {3 - payment.retryCount} remaining before suspension
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => handleRetry(payment)}
                disabled={isRetrying}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-wait transition-all"
              >
                {isRetrying ? (
                  <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Retrying…</>
                ) : (
                  <><RefreshCw size={13} /> Retry Now</>
                )}
              </button>
              <button className="px-3 py-2 rounded-xl border border-white/[0.08] text-xs text-gray-500 hover:bg-white/[0.04] flex items-center gap-1 transition-all">
                Update Card <ChevronRight size={12} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
