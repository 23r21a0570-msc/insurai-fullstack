import { useState } from 'react';
import {
  CreditCard, CheckCircle2, Clock, AlertCircle, History, Zap,
  Calculator, FileText, RefreshCw, CalendarClock, ChevronRight
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Modal } from '@/components/ui/Modal';
import { PaymentModal } from '@/components/ui/PaymentModal';
import { PaymentPlanGenerator } from '@/components/ui/PaymentPlanGenerator';
import { LateFeeCalculator } from '@/components/ui/LateFeeCalculator';
import { TaxDocuments } from '@/components/ui/TaxDocuments';
import { FailedPaymentRetry } from '@/components/ui/FailedPaymentRetry';
import { mockCustomerPayments, CustomerPayment } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import { useToast } from '@/context/ToastContext';

type ActiveModal =
  | { type: 'pay';      payment: CustomerPayment }
  | { type: 'plan';     payment: CustomerPayment }
  | { type: 'late_fee'; payment: CustomerPayment }
  | { type: 'tax_docs' }
  | { type: 'failed'   }
  | null;

const statusConfig = {
  upcoming: { label: 'Upcoming', color: 'text-amber-400  bg-amber-500/10  border-amber-500/20',  icon: Clock         },
  paid:     { label: 'Paid',     color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2  },
  overdue:  { label: 'Overdue',  color: 'text-red-400    bg-red-500/10    border-red-500/20',    icon: AlertCircle   },
};

const QUICK_ACTIONS = [
  { icon: Calculator,   label: 'Payment Plans',   desc: 'Split into installments', modal: 'plan'     },
  { icon: CalendarClock,label: 'Late Fee Calc',   desc: 'Grace period & fees',    modal: 'late_fee'  },
  { icon: FileText,     label: 'Tax Documents',   desc: '1099s & summaries',      modal: 'tax_docs'  },
  { icon: RefreshCw,    label: 'Failed Payments', desc: 'Retry failed charges',   modal: 'failed'    },
] as const;

export const CustomerPayments = () => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [autoPay,     setAutoPay]     = useState(false);
  const { success } = useToast();

  const upcoming = mockCustomerPayments.filter(p => p.status === 'upcoming' || p.status === 'overdue');
  const history  = mockCustomerPayments.filter(p => p.status === 'paid');

  const firstUpcoming = upcoming[0] ?? null;

  const handlePaySuccess = () => {
    const p = activeModal && 'payment' in activeModal ? activeModal.payment : null;
    if (p) success('Payment Successful', `${formatCurrency(p.amount)} paid for ${p.policyNumber}`);
    setActiveModal(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <p className="text-sm text-gray-500 mt-1">Manage premiums, plans, tax documents, and billing history.</p>
      </div>

      {/* Auto-pay banner */}
      <div className={cn(
        'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all',
        autoPay ? 'bg-emerald-500/[0.05] border-emerald-500/20' : 'bg-white/[0.02] border-white/[0.08]'
      )}>
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg', autoPay ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.05] text-gray-500')}>
            <Zap size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-200">Auto-Pay</p>
            <p className="text-xs text-gray-500">
              {autoPay ? 'Enabled — payments charge automatically on each due date.' : 'Enable to never miss a payment.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => { setAutoPay(p => !p); if (!autoPay) success('Auto-Pay Enabled', 'Premiums will be collected automatically.'); }}
          className={cn('relative w-11 h-6 rounded-full transition-colors shrink-0', autoPay ? 'bg-emerald-500' : 'bg-white/10')}
          role="switch" aria-checked={autoPay} aria-label="Toggle auto-pay"
        >
          <span className={cn('absolute top-1 w-4 h-4 rounded-full bg-white transition-transform', autoPay ? 'translate-x-6' : 'translate-x-1')} />
        </button>
      </div>

      {/* Quick actions grid */}
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ icon: Icon, label, desc, modal }) => (
            <button
              key={modal}
              onClick={() => {
                if (modal === 'tax_docs' || modal === 'failed') {
                  setActiveModal({ type: modal });
                } else if (firstUpcoming) {
                  setActiveModal({ type: modal, payment: firstUpcoming });
                } else {
                  success('No upcoming payments', 'You\'re all caught up!');
                }
              }}
              className="flex flex-col items-start gap-2 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] transition-all text-left group"
            >
              <div className="p-2 rounded-lg bg-white/[0.05] text-gray-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-200">{label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming payments */}
      <div className="space-y-3">
        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Upcoming Payments</h2>
        {upcoming.length === 0 ? (
          <GlassPanel>
            <p className="text-center text-gray-500 py-8 text-sm">No upcoming payments. You're all caught up! 🎉</p>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {upcoming.map(payment => {
              const cfg  = statusConfig[payment.status];
              const Icon = cfg.icon;
              return (
                <div
                  key={payment.id}
                  className="flex flex-col gap-4 p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-mono text-gray-400">{payment.policyNumber}</p>
                      <p className="text-2xl font-bold text-white tabular-nums mt-1">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs text-gray-500 mt-1">Due {formatDate(payment.dueDate)}</p>
                    </div>
                    <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-bold uppercase', cfg.color)}>
                      <Icon size={10} /> {cfg.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setActiveModal({ type: 'pay', payment })}
                      className="col-span-1 py-2 rounded-lg bg-emerald-500 text-white text-[11px] font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-1"
                    >
                      <CreditCard size={12} /> Pay
                    </button>
                    <button
                      onClick={() => setActiveModal({ type: 'plan', payment })}
                      className="py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-gray-400 hover:bg-white/[0.07] transition-all flex items-center justify-center gap-1"
                    >
                      <Calculator size={12} /> Plan
                    </button>
                    <button
                      onClick={() => setActiveModal({ type: 'late_fee', payment })}
                      className="py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-gray-400 hover:bg-white/[0.07] transition-all flex items-center justify-center gap-1"
                    >
                      <CalendarClock size={12} /> Fees
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment history */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={14} className="text-gray-500" />
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Payment History</h2>
          </div>
          <button
            onClick={() => setActiveModal({ type: 'tax_docs' })}
            className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 hover:underline"
          >
            <FileText size={11} /> Tax Documents <ChevronRight size={11} />
          </button>
        </div>
        <GlassPanel className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]" role="row">
                  {['Policy', 'Amount', 'Date', 'Method', 'Status', 'Receipt'].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-left" role="columnheader">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody role="rowgroup">
                {history.length === 0 ? (
                  <tr role="row">
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-600 text-sm" role="cell">No payment history yet.</td>
                  </tr>
                ) : (
                  history.map(payment => (
                    <tr key={payment.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors" role="row">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400" role="cell">{payment.policyNumber}</td>
                      <td className="px-4 py-3 font-bold text-gray-200 tabular-nums" role="cell">{formatCurrency(payment.amount)}</td>
                      <td className="px-4 py-3 text-xs text-gray-500" role="cell">{payment.paidAt ? formatDate(payment.paidAt) : '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500" role="cell">
                        <span className="inline-flex items-center gap-1"><CreditCard size={10} /> Visa ••4242</span>
                      </td>
                      <td className="px-4 py-3" role="cell">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                          <CheckCircle2 size={9} /> Paid
                        </span>
                      </td>
                      <td className="px-4 py-3" role="cell">
                        <button
                          onClick={() => success('Receipt Downloaded', `Receipt for ${formatCurrency(payment.amount)}`)}
                          className="text-xs text-emerald-400 hover:underline"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </div>

      {/* ── Modals ── */}

      {/* Pay Now */}
      <Modal
        isOpen={activeModal?.type === 'pay'}
        onClose={() => setActiveModal(null)}
        title="Make a Payment"
      >
        {activeModal?.type === 'pay' && (
          <PaymentModal
            amount={activeModal.payment.amount}
            policyNumber={activeModal.payment.policyNumber}
            dueDate={formatDate(activeModal.payment.dueDate)}
            onSuccess={handlePaySuccess}
            onCancel={() => setActiveModal(null)}
          />
        )}
      </Modal>

      {/* Payment Plan */}
      <Modal
        isOpen={activeModal?.type === 'plan'}
        onClose={() => setActiveModal(null)}
        title="Payment Plan Generator"
      >
        {activeModal?.type === 'plan' && (
          <PaymentPlanGenerator
            totalAmount={activeModal.payment.amount}
            policyNumber={activeModal.payment.policyNumber}
            onSelectPlan={() => setActiveModal(null)}
          />
        )}
      </Modal>

      {/* Late Fee Calculator */}
      <Modal
        isOpen={activeModal?.type === 'late_fee'}
        onClose={() => setActiveModal(null)}
        title="Late Fee & Grace Period"
      >
        {activeModal?.type === 'late_fee' && (
          <LateFeeCalculator
            originalAmount={activeModal.payment.amount}
            dueDate={activeModal.payment.dueDate}
            policyNumber={activeModal.payment.policyNumber}
            onPayNow={() => setActiveModal({ type: 'pay', payment: activeModal.payment })}
            onRequestExtension={() => setActiveModal(null)}
          />
        )}
      </Modal>

      {/* Tax Documents */}
      <Modal
        isOpen={activeModal?.type === 'tax_docs'}
        onClose={() => setActiveModal(null)}
        title="Tax Documents"
      >
        <TaxDocuments />
      </Modal>

      {/* Failed Payments */}
      <Modal
        isOpen={activeModal?.type === 'failed'}
        onClose={() => setActiveModal(null)}
        title="Failed Payments"
      >
        <FailedPaymentRetry />
      </Modal>
    </div>
  );
};
