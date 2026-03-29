import { useState } from 'react';
import { Download, RefreshCw, TrendingUp, TrendingDown, DollarSign, Users, FileText, Shield, BarChart2, Activity, Calendar } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import {
  AreaChart, Area, BarChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatters';

type View = 'financial' | 'operational' | 'predictive' | 'reports';

// Mock data
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const financialData = months.map((m) => ({
  month: m,
  premium: 280000 + Math.random() * 80000,
  claims: 160000 + Math.random() * 60000,
  profit: 80000 + Math.random() * 40000,
  lossRatio: 55 + Math.random() * 20,
}));

const retentionData = months.map((m) => ({
  month: m,
  retained: 92 - Math.random() * 4,
  churned: 3 + Math.random() * 3,
  new: 5 + Math.random() * 4,
}));

const clvData = [
  { segment: 'High Value', clv: 32400, count: 842, color: '#10B981' },
  { segment: 'Growth', clv: 14800, count: 1456, color: '#3B82F6' },
  { segment: 'New', clv: 3200, count: 389, color: '#8B5CF6' },
  { segment: 'At Risk', clv: 8200, count: 234, color: '#EF4444' },
  { segment: 'Dormant', clv: 4100, count: 178, color: '#6B7280' },
];

const churnPrediction = months.slice(0, 6).map((m, i) => ({
  month: m,
  actual: i < 3 ? 3.2 + Math.random() : null,
  predicted: 2.8 + Math.random() * 1.5,
  upperBound: 4.5 + Math.random(),
  lowerBound: 1.8 + Math.random(),
}));

const agentMetrics = [
  { name: 'Sarah Chen', claims: 48, avgTime: 2.1, approvalRate: 94, satisfaction: 4.8 },
  { name: 'Mike Ross', claims: 42, avgTime: 2.8, approvalRate: 91, satisfaction: 4.6 },
  { name: 'Emily Wang', claims: 39, avgTime: 3.2, approvalRate: 89, satisfaction: 4.5 },
  { name: 'James Wilson', claims: 35, avgTime: 2.5, approvalRate: 92, satisfaction: 4.7 },
  { name: 'Lisa Park', claims: 31, avgTime: 2.9, approvalRate: 88, satisfaction: 4.4 },
];

const KPI = ({ label, value, change, positive, icon: Icon, color }: {
  label: string; value: string; change: string; positive: boolean;
  icon: React.ElementType; color: string;
}) => (
  <GlassPanel>
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <span className={cn('flex items-center text-xs font-bold gap-1', positive ? 'text-emerald-400' : 'text-red-400')}>
        {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {change}
      </span>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">{label}</p>
  </GlassPanel>
);

const tooltipStyle = {
  contentStyle: { backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' },
  itemStyle: { color: '#9CA3AF' },
};

export const AdvancedAnalytics = () => {
  const [view, setView] = useState<View>('financial');
  const [period, setPeriod] = useState('12m');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Advanced Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Financial performance, operational metrics, and predictive intelligence.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-lg p-1">
            {['3m', '6m', '12m', 'YTD'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={cn('px-3 py-1.5 rounded text-xs font-bold transition-all', period === p ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300')}>
                {p}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={12} />}>Refresh</Button>
          <Button variant="secondary" size="sm" leftIcon={<Download size={12} />}>Export</Button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] overflow-x-auto hide-scrollbar">
        {([
          { key: 'financial', label: 'Financial', icon: DollarSign },
          { key: 'operational', label: 'Operational', icon: Activity },
          { key: 'predictive', label: 'Predictive AI', icon: TrendingUp },
          { key: 'reports', label: 'Report Builder', icon: BarChart2 },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setView(t.key as View)}
            className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              view === t.key ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-300'
            )}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── FINANCIAL VIEW ── */}
      {view === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPI label="Gross Written Premium" value="$3.42M" change="+12.4%" positive icon={DollarSign} color="#10B981" />
            <KPI label="Loss Ratio" value="61.3%" change="-3.2%" positive icon={FileText} color="#3B82F6" />
            <KPI label="Combined Ratio" value="94.1%" change="-1.8%" positive icon={Shield} color="#8B5CF6" />
            <KPI label="Net Profit" value="$412K" change="+18.7%" positive icon={TrendingUp} color="#F59E0B" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <GlassPanel>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-200">Premium vs Claims</h3>
                  <p className="text-xs text-gray-600">Monthly comparison ({period})</p>
                </div>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData} margin={{ left: -20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="premium" name="Premium" fill="#10B981" radius={[3, 3, 0, 0]} opacity={0.8} />
                    <Bar dataKey="claims" name="Claims" fill="#EF4444" radius={[3, 3, 0, 0]} opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>

            <GlassPanel>
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-200">Loss Ratio Trend</h3>
                <p className="text-xs text-gray-600">Target: below 70%</p>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financialData} margin={{ left: -20, right: 10 }}>
                    <defs>
                      <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} domain={[40, 90]} tickFormatter={v => `${v}%`} />
                    <Tooltip {...tooltipStyle} />
                    <Area type="monotone" dataKey="lossRatio" name="Loss Ratio" stroke="#F59E0B" fill="url(#lossGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>

            <GlassPanel className="xl:col-span-2">
              <h3 className="text-sm font-bold text-gray-200 mb-4">Key Financial Ratios</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {['Metric', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Target', 'Status'].map(h => (
                        <th key={h} className="pb-2 text-left font-bold text-gray-600 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {[
                      { metric: 'Loss Ratio', values: [63, 61, 65, 58, 62, 60], target: '< 70%', good: true },
                      { metric: 'Expense Ratio', values: [28, 31, 29, 32, 30, 34], target: '< 35%', good: true },
                      { metric: 'Combined Ratio', values: [91, 92, 94, 90, 92, 94], target: '< 100%', good: true },
                      { metric: 'CAC', values: [320, 290, 310, 280, 295, 305], target: '< $350', good: true },
                      { metric: 'Retention Rate', values: [94, 93, 95, 92, 94, 95], target: '> 90%', good: true },
                    ].map(row => (
                      <tr key={row.metric}>
                        <td className="py-3 text-gray-300 font-medium pr-4">{row.metric}</td>
                        {row.values.map((v, i) => (
                          <td key={i} className="py-3 text-gray-400 pr-4">{v}{row.metric.includes('Rate') || row.metric.includes('Ratio') ? '%' : ''}</td>
                        ))}
                        <td className="py-3 text-gray-500 pr-4">{row.target}</td>
                        <td className="py-3">
                          <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', row.good ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>
                            {row.good ? 'ON TARGET' : 'OVER'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* ── OPERATIONAL VIEW ── */}
      {view === 'operational' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPI label="Avg Processing Time" value="2.4d" change="-15%" positive icon={Activity} color="#10B981" />
            <KPI label="Payment Collection" value="96.8%" change="+1.2%" positive icon={DollarSign} color="#3B82F6" />
            <KPI label="First Contact Resolve" value="78%" change="+5%" positive icon={Users} color="#8B5CF6" />
            <KPI label="SLA Compliance" value="91%" change="-2%" positive={false} icon={Calendar} color="#F59E0B" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <GlassPanel>
              <h3 className="text-sm font-bold text-gray-200 mb-4">Agent Performance</h3>
              <div className="space-y-3">
                {agentMetrics.map((agent, i) => (
                  <div key={agent.name} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-xs text-gray-600 w-4">#{i + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200">{agent.name}</p>
                      <p className="text-xs text-gray-500">{agent.claims} claims · {agent.avgTime}d avg</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">{agent.approvalRate}%</p>
                      <p className="text-[10px] text-gray-600">approval</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-200">{agent.satisfaction}⭐</p>
                      <p className="text-[10px] text-gray-600">satisfaction</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel>
              <h3 className="text-sm font-bold text-gray-200 mb-4">Customer Retention Trend</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={retentionData} margin={{ left: -20, right: 10 }}>
                    <defs>
                      <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} domain={[85, 100]} tickFormatter={v => `${v}%`} />
                    <Tooltip {...tooltipStyle} />
                    <Area type="monotone" dataKey="retained" name="Retained" stroke="#10B981" fill="url(#retGrad)" strokeWidth={2} />
                    <Line type="monotone" dataKey="churned" name="Churned" stroke="#EF4444" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>

            <GlassPanel>
              <h3 className="text-sm font-bold text-gray-200 mb-4">CLV by Segment</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clvData} layout="vertical" margin={{ left: 40, right: 20 }}>
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                    <YAxis type="category" dataKey="segment" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="clv" name="Avg CLV" radius={[0, 4, 4, 0]}>
                      {clvData.map((entry) => (
                        <Cell key={entry.segment} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>

            <GlassPanel>
              <h3 className="text-sm font-bold text-gray-200 mb-4">Policy Mix</h3>
              <div className="h-56 flex items-center">
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie data={[
                      { name: 'Auto', value: 42, color: '#10B981' },
                      { name: 'Home', value: 28, color: '#3B82F6' },
                      { name: 'Health', value: 18, color: '#8B5CF6' },
                      { name: 'Life', value: 12, color: '#F59E0B' },
                    ]} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                      {[{ color: '#10B981' }, { color: '#3B82F6' }, { color: '#8B5CF6' }, { color: '#F59E0B' }].map((e, i) => (
                        <Cell key={i} fill={e.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {[
                    { label: 'Auto', pct: 42, color: '#10B981' },
                    { label: 'Home', pct: 28, color: '#3B82F6' },
                    { label: 'Health', pct: 18, color: '#8B5CF6' },
                    { label: 'Life', pct: 12, color: '#F59E0B' },
                  ].map(p => (
                    <div key={p.label} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-gray-400 flex-1">{p.label}</span>
                      <span className="text-gray-200 font-bold">{p.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* ── PREDICTIVE VIEW ── */}
      {view === 'predictive' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPI label="Churn Forecast (6mo)" value="5.2%" change="-0.8%" positive icon={TrendingDown} color="#EF4444" />
            <KPI label="Revenue Forecast" value="$4.1M" change="+9.3%" positive icon={DollarSign} color="#10B981" />
            <KPI label="Claim Freq. Forecast" value="8.4%" change="+1.1%" positive={false} icon={FileText} color="#F59E0B" />
            <KPI label="Upsell Pipeline" value="$892K" change="+22%" positive icon={TrendingUp} color="#8B5CF6" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <GlassPanel>
              <h3 className="text-sm font-bold text-gray-200 mb-1">Churn Rate Forecast</h3>
              <p className="text-xs text-gray-600 mb-4">Actual + 6-month prediction with confidence interval</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={churnPrediction} margin={{ left: -20, right: 10 }}>
                    <defs>
                      <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} tickFormatter={v => `${v}%`} />
                    <Tooltip {...tooltipStyle} />
                    <Area type="monotone" dataKey="upperBound" name="Upper" stroke="transparent" fill="url(#churnGrad)" strokeWidth={0} />
                    <Line type="monotone" dataKey="actual" name="Actual" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} connectNulls={false} />
                    <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>

            <GlassPanel>
              <h3 className="text-sm font-bold text-gray-200 mb-4">Dynamic Pricing Optimization</h3>
              <div className="space-y-4">
                {[
                  { type: 'Auto Insurance', current: 1850, optimal: 1920, change: 3.8, rationale: 'Regional accident rate +12%, traffic increase' },
                  { type: 'Home Insurance', current: 1500, optimal: 1470, change: -2.0, rationale: 'Lower claims in zip code, strong retention' },
                  { type: 'Health Insurance', current: 2400, optimal: 2520, change: 5.0, rationale: 'Medical inflation index +4.8% YoY' },
                  { type: 'Life Insurance', current: 900, optimal: 885, change: -1.7, rationale: 'Improved mortality tables, competitor pricing' },
                ].map(p => (
                  <div key={p.type} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-200">{p.type}</p>
                      <span className={cn('text-xs font-bold', p.change > 0 ? 'text-amber-400' : 'text-emerald-400')}>
                        {p.change > 0 ? '+' : ''}{p.change}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-1">
                      <span>Current: {formatCurrency(p.current)}/yr</span>
                      <span>→</span>
                      <span className="text-gray-200 font-medium">Optimal: {formatCurrency(p.optimal)}/yr</span>
                    </div>
                    <p className="text-[10px] text-gray-600">{p.rationale}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel className="xl:col-span-2">
              <h3 className="text-sm font-bold text-gray-200 mb-4">30-Day Action Priorities</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    priority: 1, label: 'Prevent At-Risk Churn', impact: '$384K revenue at risk',
                    action: 'Launch retention campaign for 234 at-risk customers',
                    color: '#EF4444',
                  },
                  {
                    priority: 2, label: 'Activate Upsell Pipeline', impact: '$892K upsell opportunity',
                    action: 'Send bundle offer to 1,456 Growth segment customers',
                    color: '#10B981',
                  },
                  {
                    priority: 3, label: 'Optimize Auto Pricing', impact: '+$89K annual premium',
                    action: 'Implement 3.8% rate adjustment for auto policies in Portland region',
                    color: '#3B82F6',
                  },
                ].map(a => (
                  <div key={a.priority} className="p-4 rounded-xl border" style={{ borderColor: `${a.color}30`, backgroundColor: `${a.color}08` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: a.color }}>
                        {a.priority}
                      </span>
                      <p className="text-sm font-bold text-gray-200">{a.label}</p>
                    </div>
                    <p className="text-xs font-medium mb-1" style={{ color: a.color }}>{a.impact}</p>
                    <p className="text-xs text-gray-500">{a.action}</p>
                    <Button size="sm" variant="secondary" className="mt-3 w-full">Execute</Button>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* ── REPORT BUILDER VIEW ── */}
      {view === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassPanel className="md:col-span-2">
              <h3 className="text-sm font-bold text-gray-200 mb-4">Custom Report Builder</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Report Type</label>
                    <select className="mt-1.5 w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/40">
                      <option>Financial Summary</option>
                      <option>Claims Analysis</option>
                      <option>Customer Retention</option>
                      <option>Fraud Report</option>
                      <option>Agent Performance</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Period</label>
                    <select className="mt-1.5 w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/40">
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                      <option>Last 12 months</option>
                      <option>YTD</option>
                      <option>Custom range</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Include Metrics</label>
                  <div className="flex flex-wrap gap-2">
                    {['Revenue', 'Claims', 'Loss Ratio', 'Retention', 'CAC', 'CLV', 'NPS', 'Fraud Rate', 'Processing Time'].map(m => (
                      <label key={m} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" defaultChecked={['Revenue', 'Claims', 'Loss Ratio', 'Retention'].includes(m)}
                          className="w-3 h-3 rounded border-white/20 accent-emerald-500" />
                        <span className="text-xs text-gray-400">{m}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Group By</label>
                  <div className="flex gap-2">
                    {['Month', 'Quarter', 'Product', 'Region', 'Agent'].map(g => (
                      <button key={g} className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-400 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors">
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button className="flex-1">Generate Report</Button>
                  <Button variant="secondary" leftIcon={<Download size={14} />}>Export CSV</Button>
                  <Button variant="secondary" leftIcon={<Download size={14} />}>Export PDF</Button>
                </div>
              </div>
            </GlassPanel>

            <div className="space-y-4">
              <GlassPanel>
                <h3 className="text-sm font-bold text-gray-200 mb-3">Saved Reports</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Monthly Financial Summary', freq: 'Monthly', last: '2 days ago' },
                    { name: 'Fraud Detection Report', freq: 'Weekly', last: '5 days ago' },
                    { name: 'Agent Performance Review', freq: 'Monthly', last: '12 days ago' },
                    { name: 'Retention Analysis', freq: 'Quarterly', last: '22 days ago' },
                  ].map(r => (
                    <div key={r.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                      <div>
                        <p className="text-xs font-medium text-gray-200">{r.name}</p>
                        <p className="text-[10px] text-gray-600">{r.freq} · Last {r.last}</p>
                      </div>
                      <Download size={12} className="text-gray-600 hover:text-emerald-400 transition-colors" />
                    </div>
                  ))}
                </div>
              </GlassPanel>
              <GlassPanel>
                <h3 className="text-sm font-bold text-gray-200 mb-3">Scheduled Reports</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Financial Summary', schedule: 'Every Monday 8am', recipients: 3 },
                    { name: 'Fraud Digest', schedule: 'Daily 9am', recipients: 5 },
                  ].map(r => (
                    <div key={r.name} className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <p className="text-xs font-medium text-gray-200">{r.name}</p>
                      <p className="text-[10px] text-gray-600">{r.schedule} · {r.recipients} recipients</p>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="secondary" className="w-full mt-3">Schedule New Report</Button>
              </GlassPanel>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
