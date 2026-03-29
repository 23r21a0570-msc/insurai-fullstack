import { useState } from 'react';
import { History, Search, CheckCircle, LogIn, AlertTriangle, XCircle, RefreshCw, Plus, Edit } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { getAuditLog } from '@/data/mockData';
import { formatRelativeTime } from '@/utils/formatters';
import type { AuditLogEntry } from '@/types';

const actionConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  approve: { icon: CheckCircle, color: '#10B981', label: 'Approved' },
  reject: { icon: XCircle, color: '#EF4444', label: 'Rejected' },
  escalate: { icon: AlertTriangle, color: '#F59E0B', label: 'Escalated' },
  login: { icon: LogIn, color: '#3B82F6', label: 'Login' },
  update: { icon: Edit, color: '#8B5CF6', label: 'Updated' },
  create: { icon: Plus, color: '#10B981', label: 'Created' },
};

const roleBadge: Record<string, string> = {
  admin: 'bg-purple-500/10 text-purple-400',
  manager: 'bg-blue-500/10 text-blue-400',
  analyst: 'bg-amber-500/10 text-amber-400',
  agent: 'bg-gray-500/10 text-gray-400',
};

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export const AuditLog = () => {
  const [search, setSearch] = useState('');
  const entries = getAuditLog();

  const filtered = entries.filter(
    (e) =>
      e.userName.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <History size={22} className="text-gray-500" /> Activity Log
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track all actions taken across claims, policies, and team members.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <RefreshCw size={12} />
          <span>Auto-refreshes every 30s</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user, action, or description..."
          className="h-10 w-full rounded-lg border border-white/[0.07] bg-white/[0.04] pl-9 pr-4 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 transition-all"
        />
      </div>

      {/* Log Entries */}
      <GlassPanel className="p-0 overflow-hidden">
        <div className="divide-y divide-white/[0.05]">
          {filtered.map((entry: AuditLogEntry) => {
            const cfg = actionConfig[entry.action] ?? { icon: RefreshCw, color: '#6B7280', label: entry.action };
            const Icon = cfg.icon;
            return (
              <div key={entry.id} className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                {/* Icon */}
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5"
                  style={{ backgroundColor: `${cfg.color}15` }}
                >
                  <Icon size={15} style={{ color: cfg.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#10B981]/15 text-[#10B981] text-[9px] font-bold shrink-0">
                        {getInitials(entry.userName)}
                      </div>
                      <span className="text-sm font-semibold text-gray-200">{entry.userName}</span>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${roleBadge[entry.userRole] ?? 'bg-gray-500/10 text-gray-400'}`}
                    >
                      {entry.userRole}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ color: cfg.color, backgroundColor: `${cfg.color}15` }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{entry.description}</p>
                </div>

                {/* Time */}
                <span className="text-[11px] text-gray-600 font-mono tabular-nums shrink-0">
                  {formatRelativeTime(entry.timestamp)}
                </span>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <History size={32} className="mx-auto text-gray-700 mb-3" />
              <p className="text-sm text-gray-600">No log entries found.</p>
            </div>
          )}
        </div>
      </GlassPanel>
    </div>
  );
};
