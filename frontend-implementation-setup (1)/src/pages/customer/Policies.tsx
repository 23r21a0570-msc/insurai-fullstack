import { useState } from 'react';
import { ShieldCheck, Calendar, DollarSign, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { mockCustomerPolicies } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { cn } from '@/utils/cn';

const typeIcon: Record<string, string> = {
  auto: '🚗', home: '🏠', health: '🏥', life: '❤️', business: '🏢',
};

const statusStyle: Record<string, string> = {
  active:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  expired:   'bg-gray-500/10 text-gray-400 border-gray-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export const CustomerPolicies = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded((p) => (p === id ? null : id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="text-[#10B981]" size={24} />
          My Policies
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          All active and pending insurance policies in your account.
        </p>
      </div>

      {/* Policy cards */}
      <div className="space-y-3">
        {mockCustomerPolicies.map((policy) => {
          const isOpen = expanded === policy.id;
          return (
            <GlassPanel key={policy.id} className="p-0 overflow-hidden">
              {/* Header row */}
              <button
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => toggle(policy.id)}
                aria-expanded={isOpen}
              >
                <div className="text-2xl shrink-0">{typeIcon[policy.type] ?? '📋'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-white capitalize">{policy.type} Insurance</p>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded border text-[10px] font-bold uppercase',
                        statusStyle[policy.status]
                      )}
                    >
                      {policy.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{policy.policyNumber}</p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="text-sm font-bold text-white">{formatCurrency(policy.coverageAmount)}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">Coverage</p>
                </div>
                {isOpen ? (
                  <ChevronUp size={16} className="text-gray-500 shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500 shrink-0" />
                )}
              </button>

              {/* Expanded details */}
              {isOpen && (
                <div className="border-t border-white/[0.06] px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in">
                  <div>
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-wide mb-1">Premium</p>
                    <p className="text-sm font-semibold text-white">{formatCurrency(policy.premium)}<span className="text-xs text-gray-500">/yr</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-wide mb-1">Deductible</p>
                    <p className="text-sm font-semibold text-white">{formatCurrency(policy.deductible)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-wide mb-1">Start Date</p>
                    <p className="text-sm font-semibold text-white flex items-center gap-1">
                      <Calendar size={11} className="text-gray-500" /> {formatDate(policy.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-wide mb-1">End Date</p>
                    <p className="text-sm font-semibold text-white flex items-center gap-1">
                      <Calendar size={11} className="text-gray-500" /> {formatDate(policy.endDate)}
                    </p>
                  </div>

                  {policy.status === 'active' && (
                    <div className="col-span-2 sm:col-span-4 mt-2 flex items-center gap-2 rounded-lg border border-[#10B981]/15 bg-[#10B981]/[0.04] px-3 py-2">
                      <DollarSign size={13} className="text-[#10B981] shrink-0" />
                      <p className="text-xs text-gray-400">
                        Next payment of{' '}
                        <span className="text-white font-semibold">{formatCurrency(policy.nextPaymentAmount)}</span>{' '}
                        due on{' '}
                        <span className="text-white font-semibold">{formatDate(policy.nextPaymentDate)}</span>.
                      </p>
                    </div>
                  )}

                  {policy.status === 'pending' && (
                    <div className="col-span-2 sm:col-span-4 mt-2 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.04] px-3 py-2">
                      <AlertCircle size={13} className="text-amber-400 shrink-0" />
                      <p className="text-xs text-amber-300">
                        Your policy is pending activation. It will go live on {formatDate(policy.startDate)}.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </GlassPanel>
          );
        })}
      </div>

      {mockCustomerPolicies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-white/[0.08]">
          <ShieldCheck size={40} className="text-gray-700 mb-3" />
          <p className="text-sm text-gray-500">No policies found in your account.</p>
        </div>
      )}
    </div>
  );
};
