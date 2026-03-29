import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, CheckCheck, AlertTriangle, CheckCircle,
  Info, AlertCircle, X, Filter,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { getNotifications } from '@/data/mockData';
import { formatRelativeTime, formatDateTime } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import type { AppNotification } from '@/types';

const typeConfig = {
  error: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/10', label: 'Alert' },
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/10', label: 'Success' },
  warning: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/10', label: 'Warning' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/10', label: 'Info' },
};

type FilterType = 'all' | AppNotification['type'];

export const NotificationCenter = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>(getNotifications());
  const [filter, setFilter] = useState<FilterType>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered =
    filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClick = (n: AppNotification) => {
    markRead(n.id);
    if (n.link) navigate(n.link);
  };

  const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Alerts', value: 'error' },
    { label: 'Success', value: 'success' },
    { label: 'Warnings', value: 'warning' },
    { label: 'Info', value: 'info' },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell size={20} className="text-[#10B981]" />
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            All system alerts, claim updates, and activity notifications.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<CheckCheck size={14} />}
            onClick={markAllRead}
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(typeConfig).map(([type, cfg]) => {
          const count = notifications.filter((n) => n.type === type).length;
          const Icon = cfg.icon;
          return (
            <GlassPanel key={type} className={cn('border', cfg.border)}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} className={cfg.color} />
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                  {cfg.label}
                </p>
              </div>
              <p className="text-xl font-bold text-white">{count}</p>
            </GlassPanel>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter size={13} className="text-gray-600" />
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all',
              filter === opt.value
                ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
                : 'bg-white/[0.03] border-white/[0.07] text-gray-500 hover:text-gray-300'
            )}
          >
            {opt.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-600">{filtered.length} notifications</span>
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-white/[0.08]">
            <Bell size={36} className="text-gray-700 mb-3" />
            <p className="text-gray-500 font-medium">No notifications</p>
            <p className="text-xs text-gray-700 mt-1">You're all caught up!</p>
          </div>
        )}

        {filtered.map((n) => {
          const cfg = typeConfig[n.type];
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              className={cn(
                'group flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer',
                !n.read
                  ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05]'
                  : 'bg-transparent border-white/[0.04] hover:bg-white/[0.02]'
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleClick(n)}
              aria-label={n.title}
            >
              {/* Icon */}
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl mt-0.5',
                  cfg.bg
                )}
              >
                <Icon size={16} className={cfg.color} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        n.read ? 'text-gray-400' : 'text-gray-100'
                      )}
                    >
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-[#10B981]" aria-label="Unread" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismiss(n.id);
                      }}
                      className="text-gray-700 hover:text-gray-400 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Dismiss notification"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-gray-600 tabular-nums">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                  <span className="text-[10px] text-gray-700">·</span>
                  <span className="text-[10px] text-gray-700">
                    {formatDateTime(n.createdAt)}
                  </span>
                  {n.link && (
                    <>
                      <span className="text-[10px] text-gray-700">·</span>
                      <span className="text-[10px] text-[#10B981] hover:underline">
                        View →
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
