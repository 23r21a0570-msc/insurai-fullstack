import { useState } from 'react';
import {
  CheckCircle2, XCircle, Clock, Download, Filter,
  Users, AlertTriangle, RefreshCw,
  FileText, Mail, Globe, Smartphone, Cookie
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

type ConsentStatus = 'granted' | 'withdrawn' | 'pending' | 'expired';
type ConsentCategory = 'marketing' | 'analytics' | 'functional' | 'necessary' | 'third-party';

interface ConsentRecord {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  category: ConsentCategory;
  purpose: string;
  status: ConsentStatus;
  grantedAt?: string;
  withdrawnAt?: string;
  expiresAt?: string;
  channel: 'web' | 'email' | 'sms' | 'app';
  ipAddress: string;
  version: string;
}

const MOCK_CONSENTS: ConsentRecord[] = [
  { id: '1', customerId: 'C001', customerName: 'Sarah Johnson', email: 'sarah@email.com', category: 'marketing', purpose: 'Email marketing campaigns', status: 'granted', grantedAt: '2024-06-15T10:30:00Z', expiresAt: '2026-06-15T10:30:00Z', channel: 'web', ipAddress: '192.168.1.100', version: 'v2.1' },
  { id: '2', customerId: 'C001', customerName: 'Sarah Johnson', email: 'sarah@email.com', category: 'analytics', purpose: 'Usage analytics & personalization', status: 'granted', grantedAt: '2024-06-15T10:30:00Z', expiresAt: '2026-06-15T10:30:00Z', channel: 'web', ipAddress: '192.168.1.100', version: 'v2.1' },
  { id: '3', customerId: 'C002', customerName: 'Mark Thompson', email: 'mark@email.com', category: 'marketing', purpose: 'SMS promotional messages', status: 'withdrawn', grantedAt: '2023-11-01T09:00:00Z', withdrawnAt: '2024-08-20T14:22:00Z', channel: 'sms', ipAddress: '10.0.0.55', version: 'v1.8' },
  { id: '4', customerId: 'C003', customerName: 'Lisa Chen', email: 'lisa@email.com', category: 'third-party', purpose: 'Share data with partner insurers', status: 'pending', channel: 'email', ipAddress: '203.0.113.42', version: 'v2.1' },
  { id: '5', customerId: 'C004', customerName: 'James Miller', email: 'james@email.com', category: 'analytics', purpose: 'Behavioral tracking', status: 'expired', grantedAt: '2022-09-10T00:00:00Z', expiresAt: '2024-09-10T00:00:00Z', channel: 'web', ipAddress: '172.16.0.10', version: 'v1.5' },
  { id: '6', customerId: 'C005', customerName: 'Emma Davis', email: 'emma@email.com', category: 'marketing', purpose: 'Personalized policy recommendations', status: 'granted', grantedAt: '2024-12-01T11:00:00Z', expiresAt: '2026-12-01T11:00:00Z', channel: 'app', ipAddress: '10.0.1.22', version: 'v2.1' },
  { id: '7', customerId: 'C005', customerName: 'Emma Davis', email: 'emma@email.com', category: 'third-party', purpose: 'Credit bureau data sharing', status: 'withdrawn', grantedAt: '2024-12-01T11:00:00Z', withdrawnAt: '2025-01-10T09:15:00Z', channel: 'web', ipAddress: '10.0.1.22', version: 'v2.1' },
  { id: '8', customerId: 'C006', customerName: 'Robert Brown', email: 'robert@email.com', category: 'functional', purpose: 'Personalized dashboard widgets', status: 'granted', grantedAt: '2024-10-05T08:30:00Z', expiresAt: '2026-10-05T08:30:00Z', channel: 'web', ipAddress: '192.168.1.200', version: 'v2.0' },
];

const CONSENT_PURPOSES = [
  { id: 'marketing-email', category: 'marketing' as ConsentCategory, name: 'Email Marketing', desc: 'Send promotional offers, newsletters, and product updates via email', granted: 8234, total: 12847, required: false },
  { id: 'marketing-sms', category: 'marketing' as ConsentCategory, name: 'SMS Marketing', desc: 'Send promotional text messages and alerts', granted: 5621, total: 12847, required: false },
  { id: 'analytics', category: 'analytics' as ConsentCategory, name: 'Analytics & Tracking', desc: 'Track usage behavior to improve the platform experience', granted: 11203, total: 12847, required: false },
  { id: 'personalization', category: 'analytics' as ConsentCategory, name: 'Personalization', desc: 'Use data to personalize recommendations and dashboard', granted: 9842, total: 12847, required: false },
  { id: 'third-party-credit', category: 'third-party' as ConsentCategory, name: 'Credit Bureau Sharing', desc: 'Share data with credit bureaus for underwriting purposes', granted: 6103, total: 12847, required: false },
  { id: 'third-party-partners', category: 'third-party' as ConsentCategory, name: 'Partner Data Sharing', desc: 'Share anonymized data with reinsurance partners', granted: 3241, total: 12847, required: false },
  { id: 'necessary', category: 'necessary' as ConsentCategory, name: 'Essential Cookies', desc: 'Required for the platform to function (cannot be disabled)', granted: 12847, total: 12847, required: true },
  { id: 'functional', category: 'functional' as ConsentCategory, name: 'Functional Preferences', desc: 'Remember user preferences and settings', granted: 10924, total: 12847, required: false },
];

const statusColor: Record<ConsentStatus, string> = {
  granted: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  withdrawn: 'text-red-400 bg-red-500/10 border-red-500/20',
  pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  expired: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
};

const categoryColor: Record<ConsentCategory, string> = {
  marketing: '#F59E0B',
  analytics: '#3B82F6',
  functional: '#8B5CF6',
  necessary: '#10B981',
  'third-party': '#EF4444',
};

const channelIcon: Record<string, React.ElementType> = {
  web: Globe, email: Mail, sms: Smartphone, app: Smartphone,
};

const TABS = ['Overview', 'Records', 'Consent Log', 'Cookie Banner', 'Compliance'] as const;
type Tab = typeof TABS[number];

const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

export const ConsentManager = () => {
  const { success, info } = useToast();
  const [tab, setTab] = useState<Tab>('Overview');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConsentStatus | 'all'>('all');

  const granted = MOCK_CONSENTS.filter(c => c.status === 'granted').length;
  const withdrawn = MOCK_CONSENTS.filter(c => c.status === 'withdrawn').length;
  const pending = MOCK_CONSENTS.filter(c => c.status === 'pending').length;
  const expired = MOCK_CONSENTS.filter(c => c.status === 'expired').length;

  const filtered = MOCK_CONSENTS.filter(c => {
    const matchSearch = !search || c.customerName.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Cookie className="text-emerald-400" size={22} /> Consent Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track, manage, and audit customer consent across all data processing activities.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => success('Exported', 'Consent records exported to CSV.')}>
            <Download size={13} className="mr-1.5" /> Export
          </Button>
          <Button size="sm" onClick={() => info('Synced', 'Consent preferences re-synced across all systems.')}>
            <RefreshCw size={13} className="mr-1.5" /> Sync
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Consent Granted', value: granted, icon: CheckCircle2, color: '#10B981' },
          { label: 'Withdrawn', value: withdrawn, icon: XCircle, color: '#EF4444' },
          { label: 'Pending', value: pending, icon: Clock, color: '#F59E0B' },
          { label: 'Expired', value: expired, icon: AlertTriangle, color: '#6B7280' },
        ].map(c => (
          <GlassPanel key={c.label}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${c.color}20` }}>
                <c.icon size={14} style={{ color: c.color }} />
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{c.label}</p>
            </div>
            <p className="text-2xl font-bold text-white">{c.value}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] overflow-x-auto hide-scrollbar">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              tab === t ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-300')}>
            {t}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassPanel>
              <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Consent by Purpose</h3>
              <div className="space-y-4">
                {CONSENT_PURPOSES.map(p => {
                  const pct = Math.round((p.granted / p.total) * 100);
                  const color = categoryColor[p.category];
                  return (
                    <div key={p.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border" style={{ color, borderColor: `${color}40`, backgroundColor: `${color}15` }}>
                            {p.category}
                          </span>
                          <span className="text-xs text-gray-200 font-medium">{p.name}</span>
                          {p.required && <span className="text-[9px] text-gray-500 font-bold bg-white/5 px-1 rounded">REQUIRED</span>}
                        </div>
                        <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                      <p className="text-[10px] text-gray-600 mt-1">{p.granted.toLocaleString()} / {p.total.toLocaleString()} customers</p>
                    </div>
                  );
                })}
              </div>
            </GlassPanel>

            <GlassPanel>
              <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Consent Health</h3>
              <div className="space-y-4">
                {[
                  { label: 'Overall Consent Rate', value: '87.4%', status: 'good', desc: 'Above industry avg of 72%' },
                  { label: 'Withdrawal Rate (30d)', value: '1.2%', status: 'good', desc: '0.3pp lower than last month' },
                  { label: 'Expired Consents', value: '234', status: 'warn', desc: 'Need renewal outreach' },
                  { label: 'Pending Responses', value: '89', status: 'warn', desc: 'Awaiting customer action' },
                  { label: 'Double Opt-In Rate', value: '94.1%', status: 'good', desc: 'Email verification complete' },
                  { label: 'GDPR Compliance', value: '100%', status: 'good', desc: 'All consents properly documented' },
                ].map(({ label, value, status, desc }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
                    <div>
                      <p className="text-sm text-gray-200">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-200">{value}</p>
                      {status === 'good'
                        ? <CheckCircle2 size={14} className="text-emerald-400" />
                        : <AlertTriangle size={14} className="text-amber-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* ── RECORDS TAB ── */}
      {tab === 'Records' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Search by name or email..." />
            </div>
            <div className="flex gap-2">
              {(['all', 'granted', 'withdrawn', 'pending', 'expired'] as const).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={cn('px-3 py-1.5 rounded-lg border text-xs font-medium transition-all capitalize',
                    statusFilter === s ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'text-gray-500 border-white/10 hover:text-gray-300')}>
                  {s}
                </button>
              ))}
            </div>
            <Button variant="secondary" size="sm" onClick={() => success('Exported', 'Filtered records exported.')}>
              <Download size={13} className="mr-1.5" /> Export
            </Button>
          </div>

          <GlassPanel>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Customer', 'Purpose', 'Category', 'Channel', 'Status', 'Granted', 'Expires / Withdrawn', 'Version'].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map(c => {
                    const ChIcon = channelIcon[c.channel] || Globe;
                    return (
                      <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-medium text-gray-200">{c.customerName}</p>
                          <p className="text-[10px] text-gray-500">{c.email}</p>
                        </td>
                        <td className="py-3 px-3 text-xs text-gray-400 max-w-[180px] truncate">{c.purpose}</td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border capitalize"
                            style={{ color: categoryColor[c.category], borderColor: `${categoryColor[c.category]}40`, backgroundColor: `${categoryColor[c.category]}15` }}>
                            {c.category}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <ChIcon size={12} className="text-gray-600" />
                            {c.channel}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border capitalize', statusColor[c.status])}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-gray-500">{formatDate(c.grantedAt)}</td>
                        <td className="py-3 px-3 text-xs text-gray-500">
                          {c.status === 'withdrawn' ? formatDate(c.withdrawnAt) : formatDate(c.expiresAt)}
                        </td>
                        <td className="py-3 px-3 text-xs font-mono text-gray-600">{c.version}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-gray-600 text-sm">No records match your filters</div>
              )}
            </div>
          </GlassPanel>
        </div>
      )}

      {/* ── CONSENT LOG TAB ── */}
      {tab === 'Consent Log' && (
        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-200">Consent Event Log</h3>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm"><Filter size={13} className="mr-1.5" />Filter</Button>
              <Button variant="secondary" size="sm" onClick={() => success('Exported', 'Consent log exported.')}><Download size={13} className="mr-1.5" />Export</Button>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { action: 'CONSENT_GRANTED', customer: 'Emma Davis', purpose: 'Email Marketing', time: '2025-01-25 14:32:01', ip: '10.0.1.22', channel: 'app', color: '#10B981' },
              { action: 'CONSENT_WITHDRAWN', customer: 'Emma Davis', purpose: 'Credit Bureau Sharing', time: '2025-01-10 09:15:33', ip: '10.0.1.22', channel: 'web', color: '#EF4444' },
              { action: 'CONSENT_EXPIRED', customer: 'James Miller', purpose: 'Behavioral Tracking', time: '2024-09-10 00:00:00', ip: 'system', channel: 'system', color: '#6B7280' },
              { action: 'CONSENT_WITHDRAWN', customer: 'Mark Thompson', purpose: 'SMS Marketing', time: '2024-08-20 14:22:12', ip: '10.0.0.55', channel: 'sms', color: '#EF4444' },
              { action: 'CONSENT_GRANTED', customer: 'Sarah Johnson', purpose: 'Email Marketing', time: '2024-06-15 10:30:44', ip: '192.168.1.100', channel: 'web', color: '#10B981' },
              { action: 'CONSENT_GRANTED', customer: 'Robert Brown', purpose: 'Functional Preferences', time: '2024-10-05 08:30:22', ip: '192.168.1.200', channel: 'web', color: '#10B981' },
            ].map((ev, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold" style={{ color: ev.color }}>{ev.action}</span>
                    <span className="text-xs text-gray-300">{ev.customer}</span>
                    <span className="text-xs text-gray-500">—</span>
                    <span className="text-xs text-gray-400">{ev.purpose}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-600">
                    <span className="font-mono">{ev.time}</span>
                    <span>·</span>
                    <span>IP: {ev.ip}</span>
                    <span>·</span>
                    <span>via {ev.channel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* ── COOKIE BANNER TAB ── */}
      {tab === 'Cookie Banner' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassPanel>
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Cookie Consent Configuration</h3>
            <div className="space-y-4">
              {[
                { label: 'Banner Position', options: ['Bottom bar', 'Center modal', 'Top bar'], selected: 'Bottom bar' },
                { label: 'Default State', options: ['All rejected', 'Necessary only', 'All accepted'], selected: 'Necessary only' },
                { label: 'Consent Expiry', options: ['6 months', '1 year', '2 years', 'Never'], selected: '1 year' },
                { label: 'Granularity', options: ['Accept/Reject all', 'Per category', 'Per purpose'], selected: 'Per category' },
              ].map(({ label, options, selected }) => (
                <div key={label}>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>
                  <select defaultValue={selected} className="mt-1.5 w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-gray-300 focus:outline-none">
                    {options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <Button className="w-full" onClick={() => success('Config saved', 'Cookie banner configuration updated.')}>
                Save Banner Config
              </Button>
            </div>
          </GlassPanel>

          <GlassPanel>
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Banner Preview</h3>
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-3">
              <div className="flex items-start gap-2">
                <Cookie size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-gray-200">We use cookies</p>
                  <p className="text-xs text-gray-400 mt-1">We use cookies and similar technologies to improve your experience, analyze usage, and show personalized content. You can manage your preferences below.</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Necessary', required: true, checked: true },
                  { name: 'Analytics', required: false, checked: false },
                  { name: 'Marketing', required: false, checked: false },
                  { name: 'Functional', required: false, checked: true },
                ].map(c => (
                  <label key={c.name} className={cn('flex items-center justify-between p-2 rounded-lg cursor-pointer', c.required ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]')}>
                    <span className="text-xs text-gray-300">{c.name} {c.required && <span className="text-[9px] text-gray-600">(required)</span>}</span>
                    <input type="checkbox" defaultChecked={c.checked} disabled={c.required} className="accent-emerald-500" />
                  </label>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 h-8 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors">Accept Selected</button>
                <button className="flex-1 h-8 rounded-lg border border-white/10 text-gray-400 text-xs font-bold hover:bg-white/5 transition-colors">Accept All</button>
              </div>
              <p className="text-[9px] text-gray-600 text-center">Powered by INSURAI Consent Manager · Privacy Policy · Cookie Policy</p>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* ── COMPLIANCE TAB ── */}
      {tab === 'Compliance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { framework: 'GDPR', score: 96, status: 'Compliant', items: ['Lawful basis documented', 'Consent records kept 3 years', 'Withdrawal mechanism active', 'Double opt-in for email'] },
              { framework: 'CCPA', score: 100, status: 'Compliant', items: ['"Do Not Sell" link present', 'Consumer deletion workflow active', 'Privacy notice updated', 'Opt-out honored within 15 days'] },
              { framework: 'CASL', score: 88, status: 'Mostly Compliant', items: ['Express consent captured', 'Unsubscribe within 10 days', 'Sender identification present', 'Need: electronic contact address'] },
            ].map(fw => (
              <GlassPanel key={fw.framework}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-200">{fw.framework}</h3>
                  <div className="text-right">
                    <p className="text-2xl font-bold tabular-nums" style={{ color: fw.score >= 95 ? '#10B981' : fw.score >= 80 ? '#F59E0B' : '#EF4444' }}>{fw.score}%</p>
                    <p className="text-[10px] text-gray-500">{fw.status}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {fw.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle2 size={12} className={fw.score === 100 || i < 3 ? 'text-emerald-400' : 'text-amber-400'} />
                      {item}
                    </div>
                  ))}
                </div>
              </GlassPanel>
            ))}
          </div>

          <GlassPanel>
            <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
              <FileText size={16} className="text-gray-400" /> Consent Audit Report
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { label: 'Total Consent Records', value: '98,421' },
                { label: 'Records With Proof', value: '98,421 (100%)' },
                { label: 'Oldest Record', value: 'Jan 15, 2020' },
                { label: 'Last Audit', value: 'Jan 22, 2025' },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-bold text-gray-200 mt-1">{value}</p>
                </div>
              ))}
            </div>
            <Button variant="secondary" onClick={() => success('Report generated', 'Consent audit report emailed to compliance team.')}>
              <Download size={14} className="mr-1.5" /> Generate Full Audit Report
            </Button>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
