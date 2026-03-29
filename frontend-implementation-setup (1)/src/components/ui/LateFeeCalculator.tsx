import { useState } from 'react';
import { AlertTriangle, Clock, ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useToast } from '@/context/ToastContext';

interface LateFeeCalculatorProps {
  originalAmount: number;
  dueDate: string;
  policyNumber: string;
  onPayNow?: () => void;
  onRequestExtension?: () => void;
}

export const LateFeeCalculator = ({
  originalAmount,
  dueDate,
  policyNumber,
  onPayNow,
  onRequestExtension,
}: LateFeeCalculatorProps) => {
  const today    = new Date();
  const due      = new Date(dueDate);
  const daysLate = Math.max(0, Math.floor((today.getTime() - due.getTime()) / 86400000));

  // Fee tiers
  const feeRate  = daysLate === 0 ? 0 : daysLate <= 10 ? 0.015 : daysLate <= 30 ? 0.03 : 0.05;
  const lateFee  = originalAmount * feeRate;
  const totalDue = originalAmount + lateFee;
  const isOverdue = daysLate > 0;

  const gracePeriodEnd = new Date(due);
  gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 5);
  const inGrace = today <= gracePeriodEnd && isOverdue;

  const TIERS = [
    { days: '1–10 days',  rate: '1.5%', fee: formatCurrency(originalAmount * 0.015), color: 'text-amber-400'  },
    { days: '11–30 days', rate: '3.0%', fee: formatCurrency(originalAmount * 0.03),  color: 'text-orange-400' },
    { days: '31+ days',   rate: '5.0%', fee: formatCurrency(originalAmount * 0.05),  color: 'text-red-400'    },
  ];

  const { info } = useToast();
  const [extending, setExtending] = useState(false);
  const [extendReason, setExtendReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleExtend = () => {
    setSubmitted(true);
    info('Extension Requested', 'Your grace period extension request has been submitted. You\'ll hear back within 24 hours.');
    onRequestExtension?.();
  };

  return (
    <div className="space-y-6">
      {/* Status banner */}
      <div className={cn(
        'p-4 rounded-xl border flex items-start gap-3',
        !isOverdue  ? 'bg-emerald-500/5 border-emerald-500/20' :
        inGrace     ? 'bg-amber-500/5 border-amber-500/20' :
                      'bg-red-500/5 border-red-500/20'
      )}>
        {!isOverdue  ? <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" /> :
         inGrace     ? <Clock size={18} className="text-amber-400 shrink-0 mt-0.5" /> :
                       <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />}
        <div>
          <p className={cn(
            'text-sm font-bold',
            !isOverdue ? 'text-emerald-300' : inGrace ? 'text-amber-300' : 'text-red-300'
          )}>
            {!isOverdue  ? 'Payment Not Yet Overdue'   :
             inGrace     ? `Grace Period — ${5 - Math.max(0, daysLate - 0)} days remaining` :
                           `Overdue by ${daysLate} day${daysLate !== 1 ? 's' : ''}`}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {!isOverdue  ? `Due on ${formatDate(dueDate)}. Pay before this date to avoid fees.`     :
             inGrace     ? `Grace period ends ${formatDate(gracePeriodEnd.toISOString())}. No fee if paid within grace period.` :
                           `Late fee of ${(feeRate * 100).toFixed(1)}% applied. Pay now to stop fee accumulation.`}
          </p>
        </div>
      </div>

      {/* Amount breakdown */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Original premium</span>
          <span className="font-bold text-white">{formatCurrency(originalAmount)}</span>
        </div>
        {isOverdue && !inGrace && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Late fee ({(feeRate * 100).toFixed(1)}%)</span>
            <span className="font-bold text-red-400">+{formatCurrency(lateFee)}</span>
          </div>
        )}
        {inGrace && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Late fee (grace period waived)</span>
            <span className="font-bold text-emerald-400">$0.00</span>
          </div>
        )}
        <div className="flex justify-between text-sm border-t border-white/[0.06] pt-3">
          <span className="font-bold text-gray-200">Total due now</span>
          <span className="font-bold text-white text-base">
            {formatCurrency(isOverdue && !inGrace ? totalDue : originalAmount)}
          </span>
        </div>
      </div>

      {/* Fee tier table */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Late Fee Schedule — {policyNumber}</p>
        <div className="rounded-xl overflow-hidden border border-white/[0.06]">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-white/[0.03] text-gray-500 border-b border-white/[0.06]">
                <th className="px-3 py-2 text-left font-bold uppercase tracking-wider">Overdue by</th>
                <th className="px-3 py-2 text-left font-bold uppercase tracking-wider">Rate</th>
                <th className="px-3 py-2 text-right font-bold uppercase tracking-wider">Fee amount</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((tier, i) => {
                const isActive = i === 0 && daysLate >= 1 && daysLate <= 10
                              || i === 1 && daysLate >= 11 && daysLate <= 30
                              || i === 2 && daysLate > 30;
                return (
                  <tr key={i} className={cn('border-b border-white/[0.04] last:border-0', isActive && 'bg-white/[0.04]')}>
                    <td className="px-3 py-2 text-gray-400">
                      {isActive && <span className="mr-1.5 text-white font-bold">→</span>}
                      {tier.days}
                    </td>
                    <td className={cn('px-3 py-2 font-bold', tier.color)}>{tier.rate}</td>
                    <td className="px-3 py-2 text-right text-gray-300 tabular-nums">{tier.fee}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extension request form */}
      {isOverdue && !submitted && (
        <div className="border-t border-white/[0.06] pt-4 space-y-3">
          {!extending ? (
            <button
              onClick={() => setExtending(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/10 transition-all"
            >
              <PhoneCall size={14} /> Request Payment Extension
            </button>
          ) : (
            <div className="space-y-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-xs font-bold text-amber-300">Request a Grace Period Extension</p>
              <p className="text-[10px] text-gray-400">Explain your situation. Extensions are reviewed within 24 hours.</p>
              <select
                value={extendReason}
                onChange={e => setExtendReason(e.target.value)}
                className="w-full h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-xs text-gray-200 focus:outline-none"
              >
                <option value="" className="bg-gray-900">Select reason…</option>
                <option className="bg-gray-900">Temporary financial hardship</option>
                <option className="bg-gray-900">Awaiting insurance claim payout</option>
                <option className="bg-gray-900">Bank processing delay</option>
                <option className="bg-gray-900">Medical emergency</option>
                <option className="bg-gray-900">Other</option>
              </select>
              <div className="flex gap-2">
                <button onClick={() => setExtending(false)} className="flex-1 py-2 rounded-lg border border-white/[0.08] text-xs text-gray-500 hover:bg-white/[0.04]">
                  Cancel
                </button>
                <button
                  onClick={handleExtend}
                  disabled={!extendReason}
                  className="flex-1 py-2 rounded-lg bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Request
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {submitted && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-300">Extension request submitted. You'll receive a response within 24 hours.</p>
        </div>
      )}

      {/* Pay now CTA */}
      <button
        onClick={onPayNow}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all"
      >
        Pay {formatCurrency(isOverdue && !inGrace ? totalDue : originalAmount)} Now
        <ArrowRight size={16} />
      </button>
    </div>
  );
};
