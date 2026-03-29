import { useState } from 'react';
import {
  Shield, Lock, Key, AlertTriangle, CheckCircle2, XCircle,
  Globe, Smartphone, FileText, Download,
  RefreshCw, Plus, Trash2, Save, Activity, Users,
  ShieldCheck, ShieldAlert, Fingerprint, Zap, Search, Filter
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

// ─── Types ───────────────────────────────────────────────────────
interface IPRule { id: string; ip: string; label: string; type: 'allow' | 'block'; addedAt: string; }
interface PasswordPolicy { minLength: number; requireUppercase: boolean; requireNumbers: boolean; requireSymbols: boolean; expiryDays: number; preventReuse: number; maxAttempts: number; lockoutMinutes: number; }
interface ScanResult { id: string; severity: 'critical' | 'high' | 'medium' | 'low' | 'info'; title: string; description: string; status: 'open' | 'fixed' | 'accepted'; cvss: number; }
interface ComplianceItem { id: string; framework: string; control: string; status: 'compliant' | 'partial' | 'non-compliant'; evidence?: string; lastChecked: string; }

// ─── Mock Data ────────────────────────────────────────────────────
const MOCK_IP_RULES: IPRule[] = [
  { id: '1', ip: '192.168.1.0/24', label: 'Internal Network', type: 'allow', addedAt: '2025-01-15' },
  { id: '2', ip: '10.0.0.0/8', label: 'VPN Range', type: 'allow', addedAt: '2025-01-15' },
  { id: '3', ip: '203.0.113.42', label: 'Known Bad Actor', type: 'block', addedAt: '2025-01-20' },
  { id: '4', ip: '198.51.100.0/24', label: 'Suspicious Range', type: 'block', addedAt: '2025-01-22' },
];

const MOCK_SCAN_RESULTS: ScanResult[] = [
  { id: '1', severity: 'critical', title: 'SQL Injection in Claims API', description: 'Unsanitized input in /api/claims endpoint allows SQL injection attacks.', status: 'fixed', cvss: 9.8 },
  { id: '2', severity: 'high', title: 'Missing Rate Limiting', description: 'Authentication endpoints lack rate limiting, enabling brute-force attacks.', status: 'open', cvss: 7.5 },
  { id: '3', severity: 'medium', title: 'Outdated TLS Version', description: 'Server supports TLS 1.0 which is deprecated.', status: 'fixed', cvss: 5.3 },
  { id: '4', severity: 'medium', title: 'Missing Security Headers', description: 'X-Frame-Options and Content-Security-Policy headers not set.', status: 'open', cvss: 4.8 },
  { id: '5', severity: 'low', title: 'Verbose Error Messages', description: 'Stack traces exposed in production error responses.', status: 'accepted', cvss: 2.6 },
  { id: '6', severity: 'info', title: 'HSTS Not Configured', description: 'HTTP Strict Transport Security not enforced on subdomains.', status: 'open', cvss: 0 },
];

const MOCK_COMPLIANCE: ComplianceItem[] = [
  { id: '1', framework: 'GDPR', control: 'Data Subject Rights (Art. 17)', status: 'compliant', evidence: 'Automated deletion workflow implemented', lastChecked: '2025-01-20' },
  { id: '2', framework: 'GDPR', control: 'Data Breach Notification (Art. 33)', status: 'compliant', evidence: 'Incident response plan active', lastChecked: '2025-01-20' },
  { id: '3', framework: 'GDPR', control: 'Consent Management (Art. 7)', status: 'partial', evidence: 'Cookie consent implemented; email consent pending', lastChecked: '2025-01-18' },
  { id: '4', framework: 'PCI-DSS', control: 'Cardholder Data Encryption', status: 'compliant', evidence: 'AES-256 tokenization active', lastChecked: '2025-01-15' },
  { id: '5', framework: 'PCI-DSS', control: 'Access Control Measures', status: 'compliant', evidence: 'RBAC + MFA enforced', lastChecked: '2025-01-15' },
  { id: '6', framework: 'PCI-DSS', control: 'Vulnerability Management', status: 'partial', evidence: 'Quarterly scans running; 2 open findings', lastChecked: '2025-01-22' },
  { id: '7', framework: 'HIPAA', control: 'PHI Access Controls', status: 'compliant', evidence: 'Role-based access with audit logging', lastChecked: '2025-01-10' },
  { id: '8', framework: 'HIPAA', control: 'Encryption of PHI at Rest', status: 'compliant', evidence: 'AES-256 database encryption active', lastChecked: '2025-01-10' },
  { id: '9', framework: 'SOC 2', control: 'Availability Monitoring', status: 'compliant', evidence: 'Uptime monitoring + alerting configured', lastChecked: '2025-01-12' },
  { id: '10', framework: 'SOC 2', control: 'Incident Response', status: 'partial', evidence: 'Plan documented; annual drill pending', lastChecked: '2025-01-12' },
  { id: '11', framework: 'CCPA', control: 'Right to Delete', status: 'compliant', evidence: 'Self-service deletion in customer portal', lastChecked: '2025-01-08' },
  { id: '12', framework: 'CCPA', control: 'Opt-out of Data Sale', status: 'compliant', evidence: 'Do Not Sell link on all pages', lastChecked: '2025-01-08' },
];

const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 12, requireUppercase: true, requireNumbers: true, requireSymbols: true,
  expiryDays: 90, preventReuse: 12, maxAttempts: 5, lockoutMinutes: 30,
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: Shield },
  { id: 'encryption', label: 'Encryption', icon: Lock },
  { id: 'access', label: 'Access Control', icon: Key },
  { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
  { id: 'vulnerabilities', label: 'Vulnerabilities', icon: AlertTriangle },
  { id: 'ipmanager', label: 'IP Manager', icon: Globe },
  { id: 'passwordpolicy', label: 'Password Policy', icon: Fingerprint },
  { id: 'sso', label: 'SSO / OAuth', icon: Zap },
  { id: 'audit', label: 'Security Audit', icon: Activity },
];

// ─── Helpers ──────────────────────────────────────────────────────
const severityColor: Record<string, string> = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  low: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  info: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
};

const complianceColor: Record<string, string> = {
  compliant: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  partial: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  'non-compliant': 'text-red-400 bg-red-500/10 border-red-500/20',
};

// ─── Sub-Components ───────────────────────────────────────────────
const SecurityScore = ({ score }: { score: number }) => {
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';
  const r = 54; const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg width="144" height="144" className="-rotate-90">
        <circle cx="72" cy="72" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="72" cy="72" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold tabular-nums" style={{ color }}>{score}</span>
        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Security</span>
      </div>
    </div>
  );
};

const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
  <button onClick={onChange}
    className={cn('relative h-6 w-11 rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-500/50', value ? 'bg-emerald-500' : 'bg-white/10')}
    role="switch" aria-checked={value}>
    <span className={cn('absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200', value ? 'translate-x-5' : 'translate-x-0')} />
  </button>
);

// ─── Main Component ───────────────────────────────────────────────
export const SecurityCenter = () => {
  const { success, info } = useToast();
  const [tab, setTab] = useState('overview');
  const [ipRules, setIpRules] = useState<IPRule[]>(MOCK_IP_RULES);
  const [newIP, setNewIP] = useState('');
  const [newIPLabel, setNewIPLabel] = useState('');
  const [newIPType, setNewIPType] = useState<'allow' | 'block'>('allow');
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>(DEFAULT_PASSWORD_POLICY);
  const [scanResults] = useState<ScanResult[]>(MOCK_SCAN_RESULTS);
  const [compliance] = useState<ComplianceItem[]>(MOCK_COMPLIANCE);
  const [selectedFramework, setSelectedFramework] = useState('All');
  const [scanning, setScanning] = useState(false);
  const [ssoEnabled, setSsoEnabled] = useState({ saml: false, google: true, microsoft: false, okta: false });
  const [mfaRequired, setMfaRequired] = useState(true);
  const [encryptionSettings, setEncryptionSettings] = useState({
    atRest: true, inTransit: true, tokenization: true, keyRotation: true, backupEncryption: true,
  });

  const securityScore = 74;
  const openFindings = scanResults.filter(r => r.status === 'open').length;
  const complianceScore = Math.round((compliance.filter(c => c.status === 'compliant').length / compliance.length) * 100);
  const frameworks = ['All', 'GDPR', 'PCI-DSS', 'HIPAA', 'SOC 2', 'CCPA'];
  const filteredCompliance = selectedFramework === 'All' ? compliance : compliance.filter(c => c.framework === selectedFramework);

  const handleAddIP = () => {
    if (!newIP) return;
    const rule: IPRule = { id: Date.now().toString(), ip: newIP, label: newIPLabel || 'Unnamed', type: newIPType, addedAt: new Date().toISOString().split('T')[0] };
    setIpRules(prev => [...prev, rule]);
    setNewIP(''); setNewIPLabel('');
    success(`IP ${newIPType === 'allow' ? 'allowed' : 'blocked'}`, `${newIP} has been added to the ${newIPType}list.`);
  };

  const handleRemoveIP = (id: string) => {
    setIpRules(prev => prev.filter(r => r.id !== id));
    success('IP rule removed', 'The IP rule has been deleted.');
  };

  const handleScan = async () => {
    setScanning(true);
    await new Promise(r => setTimeout(r, 2500));
    setScanning(false);
    info('Scan complete', `Found ${openFindings} open vulnerabilities.`);
  };

  const handleSavePasswordPolicy = () => success('Policy saved', 'Password policy has been updated for all users.');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-emerald-400" size={24} /> Security Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage encryption, access control, compliance, and vulnerability management.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => { success('Report generated', 'Security report has been emailed to you.'); }}>
            <Download size={14} className="mr-1.5" /> Export Report
          </Button>
          <Button size="sm" onClick={handleScan} isLoading={scanning}>
            <RefreshCw size={14} className="mr-1.5" /> Run Scan
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl bg-white/[0.03] border border-white/[0.06] p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all',
              tab === id ? 'bg-white/[0.08] text-gray-100' : 'text-gray-500 hover:text-gray-300')}>
            <Icon size={13} />{label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassPanel className="flex flex-col items-center justify-center py-6 gap-4">
            <SecurityScore score={securityScore} />
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-200">Security Score</p>
              <p className="text-xs text-gray-500 mt-1">Based on 47 security controls</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium">Room for improvement</span>
            </div>
          </GlassPanel>

          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {[
              { label: 'Open Vulnerabilities', value: openFindings, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
              { label: 'Compliance Score', value: `${complianceScore}%`, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Active Sessions', value: '142', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Failed Logins (24h)', value: '23', icon: Lock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <GlassPanel key={label} hoverable>
                <div className={cn('inline-flex p-2 rounded-lg mb-3', bg)}>
                  <Icon size={18} className={color} />
                </div>
                <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </GlassPanel>
            ))}
          </div>

          {/* Security Alerts */}
          <div className="lg:col-span-3">
            <GlassPanel>
              <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Active Security Alerts</h3>
              <div className="space-y-3">
                {[
                  { level: 'high', msg: '23 failed login attempts from IP 45.33.32.156 in the last hour', time: '2 min ago' },
                  { level: 'medium', msg: 'Admin user "jdoe" logged in from a new location: Mumbai, India', time: '15 min ago' },
                  { level: 'low', msg: 'Password reset requested for 3 accounts simultaneously', time: '1 hr ago' },
                  { level: 'info', msg: 'TLS certificate for api.insurai.com expires in 14 days', time: '6 hrs ago' },
                ].map((alert, i) => (
                  <div key={i} className={cn('flex items-start gap-3 p-3 rounded-lg border text-sm',
                    alert.level === 'high' ? 'bg-red-500/5 border-red-500/15 text-red-300' :
                    alert.level === 'medium' ? 'bg-yellow-500/5 border-yellow-500/15 text-yellow-300' :
                    alert.level === 'low' ? 'bg-blue-500/5 border-blue-500/15 text-blue-300' :
                    'bg-gray-500/5 border-gray-500/15 text-gray-400')}>
                    <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                    <p className="flex-1">{alert.msg}</p>
                    <span className="text-[10px] text-gray-600 shrink-0">{alert.time}</span>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* ── ENCRYPTION ── */}
      {tab === 'encryption' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassPanel>
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Encryption Settings</h3>
            <div className="space-y-4">
              {[
                { key: 'atRest', label: 'Data at Rest (AES-256)', desc: 'All database records and files encrypted at rest using AES-256-GCM.' },
                { key: 'inTransit', label: 'Data in Transit (TLS 1.3)', desc: 'All API communication secured with TLS 1.3 minimum.' },
                { key: 'tokenization', label: 'PCI Tokenization', desc: 'Card numbers and SSNs replaced with non-sensitive tokens.' },
                { key: 'keyRotation', label: 'Automatic Key Rotation', desc: 'Encryption keys rotated every 90 days automatically.' },
                { key: 'backupEncryption', label: 'Backup Encryption', desc: 'Database backups encrypted with separate key material.' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start justify-between gap-4 py-3 border-b border-white/[0.05] last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                  <Toggle value={encryptionSettings[key as keyof typeof encryptionSettings]}
                    onChange={() => {
                      setEncryptionSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof encryptionSettings] }));
                      success('Setting updated', `${label} has been toggled.`);
                    }} />
                </div>
              ))}
            </div>
          </GlassPanel>

          <div className="space-y-4">
            <GlassPanel>
              <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Key Management</h3>
              <div className="space-y-3">
                {[
                  { name: 'Database Master Key', algo: 'AES-256-GCM', rotated: '2025-01-01', next: '2025-04-01', status: 'active' },
                  { name: 'S3 Backup Key', algo: 'AES-256-CBC', rotated: '2024-12-15', next: '2025-03-15', status: 'active' },
                  { name: 'API Signing Key', algo: 'RSA-4096', rotated: '2025-01-10', next: '2025-07-10', status: 'active' },
                  { name: 'JWT Secret', algo: 'HS256', rotated: '2025-01-20', next: '2025-04-20', status: 'active' },
                ].map((key, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <Key size={14} className="text-gray-500 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-200">{key.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{key.algo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-600">Rotated: {key.rotated}</p>
                      <p className="text-[10px] text-emerald-400">Next: {key.next}</p>
                    </div>
                    <button onClick={() => success('Key rotated', `${key.name} has been rotated.`)}
                      className="text-[10px] text-gray-500 hover:text-emerald-400 transition-colors border border-white/10 px-2 py-1 rounded">
                      Rotate
                    </button>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel>
              <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Tokenization Coverage</h3>
              <div className="space-y-2">
                {[
                  { field: 'Credit Card Numbers', coverage: 100 },
                  { field: 'Social Security Numbers', coverage: 100 },
                  { field: 'Bank Account Numbers', coverage: 96 },
                  { field: 'Driver License Numbers', coverage: 88 },
                ].map(({ field, coverage }) => (
                  <div key={field}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{field}</span>
                      <span className={coverage === 100 ? 'text-emerald-400' : 'text-yellow-400'}>{coverage}%</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full', coverage === 100 ? 'bg-emerald-500' : 'bg-yellow-500')}
                        style={{ width: `${coverage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* ── ACCESS CONTROL ── */}
      {tab === 'access' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassPanel>
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Multi-Factor Authentication</h3>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <div>
                  <p className="text-sm font-semibold text-gray-200">Require MFA for All Admin Users</p>
                  <p className="text-xs text-gray-500 mt-0.5">Enforce MFA on every admin login regardless of location.</p>
                </div>
                <Toggle value={mfaRequired} onChange={() => { setMfaRequired(!mfaRequired); success('MFA policy updated', `MFA is now ${!mfaRequired ? 'required' : 'optional'}.`); }} />
              </div>
              {[
                { method: 'Authenticator App (TOTP)', enabled: 87, icon: Smartphone },
                { method: 'SMS OTP', enabled: 34, icon: Smartphone },
                { method: 'Email OTP', enabled: 12, icon: FileText },
                { method: 'Hardware Key (FIDO2)', enabled: 5, icon: Key },
              ].map(({ method, enabled, icon: Icon }) => (
                <div key={method} className="flex items-center gap-3 py-2.5 border-b border-white/[0.05] last:border-0">
                  <div className="p-1.5 rounded-lg bg-white/[0.04]"><Icon size={14} className="text-gray-400" /></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-200">{method}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${enabled}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-500">{enabled}% of users</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <div className="space-y-4">
            <GlassPanel>
              <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Session Management</h3>
              <div className="space-y-3">
                {[
                  { label: 'Session Timeout (Idle)', value: '30 minutes', editable: true },
                  { label: 'Absolute Session Limit', value: '8 hours', editable: true },
                  { label: 'Concurrent Sessions', value: '3 max', editable: true },
                  { label: 'Secure Cookies', value: 'Enabled', editable: false },
                  { label: 'SameSite Policy', value: 'Strict', editable: false },
                ].map(({ label, value, editable }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
                    <p className="text-sm text-gray-300">{label}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 font-mono">{value}</span>
                      {editable && <button className="text-[10px] text-emerald-400 hover:underline" onClick={() => info('Coming soon', 'Session settings will be editable in the next release.')}>Edit</button>}
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel>
              <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Active Admin Sessions</h3>
              <div className="space-y-2">
                {[
                  { user: 'Maruthi', device: 'Chrome / macOS', ip: '192.168.1.10', location: 'San Francisco', current: true, since: '2h ago' },
                  { user: 'Sarah Chen', device: 'Firefox / Windows', ip: '10.0.0.42', location: 'New York', current: false, since: '4h ago' },
                  { user: 'Mike Ross', device: 'Safari / iPad', ip: '203.0.113.5', location: 'Chicago', current: false, since: '1h ago' },
                ].map((session, i) => (
                  <div key={i} className={cn('flex items-center justify-between gap-3 p-3 rounded-lg border text-sm',
                    session.current ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-white/[0.02] border-white/[0.05]')}>
                    <div>
                      <p className="font-medium text-gray-200">{session.user} {session.current && <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/15 px-1.5 py-0.5 rounded ml-1">YOU</span>}</p>
                      <p className="text-[10px] text-gray-500">{session.device} · {session.ip} · {session.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-600">{session.since}</span>
                      {!session.current && <button onClick={() => success('Session terminated', `${session.user}'s session has been ended.`)}
                        className="text-[10px] text-red-400 hover:underline border border-red-500/20 px-1.5 py-0.5 rounded">Revoke</button>}
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* ── COMPLIANCE ── */}
      {tab === 'compliance' && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {frameworks.filter(f => f !== 'All').map(fw => {
              const items = compliance.filter(c => c.framework === fw);
              const pct = Math.round((items.filter(c => c.status === 'compliant').length / items.length) * 100);
              return (
                <GlassPanel key={fw} hoverable>
                  <p className="text-xs font-bold text-gray-500 mb-2">{fw}</p>
                  <p className="text-2xl font-bold tabular-nums" style={{ color: pct >= 90 ? '#10B981' : pct >= 70 ? '#F59E0B' : '#EF4444' }}>{pct}%</p>
                  <p className="text-[10px] text-gray-600 mt-1">{items.filter(c => c.status === 'compliant').length}/{items.length} controls</p>
                </GlassPanel>
              );
            })}
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2">
            {frameworks.map(fw => (
              <button key={fw} onClick={() => setSelectedFramework(fw)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  selectedFramework === fw ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'text-gray-500 border-white/10 hover:text-gray-300')}>
                {fw}
              </button>
            ))}
          </div>

          {/* Controls Table */}
          <GlassPanel>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Framework', 'Control', 'Status', 'Evidence', 'Last Checked'].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredCompliance.map(item => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">{item.framework}</span></td>
                      <td className="py-3 px-3 text-gray-300">{item.control}</td>
                      <td className="py-3 px-3">
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border capitalize', complianceColor[item.status])}>
                          {item.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-500 max-w-xs">{item.evidence || '—'}</td>
                      <td className="py-3 px-3 text-[10px] text-gray-600 font-mono">{item.lastChecked}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* ── VULNERABILITIES ── */}
      {tab === 'vulnerabilities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              {['critical', 'high', 'medium', 'low', 'info'].map(s => {
                const count = scanResults.filter(r => r.severity === s).length;
                return (
                  <div key={s} className={cn('px-3 py-1.5 rounded-lg border text-xs font-bold', severityColor[s])}>
                    {count} {s.charAt(0).toUpperCase() + s.slice(1)}
                  </div>
                );
              })}
            </div>
            <Button size="sm" variant="secondary" onClick={handleScan} isLoading={scanning}>
              <RefreshCw size={13} className="mr-1.5" /> Rescan
            </Button>
          </div>

          <div className="space-y-3">
            {scanResults.map(result => (
              <GlassPanel key={result.id} hoverable>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border capitalize shrink-0 mt-0.5', severityColor[result.severity])}>{result.severity}</span>
                    <div>
                      <p className="font-semibold text-gray-200">{result.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{result.description}</p>
                      {result.cvss > 0 && <p className="text-[10px] text-gray-600 mt-1 font-mono">CVSS Score: {result.cvss}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border',
                      result.status === 'fixed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                      result.status === 'accepted' ? 'text-gray-400 bg-gray-500/10 border-gray-500/20' :
                      'text-red-400 bg-red-500/10 border-red-500/20')}>
                      {result.status}
                    </span>
                    {result.status === 'open' && (
                      <button onClick={() => success('Marked as fixed', `"${result.title}" has been marked as resolved.`)}
                        className="text-[10px] text-emerald-400 hover:underline">Mark fixed</button>
                    )}
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      )}

      {/* ── IP MANAGER ── */}
      {tab === 'ipmanager' && (
        <div className="space-y-6">
          <GlassPanel>
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Add IP Rule</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input placeholder="IP address or CIDR range (e.g. 192.168.1.0/24)" value={newIP} onChange={e => setNewIP(e.target.value)} className="flex-1" />
              <Input placeholder="Label (e.g. Office Network)" value={newIPLabel} onChange={e => setNewIPLabel(e.target.value)} className="flex-1" />
              <select value={newIPType} onChange={e => setNewIPType(e.target.value as 'allow' | 'block')}
                className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                <option value="allow" className="bg-[#0F1629]">Allow</option>
                <option value="block" className="bg-[#0F1629]">Block</option>
              </select>
              <Button onClick={handleAddIP} className="shrink-0"><Plus size={14} className="mr-1.5" />Add Rule</Button>
            </div>
          </GlassPanel>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {(['allow', 'block'] as const).map(type => (
              <GlassPanel key={type}>
                <h3 className={cn('text-[10px] font-bold uppercase tracking-widest mb-4', type === 'allow' ? 'text-emerald-400' : 'text-red-400')}>
                  {type === 'allow' ? '✓ Allowlist' : '✗ Blocklist'}
                </h3>
                <div className="space-y-2">
                  {ipRules.filter(r => r.type === type).map(rule => (
                    <div key={rule.id} className={cn('flex items-center justify-between gap-3 p-3 rounded-lg border',
                      type === 'allow' ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-red-500/5 border-red-500/15')}>
                      <div>
                        <p className="text-sm font-mono font-medium text-gray-200">{rule.ip}</p>
                        <p className="text-[10px] text-gray-500">{rule.label} · Added {rule.addedAt}</p>
                      </div>
                      <button onClick={() => handleRemoveIP(rule.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {ipRules.filter(r => r.type === type).length === 0 && (
                    <p className="text-xs text-gray-600 text-center py-6">No rules configured</p>
                  )}
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      )}

      {/* ── PASSWORD POLICY ── */}
      {tab === 'passwordpolicy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassPanel>
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Password Requirements</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Minimum Length: {passwordPolicy.minLength} characters</label>
                <input type="range" min="8" max="32" value={passwordPolicy.minLength}
                  onChange={e => setPasswordPolicy(p => ({ ...p, minLength: +e.target.value }))}
                  className="w-full mt-2 accent-emerald-500" />
              </div>
              {[
                { key: 'requireUppercase', label: 'Require Uppercase Letters', desc: 'At least one A-Z character' },
                { key: 'requireNumbers', label: 'Require Numbers', desc: 'At least one 0-9 digit' },
                { key: 'requireSymbols', label: 'Require Symbols', desc: 'At least one !@#$%^& character' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start justify-between gap-4 py-3 border-b border-white/[0.05] last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                  <Toggle value={passwordPolicy[key as keyof PasswordPolicy] as boolean}
                    onChange={() => setPasswordPolicy(p => ({ ...p, [key]: !p[key as keyof PasswordPolicy] }))} />
                </div>
              ))}
            </div>
          </GlassPanel>

          <div className="space-y-4">
            <GlassPanel>
              <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Password Lifecycle</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password Expiry: {passwordPolicy.expiryDays} days</label>
                  <input type="range" min="30" max="365" step="30" value={passwordPolicy.expiryDays}
                    onChange={e => setPasswordPolicy(p => ({ ...p, expiryDays: +e.target.value }))}
                    className="w-full mt-2 accent-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Prevent Reuse: Last {passwordPolicy.preventReuse} passwords</label>
                  <input type="range" min="0" max="24" value={passwordPolicy.preventReuse}
                    onChange={e => setPasswordPolicy(p => ({ ...p, preventReuse: +e.target.value }))}
                    className="w-full mt-2 accent-emerald-500" />
                </div>
                <div className="pt-2 border-t border-white/[0.06]">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account Lockout</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-gray-500">Max Attempts: {passwordPolicy.maxAttempts}</label>
                      <input type="range" min="3" max="10" value={passwordPolicy.maxAttempts}
                        onChange={e => setPasswordPolicy(p => ({ ...p, maxAttempts: +e.target.value }))}
                        className="w-full mt-1 accent-emerald-500" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500">Lockout: {passwordPolicy.lockoutMinutes} min</label>
                      <input type="range" min="5" max="120" step="5" value={passwordPolicy.lockoutMinutes}
                        onChange={e => setPasswordPolicy(p => ({ ...p, lockoutMinutes: +e.target.value }))}
                        className="w-full mt-1 accent-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            </GlassPanel>

            {/* Live Preview */}
            <GlassPanel>
              <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">Policy Preview</h3>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] font-mono text-xs text-gray-400 space-y-1">
                <p className="text-emerald-400 font-bold"># Password Policy</p>
                <p>min_length: {passwordPolicy.minLength}</p>
                <p>require_uppercase: {passwordPolicy.requireUppercase.toString()}</p>
                <p>require_numbers: {passwordPolicy.requireNumbers.toString()}</p>
                <p>require_symbols: {passwordPolicy.requireSymbols.toString()}</p>
                <p>expiry_days: {passwordPolicy.expiryDays}</p>
                <p>prevent_reuse: {passwordPolicy.preventReuse}</p>
                <p>max_attempts: {passwordPolicy.maxAttempts}</p>
                <p>lockout_minutes: {passwordPolicy.lockoutMinutes}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSavePasswordPolicy}><Save size={14} className="mr-1.5" />Save Policy</Button>
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* ── SSO ── */}
      {tab === 'sso' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassPanel>
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">SSO Providers</h3>
            <div className="space-y-4">
              {[
                { key: 'google', name: 'Google Workspace', desc: 'OAuth 2.0 / OIDC via Google', protocol: 'OAuth 2.0' },
                { key: 'microsoft', name: 'Microsoft Azure AD', desc: 'SAML 2.0 via Microsoft', protocol: 'SAML 2.0' },
                { key: 'okta', name: 'Okta', desc: 'SAML 2.0 / OIDC via Okta', protocol: 'SAML 2.0' },
                { key: 'saml', name: 'Custom SAML IdP', desc: 'Bring your own SAML identity provider', protocol: 'SAML 2.0' },
              ].map(({ key, name, desc, protocol }) => (
                <div key={key} className={cn('flex items-center justify-between gap-4 p-4 rounded-xl border transition-all',
                  ssoEnabled[key as keyof typeof ssoEnabled] ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/[0.06]')}>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    <span className="text-[10px] font-mono text-gray-600">{protocol}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Toggle value={ssoEnabled[key as keyof typeof ssoEnabled]}
                      onChange={() => {
                        setSsoEnabled(prev => ({ ...prev, [key]: !prev[key as keyof typeof ssoEnabled] }));
                        success(`${name} ${ssoEnabled[key as keyof typeof ssoEnabled] ? 'disabled' : 'enabled'}`, 'SSO provider updated.');
                      }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <div className="space-y-4">
            <GlassPanel>
              <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">OAuth 2.0 Configuration</h3>
              <div className="space-y-3">
                <Input label="Client ID" defaultValue="insurai-prod-a3f9b2c1" readOnly className="opacity-70" />
                <div className="relative">
                  <Input label="Client Secret" defaultValue="sk_prod_••••••••••••••••••••" readOnly type="password" className="opacity-70" />
                  <button onClick={() => info('Copied', 'Client secret copied to clipboard.')} className="absolute right-3 bottom-2 text-[10px] text-emerald-400 hover:underline">Reveal</button>
                </div>
                <Input label="Redirect URI" defaultValue="https://app.insurai.com/auth/callback" readOnly className="opacity-70" />
                <Input label="Allowed Scopes" defaultValue="openid profile email" readOnly className="opacity-70" />
                <Button className="w-full" onClick={() => success('Config saved', 'OAuth 2.0 configuration updated.')}>
                  <Save size={14} className="mr-1.5" />Save Configuration
                </Button>
              </div>
            </GlassPanel>

            <GlassPanel>
              <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">SSO Login Activity</h3>
              <div className="space-y-2">
                {[
                  { user: 'sarah@insurai.com', provider: 'Google', time: '2 min ago', success: true },
                  { user: 'mike@insurai.com', provider: 'Google', time: '15 min ago', success: true },
                  { user: 'external@partner.com', provider: 'Okta', time: '1 hr ago', success: false },
                  { user: 'admin@insurai.com', provider: 'Google', time: '2 hr ago', success: true },
                ].map((entry, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.05] last:border-0">
                    {entry.success ? <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> : <XCircle size={14} className="text-red-400 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 truncate">{entry.user}</p>
                      <p className="text-[10px] text-gray-500">via {entry.provider}</p>
                    </div>
                    <span className="text-[10px] text-gray-600">{entry.time}</span>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* ── SECURITY AUDIT ── */}
      {tab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input className="w-full h-10 pl-9 pr-3 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Search audit log..." />
            </div>
            <Button variant="secondary" size="sm"><Filter size={13} className="mr-1.5" />Filter</Button>
            <Button variant="secondary" size="sm" onClick={() => success('Exported', 'Audit log exported to CSV.')}><Download size={13} className="mr-1.5" />Export</Button>
          </div>

          <GlassPanel>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Timestamp', 'User', 'Action', 'Resource', 'IP Address', 'Status'].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {[
                    { ts: '2025-01-25 14:32:01', user: 'Maruthi', action: 'LOGIN', resource: 'Auth', ip: '192.168.1.10', ok: true },
                    { ts: '2025-01-25 14:28:44', user: 'Sarah Chen', action: 'APPROVE_CLAIM', resource: 'CLM-2024-1042', ip: '10.0.0.42', ok: true },
                    { ts: '2025-01-25 14:15:22', user: 'Unknown', action: 'FAILED_LOGIN', resource: 'Auth', ip: '45.33.32.156', ok: false },
                    { ts: '2025-01-25 13:55:10', user: 'Mike Ross', action: 'EXPORT_DATA', resource: 'Claims Report', ip: '10.0.0.15', ok: true },
                    { ts: '2025-01-25 13:42:00', user: 'Unknown', action: 'FAILED_LOGIN', resource: 'Auth', ip: '45.33.32.156', ok: false },
                    { ts: '2025-01-25 12:30:55', user: 'Maruthi', action: 'UPDATE_POLICY', resource: 'POL-1234', ip: '192.168.1.10', ok: true },
                    { ts: '2025-01-25 11:20:33', user: 'Emily Wang', action: 'DELETE_USER', resource: 'user_99', ip: '10.0.0.8', ok: true },
                    { ts: '2025-01-25 10:05:12', user: 'System', action: 'KEY_ROTATION', resource: 'DB Master Key', ip: 'internal', ok: true },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-mono text-[10px] text-gray-500">{row.ts}</td>
                      <td className="py-3 px-3 text-gray-300">{row.user}</td>
                      <td className="py-3 px-3"><span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">{row.action}</span></td>
                      <td className="py-3 px-3 text-gray-400">{row.resource}</td>
                      <td className="py-3 px-3 font-mono text-[10px] text-gray-500">{row.ip}</td>
                      <td className="py-3 px-3">
                        {row.ok ? <CheckCircle2 size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-red-400" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
