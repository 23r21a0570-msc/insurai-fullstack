import { useState } from 'react';
import { User, Bell, Lock, Save } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
];

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export const Settings = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    department: user?.department ?? '',
  });
  const [notifications, setNotifications] = useState({
    newClaims: true,
    fraudAlerts: true,
    statusChanges: false,
    weeklyReport: true,
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    success('Profile updated', 'Your profile information has been saved.');
  };

  const handleSaveNotifications = () => {
    success('Preferences saved', 'Notification settings updated.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.next !== passwordForm.confirm) {
      return;
    }
    success('Password changed', 'Your password has been updated successfully.');
    setPasswordForm({ current: '', next: '', confirm: '' });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-white/[0.03] border border-white/[0.06] p-1 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === id
                ? 'bg-white/[0.08] text-gray-100'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <GlassPanel>
          <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-6">Profile Information</h3>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/[0.06]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10B981]/15 text-[#10B981] text-xl font-bold">
              {getInitials(user?.name ?? 'U')}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-200">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize mt-0.5">{user?.role}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Full Name"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            />
            <Input
              label="Department"
              value={profileForm.department}
              onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
            />
            <div className="flex justify-end pt-2">
              <Button type="submit" leftIcon={<Save size={14} />}>Save Changes</Button>
            </div>
          </form>
        </GlassPanel>
      )}

      {/* Notifications Tab */}
      {tab === 'notifications' && (
        <GlassPanel>
          <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-6">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { key: 'newClaims', label: 'New Claims', desc: 'Get notified when a new claim is submitted' },
              { key: 'fraudAlerts', label: 'Fraud Alerts', desc: 'Receive alerts when the AI flags suspicious activity' },
              { key: 'statusChanges', label: 'Status Changes', desc: 'Notifications when a claim status is updated' },
              { key: 'weeklyReport', label: 'Weekly Summary', desc: 'A weekly digest of your claims activity' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-4 py-3 border-b border-white/[0.05] last:border-0">
                <div>
                  <p className="text-sm font-semibold text-gray-200">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))}
                  className={cn(
                    'relative h-6 w-11 rounded-full transition-all duration-200',
                    notifications[key as keyof typeof notifications]
                      ? 'bg-[#10B981]'
                      : 'bg-white/[0.10]'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200',
                      notifications[key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button leftIcon={<Save size={14} />} onClick={handleSaveNotifications}>Save Preferences</Button>
          </div>
        </GlassPanel>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
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
              placeholder="••••••••"
              value={passwordForm.next}
              onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
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
            <div className="flex justify-end pt-2">
              <Button type="submit" leftIcon={<Lock size={14} />}>Update Password</Button>
            </div>
          </form>
        </GlassPanel>
      )}
    </div>
  );
};
