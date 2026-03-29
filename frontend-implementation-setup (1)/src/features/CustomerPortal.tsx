import { useState } from 'react';
import { Home, FileCheck, FileText, CreditCard, User, Shield, Car, Heart, Building, AlertCircle, CheckCircle2, Clock, XCircle, Plus, ChevronDown, ChevronUp, Lock, Eye, EyeOff } from 'lucide-react';
import { cn, formatCurrency, formatDate, formatRelativeTime, formatClaimType } from '@/lib/utils';
import { mockCustomerPolicies, mockCustomerClaims, mockCustomerPayments } from '@/lib/mockData';
import { CustomerOverviewCard, GlassPanel, Button, StatusBadge, Modal, Input, Select, EmptyState } from '@/components/UI';
import { useToast } from '@/lib/contexts';
import { useAuth } from '@/lib/contexts';
import type { ClaimStatus } from '@/types';

type Tab = 'dashboard' | 'policies' | 'claims' | 'payments' | 'profile';

// ─── Status icon helper ───────────────────────────────────────────────────────
const StatusIcon = ({ status }: { status: ClaimStatus }) => {
  const map = { approved: <CheckCircle2 size={16} className="text-emerald-400" />, rejected: <XCircle size={16} className="text-red-400" />, under_review: <Clock size={16} className="text-blue-400" />, pending_info: <AlertCircle size={16} className="text-amber-400" />, escalated: <AlertCircle size={16} className="text-purple-400" />, submitted: <Clock size={16} className="text-gray-400" /> };
  return map[status] ?? null;
};

// ─── Policy type icon ─────────────────────────────────────────────────────────
const PolicyIcon = ({ type }: { type: string }) => {
  const map: Record<string, React.ReactNode> = { auto: <Car size={20} />, home: <Home size={20} />, health: <Heart size={20} />, life: <Shield size={20} />, business: <Building size={20} /> };
  return <>{map[type] ?? <Shield size={20} />}</>;
};

// ─── CustomerPortal ───────────────────────────────────────────────────────────
export const CustomerPortal = () => {
  const [tab, setTab]             = useState<Tab>('dashboard');
  const [newClaimOpen, setNewClaimOpen] = useState(false);
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);
  const { success } = useToast();
  const { user }    = useAuth();

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard',    icon: <Home size={18} />       },
    { id: 'policies',  label: 'My Policies',  icon: <FileCheck size={18} />  },
    { id: 'claims',    label: 'My Claims',    icon: <FileText size={18} />   },
    { id: 'payments',  label: 'Payments',     icon: <CreditCard size={18} /> },
    { id: 'profile',   label: 'Profile',      icon: <User size={18} />       },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your policies, claims, and upcoming payments.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-xl hide-scrollbar">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn('flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
              tab === t.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5')}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD TAB ── */}
      {tab === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CustomerOverviewCard title="Active Policies" value={mockCustomerPolicies.filter(p=>p.status==='active').length} description="Currently active coverage" icon={<Shield size={20} />} accent="emerald" onClick={() => setTab('policies')} />
            <CustomerOverviewCard title="Open Claims" value={mockCustomerClaims.filter(c=>!['approved','rejected'].includes(c.status)).length} description="Claims under review" icon={<FileText size={20} />} accent="blue" onClick={() => setTab('claims')} />
            <CustomerOverviewCard title="Next Payment" value={formatCurrency(mockCustomerPayments.filter(p=>p.status==='upcoming')[0]?.amount ?? 0)} description={`Due ${formatDate(mockCustomerPayments.filter(p=>p.status==='upcoming')[0]?.dueDate ?? new Date().toISOString())}`} icon={<CreditCard size={20} />} accent="amber" onClick={() => setTab('payments')} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassPanel>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-200">Recent Claims</h3>
                <button onClick={() => setTab('claims')} className="text-xs text-emerald-500 hover:underline">View all</button>
              </div>
              <div className="space-y-3">
                {mockCustomerClaims.slice(0, 3).map(c => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <StatusIcon status={c.status} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200">{c.claimNumber}</p>
                      <p className="text-xs text-gray-500 truncate">{formatClaimType(c.type)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-200">{formatCurrency(c.amount)}</p>
                      <StatusBadge status={c.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-200">Upcoming Payments</h3>
                <button onClick={() => setTab('payments')} className="text-xs text-emerald-500 hover:underline">View all</button>
              </div>
              <div className="space-y-3">
                {mockCustomerPayments.filter(p=>p.status==='upcoming').map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><CreditCard size={16} /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-200">{p.policyNumber}</p>
                      <p className="text-xs text-gray-500">Due {formatDate(p.dueDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-200">{formatCurrency(p.amount)}</p>
                      <Button variant="primary" size="sm" onClick={() => success('Payment processed', `${formatCurrency(p.amount)} paid for ${p.policyNumber}.`)} className="mt-1 text-[10px] h-6 px-2">Pay Now</Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* ── POLICIES TAB ── */}
      {tab === 'policies' && (
        <div className="space-y-4 animate-fade-in">
          {mockCustomerPolicies.length === 0 ? <EmptyState message="No policies found." /> : mockCustomerPolicies.map(p => (
            <GlassPanel key={p.id} hoverable>
              <div className="flex items-center gap-4">
                <div className={cn('p-3 rounded-xl', p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400')}><PolicyIcon type={p.type} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold text-gray-200">{p.policyNumber}</p>
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border uppercase', p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20')}>{p.status}</span>
                    <span className="text-xs text-gray-500 capitalize">{p.type} Insurance</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">Coverage: {formatCurrency(p.coverageAmount)} · Premium: {formatCurrency(p.premium)}/yr</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500">Expires</p>
                  <p className="text-sm font-medium text-gray-300">{formatDate(p.endDate)}</p>
                </div>
                <button onClick={() => setExpandedPolicy(expandedPolicy === p.id ? null : p.id)} className="p-2 rounded-lg hover:bg-white/10 text-gray-500" aria-label="Expand">
                  {expandedPolicy === p.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              {expandedPolicy === p.id && (
                <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[['Deductible', formatCurrency(p.deductible)], ['Start Date', formatDate(p.startDate)], ['End Date', formatDate(p.endDate)], ['Next Payment', formatCurrency(p.nextPaymentAmount)]].map(([label, val]) => (
                    <div key={label}><p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{label}</p><p className="text-sm font-semibold text-gray-200 mt-0.5">{val}</p></div>
                  ))}
                  <div className="col-span-2 md:col-span-4 flex gap-3 mt-2">
                    <Button variant="secondary" size="sm">Download Policy PDF</Button>
                    <Button variant="outline" size="sm" onClick={() => { setNewClaimOpen(true); setTab('claims'); }}>File a Claim</Button>
                  </div>
                </div>
              )}
            </GlassPanel>
          ))}
        </div>
      )}

      {/* ── CLAIMS TAB ── */}
      {tab === 'claims' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{mockCustomerClaims.length} total claims</p>
            <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setNewClaimOpen(true)}>File New Claim</Button>
          </div>
          {mockCustomerClaims.length === 0 ? <EmptyState message="No claims filed yet." action={<Button size="sm" onClick={() => setNewClaimOpen(true)}>File Your First Claim</Button>} /> : (
            <div className="space-y-3">
              {mockCustomerClaims.map(c => (
                <GlassPanel key={c.id} hoverable>
                  <div className="flex items-start gap-4">
                    <StatusIcon status={c.status} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-mono font-bold text-emerald-400 text-sm">{c.claimNumber}</p>
                        <StatusBadge status={c.status} size="sm" />
                        <span className="text-xs text-gray-500">{formatClaimType(c.type)}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{c.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500">Policy: <span className="text-gray-300">{c.policyNumber}</span></span>
                        <span className="text-xs text-gray-500">Filed: <span className="text-gray-300">{formatRelativeTime(c.submittedAt)}</span></span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-gray-100">{formatCurrency(c.amount)}</p>
                      <p className="text-xs text-gray-500">{formatDate(c.updatedAt)}</p>
                    </div>
                  </div>
                </GlassPanel>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── PAYMENTS TAB ── */}
      {tab === 'payments' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassPanel className="border-amber-500/20 bg-amber-500/[0.02]">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Outstanding</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(mockCustomerPayments.filter(p=>p.status==='upcoming').reduce((s,p)=>s+p.amount,0))}</p>
              <p className="text-xs text-gray-500 mt-1">{mockCustomerPayments.filter(p=>p.status==='upcoming').length} upcoming payments</p>
            </GlassPanel>
            <GlassPanel className="border-emerald-500/20 bg-emerald-500/[0.02]">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Paid This Year</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(mockCustomerPayments.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0))}</p>
              <p className="text-xs text-gray-500 mt-1">{mockCustomerPayments.filter(p=>p.status==='paid').length} payments completed</p>
            </GlassPanel>
          </div>
          <GlassPanel>
            <h3 className="font-semibold mb-4">Upcoming Payments</h3>
            <div className="space-y-3">
              {mockCustomerPayments.filter(p=>p.status==='upcoming').map(p => (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><CreditCard size={18} /></div>
                  <div className="flex-1"><p className="text-sm font-medium text-gray-200">{p.policyNumber}</p><p className="text-xs text-gray-500">Due {formatDate(p.dueDate)}</p></div>
                  <p className="font-bold text-gray-100">{formatCurrency(p.amount)}</p>
                  <Button size="sm" onClick={() => success('Payment processed', `${formatCurrency(p.amount)} paid for ${p.policyNumber}.`)}>Pay Now</Button>
                </div>
              ))}
            </div>
          </GlassPanel>
          <GlassPanel>
            <h3 className="font-semibold mb-4">Payment History</h3>
            <div className="space-y-2">
              {mockCustomerPayments.filter(p=>p.status==='paid').map(p => (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <div className="flex-1"><p className="text-sm font-medium text-gray-200">{p.policyNumber}</p><p className="text-xs text-gray-500">Paid {p.paidAt ? formatDate(p.paidAt) : '–'}</p></div>
                  <p className="font-semibold text-emerald-400">{formatCurrency(p.amount)}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PAID</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}

      {/* ── PROFILE TAB ── */}
      {tab === 'profile' && <CustomerProfileTab />}

      {/* ── New Claim Modal ── */}
      <NewClaimModal isOpen={newClaimOpen} onClose={() => setNewClaimOpen(false)} />
    </div>
  );
};

// ─── Customer Profile Tab ─────────────────────────────────────────────────────
const CustomerProfileTab = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [profileTab, setProfileTab] = useState<'profile'|'security'|'notifications'>('profile');
  const [name, setName]   = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [showPass, setShowPass] = useState(false);
  const [currentPw, setCurrentPw]   = useState('');
  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [notifs, setNotifs] = useState({ email: true, sms: false, claims: true, payments: true });

  const ptabs = ['profile', 'security', 'notifications'] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-xl w-fit">
        {ptabs.map(t => (
          <button key={t} onClick={() => setProfileTab(t)} className={cn('px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all', profileTab === t ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400 hover:text-gray-200')}>
            {t}
          </button>
        ))}
      </div>

      {profileTab === 'profile' && (
        <GlassPanel>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold">{name.split(' ').map(n=>n[0]).join('').toUpperCase()}</div>
            <div><p className="font-bold text-gray-100 text-lg">{name}</p><p className="text-sm text-gray-500">{user?.role} · Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2023'}</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <Input label="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="mt-4"><Button onClick={() => success('Profile updated', 'Your changes have been saved.')}>Save Changes</Button></div>
        </GlassPanel>
      )}

      {profileTab === 'security' && (
        <GlassPanel>
          <h3 className="font-semibold mb-4">Change Password</h3>
          <div className="space-y-4 max-w-md">
            <div className="relative"><Input label="Current Password" type={showPass ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)} leftIcon={<Lock size={14} />} /><button type="button" onClick={() => setShowPass(p=>!p)} className="absolute right-3 top-9 text-gray-500">{showPass ? <EyeOff size={14} /> : <Eye size={14} />}</button></div>
            <Input label="New Password" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} leftIcon={<Lock size={14} />} />
            <Input label="Confirm New Password" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} leftIcon={<Lock size={14} />} error={confirmPw && newPw !== confirmPw ? 'Passwords do not match' : undefined} />
            <Button onClick={() => { if (newPw === confirmPw && newPw.length >= 8) { success('Password updated', 'Your password has been changed.'); setCurrentPw(''); setNewPw(''); setConfirmPw(''); } }} disabled={!currentPw || !newPw || newPw !== confirmPw}>Update Password</Button>
          </div>
        </GlassPanel>
      )}

      {profileTab === 'notifications' && (
        <GlassPanel>
          <h3 className="font-semibold mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {([['email', 'Email Notifications', 'Receive updates via email'], ['sms', 'SMS Alerts', 'Get text messages for critical updates'], ['claims', 'Claim Updates', 'Notify when claim status changes'], ['payments', 'Payment Reminders', 'Remind 3 days before payment due']] as const).map(([key, label, desc]) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                <div><p className="text-sm font-medium text-gray-200">{label}</p><p className="text-xs text-gray-500">{desc}</p></div>
                <button onClick={() => setNotifs(p => ({ ...p, [key]: !p[key] }))} className={cn('relative w-11 h-6 rounded-full transition-colors', notifs[key] ? 'bg-emerald-500' : 'bg-white/10')} aria-checked={notifs[key]} role="switch">
                  <span className={cn('absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform', notifs[key] && 'translate-x-5')} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4"><Button onClick={() => success('Preferences saved', 'Your notification settings have been updated.')}>Save Preferences</Button></div>
        </GlassPanel>
      )}
    </div>
  );
};

// ─── New Claim Modal ──────────────────────────────────────────────────────────
const NewClaimModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { success } = useToast();
  const [step, setStep]       = useState(1);
  const [policy, setPolicy]   = useState('');
  const [type, setType]       = useState('');
  const [amount, setAmount]   = useState('');
  const [desc, setDesc]       = useState('');

  const handleSubmit = async () => {
    await new Promise(r => setTimeout(r, 800));
    success('Claim submitted', 'Your claim has been received and is under review.');
    onClose();
    setStep(1); setPolicy(''); setType(''); setAmount(''); setDesc('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="File a New Claim">
      {/* Steps */}
      <div className="flex items-center gap-2 mb-6">
        {[1,2,3].map(s => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0', step >= s ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-500')}>{s}</div>
            {s < 3 && <div className={cn('h-px flex-1', step > s ? 'bg-emerald-500' : 'bg-white/10')} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 font-medium">Select the policy for this claim</p>
          <div className="space-y-2">
            {mockCustomerPolicies.map(p => (
              <button key={p.id} onClick={() => setPolicy(p.policyNumber)} className={cn('w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all', policy === p.policyNumber ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/20')}>
                <PolicyIcon type={p.type} />
                <div><p className="font-semibold text-gray-200">{p.policyNumber}</p><p className="text-xs text-gray-500 capitalize">{p.type} · {formatCurrency(p.coverageAmount)} coverage</p></div>
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-4"><Button onClick={() => setStep(2)} disabled={!policy}>Continue</Button></div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 font-medium">Describe the incident</p>
          <Select label="Claim Type" value={type} onChange={e => setType(e.target.value)} options={[{label:'Select type',value:''},{label:'Auto – Collision',value:'auto_collision'},{label:'Auto – Theft',value:'auto_theft'},{label:'Property Damage',value:'property_damage'},{label:'Medical',value:'medical'},{label:'Liability',value:'liability'},{label:'Natural Disaster',value:'natural_disaster'}]} />
          <Input label="Estimated Amount ($)" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} placeholder="Describe the incident in detail…" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 resize-none" />
          </div>
          <div className="flex gap-3 justify-between mt-4">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)} disabled={!type || !amount || !desc}>Continue</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 font-medium">Review and submit</p>
          <div className="space-y-2 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            {[['Policy', policy], ['Type', type.split('_').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ')], ['Amount', `$${amount}`]].map(([k,v]) => (
              <div key={k} className="flex justify-between text-sm"><span className="text-gray-500">{k}</span><span className="text-gray-200 font-medium">{v}</span></div>
            ))}
            <div className="pt-2 border-t border-white/5 text-sm"><span className="text-gray-500">Description</span><p className="text-gray-300 mt-1 text-xs">{desc}</p></div>
          </div>
          <div className="flex gap-3 justify-between mt-4">
            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={handleSubmit}>Submit Claim</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
