import { useState } from 'react';
import { Camera, Save, Lock, Activity, LogIn, CheckCircle2, Shield, Mail, Phone, Building } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatDateTime, getInitials } from '@/utils/formatters';
import { cn } from '@/utils/cn';

const TABS = [
  { id: 'info', label: 'Personal Info', icon: Shield },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'activity', label: 'Recent Activity', icon: Activity },
];

const recentLogins = [
  { device: 'Chrome on macOS', location: 'San Francisco, CA', time: new Date(Date.now() - 300000).toISOString(), current: true },
  { device: 'Safari on iPhone', location: 'San Francisco, CA', time: new Date(Date.now() - 3600000 * 6).toISOString(), current: false },
  { device: 'Chrome on Windows', location: 'New York, NY', time: new Date(Date.now() - 3600000 * 48).toISOString(), current: false },
];

const recentActions = [
  { action: 'Approved claim CLM-2024-1042', time: new Date(Date.now() - 600000).toISOString() },
  { action: 'Updated settings', time: new Date(Date.now() - 3600000 * 2).toISOString() },
  { action: 'Reviewed 5 fraud alerts', time: new Date(Date.now() - 3600000 * 5).toISOString() },
  { action: 'Added note to CLM-2024-1038', time: new Date(Date.now() - 3600000 * 8).toISOString() },
  { action: 'Exported claims report', time: new Date(Date.now() - 86400000).toISOString() },
];

export const Profile = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [tab, setTab] = useState('info');

  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    department: user?.department ?? '',
    phone: '+1 (555) 000-0000',
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  });

  const [twoFA, setTwoFA] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    success('Profile updated', 'Your profile information has been saved.');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.next !== passwordForm.confirm) {
      error('Password mismatch', 'New passwords do not match.');
      return;
    }
    if (passwordForm.next.length < 8) {
      error('Password too short', 'Password must be at least 8 characters.');
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    success('Password changed', 'Your password has been updated.');
    setPasswordForm({ current: '', next: '', confirm: '' });
  };

  const roleBadge: Record<string, string> = {
    admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    manager: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    analyst: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    agent: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your personal information and account security.</p>
      </div>

      {/* Avatar Card */}
      <GlassPanel>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative group">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#10B981]/15 text-[#10B981] text-2xl font-bold select-none">
              {getInitials(user?.name ?? 'U')}
            </div>
            <button
              className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Change avatar"
            >
              <Camera size={18} className="text-white" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border', roleBadge[user?.role ?? 'agent'])}>
                {user?.role}
              </span>
              {user?.department && (
                <span className="text-xs text-gray-500">{user.department}</span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {user?.lastLogin ? `Last login: ${formatDateTime(user.lastLogin)}` : 'First login'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">Active</span>
          </div>
        </div>
      </GlassPanel>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-white/[0.03] border border-white/[0.06] p-1 w-fit flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === id ? 'bg-white/[0.08] text-gray-100' : 'text-gray-500 hover:text-gray-300'
            )}
            aria-selected={tab === id}
            role="tab"
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Personal Info Tab */}
      {tab === 'info' && (
        <GlassPanel>
          <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-6">Personal Information</h3>
          <form onSubmit={handleSaveInfo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                leftIcon={<Shield size={14} />}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                leftIcon={<Mail size={14} />}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                leftIcon={<Phone size={14} />}
              />
              <Input
                label="Department"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                leftIcon={<Building size={14} />}
              />
            </div>

            {/* Read-only fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
              <div>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Role</p>
                <div className="h-10 flex items-center px-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                  <span className="text-sm text-gray-400 capitalize">{user?.role}</span>
                </div>
                <p className="text-[10px] text-gray-700 mt-1">Roles are assigned by administrators.</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Member Since</p>
                <div className="h-10 flex items-center px-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                  <span className="text-sm text-gray-400">{formatDateTime(user?.createdAt ?? '')}</span>
                </div>
              </div>
            </div>

            {/* 2FA Toggle */}
            <div className="flex items-center justify-between py-3 border-t border-white/[0.06]">
              <div>
                <p className="text-sm font-semibold text-gray-200">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security to your account.</p>
              </div>
              <button
                type="button"
                onClick={() => { setTwoFA(!twoFA); success(twoFA ? '2FA disabled' : '2FA enabled', twoFA ? 'Two-factor authentication has been turned off.' : 'Two-factor authentication is now active.'); }}
                className={cn(
                  'relative h-6 w-11 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/50',
                  twoFA ? 'bg-[#10B981]' : 'bg-white/[0.10]'
                )}
                aria-pressed={twoFA}
                aria-label="Toggle two-factor authentication"
              >
                <span className={cn('absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200', twoFA ? 'translate-x-5' : 'translate-x-0')} />
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" isLoading={isSaving} leftIcon={<Save size={14} />}>
                Save Changes
              </Button>
            </div>
          </form>
        </GlassPanel>
      )}

      {/* Password Tab */}
      {tab === 'password' && (
        <GlassPanel>
          <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-6">Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
              required
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Min. 8 characters"
              value={passwordForm.next}
              onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
              hint={passwordForm.next.length > 0 ? `${passwordForm.next.length} characters` : undefined}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              error={
                passwordForm.confirm && passwordForm.next !== passwordForm.confirm
                  ? 'Passwords do not match'
                  : undefined
              }
              required
            />

            {/* Password requirements */}
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-1.5">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Requirements</p>
              {[
                { label: 'At least 8 characters', met: passwordForm.next.length >= 8 },
                { label: 'Contains a number', met: /\d/.test(passwordForm.next) },
                { label: 'Contains a special character', met: /[^A-Za-z0-9]/.test(passwordForm.next) },
              ].map((req) => (
                <div key={req.label} className="flex items-center gap-2">
                  <CheckCircle2
                    size={12}
                    className={req.met ? 'text-emerald-400' : 'text-gray-700'}
                  />
                  <p className={cn('text-xs', req.met ? 'text-emerald-400' : 'text-gray-600')}>
                    {req.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" isLoading={isSaving} leftIcon={<Lock size={14} />}>
                Update Password
              </Button>
            </div>
          </form>
        </GlassPanel>
      )}

      {/* Activity Tab */}
      {tab === 'activity' && (
        <div className="space-y-4">
          {/* Login sessions */}
          <GlassPanel>
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Active Sessions</h3>
            <div className="space-y-3">
              {recentLogins.map((login, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-start justify-between gap-4 rounded-xl border p-3.5 transition-all',
                    login.current
                      ? 'bg-[#10B981]/[0.04] border-[#10B981]/15'
                      : 'bg-white/[0.02] border-white/[0.06]'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', login.current ? 'bg-[#10B981]/10' : 'bg-white/[0.04]')}>
                      <LogIn size={16} className={login.current ? 'text-[#10B981]' : 'text-gray-600'} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-200">{login.device}</p>
                        {login.current && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#10B981]/15 text-[#10B981] uppercase">
                            This session
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{login.location}</p>
                      <p className="text-[10px] text-gray-700 mt-0.5 tabular-nums">{formatDateTime(login.time)}</p>
                    </div>
                  </div>
                  {!login.current && (
                    <button className="text-[10px] text-red-400 hover:underline shrink-0">Revoke</button>
                  )}
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Recent actions */}
          <GlassPanel>
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Recent Actions</h3>
            <div className="space-y-3">
              {recentActions.map((action, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-2.5 border-b border-white/[0.05] last:border-0">
                  <div className="flex items-center gap-3">
                    <Activity size={13} className="text-gray-600 shrink-0" />
                    <p className="text-sm text-gray-300">{action.action}</p>
                  </div>
                  <span className="text-[10px] text-gray-600 tabular-nums shrink-0">{formatDateTime(action.time)}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
