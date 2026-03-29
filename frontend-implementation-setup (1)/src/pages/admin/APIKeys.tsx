import { useState } from 'react';
import {
  Key, Plus, Trash2, Copy, Eye, EyeOff, RefreshCw,
  Shield, AlertTriangle, CheckCircle2, Download,
  Activity, Clock, Globe, Lock
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

interface APIKey {
  id: string;
  name: string;
  prefix: string;
  key?: string;
  environment: 'production' | 'sandbox' | 'development';
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
  requestsToday: number;
  requestsMonth: number;
  rateLimit: number;
  status: 'active' | 'revoked' | 'expired';
  createdBy: string;
  ipWhitelist?: string[];
}

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'failing' | 'disabled';
  secret: string;
  lastDelivery?: string;
  successRate: number;
  totalDeliveries: number;
}

const MOCK_KEYS: APIKey[] = [
  {
    id: '1', name: 'Production Claims API', prefix: 'ik_prod_',
    environment: 'production',
    permissions: ['claims:read', 'claims:write', 'policies:read'],
    createdAt: '2024-01-15', lastUsed: '2025-01-25T14:32:00Z',
    expiresAt: '2026-01-15',
    requestsToday: 1284, requestsMonth: 38421, rateLimit: 10000,
    status: 'active', createdBy: 'Maruthi',
    ipWhitelist: ['10.0.0.0/8', '203.0.113.0/24'],
  },
  {
    id: '2', name: 'Analytics Service', prefix: 'ik_prod_',
    environment: 'production',
    permissions: ['analytics:read', 'reports:read'],
    createdAt: '2024-03-20', lastUsed: '2025-01-25T12:00:00Z',
    requestsToday: 458, requestsMonth: 14822, rateLimit: 5000,
    status: 'active', createdBy: 'Sarah Chen',
  },
  {
    id: '3', name: 'Staging Integration Test', prefix: 'ik_sbx_',
    environment: 'sandbox',
    permissions: ['claims:read', 'claims:write', 'policies:read', 'policies:write', 'users:read'],
    createdAt: '2024-06-01', lastUsed: '2025-01-20T10:00:00Z',
    requestsToday: 82, requestsMonth: 2451, rateLimit: 1000,
    status: 'active', createdBy: 'Mike Ross',
  },
  {
    id: '4', name: 'Legacy Partner Integration', prefix: 'ik_prod_',
    environment: 'production',
    permissions: ['policies:read'],
    createdAt: '2022-11-01', lastUsed: '2024-10-15T08:00:00Z',
    expiresAt: '2024-11-01',
    requestsToday: 0, requestsMonth: 0, rateLimit: 500,
    status: 'expired', createdBy: 'James Wilson',
  },
  {
    id: '5', name: 'Dev Environment', prefix: 'ik_dev_',
    environment: 'development',
    permissions: ['claims:read', 'policies:read', 'users:read', 'analytics:read'],
    createdAt: '2025-01-01',
    requestsToday: 344, requestsMonth: 8941, rateLimit: 2000,
    status: 'active', createdBy: 'Emily Wang',
  },
];

const MOCK_WEBHOOKS: WebhookEndpoint[] = [
  { id: '1', url: 'https://partner.example.com/webhooks/insurai', events: ['claim.approved', 'claim.rejected', 'policy.renewed'], status: 'active', secret: 'whsec_****', lastDelivery: '2025-01-25T14:30:00Z', successRate: 99.2, totalDeliveries: 48291 },
  { id: '2', url: 'https://analytics.mycompany.com/insurai-events', events: ['claim.submitted', 'policy.created', 'payment.received'], status: 'failing', secret: 'whsec_****', lastDelivery: '2025-01-24T18:00:00Z', successRate: 61.4, totalDeliveries: 12840 },
  { id: '3', url: 'https://crm.internal/hooks/insurance', events: ['customer.updated', 'claim.submitted'], status: 'active', secret: 'whsec_****', lastDelivery: '2025-01-25T13:00:00Z', successRate: 97.8, totalDeliveries: 28410 },
];

const ALL_PERMISSIONS = [
  'claims:read', 'claims:write', 'claims:delete',
  'policies:read', 'policies:write',
  'users:read', 'users:write',
  'analytics:read', 'reports:read',
  'payments:read', 'payments:write',
  'fraud:read', 'audit:read',
  'admin:all',
];

const ALL_EVENTS = [
  'claim.submitted', 'claim.approved', 'claim.rejected', 'claim.updated',
  'policy.created', 'policy.renewed', 'policy.cancelled',
  'payment.received', 'payment.failed',
  'customer.created', 'customer.updated',
  'fraud.detected',
];

const envColor: Record<string, string> = {
  production: 'text-red-400 bg-red-500/10 border-red-500/20',
  sandbox: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  development: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

const statusColor: Record<string, string> = {
  active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  revoked: 'text-red-400 bg-red-500/10 border-red-500/20',
  expired: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  failing: 'text-red-400 bg-red-500/10 border-red-500/20',
  disabled: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
};

const formatRelative = (d?: string) => {
  if (!d) return 'Never';
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
};

const TABS = ['API Keys', 'Webhooks', 'Rate Limits', 'Audit Log'] as const;
type Tab = typeof TABS[number];

export const APIKeys = () => {
  const { success, error: toastError } = useToast();
  const [tab, setTab] = useState<Tab>('API Keys');
  const [keys, setKeys] = useState<APIKey[]>(MOCK_KEYS);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState<'production' | 'sandbox' | 'development'>('sandbox');
  const [newKeyPerms, setNewKeyPerms] = useState<string[]>(['claims:read', 'policies:read']);
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const activeKeys = keys.filter(k => k.status === 'active').length;
  const totalReqToday = keys.reduce((s, k) => s + k.requestsToday, 0);
  const totalReqMonth = keys.reduce((s, k) => s + k.requestsMonth, 0);

  const toggleReveal = (id: string) => {
    setRevealedKeys(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCopy = (text: string, label = 'API key') => {
    navigator.clipboard.writeText(text).catch(() => {});
    success(`${label} copied`, 'Copied to clipboard.');
  };

  const handleRevoke = (id: string, name: string) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
    success('Key revoked', `"${name}" has been permanently revoked.`);
  };

  const handleCreate = () => {
    if (!newKeyName) return toastError('Name required', 'Please enter a name for this key.');
    const fakePart = Math.random().toString(36).slice(2, 18) + Math.random().toString(36).slice(2, 18);
    const prefix = newKeyEnv === 'production' ? 'ik_prod_' : newKeyEnv === 'sandbox' ? 'ik_sbx_' : 'ik_dev_';
    const fullKey = prefix + fakePart;
    setCreatedKey(fullKey);
    const newKey: APIKey = {
      id: Date.now().toString(), name: newKeyName, prefix,
      key: fullKey, environment: newKeyEnv,
      permissions: newKeyPerms,
      createdAt: new Date().toISOString().split('T')[0],
      requestsToday: 0, requestsMonth: 0, rateLimit: 1000,
      status: 'active', createdBy: 'Maruthi',
    };
    setKeys(prev => [newKey, ...prev]);
    setShowCreateForm(false);
    setNewKeyName('');
    setNewKeyPerms(['claims:read', 'policies:read']);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Key className="text-emerald-400" size={22} /> API Keys & Integrations
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage API keys, webhooks, and third-party integrations.</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus size={14} className="mr-1.5" /> Create API Key
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Keys', value: activeKeys, icon: Key, color: '#10B981' },
          { label: 'Requests Today', value: totalReqToday.toLocaleString(), icon: Activity, color: '#3B82F6' },
          { label: 'Requests (Month)', value: `${(totalReqMonth / 1000).toFixed(1)}K`, icon: Globe, color: '#8B5CF6' },
          { label: 'Webhooks Active', value: MOCK_WEBHOOKS.filter(w => w.status === 'active').length, icon: RefreshCw, color: '#F59E0B' },
        ].map(kpi => (
          <GlassPanel key={kpi.label}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${kpi.color}20` }}>
                <kpi.icon size={14} style={{ color: kpi.color }} />
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{kpi.label}</p>
            </div>
            <p className="text-xl font-bold text-white">{kpi.value}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Created Key Alert */}
      {createdKey && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-400">API Key Created — Copy it now!</p>
              <p className="text-xs text-gray-400 mt-1">This key will only be shown once. Store it securely.</p>
              <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-black/30 border border-white/10">
                <code className="flex-1 text-xs font-mono text-gray-300 break-all">{createdKey}</code>
                <button onClick={() => handleCopy(createdKey, 'New API key')} className="text-emerald-400 hover:text-emerald-300 shrink-0">
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <button onClick={() => setCreatedKey(null)} className="text-gray-600 hover:text-gray-400">✕</button>
          </div>
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <GlassPanel className="border-emerald-500/20">
          <h3 className="text-sm font-bold text-gray-200 mb-4">Create New API Key</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input label="Key Name" placeholder="e.g. Partner Integration" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} />
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Environment</label>
              <select value={newKeyEnv} onChange={e => setNewKeyEnv(e.target.value as 'production' | 'sandbox' | 'development')}
                className="mt-1.5 w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-gray-300 focus:outline-none">
                <option value="development">Development</option>
                <option value="sandbox">Sandbox</option>
                <option value="production">Production</option>
              </select>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Permissions</p>
            <div className="flex flex-wrap gap-2">
              {ALL_PERMISSIONS.map(p => (
                <label key={p} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={newKeyPerms.includes(p)} onChange={e => {
                    if (e.target.checked) setNewKeyPerms(prev => [...prev, p]);
                    else setNewKeyPerms(prev => prev.filter(x => x !== p));
                  }} className="accent-emerald-500 w-3 h-3" />
                  <span className="text-xs text-gray-400 font-mono">{p}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleCreate}>Create Key</Button>
            <Button variant="secondary" onClick={() => setShowCreateForm(false)}>Cancel</Button>
          </div>
        </GlassPanel>
      )}

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

      {/* ── API KEYS TAB ── */}
      {tab === 'API Keys' && (
        <div className="space-y-4">
          {keys.map(k => (
            <GlassPanel key={k.id} hoverable className={k.status !== 'active' ? 'opacity-60' : ''}>
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-200">{k.name}</p>
                    <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold border capitalize', envColor[k.environment])}>{k.environment}</span>
                    <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold border', statusColor[k.status])}>{k.status}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <code className="text-xs font-mono text-gray-400 bg-white/[0.04] px-2 py-1 rounded">
                      {revealedKeys.has(k.id) ? (k.key || k.prefix + '••••••••••••••••') : k.prefix + '••••••••••••••••'}
                    </code>
                    <button onClick={() => toggleReveal(k.id)} className="text-gray-600 hover:text-gray-400 transition-colors">
                      {revealedKeys.has(k.id) ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button onClick={() => handleCopy(k.prefix + 'copied')} className="text-gray-600 hover:text-emerald-400 transition-colors">
                      <Copy size={13} />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {k.permissions.map(p => (
                      <span key={p} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-gray-500 border border-white/[0.06]">{p}</span>
                    ))}
                  </div>
                  {k.ipWhitelist && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                      <Lock size={11} className="text-gray-600" />
                      IP restricted: {k.ipWhitelist.join(', ')}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-6 text-xs text-center">
                  <div>
                    <p className="font-bold text-gray-200">{k.requestsToday.toLocaleString()}</p>
                    <p className="text-gray-600">Today</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-200">{k.requestsMonth.toLocaleString()}</p>
                    <p className="text-gray-600">This Month</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-200">{k.rateLimit.toLocaleString()}/hr</p>
                    <p className="text-gray-600">Rate Limit</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-200">{formatRelative(k.lastUsed)}</p>
                    <p className="text-gray-600">Last Used</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {k.status === 'active' && (
                    <Button size="sm" variant="danger" onClick={() => handleRevoke(k.id, k.name)}>
                      <Trash2 size={13} className="mr-1" /> Revoke
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/[0.05] flex flex-wrap gap-4 text-xs text-gray-600">
                <span><Clock size={11} className="inline mr-1" />Created {k.createdAt} by {k.createdBy}</span>
                {k.expiresAt && <span className={k.status === 'expired' ? 'text-red-400' : ''}><Clock size={11} className="inline mr-1" />Expires {k.expiresAt}</span>}
              </div>
            </GlassPanel>
          ))}
        </div>
      )}

      {/* ── WEBHOOKS TAB ── */}
      {tab === 'Webhooks' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => success('Coming soon', 'Webhook creation UI coming next release.')}>
              <Plus size={13} className="mr-1.5" /> Add Endpoint
            </Button>
          </div>
          {MOCK_WEBHOOKS.map(w => (
            <GlassPanel key={w.id} hoverable>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Globe size={14} className="text-gray-500 shrink-0" />
                    <code className="text-sm font-mono text-gray-200 break-all">{w.url}</code>
                    <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold border', statusColor[w.status])}>{w.status}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {w.events.map(ev => (
                      <span key={ev} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{ev}</span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span>Last delivery: {formatRelative(w.lastDelivery)}</span>
                    <span>Success rate: <span className={w.successRate >= 95 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{w.successRate}%</span></span>
                    <span>{w.totalDeliveries.toLocaleString()} total deliveries</span>
                  </div>
                  {w.status === 'failing' && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-red-400 bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-2">
                      <AlertTriangle size={13} /> Endpoint is returning errors — check your server logs
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleCopy(w.secret, 'Webhook secret')} className="text-xs text-gray-500 hover:text-emerald-400 flex items-center gap-1 border border-white/10 px-2 py-1.5 rounded-lg">
                    <Shield size={12} /> Secret
                  </button>
                  <Button size="sm" variant="secondary" onClick={() => success('Test sent', 'Test event delivered to endpoint.')}>
                    Test
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => success('Disabled', 'Webhook endpoint disabled.')}>
                    Disable
                  </Button>
                </div>
              </div>
            </GlassPanel>
          ))}

          <GlassPanel>
            <h3 className="text-sm font-bold text-gray-200 mb-4">Available Events</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_EVENTS.map(ev => (
                <span key={ev} className="text-xs font-mono px-2 py-1 rounded bg-white/[0.04] text-gray-400 border border-white/[0.06]">{ev}</span>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}

      {/* ── RATE LIMITS TAB ── */}
      {tab === 'Rate Limits' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassPanel>
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Global Rate Limits</h3>
            <div className="space-y-4">
              {[
                { tier: 'Development', limit: '1,000 req/hr', burst: '100 req/min', color: '#3B82F6' },
                { tier: 'Sandbox', limit: '5,000 req/hr', burst: '500 req/min', color: '#F59E0B' },
                { tier: 'Production', limit: '10,000 req/hr', burst: '1,000 req/min', color: '#10B981' },
                { tier: 'Enterprise', limit: 'Custom', burst: 'Custom', color: '#8B5CF6' },
              ].map(({ tier, limit, burst, color }) => (
                <div key={tier} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <p className="text-sm font-medium text-gray-200">{tier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-200">{limit}</p>
                    <p className="text-xs text-gray-500">Burst: {burst}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel>
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Usage by Key (Today)</h3>
            <div className="space-y-3">
              {keys.filter(k => k.status === 'active').map(k => {
                const pct = Math.min(Math.round((k.requestsToday / k.rateLimit) * 100), 100);
                return (
                  <div key={k.id}>
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="text-gray-300 truncate max-w-[200px]">{k.name}</span>
                      <span className={pct > 80 ? 'text-red-400 font-bold' : pct > 50 ? 'text-amber-400 font-bold' : 'text-gray-400'}>
                        {k.requestsToday.toLocaleString()} / {k.rateLimit.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: pct > 80 ? '#EF4444' : pct > 50 ? '#F59E0B' : '#10B981' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassPanel>
        </div>
      )}

      {/* ── AUDIT LOG TAB ── */}
      {tab === 'Audit Log' && (
        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-200">API Access Log</h3>
            <Button variant="secondary" size="sm" onClick={() => success('Exported', 'API audit log exported.')}>
              <Download size={13} className="mr-1.5" /> Export
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" role="table">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Timestamp', 'Key Name', 'Method', 'Endpoint', 'Status', 'Response Time', 'IP'].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {[
                  { ts: '14:32:01', key: 'Production Claims API', method: 'GET', endpoint: '/api/claims', status: 200, time: '45ms', ip: '10.0.0.24' },
                  { ts: '14:31:55', key: 'Analytics Service', method: 'GET', endpoint: '/api/analytics/dashboard', status: 200, time: '120ms', ip: '10.0.0.31' },
                  { ts: '14:30:42', key: 'Production Claims API', method: 'POST', endpoint: '/api/claims', status: 201, time: '230ms', ip: '10.0.0.24' },
                  { ts: '14:29:18', key: 'Dev Environment', method: 'GET', endpoint: '/api/policies', status: 200, time: '88ms', ip: '127.0.0.1' },
                  { ts: '14:28:03', key: 'Production Claims API', method: 'PUT', endpoint: '/api/claims/123', status: 200, time: '195ms', ip: '10.0.0.24' },
                  { ts: '14:26:44', key: 'Staging Integration Test', method: 'GET', endpoint: '/api/users', status: 403, time: '12ms', ip: '10.0.1.5' },
                  { ts: '14:25:01', key: 'Analytics Service', method: 'GET', endpoint: '/api/analytics/fraud', status: 200, time: '340ms', ip: '10.0.0.31' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono text-gray-500">2025-01-25 {row.ts}</td>
                    <td className="py-3 px-3 text-gray-300 truncate max-w-[150px]">{row.key}</td>
                    <td className="py-3 px-3">
                      <span className={cn('font-mono font-bold text-[10px]',
                        row.method === 'GET' ? 'text-blue-400' : row.method === 'POST' ? 'text-emerald-400' :
                        row.method === 'PUT' ? 'text-amber-400' : 'text-red-400')}>
                        {row.method}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-400">{row.endpoint}</td>
                    <td className="py-3 px-3">
                      <span className={cn('font-mono font-bold', row.status < 300 ? 'text-emerald-400' : row.status < 400 ? 'text-amber-400' : 'text-red-400')}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-500">{row.time}</td>
                    <td className="py-3 px-3 font-mono text-gray-600">{row.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      )}
    </div>
  );
};
