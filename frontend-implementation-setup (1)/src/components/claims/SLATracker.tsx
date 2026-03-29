import { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/utils/cn';
import { mockClaims } from '@/data/mockData';
import { formatRelativeTime } from '@/utils/formatters';

interface SLARule {
  id: string;
  name: string;
  riskLevel: string;
  targetHours: number;
  warningHours: number;
  color: string;
}

const SLA_RULES: SLARule[] = [
  { id: '1', name: 'Critical Claims', riskLevel: 'critical', targetHours: 4, warningHours: 2, color: '#EF4444' },
  { id: '2', name: 'High Risk Claims', riskLevel: 'high', targetHours: 24, warningHours: 18, color: '#F59E0B' },
  { id: '3', name: 'Medium Risk Claims', riskLevel: 'medium', targetHours: 72, warningHours: 48, color: '#3B82F6' },
  { id: '4', name: 'Standard Claims', riskLevel: 'low', targetHours: 168, warningHours: 120, color: '#10B981' },
];

type SLAStatus = 'breached' | 'warning' | 'on_track';

function getHoursElapsed(dateStr: string): number {
  return Math.abs(Date.now() - new Date(dateStr).getTime()) / 36e5;
}

function getSLAStatus(hoursElapsed: number, rule: SLARule): SLAStatus {
  if (hoursElapsed >= rule.targetHours) return 'breached';
  if (hoursElapsed >= rule.warningHours) return 'warning';
  return 'on_track';
}

function getProgressPct(hoursElapsed: number, rule: SLARule): number {
  return Math.min((hoursElapsed / rule.targetHours) * 100, 100);
}

export const SLATracker = () => {
  const [expandedRule, setExpandedRule] = useState<string | null>('1');

  const claimsWithSLA = mockClaims
    .filter((c) => ['submitted', 'under_review', 'pending_info'].includes(c.status))
    .map((claim) => {
      const rule = SLA_RULES.find((r) => r.riskLevel === claim.riskLevel) ?? SLA_RULES[3];
      const hoursElapsed = getHoursElapsed(claim.submittedAt);
      const status = getSLAStatus(hoursElapsed, rule);
      const progress = getProgressPct(hoursElapsed, rule);
      const hoursRemaining = Math.max(rule.targetHours - hoursElapsed, 0);
      return { ...claim, rule, hoursElapsed, status, progress, hoursRemaining };
    });

  const breached = claimsWithSLA.filter((c) => c.status === 'breached');
  const warning = claimsWithSLA.filter((c) => c.status === 'warning');
  const onTrack = claimsWithSLA.filter((c) => c.status === 'on_track');
  const complianceRate = Math.round((onTrack.length / Math.max(claimsWithSLA.length, 1)) * 100);

  const statusConfig = {
    breached: { label: 'SLA Breached', color: '#EF4444', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle },
    warning: { label: 'At Risk', color: '#F59E0B', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
    on_track: { label: 'On Track', color: '#10B981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle },
  };

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'SLA Compliance', value: `${complianceRate}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', sub: '+2.3% vs last week' },
          { label: 'Breached', value: breached.length, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', sub: 'Needs immediate action' },
          { label: 'At Risk', value: warning.length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', sub: 'Approaching deadline' },
          { label: 'On Track', value: onTrack.length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', sub: 'Within SLA bounds' },
        ].map((kpi) => (
          <GlassPanel key={kpi.label} className="flex items-center gap-3">
            <div className={cn('p-2.5 rounded-xl shrink-0', kpi.bg)}>
              <kpi.icon size={18} className={kpi.color} />
            </div>
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">{kpi.label}</p>
              <p className="text-xl font-bold text-white tabular-nums">{kpi.value}</p>
              <p className="text-[10px] text-gray-600">{kpi.sub}</p>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* SLA Rules Breakdown */}
      <div className="space-y-3">
        {SLA_RULES.map((rule) => {
          const ruleClaims = claimsWithSLA.filter((c) => c.rule.id === rule.id);
          const ruleBreached = ruleClaims.filter((c) => c.status === 'breached').length;
          const ruleWarning = ruleClaims.filter((c) => c.status === 'warning').length;
          const isExpanded = expandedRule === rule.id;

          return (
            <GlassPanel key={rule.id} className="overflow-hidden">
              <button
                className="flex items-center justify-between w-full text-left"
                onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: rule.color }} />
                  <div>
                    <p className="text-sm font-bold text-gray-200">{rule.name}</p>
                    <p className="text-[10px] text-gray-600">Target: {rule.targetHours}h · Warning: {rule.warningHours}h</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {ruleBreached > 0 && (
                    <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                      {ruleBreached} breached
                    </span>
                  )}
                  {ruleWarning > 0 && (
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      {ruleWarning} at risk
                    </span>
                  )}
                  <span className="text-xs text-gray-500">{ruleClaims.length} claims</span>
                  <ChevronDown size={14} className={cn('text-gray-500 transition-transform', isExpanded && 'rotate-180')} />
                </div>
              </button>

              {isExpanded && ruleClaims.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
                  {ruleClaims.slice(0, 5).map((claim) => {
                    const cfg = statusConfig[claim.status as SLAStatus];
                    const StatusIcon = cfg.icon;
                    return (
                      <div key={claim.id} className={cn('rounded-lg border p-3', cfg.bg, cfg.border)}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <StatusIcon size={13} style={{ color: cfg.color }} />
                            <span className="font-mono text-xs font-bold" style={{ color: cfg.color }}>{claim.claimNumber}</span>
                            <span className="text-xs text-gray-400">{claim.claimant.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-gray-500">{cfg.label}</p>
                            <p className="text-[10px] font-mono" style={{ color: cfg.color }}>
                              {claim.status === 'breached'
                                ? `${Math.round(claim.hoursElapsed - rule.targetHours)}h overdue`
                                : `${Math.round(claim.hoursRemaining)}h remaining`}
                            </p>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${claim.progress}%`,
                              backgroundColor: cfg.color,
                              opacity: 0.7,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-gray-600">Submitted {formatRelativeTime(claim.submittedAt)}</span>
                          <span className="text-[10px] text-gray-600">{Math.round(claim.progress)}% of SLA used</span>
                        </div>
                      </div>
                    );
                  })}
                  {ruleClaims.length > 5 && (
                    <p className="text-[10px] text-gray-600 text-center">+{ruleClaims.length - 5} more claims</p>
                  )}
                </div>
              )}

              {isExpanded && ruleClaims.length === 0 && (
                <div className="mt-4 pt-4 border-t border-white/[0.06] text-center py-6">
                  <CheckCircle size={24} className="text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No active claims in this category</p>
                </div>
              )}
            </GlassPanel>
          );
        })}
      </div>

      {/* SLA Trend */}
      <GlassPanel>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">SLA Performance Trend (Last 7 Days)</p>
        <div className="flex items-end gap-2 h-24">
          {[78, 82, 79, 85, 88, 84, complianceRate].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-sm transition-all"
                style={{
                  height: `${(val / 100) * 80}px`,
                  backgroundColor: val >= 85 ? '#10B981' : val >= 75 ? '#F59E0B' : '#EF4444',
                  opacity: 0.7,
                }}
              />
              <span className="text-[9px] text-gray-600">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'][i]}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={12} className="text-emerald-400" />
            <span className="text-[10px] text-gray-400">Weekly avg: 83.7%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingDown size={12} className="text-amber-400" />
            <span className="text-[10px] text-gray-400">Target: 90%</span>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};
