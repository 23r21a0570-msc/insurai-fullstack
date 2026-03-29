import { useState } from 'react';
import { Monitor, Smartphone, Tablet, MapPin, Clock, LogOut, Shield, Wifi } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/cn';
import { useToast } from '@/context/ToastContext';
import { formatRelativeTime } from '@/utils/formatters';

interface Session {
  id: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

const MOCK_SESSIONS: Session[] = [
  {
    id: 'sess_1',
    device: 'desktop',
    browser: 'Chrome 120',
    os: 'macOS Sonoma',
    location: 'San Francisco, CA',
    ip: '192.168.1.1',
    lastActive: new Date().toISOString(),
    isCurrent: true,
  },
  {
    id: 'sess_2',
    device: 'mobile',
    browser: 'Safari 17',
    os: 'iOS 17.2',
    location: 'San Francisco, CA',
    ip: '192.168.1.45',
    lastActive: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    isCurrent: false,
  },
  {
    id: 'sess_3',
    device: 'desktop',
    browser: 'Firefox 121',
    os: 'Windows 11',
    location: 'New York, NY',
    ip: '10.0.0.12',
    lastActive: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    isCurrent: false,
  },
  {
    id: 'sess_4',
    device: 'tablet',
    browser: 'Chrome 120',
    os: 'iPadOS 17',
    location: 'Austin, TX',
    ip: '172.16.0.5',
    lastActive: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    isCurrent: false,
  },
];

const DeviceIcon = ({ type }: { type: Session['device'] }) => {
  const cls = 'shrink-0';
  if (type === 'mobile')  return <Smartphone size={20} className={cls} />;
  if (type === 'tablet')  return <Tablet size={20} className={cls} />;
  return <Monitor size={20} className={cls} />;
};

export const ActiveSessions = () => {
  const { success, warning } = useToast();
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [revoking, setRevoking] = useState<string | null>(null);

  const revoke = async (id: string) => {
    setRevoking(id);
    await new Promise(r => setTimeout(r, 900));
    setSessions(prev => prev.filter(s => s.id !== id));
    setRevoking(null);
    success('Session ended', 'The device has been signed out.');
  };

  const revokeAll = async () => {
    setRevoking('all');
    await new Promise(r => setTimeout(r, 1200));
    setSessions(prev => prev.filter(s => s.isCurrent));
    setRevoking(null);
    warning('All other sessions ended', 'Only your current session remains active.');
  };

  const others = sessions.filter(s => !s.isCurrent);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wifi size={16} className="text-[#10B981]" />
          <h3 className="text-sm font-bold text-white">Active Sessions</h3>
          <span className="px-1.5 py-0.5 rounded-full bg-white/[0.06] text-[10px] text-gray-400 font-mono">
            {sessions.length}
          </span>
        </div>
        {others.length > 0 && (
          <Button
            variant="danger"
            size="sm"
            isLoading={revoking === 'all'}
            onClick={revokeAll}
          >
            Sign out all others
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {sessions.map(session => (
          <div
            key={session.id}
            className={cn(
              'rounded-xl border p-4 transition-all duration-200',
              session.isCurrent
                ? 'border-[#10B981]/20 bg-[#10B981]/[0.03]'
                : 'border-white/[0.06] bg-white/[0.02]'
            )}
          >
            <div className="flex items-start gap-4">
              {/* Device icon */}
              <div className={cn(
                'p-2.5 rounded-xl shrink-0',
                session.isCurrent ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-white/[0.04] text-gray-400'
              )}>
                <DeviceIcon type={session.device} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">{session.browser}</span>
                  <span className="text-xs text-gray-500">·</span>
                  <span className="text-xs text-gray-500">{session.os}</span>
                  {session.isCurrent && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] text-[9px] font-bold uppercase">
                      Current
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1 text-[11px] text-gray-500">
                    <MapPin size={10} aria-hidden="true" /> {session.location}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-600">
                    <Shield size={10} aria-hidden="true" /> {session.ip}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-500">
                    <Clock size={10} aria-hidden="true" />
                    {session.isCurrent ? 'Now' : formatRelativeTime(session.lastActive)}
                  </span>
                </div>
              </div>

              {/* Action */}
              {!session.isCurrent && (
                <button
                  type="button"
                  onClick={() => revoke(session.id)}
                  disabled={revoking === session.id}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all disabled:opacity-50"
                  aria-label={`Sign out ${session.browser} on ${session.os}`}
                >
                  {revoking === session.id
                    ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                    : <LogOut size={12} />
                  }
                  Sign out
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {others.length === 0 && sessions.length > 0 && (
        <p className="text-xs text-gray-600 text-center py-2">
          No other active sessions.
        </p>
      )}
    </div>
  );
};
