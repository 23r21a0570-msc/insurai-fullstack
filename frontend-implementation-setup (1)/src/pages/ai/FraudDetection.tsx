import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert, AlertTriangle, Clock, CheckCircle,
  Network, Copy, BarChart2, List,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { getFraudAlerts } from '@/data/mockData';
import { formatRelativeTime } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import { DuplicateDetector } from '@/components/claims/DuplicateDetector';
import { FraudNetworkGraph } from '@/components/claims/FraudNetworkGraph';
import { SLATracker } from '@/components/claims/SLATracker';

const severityConfig = {
  critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: 'CRITICAL' },
  high: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'HIGH' },
  medium: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', label: 'MEDIUM' },
  low: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', label: 'LOW' },
};

const statusConfig = {
  active: { color: '#EF4444', label: 'Active' },
  investigating: { color: '#F59E0B', label: 'Investigating' },
  resolved: { color: '#10B981', label: 'Resolved' },
  dismissed: { color: '#6B7280', label: 'Dismissed' },
};

type TabId = 'alerts' | 'duplicates' | 'network' | 'sla' | 'analytics';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'alerts', label: 'Fraud Alerts', icon: ShieldAlert },
  { id: 'duplicates', label: 'Duplicate Detector', icon: Copy },
  { id: 'network', label: 'Network Analysis', icon: Network },
  { id: 'sla', label: 'SLA Tracker', icon: Clock },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
];

// Mock analytics data for the fraud analytics tab
const FRAUD_ANALYTICS = {
  monthlyTrend: [
    { month: 'Aug', flagged: 12, confirmed: 4, savings: 180000 },
    { month: 'Sep', flagged: 15, confirmed: 6, savings: 240000 },
    { month: 'Oct', flagged: 11, confirmed: 3, savings: 130000 },
    { month: 'Nov', flagged: 18, confirmed: 7, savings: 310000 },
    { month: 'Dec', flagged: 22, confirmed: 9, savings: 420000 },
    { month: 'Jan', flagged: 19, confirmed: 8, savings: 380000 },
  ],
  typeBreakdown: [
    { type: 'Duplicate Claims', count: 18, pct: 32, color: '#EF4444' },
    { type: 'Inflated Estimates', count: 14, pct: 25, color: '#F59E0B' },
    { type: 'Staged Accidents', count: 11, pct: 20, color: '#8B5CF6' },
    { type: 'Identity Fraud', count: 8, pct: 14, color: '#3B82F6' },
    { type: 'Provider Fraud', count: 5, pct: 9, color: '#EC4899' },
  ],
  modelPerformance: {
    accuracy: 94.2,
    precision: 91.8,
    recall: 88.5,
    f1Score: 90.1,
    falsePositiveRate: 5.8,
    avgDetectionTime: 1.2,
  },
};

export const FraudDetection = () => {
  const allAlerts = getFraudAlerts();
  const [tab, setTab] = useState<TabId>('alerts');
  const [filter, setFilter] = useState<'all' | 'active' | 'investigating'>('all');

  const filtered = filter === 'all' ? allAlerts : allAlerts.filter((a) => a.status === filter);
  const critical = allAlerts.filter((a) => a.severity === 'critical').length;
  const active = allAlerts.filter((a) => a.status === 'active').length;
  const investigating = allAlerts.filter((a) => a.status === 'investigating').length;
  const maxBar = Math.max(...FRAUD_ANALYTICS.monthlyTrend.map((m) => m.flagged));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert size={22} className="text-red-400" />
          <h1 className="text-2xl font-bold text-white">Fraud Intelligence</h1>
        </div>
        <p className="text-sm text-gray-500">
          AI-powered fraud detection — anomaly analysis, duplicate detection, network mapping, and SLA monitoring.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Critical Alerts', value: critical, color: '#EF4444', bg: 'bg-red-500/10', sub: 'Immediate action' },
          { label: 'Active Investigations', value: active + investigating, color: '#F59E0B', bg: 'bg-amber-500/10', sub: 'Under review' },
          { label: 'Total Alerts', value: allAlerts.length, color: '#3B82F6', bg: 'bg-blue-500/10', sub: 'This month' },
          { label: 'Fraud Savings', value: '$1.66M', color: '#10B981', bg: 'bg-emerald-500/10', sub: 'YTD prevented' },
        ].map((stat) => (
          <GlassPanel key={stat.label} className="text-center">
            <p className={cn('text-3xl font-bold tabular-nums', `text-[${stat.color}]`)} style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{stat.label}</p>
            <p className="text-[10px] text-gray-600 mt-0.5">{stat.sub}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 flex-wrap border-b border-white/[0.06] pb-0">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all -mb-px',
                tab === t.id
                  ? 'border-[#10B981] text-[#10B981]'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              )}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === 'alerts' && (
        <div className="space-y-4">
          {/* Sub-filter */}
          <div className="flex items-center gap-2">
            {(['all', 'active', 'investigating'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all',
                  filter === f
                    ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
                    : 'bg-white/[0.03] border-white/[0.07] text-gray-500 hover:text-gray-300'
                )}
              >
                {f === 'all' ? 'All Alerts' : f === 'active' ? 'Active' : 'Investigating'}
              </button>
            ))}
            <span className="ml-auto text-xs text-gray-600">{filtered.length} alerts</span>
          </div>

          {filtered.map((alert) => {
            const sev = severityConfig[alert.severity];
            const st = statusConfig[alert.status];
            return (
              <GlassPanel key={alert.id} hoverable className="border-white/[0.06]">
                <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl mt-0.5" style={{ backgroundColor: sev.bg }}>
                      <AlertTriangle size={20} style={{ color: sev.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                          style={{ color: sev.color, backgroundColor: sev.bg, borderColor: `${sev.color}33` }}>
                          {sev.label}
                        </span>
                        <span className="text-xs font-mono text-gray-500">{alert.claimNumber}</span>
                        <span className="text-[10px] font-bold uppercase" style={{ color: st.color }}>· {st.label}</span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-200 mb-1">{alert.type}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">{alert.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {alert.indicators.map((ind, i) => (
                          <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-gray-400 font-mono">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex lg:flex-col items-center lg:items-end gap-3 lg:gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-[10px] text-gray-600">
                      <Clock size={11} />
                      <span>{formatRelativeTime(alert.detectedAt)}</span>
                    </div>
                    <Link
                      to={`/claims/${alert.claimId}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      Investigate <List size={12} />
                    </Link>
                    {alert.status === 'active' && (
                      <button className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-200 hover:bg-white/[0.08] transition-colors">
                        <CheckCircle size={12} /> Dismiss
                      </button>
                    )}
                  </div>
                </div>
              </GlassPanel>
            );
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-white/[0.08]">
              <CheckCircle size={40} className="text-[#10B981] mb-4" />
              <p className="text-gray-400 font-medium">No alerts match your filter</p>
            </div>
          )}
        </div>
      )}

      {tab === 'duplicates' && <DuplicateDetector />}
      {tab === 'network' && <FraudNetworkGraph />}
      {tab === 'sla' && <SLATracker />}

      {tab === 'analytics' && (
        <div className="space-y-6">
          {/* Model Performance */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Model Accuracy', value: `${FRAUD_ANALYTICS.modelPerformance.accuracy}%`, color: '#10B981' },
              { label: 'Precision', value: `${FRAUD_ANALYTICS.modelPerformance.precision}%`, color: '#3B82F6' },
              { label: 'Recall', value: `${FRAUD_ANALYTICS.modelPerformance.recall}%`, color: '#8B5CF6' },
              { label: 'F1 Score', value: `${FRAUD_ANALYTICS.modelPerformance.f1Score}%`, color: '#F59E0B' },
              { label: 'False Positive Rate', value: `${FRAUD_ANALYTICS.modelPerformance.falsePositiveRate}%`, color: '#EF4444' },
              { label: 'Avg Detection Time', value: `${FRAUD_ANALYTICS.modelPerformance.avgDetectionTime}s`, color: '#10B981' },
            ].map((metric) => (
              <GlassPanel key={metric.label} className="text-center">
                <p className="text-2xl font-bold tabular-nums" style={{ color: metric.color }}>{metric.value}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">{metric.label}</p>
              </GlassPanel>
            ))}
          </div>

          {/* Monthly trend */}
          <GlassPanel>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-5">Monthly Fraud Detection Trend</p>
            <div className="space-y-3">
              {FRAUD_ANALYTICS.monthlyTrend.map((m) => (
                <div key={m.month} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-8 shrink-0">{m.month}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400/60" style={{ width: `${(m.flagged / maxBar) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500 w-16 shrink-0">{m.flagged} flagged</span>
                    <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                      <div className="h-full rounded-full bg-red-400/60" style={{ width: `${(m.confirmed / maxBar) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500 w-20 shrink-0">{m.confirmed} confirmed</span>
                    <span className="text-[10px] text-emerald-400 font-bold w-20 shrink-0 text-right">
                      ${(m.savings / 1000).toFixed(0)}K saved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Type breakdown */}
          <GlassPanel>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-5">Fraud Type Breakdown</p>
            <div className="space-y-4">
              {FRAUD_ANALYTICS.typeBreakdown.map((t) => (
                <div key={t.type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                      <span className="text-xs text-gray-300">{t.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{t.count} cases</span>
                      <span className="text-xs font-bold w-8 text-right" style={{ color: t.color }}>{t.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${t.pct}%`, backgroundColor: t.color, opacity: 0.65 }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
