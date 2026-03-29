import { useState } from 'react';
import { Calculator, Check, Calendar, TrendingDown, Info } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useToast } from '@/context/ToastContext';

interface Plan {
  months: number;
  label: string;
  fee: number;
  description: string;
  popular?: boolean;
}

const PLANS: Plan[] = [
  { months: 1,  label: 'Pay in Full',   fee: 0,    description: 'No fees. Pay once and you\'re done.', popular: false },
  { months: 3,  label: '3 Installments', fee: 0,   description: 'Interest-free quarterly payments.', popular: true  },
  { months: 6,  label: '6 Installments', fee: 0.5, description: '0.5% service fee per installment.'  },
  { months: 12, label: '12 Monthly',     fee: 1.5, description: '1.5% service fee per installment.'  },
];

interface PaymentPlanGeneratorProps {
  totalAmount: number;
  policyNumber: string;
  onSelectPlan?: (plan: { months: number; monthlyAmount: number; totalAmount: number }) => void;
}

export const PaymentPlanGenerator = ({ totalAmount, policyNumber, onSelectPlan }: PaymentPlanGeneratorProps) => {
  const [selected,   setSelected]   = useState(3);
  const [paydayDate, setPaydayDate] = useState(15);
  const { success } = useToast();

  const activePlan = PLANS.find(p => p.months === selected)!;
  const monthly    = totalAmount / activePlan.months;
  const fee        = monthly * activePlan.fee / 100;
  const totalWithFee = (monthly + fee) * activePlan.months;

  const nextPayments = Array.from({ length: Math.min(activePlan.months, 4) }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    d.setDate(paydayDate);
    return { date: d.toISOString(), amount: monthly + fee };
  });

  const handleConfirm = () => {
    success('Payment Plan Created', `${activePlan.label} plan activated for ${policyNumber}`);
    onSelectPlan?.({ months: activePlan.months, monthlyAmount: monthly + fee, totalAmount: totalWithFee });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
          <Calculator size={20} />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Payment Plan Generator</h3>
          <p className="text-xs text-gray-500">Split {formatCurrency(totalAmount)} into manageable installments</p>
        </div>
      </div>

      {/* Plan selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PLANS.map(plan => {
          const m = totalAmount / plan.months;
          const f = m * plan.fee / 100;
          return (
            <button
              key={plan.months}
              onClick={() => setSelected(plan.months)}
              className={cn(
                'relative p-4 rounded-xl border text-left transition-all',
                selected === plan.months
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
              )}
            >
              {plan.popular && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">POPULAR</span>
              )}
              <p className="text-xs font-bold text-gray-300 mb-1">{plan.label}</p>
              <p className="text-lg font-bold text-white tabular-nums">{formatCurrency(m + f)}</p>
              <p className="text-[10px] text-gray-500">{plan.months === 1 ? 'one-time' : '/month'}</p>
              {plan.fee > 0 && (
                <p className="text-[10px] text-amber-400 mt-1">+{plan.fee}% fee</p>
              )}
              {plan.fee === 0 && plan.months > 1 && (
                <p className="text-[10px] text-emerald-400 mt-1">Interest-free</p>
              )}
              {selected === plan.months && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Base premium</span>
          <span className="font-bold text-white">{formatCurrency(totalAmount)}</span>
        </div>
        {activePlan.fee > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Service fee ({activePlan.fee}%/installment)</span>
            <span className="font-bold text-amber-400">+{formatCurrency(fee * activePlan.months)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm border-t border-white/[0.06] pt-3">
          <span className="font-bold text-gray-200">Total cost</span>
          <span className="font-bold text-white text-base">{formatCurrency(totalWithFee)}</span>
        </div>
        {activePlan.fee === 0 && (
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <TrendingDown size={12} />
            <span>You save {formatCurrency(totalAmount * 0.015 * activePlan.months / 3)} vs. 12-month plan</span>
          </div>
        )}
      </div>

      {/* Payday alignment */}
      {selected > 1 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-emerald-400" />
            <p className="text-xs font-bold text-gray-300">Smart Payment Scheduling</p>
            <div className="group relative">
              <Info size={12} className="text-gray-600 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg bg-gray-900 border border-white/10 text-[10px] text-gray-400 hidden group-hover:block z-10">
                Align payments with your payday so funds are always available
              </div>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 mb-2">Charge on day of month: <span className="text-white font-bold">{paydayDate}</span></p>
            <input
              type="range"
              min={1}
              max={28}
              value={paydayDate}
              onChange={e => setPaydayDate(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-gray-600 mt-1">
              <span>1st</span><span>7th</span><span>14th</span><span>21st</span><span>28th</span>
            </div>
          </div>

          {/* Upcoming schedule preview */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Upcoming Charges</p>
            {nextPayments.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-[9px] font-bold text-gray-500">
                    {i + 1}
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(p.date)}</span>
                </div>
                <span className="text-xs font-bold text-gray-200 tabular-nums">{formatCurrency(p.amount)}</span>
              </div>
            ))}
            {activePlan.months > 4 && (
              <p className="text-[10px] text-gray-600">+ {activePlan.months - 4} more payments</p>
            )}
          </div>
        </div>
      )}

      {/* Confirm */}
      <button
        onClick={handleConfirm}
        className="w-full py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
      >
        <Check size={16} /> Confirm {activePlan.label} Plan
      </button>
    </div>
  );
};
