import { useState } from 'react';
import { Target, Filter, Download, Plus, ChevronRight } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatters';

const SEGMENTS = [
  {
    id: 'high_value',
    name: 'High Value',
    color: '#10B981',
    count: 842,
    avgCLV: 32400,
    avgPremium: 4800,
    churnRisk: 8,
    upsellScore: 87,
    description: 'Top 15% by lifetime value — multi-policy, long tenure, low risk',
    criteria: ['CLV > $25,000', 'Tenure > 3 years', '2+ active policies', 'Risk score < 35'],
    actions: ['Priority support', 'Loyalty rewards', 'Exclusive offers'],
  },
  {
    id: 'at_risk',
    name: 'At Risk',
    color: '#EF4444',
    count: 234,
    avgCLV: 8200,
    avgPremium: 1600,
    churnRisk: 72,
    upsellScore: 22,
    description: 'High lapse probability — missed payments, single policy, recent complaints',
    criteria: ['Lapse prob > 60%', 'Missed payment in last 90d', 'NPS < 5', 'Single policy only'],
    actions: ['Retention outreach', 'Discount offer', 'Payment plan'],
  },
  {
    id: 'growth',
    name: 'Growth Potential',
    color: '#3B82F6',
    count: 1456,
    avgCLV: 14800,
    avgPremium: 2200,
    churnRisk: 18,
    upsellScore: 78,
    description: 'Mid-tier customers with high upsell propensity — engaged, single policy',
    criteria: ['Upsell score > 70%', 'Single policy', 'Tenure 1-3 years', 'On-time payments'],
    actions: ['Bundle offer', 'Cross-sell campaign', 'Coverage review'],
  },
  {
    id: 'new',
    name: 'New Customers',
    color: '#8B5CF6',
    count: 389,
    avgCLV: 3200,
    avgPremium: 1100,
    churnRisk: 31,
    upsellScore: 45,
    description: 'Joined in last 90 days — onboarding phase, establishing trust',
    criteria: ['Joined < 90 days', 'First policy only', 'KYC complete'],
    actions: ['Onboarding flow', 'Welcome email', 'First claim guide'],
  },
  {
    id: 'dormant',
    name: 'Dormant',
    color: '#6B7280',
    count: 178,
    avgCLV: 4100,
    avgPremium: 800,
    churnRisk: 55,
    upsellScore: 15,
    description: 'Low engagement — no logins in 60+ days, no recent activity',
    criteria: ['No login > 60 days', 'No claim in 2 years', 'Auto-renewal only'],
    actions: ['Re-engagement email', 'Incentive offer', 'Survey'],
  },
];

const PREDICTIVE_METRICS = [
  { label: 'Avg Churn Probability', value: '23%', change: '-2.1%', positive: true, color: '#10B981' },
  { label: 'Upsell Opportunities', value: '2,298', change: '+156', positive: true, color: '#3B82F6' },
  { label: 'At-Risk Revenue', value: '$1.9M', change: '+$210K', positive: false, color: '#EF4444' },
  { label: 'CLV Prediction (12mo)', value: '$42.1M', change: '+8.4%', positive: true, color: '#8B5CF6' },
];

type View = 'segments' | 'predictive' | 'campaigns';

export const Segmentation = () => {
  const [view, setView] = useState<View>('segments');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [expandedSeg, setExpandedSeg] = useState<string | null>(null);

  const totalCustomers = SEGMENTS.reduce((s, seg) => s + seg.count, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customer Segmentation</h1>
          <p className="text-sm text-gray-500 mt-1">AI-powered customer grouping, lapse prediction, and upsell scoring.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Download size={14} />}>Export</Button>
          <Button size="sm" leftIcon={<Plus size={14} />}>New Segment</Button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-fit">
        {(['segments', 'predictive', 'campaigns'] as View[]).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all',
              view === v ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
            )}
          >
            {v === 'predictive' ? 'Predictive AI' : v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {view === 'segments' && (
        <>
          {/* Segment overview bar */}
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-200">Segment Distribution — {totalCustomers.toLocaleString()} customers</h3>
              <Button variant="secondary" size="sm" leftIcon={<Filter size={12} />}>Filter</Button>
            </div>
            <div className="flex h-8 rounded-full overflow-hidden gap-0.5">
              {SEGMENTS.map(seg => (
                <div
                  key={seg.id}
                  className="h-full cursor-pointer transition-opacity hover:opacity-80"
                  style={{ width: `${(seg.count / totalCustomers) * 100}%`, backgroundColor: seg.color }}
                  onClick={() => setSelectedSegment(seg.id)}
                  title={`${seg.name}: ${seg.count}`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-3">
              {SEGMENTS.map(seg => (
                <div key={seg.id} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="text-gray-400">{seg.name}</span>
                  <span className="text-gray-600">({((seg.count / totalCustomers) * 100).toFixed(0)}%)</span>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Segment cards */}
          <div className="space-y-3">
            {SEGMENTS.map(seg => (
              <GlassPanel key={seg.id} className={cn('transition-all', selectedSegment === seg.id && 'border-emerald-500/30')}>
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedSeg(expandedSeg === seg.id ? null : seg.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-12 rounded-full" style={{ backgroundColor: seg.color }} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-200">{seg.name}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: `${seg.color}20`, color: seg.color }}>
                          {seg.count.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{seg.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 mr-4">
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-gray-600">Avg CLV</p>
                      <p className="text-sm font-bold text-gray-200">{formatCurrency(seg.avgCLV)}</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-gray-600">Churn Risk</p>
                      <p className="text-sm font-bold" style={{ color: seg.churnRisk > 50 ? '#EF4444' : seg.churnRisk > 25 ? '#F59E0B' : '#10B981' }}>
                        {seg.churnRisk}%
                      </p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-gray-600">Upsell Score</p>
                      <p className="text-sm font-bold text-gray-200">{seg.upsellScore}%</p>
                    </div>
                    <ChevronRight size={16} className={cn('text-gray-600 transition-transform', expandedSeg === seg.id && 'rotate-90')} />
                  </div>
                </div>

                {expandedSeg === seg.id && (
                  <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Criteria</p>
                      <div className="space-y-1">
                        {seg.criteria.map(c => (
                          <div key={c} className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: seg.color }} />
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recommended Actions</p>
                      <div className="space-y-1">
                        {seg.actions.map(a => (
                          <div key={a} className="flex items-center gap-2 text-xs text-gray-400">
                            <Target size={10} style={{ color: seg.color }} />
                            {a}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="secondary">View Customers</Button>
                      <Button size="sm">Launch Campaign</Button>
                    </div>
                  </div>
                )}
              </GlassPanel>
            ))}
          </div>
        </>
      )}

      {view === 'predictive' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PREDICTIVE_METRICS.map(m => (
              <GlassPanel key={m.label}>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">{m.label}</p>
                <p className="text-2xl font-bold text-white">{m.value}</p>
                <p className={cn('text-xs font-medium mt-1', m.positive ? 'text-emerald-400' : 'text-red-400')}>{m.change}</p>
              </GlassPanel>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassPanel>
              <h3 className="text-sm font-bold text-gray-200 mb-4">Churn Prediction Model</h3>
              <div className="space-y-3">
                {[
                  { label: 'Payment missed (last 30d)', weight: 34, impact: 'High' },
                  { label: 'No login in 45+ days', weight: 24, impact: 'High' },
                  { label: 'Single policy only', weight: 18, impact: 'Medium' },
                  { label: 'Support complaint filed', weight: 14, impact: 'Medium' },
                  { label: 'Policy up for renewal soon', weight: 10, impact: 'Low' },
                ].map(f => (
                  <div key={f.label}>
                    <div className="flex justify-between mb-1 text-xs">
                      <span className="text-gray-400">{f.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded',
                          f.impact === 'High' ? 'bg-red-500/10 text-red-400' :
                          f.impact === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-blue-500/10 text-blue-400'
                        )}>{f.impact}</span>
                        <span className="text-gray-200 font-bold">{f.weight}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-red-500/60" style={{ width: `${f.weight}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-gray-500">
                Model accuracy: <span className="text-emerald-400 font-bold">91.3%</span> · Last trained 2 days ago
              </div>
            </GlassPanel>

            <GlassPanel>
              <h3 className="text-sm font-bold text-gray-200 mb-4">Upsell Propensity Model</h3>
              <div className="space-y-3">
                {[
                  { label: 'Home owner (no home policy)', weight: 38, product: 'Home Insurance' },
                  { label: 'Family size > 2 (no life policy)', weight: 29, product: 'Life Insurance' },
                  { label: 'CLV > $15K, single policy', weight: 21, product: 'Bundle Discount' },
                  { label: 'Auto only + homeowner', weight: 12, product: 'Home Insurance' },
                ].map(f => (
                  <div key={f.label}>
                    <div className="flex justify-between mb-1 text-xs">
                      <span className="text-gray-400">{f.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">{f.product}</span>
                        <span className="text-gray-200 font-bold">{f.weight}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${f.weight}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-gray-500">
                Model accuracy: <span className="text-emerald-400 font-bold">84.7%</span> · Based on 12-month cohort
              </div>
            </GlassPanel>

            <GlassPanel className="md:col-span-2">
              <h3 className="text-sm font-bold text-gray-200 mb-4">Lapse Risk by Segment</h3>
              <div className="space-y-3">
                {SEGMENTS.map(seg => (
                  <div key={seg.id} className="flex items-center gap-4">
                    <span className="text-xs text-gray-400 w-32 shrink-0">{seg.name}</span>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{
                          width: `${seg.churnRisk}%`,
                          backgroundColor: seg.churnRisk > 50 ? '#EF4444' : seg.churnRisk > 25 ? '#F59E0B' : '#10B981'
                        }} />
                      </div>
                      <span className="text-sm font-bold text-gray-200 w-8 text-right">{seg.churnRisk}%</span>
                      <span className="text-xs text-gray-600 w-20 text-right">{Math.round(seg.count * seg.churnRisk / 100)} customers</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {view === 'campaigns' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'At-Risk Retention', segment: 'At Risk', channel: 'Email + SMS', status: 'active', sent: 234, opened: 89, converted: 12 },
              { name: 'Growth Upsell Bundle', segment: 'Growth Potential', channel: 'Email', status: 'active', sent: 1456, opened: 612, converted: 87 },
              { name: 'High Value Loyalty', segment: 'High Value', channel: 'Email + Push', status: 'draft', sent: 0, opened: 0, converted: 0 },
              { name: 'Dormant Re-engagement', segment: 'Dormant', channel: 'Email', status: 'paused', sent: 178, opened: 23, converted: 3 },
              { name: 'New Customer Welcome', segment: 'New Customers', channel: 'Email + In-app', status: 'active', sent: 389, opened: 312, converted: 156 },
            ].map(c => (
              <GlassPanel key={c.name} hoverable>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-gray-200">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.segment} · {c.channel}</p>
                  </div>
                  <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                    c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                    c.status === 'draft' ? 'bg-gray-500/10 text-gray-400' :
                    'bg-amber-500/10 text-amber-400'
                  )}>{c.status}</span>
                </div>
                {c.sent > 0 ? (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-white/[0.02]">
                      <p className="text-sm font-bold text-gray-200">{c.sent}</p>
                      <p className="text-[10px] text-gray-600">Sent</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.02]">
                      <p className="text-sm font-bold text-gray-200">{Math.round(c.opened / c.sent * 100)}%</p>
                      <p className="text-[10px] text-gray-600">Opened</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.02]">
                      <p className="text-sm font-bold text-emerald-400">{c.converted}</p>
                      <p className="text-[10px] text-gray-600">Converted</p>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" className="w-full mt-2" variant="secondary">Configure & Launch</Button>
                )}
              </GlassPanel>
            ))}
            <GlassPanel className="flex flex-col items-center justify-center py-8 border-dashed border-white/10">
              <Plus size={24} className="text-gray-600 mb-2" />
              <p className="text-sm text-gray-500">New Campaign</p>
              <Button size="sm" variant="secondary" className="mt-3">Create</Button>
            </GlassPanel>
          </div>
        </div>
      )}
    </div>
  );
};
