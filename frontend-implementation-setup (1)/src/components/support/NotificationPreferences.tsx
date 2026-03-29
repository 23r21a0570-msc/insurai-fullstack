import { useState } from 'react';
import {
  Bell, BellOff, Smartphone, Mail, MessageSquare, Volume2,
  Moon, Clock, CheckCircle2, AlertTriangle, Zap, Shield
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useToast } from '@/context/ToastContext';

type Channel = 'push' | 'email' | 'sms' | 'whatsapp';
type Frequency = 'instant' | 'daily' | 'weekly' | 'never';

interface NotificationCategory {
  id: string;
  label: string;
  description: string;
  icon: typeof Bell;
  iconColor: string;
  channels: Record<Channel, boolean>;
  frequency: Frequency;
  critical: boolean;
}

const DEFAULT_CATEGORIES: NotificationCategory[] = [
  {
    id: 'claim_updates',
    label: 'Claim Updates',
    description: 'Status changes, document requests, approvals & rejections',
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
    channels: { push: true, email: true, sms: true, whatsapp: false },
    frequency: 'instant',
    critical: true,
  },
  {
    id: 'payment_reminders',
    label: 'Payment Reminders',
    description: 'Upcoming due dates, failed payments, receipts',
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    channels: { push: true, email: true, sms: true, whatsapp: false },
    frequency: 'instant',
    critical: true,
  },
  {
    id: 'policy_alerts',
    label: 'Policy Alerts',
    description: 'Renewals, coverage changes, expiration warnings',
    icon: Shield,
    iconColor: 'text-blue-400',
    channels: { push: true, email: true, sms: false, whatsapp: false },
    frequency: 'instant',
    critical: false,
  },
  {
    id: 'fraud_alerts',
    label: 'Fraud & Security Alerts',
    description: 'Suspicious activity, login from new device, risk flags',
    icon: Zap,
    iconColor: 'text-red-400',
    channels: { push: true, email: true, sms: true, whatsapp: false },
    frequency: 'instant',
    critical: true,
  },
  {
    id: 'promotions',
    label: 'Promotions & Offers',
    description: 'Discounts, loyalty rewards, new coverage options',
    icon: Bell,
    iconColor: 'text-purple-400',
    channels: { push: false, email: true, sms: false, whatsapp: false },
    frequency: 'weekly',
    critical: false,
  },
  {
    id: 'weekly_digest',
    label: 'Weekly Summary',
    description: 'Overview of your account activity each week',
    icon: Mail,
    iconColor: 'text-gray-400',
    channels: { push: false, email: true, sms: false, whatsapp: false },
    frequency: 'weekly',
    critical: false,
  },
];

const CHANNELS: { id: Channel; label: string; icon: typeof Bell; color: string }[] = [
  { id: 'push', label: 'Push', icon: Smartphone, color: 'text-blue-400' },
  { id: 'email', label: 'Email', icon: Mail, color: 'text-emerald-400' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, color: 'text-amber-400' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'text-green-400' },
];

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'instant', label: 'Instant' },
  { value: 'daily', label: 'Daily Digest' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'never', label: 'Never' },
];

export const NotificationPreferences = () => {
  const { success } = useToast();
  const [categories, setCategories] = useState<NotificationCategory[]>(DEFAULT_CATEGORIES);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushRequesting, setPushRequesting] = useState(false);
  const [dndEnabled, setDndEnabled] = useState(false);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('08:00');
  const [globalMute, setGlobalMute] = useState(false);

  const requestPushPermission = async () => {
    setPushRequesting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPushEnabled(true);
    setPushRequesting(false);
    success('Push notifications enabled', 'You\'ll now receive real-time alerts on this device.');
  };

  const toggleChannel = (catId: string, channel: Channel) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, channels: { ...c.channels, [channel]: !c.channels[channel] } }
          : c
      )
    );
  };

  const setFrequency = (catId: string, frequency: Frequency) => {
    setCategories((prev) => prev.map((c) => (c.id === catId ? { ...c, frequency } : c)));
  };

  const handleSave = () => {
    success('Notification preferences saved', 'Your settings have been updated.');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-sm font-bold text-gray-200 flex items-center gap-2">
          <Bell size={16} className="text-[#10B981]" /> Notification Settings
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Control how and when you receive notifications across all channels.</p>
      </div>

      {/* Push Notification Permission */}
      <GlassPanel>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={cn('p-2.5 rounded-xl', pushEnabled ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-white/5 text-gray-500')}>
              <Smartphone size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-200">Browser Push Notifications</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {pushEnabled
                  ? 'Push notifications are enabled on this browser.'
                  : 'Enable real-time alerts directly in your browser or mobile device.'}
              </p>
            </div>
          </div>
          {pushEnabled ? (
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-1 px-2 py-1 rounded bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold">
                <CheckCircle2 size={10} /> Enabled
              </span>
              <button
                onClick={() => { setPushEnabled(false); success('Push disabled', 'Browser notifications turned off.'); }}
                className="px-2 py-1 rounded text-[10px] font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
              >
                Disable
              </button>
            </div>
          ) : (
            <button
              onClick={requestPushPermission}
              disabled={pushRequesting}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs font-bold hover:bg-[#10B981]/20 disabled:opacity-50 transition-colors"
            >
              {pushRequesting ? 'Requesting…' : 'Enable Push'}
            </button>
          )}
        </div>
      </GlassPanel>

      {/* Global Mute & DND */}
      <GlassPanel className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', globalMute ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-gray-500')}>
              {globalMute ? <BellOff size={16} /> : <Volume2 size={16} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-200">Mute All Notifications</p>
              <p className="text-xs text-gray-500">Temporarily silence all non-critical alerts</p>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={globalMute}
            onClick={() => setGlobalMute((p) => !p)}
            className={cn('relative h-5 w-9 rounded-full transition-colors duration-200', globalMute ? 'bg-red-500' : 'bg-white/10')}
          >
            <span className={cn('absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200', globalMute && 'translate-x-4')} />
          </button>
        </div>

        <div className="border-t border-white/[0.06] pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', dndEnabled ? 'bg-purple-500/10 text-purple-400' : 'bg-white/5 text-gray-500')}>
                <Moon size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-200">Do Not Disturb</p>
                <p className="text-xs text-gray-500">Quiet hours — only critical alerts pass through</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={dndEnabled}
              onClick={() => setDndEnabled((p) => !p)}
              className={cn('relative h-5 w-9 rounded-full transition-colors duration-200', dndEnabled ? 'bg-purple-500' : 'bg-white/10')}
            >
              <span className={cn('absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200', dndEnabled && 'translate-x-4')} />
            </button>
          </div>

          {dndEnabled && (
            <div className="flex items-center gap-3 ml-11">
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-gray-500" />
                <span className="text-xs text-gray-400">From</span>
                <input
                  type="time"
                  value={quietStart}
                  onChange={(e) => setQuietStart(e.target.value)}
                  className="h-8 w-24 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500/40 transition-colors"
                />
                <span className="text-xs text-gray-400">to</span>
                <input
                  type="time"
                  value={quietEnd}
                  onChange={(e) => setQuietEnd(e.target.value)}
                  className="h-8 w-24 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500/40 transition-colors"
                />
              </div>
            </div>
          )}
        </div>
      </GlassPanel>

      {/* Channel Legend */}
      <div className="flex items-center gap-4 px-1 flex-wrap">
        <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Channels:</p>
        {CHANNELS.map((ch) => {
          const Icon = ch.icon;
          return (
            <div key={ch.id} className="flex items-center gap-1">
              <Icon size={11} className={ch.color} />
              <span className="text-[10px] text-gray-500">{ch.label}</span>
            </div>
          );
        })}
      </div>

      {/* Per-Category Settings */}
      <div className="space-y-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <GlassPanel key={cat.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/[0.04] shrink-0 mt-0.5">
                  <Icon size={15} className={cat.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-gray-200">{cat.label}</p>
                    {cat.critical && (
                      <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[9px] font-bold">Critical</span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">{cat.description}</p>
                </div>

                {/* Frequency */}
                <select
                  value={cat.frequency}
                  onChange={(e) => setFrequency(cat.id, e.target.value as Frequency)}
                  disabled={cat.critical}
                  className="h-7 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 text-[10px] text-gray-300 focus:outline-none disabled:opacity-40 shrink-0"
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f.value} value={f.value} className="bg-[#0F1629]">{f.label}</option>
                  ))}
                </select>
              </div>

              {/* Channel Toggles */}
              <div className="flex items-center gap-3 flex-wrap ml-9">
                {CHANNELS.map((ch) => {
                  const ChIcon = ch.icon;
                  const enabled = cat.channels[ch.id];
                  const disabled = cat.critical && (ch.id === 'push' || ch.id === 'email');
                  return (
                    <button
                      key={ch.id}
                      onClick={() => !disabled && toggleChannel(cat.id, ch.id)}
                      disabled={disabled}
                      title={disabled ? 'Required for critical notifications' : undefined}
                      className={cn(
                        'flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors border',
                        enabled
                          ? 'bg-white/[0.06] border-white/10 text-gray-300'
                          : 'bg-transparent border-white/[0.05] text-gray-600',
                        disabled && 'opacity-60 cursor-not-allowed'
                      )}
                    >
                      <ChIcon size={10} className={enabled ? ch.color : 'text-gray-600'} />
                      {ch.label}
                      <div className={cn('w-1.5 h-1.5 rounded-full', enabled ? 'bg-[#10B981]' : 'bg-gray-700')} />
                    </button>
                  );
                })}
              </div>
            </GlassPanel>
          );
        })}
      </div>

      {/* Save */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-lg bg-[#10B981] text-white text-sm font-bold hover:bg-[#059669] transition-colors"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
