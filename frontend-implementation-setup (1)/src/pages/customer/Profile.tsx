import { useState } from 'react';
import { User, Mail, Phone, Shield, Lock, Bell, CheckCircle2, Eye, Trash2 } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { MFASetup } from '@/components/ui/MFASetup';
import { KYCVerification } from '@/components/ui/KYCVerification';
import { ActiveSessions } from '@/components/ui/ActiveSessions';
import { PrivacySettings } from '@/components/ui/PrivacySettings';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getInitials } from '@/utils/formatters';
import { cn } from '@/utils/cn';

type Tab = 'profile' | 'security' | 'privacy' | 'notifications';

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'profile',       label: 'Profile',        icon: User },
  { id: 'security',      label: 'Security',        icon: Lock },
  { id: 'privacy',       label: 'Privacy',         icon: Eye },
  { id: 'notifications', label: 'Notifications',   icon: Bell },
];

export const CustomerProfile = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [tab, setTab] = useState<Tab>('profile');

  // Profile state
  const [form, setForm] = useState({
    name:  user?.name ?? '',
    email: user?.email ?? '',
    phone: '+1 (555) 000-0000',
  });
  const set = (field: keyof typeof form, v: string) => setForm(p => ({ ...p, [field]: v }));

  // Password state
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const setPwd = (f: keyof typeof passwords, v: string) => setPasswords(p => ({ ...p, [f]: v }));
  const pwdMismatch = passwords.confirm.length > 0 && passwords.next !== passwords.confirm;

  // MFA state
  const [mfaEnabled, setMfaEnabled]   = useState(false);
  const [showMFA, setShowMFA]         = useState(false);
  const [kycStatus, setKycStatus]     = useState<'unverified' | 'verified'>('unverified');
  const [showKYC, setShowKYC]         = useState(false);

  // Notifications state
  const [notifs, setNotifs] = useState({
    claimUpdates:     true,
    paymentReminders: true,
    policyAlerts:     false,
    promotions:       false,
  });

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 800));
    success('Profile updated', 'Your information has been saved.');
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdMismatch) return;
    if (!passwords.current) { error('Missing field', 'Please enter your current password.'); return; }
    await new Promise(r => setTimeout(r, 800));
    success('Password changed', 'Your password has been updated successfully.');
    setPasswords({ current: '', next: '', confirm: '' });
  };

  const handleNotifSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    success('Preferences saved', 'Notification settings updated.');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10B981]/20 text-[#10B981] text-xl font-bold shrink-0">
            {getInitials(user?.name ?? 'U')}
          </div>
          {kycStatus === 'verified' && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center border-2 border-[#0A0F1A]">
              <CheckCircle2 size={10} className="text-white" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-blue-500/20 bg-blue-500/10 text-[10px] font-bold uppercase text-blue-400">
              <Shield size={9} /> Policyholder
            </span>
            {kycStatus === 'verified' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#10B981]/20 bg-[#10B981]/10 text-[10px] font-bold uppercase text-[#10B981]">
                <CheckCircle2 size={9} /> KYC Verified
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setShowKYC(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-[10px] font-bold uppercase text-amber-400 hover:bg-amber-500/20 transition-colors"
              >
                ⚠ Verify Identity
              </button>
            )}
            {mfaEnabled && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-purple-500/20 bg-purple-500/10 text-[10px] font-bold uppercase text-purple-400">
                <Lock size={9} /> MFA On
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1 overflow-x-auto hide-scrollbar"
        role="tablist"
        aria-label="Profile sections"
      >
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              id={`tab-${t.id}`}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap',
                tab === t.id
                  ? 'bg-[#10B981]/15 text-[#10B981]'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <Icon size={13} aria-hidden="true" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── PROFILE TAB ─────────────────────────────────────────────────── */}
      {tab === 'profile' && (
        <div
          id="panel-profile"
          role="tabpanel"
          aria-labelledby="tab-profile"
        >
          <GlassPanel>
            <h2 className="text-sm font-bold text-gray-300 mb-5">Personal Information</h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <Input
                label="Full Name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                leftIcon={<User size={14} />}
              />
              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                leftIcon={<Mail size={14} />}
              />
              <Input
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                leftIcon={<Phone size={14} />}
              />

              {/* KYC prompt */}
              {kycStatus === 'unverified' && (
                <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.04]">
                  <div className="text-amber-400 mt-0.5">⚠</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-300">Identity not verified</p>
                    <p className="text-xs text-gray-500 mt-0.5">Verify your identity to unlock all features and increase claim limits.</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setShowKYC(true)}>Verify</Button>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button type="submit" size="sm">Save Changes</Button>
              </div>
            </form>
          </GlassPanel>
        </div>
      )}

      {/* ── SECURITY TAB ────────────────────────────────────────────────── */}
      {tab === 'security' && (
        <div
          id="panel-security"
          role="tabpanel"
          aria-labelledby="tab-security"
          className="space-y-5"
        >
          {/* Password */}
          <GlassPanel>
            <h2 className="text-sm font-bold text-gray-300 mb-5">Change Password</h2>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={passwords.current}
                onChange={e => setPwd('current', e.target.value)}
                required
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Min 8 characters"
                value={passwords.next}
                onChange={e => setPwd('next', e.target.value)}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={passwords.confirm}
                onChange={e => setPwd('confirm', e.target.value)}
                error={pwdMismatch ? 'Passwords do not match' : undefined}
                required
              />
              <div className="flex justify-end pt-2">
                <Button type="submit" size="sm" disabled={pwdMismatch}>Update Password</Button>
              </div>
            </form>
          </GlassPanel>

          {/* MFA */}
          <GlassPanel>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-gray-300">Two-Factor Authentication</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {mfaEnabled
                    ? 'Your account is protected with MFA. Each sign-in requires a verification code.'
                    : 'Add an extra layer of security using an authenticator app or SMS.'}
                </p>
              </div>
              {mfaEnabled ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold">
                    <CheckCircle2 size={10} /> Enabled
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => { setMfaEnabled(false); success('MFA disabled', 'Two-factor authentication has been turned off.'); }}
                  >
                    <Trash2 size={13} className="mr-1" /> Disable
                  </Button>
                </div>
              ) : (
                <Button size="sm" onClick={() => setShowMFA(true)}>
                  <Lock size={13} className="mr-1" /> Enable MFA
                </Button>
              )}
            </div>
          </GlassPanel>

          {/* Active sessions */}
          <GlassPanel>
            <ActiveSessions />
          </GlassPanel>
        </div>
      )}

      {/* ── PRIVACY TAB ─────────────────────────────────────────────────── */}
      {tab === 'privacy' && (
        <div
          id="panel-privacy"
          role="tabpanel"
          aria-labelledby="tab-privacy"
        >
          <PrivacySettings />
        </div>
      )}

      {/* ── NOTIFICATIONS TAB ───────────────────────────────────────────── */}
      {tab === 'notifications' && (
        <div
          id="panel-notifications"
          role="tabpanel"
          aria-labelledby="tab-notifications"
        >
          <GlassPanel>
            <h2 className="text-sm font-bold text-gray-300 mb-5">Notification Preferences</h2>
            <div className="space-y-1">
              {(Object.keys(notifs) as Array<keyof typeof notifs>).map(key => {
                const labels: Record<keyof typeof notifs, { title: string; desc: string }> = {
                  claimUpdates:     { title: 'Claim Updates',      desc: 'Status changes on your claims' },
                  paymentReminders: { title: 'Payment Reminders',  desc: 'Upcoming and overdue payments' },
                  policyAlerts:     { title: 'Policy Alerts',      desc: 'Renewal and coverage changes' },
                  promotions:       { title: 'Promotions',         desc: 'Offers and coverage suggestions' },
                };
                return (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-200">{labels[key].title}</p>
                      <p className="text-xs text-gray-500">{labels[key].desc}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifs[key]}
                      aria-label={labels[key].title}
                      onClick={() => setNotifs(p => ({ ...p, [key]: !p[key] }))}
                      className={cn(
                        'relative h-5 w-9 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/50',
                        notifs[key] ? 'bg-[#10B981]' : 'bg-white/10'
                      )}
                    >
                      <span className={cn(
                        'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200',
                        notifs[key] && 'translate-x-4'
                      )} />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end pt-4">
              <Button size="sm" onClick={handleNotifSave} leftIcon={<CheckCircle2 size={14} />}>
                Save Preferences
              </Button>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* ── MFA MODAL ───────────────────────────────────────────────────── */}
      <Modal isOpen={showMFA} onClose={() => setShowMFA(false)} title="Set Up Two-Factor Authentication">
        <MFASetup
          onComplete={() => { setMfaEnabled(true); setShowMFA(false); }}
          onCancel={() => setShowMFA(false)}
        />
      </Modal>

      {/* ── KYC MODAL ───────────────────────────────────────────────────── */}
      <Modal isOpen={showKYC} onClose={() => setShowKYC(false)} title="Identity Verification (KYC)">
        <KYCVerification
          onComplete={() => { setKycStatus('verified'); setShowKYC(false); }}
          onSkip={() => setShowKYC(false)}
        />
      </Modal>
    </div>
  );
};
