import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, User, FileText, CreditCard, MessageSquare, TrendingUp,
  Shield, Home, Phone, Mail, MapPin, Star, AlertTriangle, CheckCircle,
  Clock, DollarSign, ExternalLink
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/formatters';
import { cn } from '@/utils/cn';

const TABS = ['Overview', 'Policies', 'Claims', 'Payments', 'Timeline', 'Household', 'Risk'] as const;
type Tab = typeof TABS[number];

const mockCustomer = {
  id: 'cust_1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  phone: '+1 (555) 234-5678',
  address: '742 Maple Street, Portland, OR 97201',
  dob: '1985-06-15',
  joinedAt: '2021-03-10T00:00:00Z',
  lastLogin: new Date(Date.now() - 86400000).toISOString(),
  status: 'active',
  segment: 'High Value',
  clv: 28400,
  riskScore: 32,
  npsScore: 9,
  totalPolicies: 3,
  activePolicies: 3,
  totalClaims: 5,
  openClaims: 1,
  totalPremium: 4200,
  totalClaimsPaid: 12500,
  lapseProbability: 8,
  upsellScore: 85,
  avatar: null,
  household: [
    { name: 'Mark Johnson', relation: 'Spouse', age: 41, policies: 2 },
    { name: 'Emma Johnson', relation: 'Child', age: 14, policies: 0 },
    { name: 'Liam Johnson', relation: 'Child', age: 11, policies: 0 },
  ],
};

const mockPolicies = [
  { id: 'pol_1', number: 'POL-2021-001', type: 'Auto', status: 'active', premium: 1800, coverage: 100000, expires: '2025-03-10' },
  { id: 'pol_2', number: 'POL-2021-002', type: 'Home', status: 'active', premium: 1500, coverage: 350000, expires: '2025-03-10' },
  { id: 'pol_3', number: 'POL-2022-008', type: 'Life', status: 'active', premium: 900, coverage: 500000, expires: '2040-01-01' },
];

const mockClaims = [
  { id: 'clm_1', number: 'CLM-2024-1001', type: 'Auto', status: 'approved', amount: 4500, filed: '2024-01-15', resolved: '2024-01-28' },
  { id: 'clm_2', number: 'CLM-2024-1045', type: 'Home', status: 'under_review', amount: 8000, filed: '2024-08-02', resolved: null },
  { id: 'clm_3', number: 'CLM-2023-0892', type: 'Auto', status: 'approved', amount: 2200, filed: '2023-11-10', resolved: '2023-11-20' },
];

const mockPayments = [
  { id: 'pay_1', date: '2024-12-01', amount: 350, method: 'Visa ••4242', status: 'paid', policy: 'Auto' },
  { id: 'pay_2', date: '2024-11-01', amount: 350, method: 'Visa ••4242', status: 'paid', policy: 'Auto' },
  { id: 'pay_3', date: '2024-12-15', amount: 125, method: 'Visa ••4242', status: 'paid', policy: 'Life' },
  { id: 'pay_4', date: '2025-01-01', amount: 350, method: 'Auto-pay', status: 'upcoming', policy: 'Auto' },
];

const mockTimeline = [
  { id: '1', type: 'login', title: 'Customer logged in', desc: 'Via web app', time: new Date(Date.now() - 86400000).toISOString(), icon: User, color: '#6B7280' },
  { id: '2', type: 'claim', title: 'Claim submitted', desc: 'CLM-2024-1045 — Home damage claim for $8,000', time: '2024-08-02T09:15:00Z', icon: FileText, color: '#3B82F6' },
  { id: '3', type: 'payment', title: 'Payment received', desc: '$350 — Auto policy premium', time: '2024-08-01T00:00:00Z', icon: CreditCard, color: '#10B981' },
  { id: '4', type: 'chat', title: 'Support conversation', desc: 'Chatted about claim status — 12 min session', time: '2024-07-28T14:22:00Z', icon: MessageSquare, color: '#8B5CF6' },
  { id: '5', type: 'policy', title: 'Policy renewed', desc: 'Auto policy renewed for another year', time: '2024-03-10T00:00:00Z', icon: Shield, color: '#10B981' },
];

const statusColors: Record<string, string> = {
  active: 'text-emerald-400 bg-emerald-500/10',
  approved: 'text-emerald-400 bg-emerald-500/10',
  under_review: 'text-blue-400 bg-blue-500/10',
  pending: 'text-amber-400 bg-amber-500/10',
  paid: 'text-emerald-400 bg-emerald-500/10',
  upcoming: 'text-blue-400 bg-blue-500/10',
  rejected: 'text-red-400 bg-red-500/10',
};

export const Customer360 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const c = mockCustomer;

  const riskColor = c.riskScore < 30 ? '#10B981' : c.riskScore < 60 ? '#F59E0B' : '#EF4444';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white">{c.name}</h1>
          <p className="text-sm text-gray-500">Customer 360 View · ID: {id || 'cust_1'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Send Email</Button>
          <Button size="sm">Edit Profile</Button>
        </div>
      </div>

      {/* Identity card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <GlassPanel className="lg:col-span-1 flex flex-col items-center text-center py-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-2xl font-bold mb-4">
            {c.name.split(' ').map(n => n[0]).join('')}
          </div>
          <p className="font-bold text-white">{c.name}</p>
          <span className="mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {c.segment}
          </span>
          <div className="mt-4 w-full space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Mail size={12} className="text-gray-600" /> {c.email}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Phone size={12} className="text-gray-600" /> {c.phone}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <MapPin size={12} className="text-gray-600" /> {c.address}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock size={12} className="text-gray-600" /> Joined {formatDate(c.joinedAt)}
            </div>
          </div>
          <div className="mt-4 w-full pt-4 border-t border-white/5 flex justify-between text-xs">
            <div className="text-center">
              <p className="font-bold text-white">{c.npsScore}/10</p>
              <p className="text-gray-600">NPS</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-white">{c.totalPolicies}</p>
              <p className="text-gray-600">Policies</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-white">{c.totalClaims}</p>
              <p className="text-gray-600">Claims</p>
            </div>
          </div>
        </GlassPanel>

        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Customer LTV', value: formatCurrency(c.clv), icon: TrendingUp, color: '#10B981', sub: 'Lifetime value' },
            { label: 'Annual Premium', value: formatCurrency(c.totalPremium), icon: DollarSign, color: '#3B82F6', sub: 'Across all policies' },
            { label: 'Claims Paid', value: formatCurrency(c.totalClaimsPaid), icon: FileText, color: '#F59E0B', sub: 'Total paid out' },
            { label: 'Upsell Score', value: `${c.upsellScore}%`, icon: Star, color: '#8B5CF6', sub: 'Upsell propensity' },
          ].map(m => (
            <GlassPanel key={m.label} className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${m.color}20` }}>
                  <m.icon size={14} style={{ color: m.color }} />
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{m.label}</p>
              </div>
              <p className="text-xl font-bold text-white">{m.value}</p>
              <p className="text-[10px] text-gray-600 mt-1">{m.sub}</p>
            </GlassPanel>
          ))}

          {/* Risk + Lapse */}
          <GlassPanel className="col-span-2 flex items-center gap-6">
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Risk Score</p>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke={riskColor} strokeWidth="3"
                      strokeDasharray={`${(c.riskScore / 100) * 94.2} 94.2`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{c.riskScore}</span>
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: riskColor }}>
                    {c.riskScore < 30 ? 'Low Risk' : c.riskScore < 60 ? 'Medium Risk' : 'High Risk'}
                  </p>
                  <p className="text-[10px] text-gray-600">AI-assessed</p>
                </div>
              </div>
            </div>
            <div className="w-px h-12 bg-white/5" />
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Lapse Probability</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${c.lapseProbability}%` }} />
                </div>
                <span className="text-sm font-bold text-white">{c.lapseProbability}%</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-1">Very low churn risk</p>
            </div>
          </GlassPanel>

          {/* Open claims */}
          <GlassPanel className="col-span-2 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <AlertTriangle size={20} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Open Claims</p>
              <p className="text-xl font-bold text-white">{c.openClaims} active</p>
              <p className="text-[10px] text-gray-600">CLM-2024-1045 · Under review</p>
            </div>
            <Link to="/claims/clm_2" className="text-amber-400 hover:text-amber-300 transition-colors">
              <ExternalLink size={16} />
            </Link>
          </GlassPanel>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] overflow-x-auto hide-scrollbar">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              activeTab === t
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassPanel className="md:col-span-2">
            <h3 className="text-sm font-bold text-gray-200 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {mockTimeline.slice(0, 4).map((ev) => (
                <div key={ev.id} className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg mt-0.5" style={{ backgroundColor: `${ev.color}20` }}>
                    <ev.icon size={14} style={{ color: ev.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-200">{ev.title}</p>
                    <p className="text-xs text-gray-500">{ev.desc}</p>
                  </div>
                  <span className="text-[10px] text-gray-600 shrink-0">{formatRelativeTime(ev.time)}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
          <GlassPanel>
            <h3 className="text-sm font-bold text-gray-200 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              {[
                { label: 'Last login', value: formatRelativeTime(c.lastLogin) },
                { label: 'Avg claim value', value: formatCurrency(c.totalClaimsPaid / c.totalClaims) },
                { label: 'Claim frequency', value: `${(c.totalClaims / 3).toFixed(1)}/yr` },
                { label: 'Payment history', value: '100% on-time' },
                { label: 'Support tickets', value: '2 total, 0 open' },
              ].map(s => (
                <div key={s.label} className="flex justify-between text-xs">
                  <span className="text-gray-500">{s.label}</span>
                  <span className="text-gray-200 font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}

      {activeTab === 'Policies' && (
        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-200">Active Policies</h3>
            <Button size="sm" variant="secondary">Add Policy</Button>
          </div>
          <div className="space-y-3">
            {mockPolicies.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Shield size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-200">{p.type} Insurance</p>
                    <p className="text-xs text-gray-500 font-mono">{p.number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-200">{formatCurrency(p.premium)}<span className="text-xs text-gray-500">/yr</span></p>
                  <p className="text-xs text-gray-500">Coverage: {formatCurrency(p.coverage)}</p>
                </div>
                <div className="text-right">
                  <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', statusColors[p.status])}>
                    {p.status}
                  </span>
                  <p className="text-[10px] text-gray-600 mt-1">Expires {formatDate(p.expires)}</p>
                </div>
                <Link to={`/policies/${p.id}`} className="text-gray-600 hover:text-emerald-400 transition-colors">
                  <ExternalLink size={14} />
                </Link>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {activeTab === 'Claims' && (
        <GlassPanel>
          <h3 className="text-sm font-bold text-gray-200 mb-4">Claims History</h3>
          <div className="space-y-3">
            {mockClaims.map(cl => (
              <div key={cl.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div>
                  <p className="text-sm font-bold font-mono text-emerald-400">{cl.number}</p>
                  <p className="text-xs text-gray-500">{cl.type} · Filed {formatDate(cl.filed)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-200">{formatCurrency(cl.amount)}</p>
                  <p className="text-[10px] text-gray-500">{cl.resolved ? `Resolved ${formatDate(cl.resolved)}` : 'In progress'}</p>
                </div>
                <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', statusColors[cl.status])}>
                  {cl.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {activeTab === 'Payments' && (
        <GlassPanel>
          <h3 className="text-sm font-bold text-gray-200 mb-4">Payment History</h3>
          <div className="space-y-2">
            {mockPayments.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <CreditCard size={14} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-200">{p.policy} Policy</p>
                    <p className="text-xs text-gray-500">{p.method} · {formatDate(p.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-bold text-gray-200">{formatCurrency(p.amount)}</p>
                  <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', statusColors[p.status])}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {activeTab === 'Timeline' && (
        <GlassPanel>
          <h3 className="text-sm font-bold text-gray-200 mb-6">Interaction Timeline</h3>
          <div className="space-y-6 relative">
            <div className="absolute left-[18px] top-0 bottom-0 w-px bg-white/5" />
            {mockTimeline.map((ev) => (
              <div key={ev.id} className="flex items-start gap-4 relative">
                <div className="relative z-10 p-2 rounded-xl flex-shrink-0" style={{ backgroundColor: `${ev.color}20`, border: `1px solid ${ev.color}30` }}>
                  <ev.icon size={14} style={{ color: ev.color }} />
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-200">{ev.title}</p>
                    <span className="text-[10px] text-gray-600 font-mono">{formatDate(ev.time)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {activeTab === 'Household' && (
        <GlassPanel>
          <h3 className="text-sm font-bold text-gray-200 mb-4">Household Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  {c.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-200">{c.name}</p>
                  <p className="text-xs text-emerald-400">Primary Account Holder</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">{c.totalPolicies} policies · CLV {formatCurrency(c.clv)}</p>
            </div>
            {c.household.map((m) => (
              <div key={m.name} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                    {m.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-200">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.relation} · Age {m.age}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{m.policies} policies</p>
                {m.policies === 0 && (
                  <button className="mt-2 text-xs text-emerald-400 hover:underline">+ Add policy for {m.name.split(' ')[0]}</button>
                )}
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {activeTab === 'Risk' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassPanel>
            <h3 className="text-sm font-bold text-gray-200 mb-4">Risk Profile</h3>
            <div className="space-y-4">
              {[
                { label: 'Overall Risk Score', value: c.riskScore, max: 100, color: '#10B981' },
                { label: 'Claim Frequency', value: 28, max: 100, color: '#3B82F6' },
                { label: 'Payment Risk', value: 5, max: 100, color: '#10B981' },
                { label: 'Fraud Probability', value: 3, max: 100, color: '#10B981' },
              ].map(r => (
                <div key={r.label}>
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="text-gray-400">{r.label}</span>
                    <span className="font-bold text-gray-200">{r.value}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${r.value}%`, backgroundColor: r.color }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
          <GlassPanel>
            <h3 className="text-sm font-bold text-gray-200 mb-4">AI Recommendations</h3>
            <div className="space-y-3">
              {[
                { icon: TrendingUp, color: '#10B981', title: 'Upsell Opportunity', desc: 'High propensity (85%) for umbrella policy — avg $600/yr premium' },
                { icon: Star, color: '#8B5CF6', title: 'Loyalty Reward', desc: '3-year customer milestone — send $50 credit to retain' },
                { icon: Home, color: '#3B82F6', title: 'Bundle Discount', desc: 'Offer 12% bundle discount on Auto + Home renewal' },
                { icon: CheckCircle, color: '#10B981', title: 'Low Risk Discount', desc: 'Risk score qualifies for safe customer 8% discount' },
              ].map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${r.color}20` }}>
                    <r.icon size={14} style={{ color: r.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{r.title}</p>
                    <p className="text-xs text-gray-500">{r.desc}</p>
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
