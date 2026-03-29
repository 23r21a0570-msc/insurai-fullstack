import { useState } from 'react';
import { RefreshCw, CheckCircle2, Clock, AlertTriangle, ChevronRight, Tag, Shield } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { mockCustomerPolicies } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { cn } from '@/utils/cn';

function daysUntil(dateStr: string): number {
  return Math.round((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function urgencyLabel(days: number): { label: string; color: string } {
  if (days < 0)  return { label: 'Expired',      color: 'text-red-400 bg-red-500/10 border-red-500/20' };
  if (days < 30) return { label: `${days}d left`, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
  return { label: `${days}d left`, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
}

export const Renewal = () => {
  const { success } = useToast();
  const [renewed, setRenewed] = useState<string[]>([]);
  const [autoRenew, setAutoRenew] = useState<Record<string, boolean>>({ cpol_1: true, cpol_2: false, cpol_3: false });

  const handleRenew = (id: string, policyNumber: string) => {
    setRenewed((p) => [...p, id]);
    success('Policy Renewed', `${policyNumber} has been renewed for another 12 months.`);
  };

  const toggleAutoRenew = (id: string) => {
    setAutoRenew((p) => ({ ...p, [id]: !p[id] }));
    success(
      autoRenew[id] ? 'Auto-renew disabled' : 'Auto-renew enabled',
      autoRenew[id] ? 'You will be notified before expiry.' : 'Your policy will renew automatically.'
    );
  };

  const discountItems = [
    { label: 'Early renewal (30+ days)', pct: '10%' },
    { label: 'Multi-policy bundle',      pct: '8%' },
    { label: 'Loyalty discount (2+ yrs)', pct: '5%' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <RefreshCw className="text-[#10B981]" size={24} /> Policy Renewal
        </h1>
        <p className="text-sm text-gray-500 mt-1">Manage renewals, enable auto-pay, and lock in early discounts.</p>
      </div>

      {/* Discount Banner */}
      <GlassPanel className="border-[#10B981]/20 bg-[#10B981]/[0.03]">
        <div className="flex items-start gap-3">
          <Tag className="text-[#10B981] shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-[#10B981]">Available Renewal Discounts</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {discountItems.map((d) => (
                <div key={d.label} className="flex items-center justify-between p-2.5 rounded-lg bg-[#10B981]/5 border border-[#10B981]/10">
                  <span className="text-xs text-gray-400">{d.label}</span>
                  <span className="text-sm font-bold text-[#10B981] ml-2">{d.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Policies */}
      <div className="space-y-4">
        {mockCustomerPolicies.map((policy) => {
          const days    = daysUntil(policy.endDate);
          const urgency = urgencyLabel(days);
          const isRenewed = renewed.includes(policy.id);
          const isAutoOn  = autoRenew[policy.id];

          return (
            <GlassPanel key={policy.id}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Info */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#10B981]/10">
                    <Shield className="text-[#10B981]" size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white capitalize">{policy.type} Insurance</h3>
                      <span className={cn('px-2 py-0.5 rounded border text-[10px] font-bold uppercase', urgency.color)}>
                        {urgency.label}
                      </span>
                      {isRenewed && (
                        <span className="px-2 py-0.5 rounded border text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 size={10} /> Renewed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-mono">{policy.policyNumber}</p>

                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <p className="text-[10px] text-gray-600 uppercase font-bold">Coverage</p>
                        <p className="text-sm font-bold text-gray-200">{formatCurrency(policy.coverageAmount)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-600 uppercase font-bold">Annual Premium</p>
                        <p className="text-sm font-bold text-gray-200">{formatCurrency(policy.premium)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-600 uppercase font-bold">Expires</p>
                        <p className="text-sm font-bold text-gray-200">{formatDate(policy.endDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:items-end shrink-0">
                  {!isRenewed ? (
                    <Button
                      size="sm"
                      onClick={() => handleRenew(policy.id, policy.policyNumber)}
                      leftIcon={<RefreshCw size={14} />}
                      className={days < 30 ? 'animate-pulse-glow' : ''}
                    >
                      {days < 30 ? 'Renew Now' : 'Renew Early'}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="text-emerald-400" size={14} />
                      <span className="text-xs font-bold text-emerald-400">Renewed</span>
                    </div>
                  )}

                  {/* Auto-renew toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">Auto-renew</span>
                    <button
                      onClick={() => toggleAutoRenew(policy.id)}
                      role="switch"
                      aria-checked={isAutoOn}
                      className={cn('h-4 w-8 rounded-full transition-colors relative shrink-0', isAutoOn ? 'bg-[#10B981]' : 'bg-white/10')}
                    >
                      <span className={cn('absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform', isAutoOn && 'translate-x-4')} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Renewal savings */}
              {!isRenewed && days > 0 && days <= 60 && (
                <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center gap-2 text-xs text-amber-400">
                  <AlertTriangle size={12} />
                  <span>
                    {days < 30
                      ? `Renew now to avoid a lapse in coverage. ${days} days remaining.`
                      : `Renew early to lock in a 10% discount — saves you ${formatCurrency(policy.premium * 0.1)}.`}
                  </span>
                  <ChevronRight size={12} className="ml-auto" />
                </div>
              )}
            </GlassPanel>
          );
        })}
      </div>

      {/* Timeline */}
      <GlassPanel>
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Renewal Timeline</h2>
        <div className="space-y-3">
          {[
            { icon: Clock, label: '60 days before', desc: 'Renewal reminder sent via email and in-app', done: true },
            { icon: Tag, label: '30 days before', desc: 'Early renewal discount (10%) becomes available', done: true },
            { icon: AlertTriangle, label: '7 days before', desc: 'Final reminder — auto-renew will process', done: false },
            { icon: CheckCircle2, label: 'Renewal date', desc: 'Policy renewed for another 12 months', done: false },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className={cn('mt-0.5 p-1.5 rounded-full shrink-0', item.done ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-white/5 text-gray-600')}>
                  <Icon size={13} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-300">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </GlassPanel>
    </div>
  );
};
