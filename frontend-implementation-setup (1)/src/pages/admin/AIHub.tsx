import { useState } from 'react';
import { Brain, DollarSign, RefreshCw, Play, CheckCircle, Activity, Target, Cpu } from 'lucide-react';
import { cn } from '@/utils/cn';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

const TABS = ['Overview', 'Auto-Adjudication', 'Fraud ML', 'Churn Prediction', 'Dynamic Pricing', 'Recommendation Engine', 'Sentiment Analysis', 'Model Performance'];

const modelMetrics = [
  { name: 'Fraud Detection', accuracy: 94.2, precision: 91.8, recall: 96.1, f1: 93.9, status: 'active', version: 'v3.2.1', lastTrained: '2h ago', predictions: '12,450' },
  { name: 'Auto-Adjudication', accuracy: 89.7, precision: 88.3, recall: 91.2, f1: 89.7, status: 'active', version: 'v2.1.0', lastTrained: '6h ago', predictions: '8,230' },
  { name: 'Churn Prediction', accuracy: 87.3, precision: 85.1, recall: 89.4, f1: 87.2, status: 'active', version: 'v1.8.3', lastTrained: '12h ago', predictions: '5,670' },
  { name: 'Dynamic Pricing', accuracy: 92.1, precision: 90.4, recall: 93.8, f1: 92.1, status: 'active', version: 'v2.5.0', lastTrained: '1h ago', predictions: '23,100' },
  { name: 'Risk Scoring', accuracy: 91.5, precision: 89.7, recall: 93.2, f1: 91.4, status: 'active', version: 'v3.0.2', lastTrained: '3h ago', predictions: '18,900' },
  { name: 'Document Classifier', accuracy: 96.8, precision: 95.2, recall: 98.1, f1: 96.6, status: 'active', version: 'v1.3.1', lastTrained: '24h ago', predictions: '7,450' },
];

const accuracyTrend = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  fraud: 88 + Math.random() * 8,
  adjudication: 84 + Math.random() * 8,
  churn: 82 + Math.random() * 8,
  pricing: 88 + Math.random() * 6,
}));

const adjudicationQueue = [
  { id: 'CLM-2024-1042', claimant: 'John Smith', amount: 4200, type: 'Auto Collision', riskScore: 22, confidence: 96, recommendation: 'approve', elapsed: '1.2s' },
  { id: 'CLM-2024-1043', claimant: 'Emily Johnson', amount: 8500, type: 'Property Damage', riskScore: 45, confidence: 78, recommendation: 'review', elapsed: '0.9s' },
  { id: 'CLM-2024-1044', claimant: 'Michael Brown', amount: 1800, type: 'Auto Theft', riskScore: 18, confidence: 98, recommendation: 'approve', elapsed: '0.7s' },
  { id: 'CLM-2024-1045', claimant: 'Sarah Davis', amount: 32000, type: 'Medical', riskScore: 67, confidence: 71, recommendation: 'investigate', elapsed: '2.1s' },
  { id: 'CLM-2024-1046', claimant: 'David Wilson', amount: 5600, type: 'Liability', riskScore: 31, confidence: 89, recommendation: 'approve', elapsed: '1.4s' },
];

const churnRiskCustomers = [
  { id: 'cust_12', name: 'Robert Anderson', risk: 89, reason: 'Missed 2 payments, high complaint volume', segment: 'High Value', mrr: 285 },
  { id: 'cust_23', name: 'Lisa Thomas', risk: 74, reason: 'Policy renewal approaching, competitor inquiry detected', segment: 'Standard', mrr: 165 },
  { id: 'cust_34', name: 'James Wilson', risk: 68, reason: 'No engagement in 90 days, claim denied last month', segment: 'High Value', mrr: 320 },
  { id: 'cust_45', name: 'Maria Garcia', risk: 61, reason: 'Premium increase notification sent', segment: 'Standard', mrr: 135 },
  { id: 'cust_56', name: 'William Jackson', risk: 54, reason: 'Support tickets unresolved > 7 days', segment: 'Premium', mrr: 450 },
];

const pricingFactors = [
  { factor: 'Age', weight: 18, direction: 'surcharge', value: '+12%' },
  { factor: 'Driving History', weight: 25, direction: 'discount', value: '-8%' },
  { factor: 'Location Risk', weight: 15, direction: 'surcharge', value: '+5%' },
  { factor: 'Vehicle Type', weight: 12, direction: 'neutral', value: '0%' },
  { factor: 'Credit Score', weight: 10, direction: 'discount', value: '-3%' },
  { factor: 'Prior Claims', weight: 20, direction: 'surcharge', value: '+18%' },
];

const radarData = [
  { subject: 'Accuracy', A: 94, fullMark: 100 },
  { subject: 'Precision', A: 91, fullMark: 100 },
  { subject: 'Recall', A: 96, fullMark: 100 },
  { subject: 'F1 Score', A: 93, fullMark: 100 },
  { subject: 'Speed', A: 88, fullMark: 100 },
  { subject: 'Coverage', A: 97, fullMark: 100 },
];

const recommendations = [
  { customerId: 'cust_01', name: 'Alice Cooper', current: 'Basic Auto', recommended: 'Premium Auto', reason: 'Frequently drives long distances, recent accident report', confidence: 87, uplift: '+$85/mo' },
  { customerId: 'cust_02', name: 'Bob Martinez', current: 'Home Basic', recommended: 'Home + Auto Bundle', reason: '3 claims in 2 years, bundle discount saves 18%', confidence: 92, uplift: '-$42/mo' },
  { customerId: 'cust_03', name: 'Carol White', current: 'Health Standard', recommended: 'Health Premium', reason: 'Annual checkup data indicates higher coverage need', confidence: 79, uplift: '+$65/mo' },
];

const sentimentData = [
  { month: 'Jul', positive: 72, neutral: 18, negative: 10 },
  { month: 'Aug', positive: 68, neutral: 20, negative: 12 },
  { month: 'Sep', positive: 75, neutral: 16, negative: 9 },
  { month: 'Oct', positive: 71, neutral: 19, negative: 10 },
  { month: 'Nov', positive: 69, neutral: 21, negative: 10 },
  { month: 'Dec', positive: 74, neutral: 17, negative: 9 },
];

const sentimentKeywords = [
  { word: 'fast', count: 342, sentiment: 'positive' },
  { word: 'helpful', count: 289, sentiment: 'positive' },
  { word: 'easy', count: 256, sentiment: 'positive' },
  { word: 'slow', count: 123, sentiment: 'negative' },
  { word: 'confusing', count: 89, sentiment: 'negative' },
  { word: 'denied', count: 76, sentiment: 'negative' },
  { word: 'professional', count: 198, sentiment: 'positive' },
  { word: 'expensive', count: 145, sentiment: 'negative' },
];

export const AIHub = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [runningModel, setRunningModel] = useState<string | null>(null);
  const [adjudicatedIds, setAdjudicatedIds] = useState<string[]>([]);

  const handleAdjudicate = (id: string) => {
    setAdjudicatedIds(prev => [...prev, id]);
  };

  const handleRunModel = (name: string) => {
    setRunningModel(name);
    setTimeout(() => setRunningModel(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="text-[#10B981]" size={28} /> AI Intelligence Hub
          </h1>
          <p className="text-sm text-gray-500 mt-1">ML models, auto-adjudication, fraud detection, and predictive analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full border border-[#10B981]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            6 Models Active
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto hide-scrollbar border-b border-white/10 pb-0">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px',
              activeTab === tab
                ? 'border-[#10B981] text-[#10B981]'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Models Running', value: '6', icon: Cpu, color: 'emerald' },
              { label: 'Daily Predictions', value: '75.8K', icon: Activity, color: 'blue' },
              { label: 'Avg Accuracy', value: '91.9%', icon: Target, color: 'violet' },
              { label: 'Savings Generated', value: '$2.4M', icon: DollarSign, color: 'amber' },
            ].map(stat => (
              <GlassPanel key={stat.label}>
                <div className="flex items-center gap-3">
                  <div className={cn('p-2.5 rounded-xl', {
                    'bg-[#10B981]/10 text-[#10B981]': stat.color === 'emerald',
                    'bg-blue-500/10 text-blue-400': stat.color === 'blue',
                    'bg-violet-500/10 text-violet-400': stat.color === 'violet',
                    'bg-amber-500/10 text-amber-400': stat.color === 'amber',
                  })}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Status Grid */}
            <GlassPanel>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Active Models</h3>
              <div className="space-y-3">
                {modelMetrics.map(model => (
                  <div key={model.name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">{model.name}</p>
                        <p className="text-xs text-gray-500">{model.version} · Trained {model.lastTrained}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-mono font-bold text-[#10B981]">{model.accuracy}%</p>
                        <p className="text-xs text-gray-600">{model.predictions}/day</p>
                      </div>
                      <button
                        onClick={() => handleRunModel(model.name)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        title="Retrain model"
                      >
                        <RefreshCw size={14} className={runningModel === model.name ? 'animate-spin text-[#10B981]' : ''} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* Accuracy Trend */}
            <GlassPanel>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Model Accuracy Trend (30 days)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={accuracyTrend}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[80, 100]} tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="fraud" stroke="#10B981" fill="url(#g1)" strokeWidth={2} name="Fraud" />
                    <Area type="monotone" dataKey="pricing" stroke="#3B82F6" fill="none" strokeWidth={1.5} name="Pricing" />
                    <Area type="monotone" dataKey="churn" stroke="#8B5CF6" fill="none" strokeWidth={1.5} name="Churn" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* Auto-Adjudication */}
      {activeTab === 'Auto-Adjudication' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Auto-Approved Today', value: '142', pct: '68%', color: 'emerald' },
              { label: 'Flagged for Review', value: '34', pct: '16%', color: 'amber' },
              { label: 'Sent to Investigation', value: '24', pct: '12%', color: 'red' },
            ].map(s => (
              <GlassPanel key={s.label}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className={cn('h-full rounded-full', {
                    'bg-[#10B981]': s.color === 'emerald',
                    'bg-amber-500': s.color === 'amber',
                    'bg-red-500': s.color === 'red',
                  })} style={{ width: s.pct }} />
                </div>
                <p className="text-xs text-gray-600 mt-1">{s.pct} of queue</p>
              </GlassPanel>
            ))}
          </div>

          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Live Adjudication Queue</h3>
              <span className="text-xs text-gray-500">AI processes each claim in &lt;2 seconds</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Claim ID', 'Claimant', 'Amount', 'Type', 'Risk Score', 'Confidence', 'AI Decision', 'Time', 'Action'].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-[10px] font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {adjudicationQueue.map(item => (
                    <tr key={item.id} className={cn('transition-colors', adjudicatedIds.includes(item.id) ? 'opacity-40' : 'hover:bg-white/[0.02]')}>
                      <td className="py-3 px-3 font-mono text-xs text-[#10B981]">{item.id}</td>
                      <td className="py-3 px-3 font-medium">{item.claimant}</td>
                      <td className="py-3 px-3">${item.amount.toLocaleString()}</td>
                      <td className="py-3 px-3 text-gray-400 text-xs">{item.type}</td>
                      <td className="py-3 px-3">
                        <span className={cn('text-xs font-bold', item.riskScore < 30 ? 'text-[#10B981]' : item.riskScore < 60 ? 'text-amber-400' : 'text-red-400')}>
                          {item.riskScore}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-white/5 w-16">
                            <div className="h-full rounded-full bg-[#10B981]" style={{ width: `${item.confidence}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{item.confidence}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', {
                          'bg-[#10B981]/10 text-[#10B981]': item.recommendation === 'approve',
                          'bg-amber-500/10 text-amber-400': item.recommendation === 'review',
                          'bg-red-500/10 text-red-400': item.recommendation === 'investigate',
                        })}>
                          {item.recommendation}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-xs text-gray-600">{item.elapsed}</td>
                      <td className="py-3 px-3">
                        {adjudicatedIds.includes(item.id) ? (
                          <span className="text-xs text-[#10B981] flex items-center gap-1"><CheckCircle size={12} /> Done</span>
                        ) : (
                          <button
                            onClick={() => handleAdjudicate(item.id)}
                            className="text-xs px-3 py-1 rounded-lg bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 transition-colors"
                          >
                            Process
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* Churn Prediction */}
      {activeTab === 'Churn Prediction' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'High Risk Customers', value: '127', color: 'red' },
              { label: 'Revenue at Risk', value: '$48,250', color: 'amber' },
              { label: 'Predicted Churns (30d)', value: '23', color: 'orange' },
            ].map(s => (
              <GlassPanel key={s.label}>
                <p className={cn('text-2xl font-bold', s.color === 'red' ? 'text-red-400' : s.color === 'amber' ? 'text-amber-400' : 'text-orange-400')}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </GlassPanel>
            ))}
          </div>

          <GlassPanel>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">High Churn Risk Customers — Intervention Required</h3>
            <div className="space-y-3">
              {churnRiskCustomers.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-red-500/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-sm font-bold text-red-400">
                        {c.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className={cn('absolute -bottom-1 -right-1 text-[9px] px-1 rounded font-bold', c.risk > 80 ? 'bg-red-500 text-white' : 'bg-amber-500 text-black')}>
                        {c.risk}%
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-500">MRR</p>
                      <p className="text-sm font-bold">${c.mrr}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{c.segment}</span>
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 transition-colors whitespace-nowrap">
                      Intervene
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}

      {/* Dynamic Pricing */}
      {activeTab === 'Dynamic Pricing' && (
        <div className="space-y-6">
          <GlassPanel>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Pricing Factor Weights</h3>
            <div className="space-y-4">
              {pricingFactors.map(f => (
                <div key={f.factor} className="flex items-center gap-4">
                  <p className="text-sm font-medium w-36 shrink-0">{f.factor}</p>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', f.direction === 'discount' ? 'bg-[#10B981]' : f.direction === 'surcharge' ? 'bg-amber-500' : 'bg-gray-500')}
                      style={{ width: `${f.weight * 4}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{f.weight}%</span>
                  <span className={cn('text-xs font-bold w-12 text-right', f.direction === 'discount' ? 'text-[#10B981]' : f.direction === 'surcharge' ? 'text-amber-400' : 'text-gray-400')}>
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassPanel>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Model Radar</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 11 }} />
                    <Radar name="Model" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>

            <GlassPanel>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Live Pricing Simulator</h3>
              <div className="space-y-4">
                {[
                  { label: 'Age', value: 35, min: 18, max: 75, unit: 'yrs' },
                  { label: 'Coverage Amount', value: 250, min: 50, max: 500, unit: 'K' },
                  { label: 'Prior Claims', value: 1, min: 0, max: 10, unit: '' },
                  { label: 'Credit Score', value: 720, min: 300, max: 850, unit: '' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{item.label}</span>
                      <span className="text-white font-mono">{item.value}{item.unit}</span>
                    </div>
                    <input type="range" min={item.min} max={item.max} defaultValue={item.value} className="w-full accent-[#10B981]" />
                  </div>
                ))}
                <div className="mt-4 p-4 rounded-xl bg-[#10B981]/5 border border-[#10B981]/20 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">AI-Optimized Premium</p>
                  <p className="text-3xl font-bold text-[#10B981]">$247<span className="text-lg">/mo</span></p>
                  <p className="text-xs text-gray-500 mt-1">Confidence: 94.2% · Margin: 12.3%</p>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* Recommendation Engine */}
      {activeTab === 'Recommendation Engine' && (
        <div className="space-y-6">
          <GlassPanel>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">AI Cross-Sell & Upsell Recommendations</h3>
            <div className="space-y-4">
              {recommendations.map(r => (
                <div key={r.customerId} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#10B981]/20 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center text-xs font-bold text-[#10B981]">
                          {r.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{r.name}</p>
                          <p className="text-xs text-gray-500">{r.current} → <span className="text-[#10B981]">{r.recommended}</span></p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 ml-11">{r.reason}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-[#10B981]">{r.uplift}</p>
                      <p className="text-xs text-gray-500">Confidence: {r.confidence}%</p>
                      <button className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 transition-colors">
                        Send Offer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}

      {/* Sentiment Analysis */}
      {activeTab === 'Sentiment Analysis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Positive Sentiment', value: '74%', icon: '😊', color: 'emerald' },
              { label: 'Neutral', value: '17%', icon: '😐', color: 'gray' },
              { label: 'Negative Sentiment', value: '9%', icon: '😞', color: 'red' },
            ].map(s => (
              <GlassPanel key={s.label} className="text-center">
                <p className="text-3xl mb-2">{s.icon}</p>
                <p className={cn('text-2xl font-bold', s.color === 'emerald' ? 'text-[#10B981]' : s.color === 'red' ? 'text-red-400' : 'text-gray-400')}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </GlassPanel>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassPanel>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Sentiment Trend (6 months)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#4B5563', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#4B5563', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Bar dataKey="positive" name="Positive" fill="#10B981" stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="neutral" name="Neutral" fill="#6B7280" stackId="a" />
                    <Bar dataKey="negative" name="Negative" fill="#EF4444" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>

            <GlassPanel>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Top Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {sentimentKeywords.map(kw => (
                  <span
                    key={kw.word}
                    className={cn('px-3 py-1.5 rounded-full text-xs font-medium border', {
                      'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20': kw.sentiment === 'positive',
                      'bg-red-500/10 text-red-400 border-red-500/20': kw.sentiment === 'negative',
                    })}
                    style={{ fontSize: `${Math.min(16, 10 + kw.count / 50)}px` }}
                  >
                    {kw.word} <span className="opacity-60">({kw.count})</span>
                  </span>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Flagged Reviews</p>
                {[
                  { text: '"The claim process was incredibly slow and frustrating..."', sentiment: 'negative', score: -0.82 },
                  { text: '"Agent was super helpful, resolved my issue in minutes!"', sentiment: 'positive', score: 0.94 },
                  { text: '"Why was my claim denied without any explanation?"', sentiment: 'negative', score: -0.91 },
                ].map((review, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="text-xs text-gray-300 italic">{review.text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded', review.sentiment === 'positive' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-red-500/10 text-red-400')}>
                        {review.sentiment.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-gray-600">Score: {review.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* Model Performance */}
      {activeTab === 'Model Performance' && (
        <div className="space-y-6">
          <GlassPanel>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">All Models — Performance Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Model', 'Version', 'Accuracy', 'Precision', 'Recall', 'F1 Score', 'Daily Preds', 'Last Trained', 'Action'].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-[10px] font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {modelMetrics.map(m => (
                    <tr key={m.name} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-semibold">{m.name}</td>
                      <td className="py-3 px-3 font-mono text-xs text-gray-500">{m.version}</td>
                      {[m.accuracy, m.precision, m.recall, m.f1].map((v, i) => (
                        <td key={i} className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className={cn('text-sm font-bold', v >= 90 ? 'text-[#10B981]' : v >= 85 ? 'text-amber-400' : 'text-red-400')}>{v}%</span>
                          </div>
                        </td>
                      ))}
                      <td className="py-3 px-3 text-gray-400 text-xs">{m.predictions}</td>
                      <td className="py-3 px-3 text-gray-500 text-xs">{m.lastTrained}</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleRunModel(m.name)}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          {runningModel === m.name ? (
                            <><RefreshCw size={12} className="animate-spin text-[#10B981]" /> Retraining</>
                          ) : (
                            <><Play size={12} /> Retrain</>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* Fraud ML */}
      {activeTab === 'Fraud ML' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Claims Scanned', value: '2,450', color: 'blue' },
              { label: 'Fraud Detected', value: '47', color: 'red' },
              { label: 'False Positives', value: '12', color: 'amber' },
              { label: 'Savings Today', value: '$124K', color: 'emerald' },
            ].map(s => (
              <GlassPanel key={s.label}>
                <p className={cn('text-2xl font-bold', {
                  'text-blue-400': s.color === 'blue',
                  'text-red-400': s.color === 'red',
                  'text-amber-400': s.color === 'amber',
                  'text-[#10B981]': s.color === 'emerald',
                })}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </GlassPanel>
            ))}
          </div>

          <GlassPanel>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">ML Detection Signals</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { signal: 'IP Address Mismatch', strength: 88, type: 'Network' },
                { signal: 'Claim Amount Outlier', strength: 72, type: 'Statistical' },
                { signal: 'Duplicate Submission', strength: 95, type: 'Pattern' },
                { signal: 'Document Tampering', strength: 84, type: 'Vision AI' },
                { signal: 'Behavioral Anomaly', strength: 67, type: 'Behavioral' },
                { signal: 'Geographic Inconsistency', strength: 79, type: 'Geospatial' },
              ].map(s => (
                <div key={s.signal} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">{s.signal}</p>
                      <p className="text-xs text-gray-600">{s.type}</p>
                    </div>
                    <span className={cn('text-sm font-bold', s.strength >= 85 ? 'text-red-400' : s.strength >= 70 ? 'text-amber-400' : 'text-blue-400')}>
                      {s.strength}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', s.strength >= 85 ? 'bg-red-500' : s.strength >= 70 ? 'bg-amber-500' : 'bg-blue-500')}
                      style={{ width: `${s.strength}%` }}
                    />
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
