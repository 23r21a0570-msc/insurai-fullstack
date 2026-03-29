import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, CheckCircle, XCircle, Clock, AlertTriangle, ChevronLeft } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/utils/cn';

// Mock analytics data
const MONTHLY_TREND = [
  { month: 'Aug', submitted: 42, approved: 31, rejected: 7, pending: 4 },
  { month: 'Sep', submitted: 38, approved: 27, rejected: 6, pending: 5 },
  { month: 'Oct', submitted: 55, approved: 40, rejected: 9, pending: 6 },
  { month: 'Nov', submitted: 49, approved: 36, rejected: 8, pending: 5 },
  { month: 'Dec', submitted: 61, approved: 44, rejected: 11, pending: 6 },
  { month: 'Jan', submitted: 52, approved: 38, rejected: 9, pending: 5 },
];

const CLAIM_TYPES = [
  { type: 'Auto Collision', count: 48, amount: 284000, approval: 78 },
  { type: 'Property Damage', count: 32, amount: 196000, approval: 72 },
  { type: 'Medical', count: 28, amount: 142000, approval: 85 },
  { type: 'Auto Theft', count: 18, amount: 108000, approval: 65 },
  { type: 'Liability', count: 12, amount: 76000, approval: 58 },
  { type: 'Natural Disaster', count: 8, amount: 52000, approval: 90 },
];

const DENIAL_REASONS = [
  { reason: 'Policy Exclusion', count: 22, pct: 40 },
  { reason: 'Insufficient Evidence', count: 15, pct: 27 },
  { reason: 'Pre-existing Condition', count: 9, pct: 16 },
  { reason: 'Late Filing', count: 6, pct: 11 },
  { reason: 'Coverage Limit', count: 3, pct: 6 },
];

const PROCESSING_TIMES = [
  { range: '1-3 days', count: 28 },
  { range: '4-7 days', count: 42 },
  { range: '8-14 days', count: 24 },
  { range: '15-21 days', count: 12 },
  { range: '22+ days', count: 6 },
];

const STATUS_DIST = [
  { name: 'Approved', value: 38, color: '#10B981' },
  { name: 'Pending', value: 29, color: '#3B82F6' },
  { name: 'Rejected', value: 9, color: '#EF4444' },
  { name: 'Escalated', value: 4, color: '#8B5CF6' },
];

const TIPS = [
  { icon: '📄', tip: 'Claims with complete documentation are approved 3x faster', impact: 'High' },
  { icon: '⏰', tip: 'Filing within 7 days of incident improves approval rate by 23%', impact: 'High' },
  { icon: '📸', tip: 'Including 5+ photos increases first-time approval by 18%', impact: 'Medium' },
  { icon: '🔍', tip: 'Providing a police report reduces investigation time by 40%', impact: 'Medium' },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; fill: string }[]; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-white/[0.10] bg-[#0F1629] px-4 py-3 shadow-2xl">
      <p className="text-xs font-bold text-gray-400 mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
          <span className="text-gray-400">{entry.name}:</span>
          <span className="font-bold text-gray-200">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export const ClaimAnalytics = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<'30d' | '90d' | '6m' | '1y'>('6m');

  const totalSubmitted = MONTHLY_TREND.reduce((s, m) => s + m.submitted, 0);
  const totalApproved = MONTHLY_TREND.reduce((s, m) => s + m.approved, 0);
  const totalRejected = MONTHLY_TREND.reduce((s, m) => s + m.rejected, 0);
  const approvalRate = Math.round((totalApproved / totalSubmitted) * 100);
  const avgProcessingDays = 8.4;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/claims')}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          aria-label="Back"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp size={22} className="text-[#10B981]" /> Claims Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Performance metrics, approval rates, and processing insights</p>
        </div>
      </div>

      {/* Date range selector */}
      <div className="flex gap-2">
        {(['30d', '90d', '6m', '1y'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-bold border transition-all',
              dateRange === range
                ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
                : 'border-white/[0.08] text-gray-500 hover:border-white/[0.15]'
            )}
          >
            {range}
          </button>
        ))}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Submitted', value: totalSubmitted, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Approved', value: totalApproved, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', sub: `${approvalRate}% rate` },
          { label: 'Rejected', value: totalRejected, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', sub: `${100 - approvalRate}% rate` },
          { label: 'Avg Processing', value: `${avgProcessingDays}d`, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10', sub: '-1.2d vs last month' },
        ].map((kpi) => (
          <GlassPanel key={kpi.label} className="flex items-start gap-3">
            <div className={cn('p-2.5 rounded-xl shrink-0', kpi.bg)}>
              <kpi.icon size={18} className={kpi.color} />
            </div>
            <div>
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">{kpi.label}</p>
              <p className="text-xl font-bold text-white tabular-nums mt-0.5">{kpi.value}</p>
              {kpi.sub && <p className="text-[10px] text-gray-500 mt-0.5">{kpi.sub}</p>}
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly trend */}
        <GlassPanel className="lg:col-span-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">Monthly Claims Trend</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="approved" name="Approved" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="rejected" name="Rejected" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pending" name="Pending" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        {/* Status distribution */}
        <GlassPanel>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">Status Distribution</p>
          <div className="relative h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={STATUS_DIST} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                  {STATUS_DIST.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F1629', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }} itemStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xl font-bold text-white">{approvalRate}%</p>
                <p className="text-[9px] text-gray-600 uppercase">Approval</p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {STATUS_DIST.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-xs text-gray-400 flex-1">{s.name}</span>
                <span className="text-xs font-bold text-gray-300 tabular-nums">{s.value}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claims by type */}
        <GlassPanel>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">Claims by Type</p>
          <div className="space-y-3">
            {CLAIM_TYPES.map((ct) => (
              <div key={ct.type}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-xs font-medium text-gray-300">{ct.type}</span>
                    <span className="ml-2 text-[10px] text-gray-600">{ct.count} claims</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-200">{formatCurrency(ct.amount, true)}</span>
                    <span className="ml-2 text-[10px] text-emerald-400">{ct.approval}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#10B981] transition-all"
                    style={{ width: `${(ct.count / 48) * 100}%`, opacity: 0.6 + (ct.approval / 100) * 0.4 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Denial reasons */}
        <GlassPanel>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">Denial Reasons Breakdown</p>
          <div className="space-y-3">
            {DENIAL_REASONS.map((dr) => (
              <div key={dr.reason}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-300">{dr.reason}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-600">{dr.count} cases</span>
                    <span className="text-xs font-bold text-red-400">{dr.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div className="h-full rounded-full bg-red-400/60 transition-all" style={{ width: `${dr.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* Processing time distribution */}
      <GlassPanel>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">Processing Time Distribution</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PROCESSING_TIMES} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0F1629', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }} />
              <Bar dataKey="count" name="Claims" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassPanel>

      {/* Approval tips */}
      <GlassPanel>
        <div className="flex items-center gap-2 mb-5">
          <AlertTriangle size={15} className="text-amber-400" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tips to Improve Approval Rate</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIPS.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <span className="text-xl shrink-0">{tip.icon}</span>
              <div>
                <p className="text-xs text-gray-300 leading-relaxed">{tip.tip}</p>
                <span className={cn('text-[10px] font-bold uppercase tracking-wider mt-1.5 block', tip.impact === 'High' ? 'text-emerald-400' : 'text-amber-400')}>
                  {tip.impact} Impact
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
};
