import { useState } from 'react';
import {
  Ticket, Plus, Search, MessageSquare, Clock, CheckCircle2,
  AlertCircle, ChevronRight, Send, X
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatRelativeTime } from '@/utils/formatters';
import { GlassPanel } from '@/components/ui/GlassPanel';

type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
type TicketCategory = 'claim' | 'policy' | 'payment' | 'technical' | 'other';

interface TicketMessage {
  id: string;
  role: 'customer' | 'agent';
  text: string;
  timestamp: string;
  agentName?: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  assignedTo?: string;
  referenceId?: string;
}

const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-001',
    subject: 'Claim CLM-2024-0042 - Missing payment after approval',
    category: 'claim',
    status: 'in_progress',
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    assignedTo: 'Sarah Mitchell',
    referenceId: 'CLM-2024-0042',
    messages: [
      { id: '1', role: 'customer', text: 'My claim was approved 5 days ago but I still haven\'t received payment. Please help.', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: '2', role: 'agent', text: 'Hi! I can see your claim CLM-2024-0042 was approved. Payment was initiated on Jan 15. It typically takes 3–5 business days to reflect in your account. If not received by Jan 20, please let us know.', timestamp: new Date(Date.now() - 86400000).toISOString(), agentName: 'Sarah Mitchell' },
    ],
  },
  {
    id: 'TKT-002',
    subject: 'Need to update beneficiary on life policy',
    category: 'policy',
    status: 'open',
    priority: 'medium',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    referenceId: 'POL-4392',
    messages: [
      { id: '1', role: 'customer', text: 'I got married recently and need to update the beneficiary on my life insurance policy POL-4392 to my spouse.', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
    ],
  },
  {
    id: 'TKT-003',
    subject: 'Incorrect premium charge on auto policy',
    category: 'payment',
    status: 'resolved',
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    assignedTo: 'Michael Torres',
    referenceId: 'POL-7821',
    messages: [
      { id: '1', role: 'customer', text: 'I was charged $1,450 instead of $1,200 for my auto policy this month.', timestamp: new Date(Date.now() - 86400000 * 7).toISOString() },
      { id: '2', role: 'agent', text: 'I can see the discrepancy. The $250 difference was due to an add-on that was applied. I have reversed this charge. You\'ll receive a refund within 2–3 business days.', timestamp: new Date(Date.now() - 86400000 * 6).toISOString(), agentName: 'Michael Torres' },
      { id: '3', role: 'customer', text: 'Great, thank you! Received the refund confirmation.', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
    ],
  },
];

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  open: { label: 'Open', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: AlertCircle },
  in_progress: { label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Clock },
  waiting: { label: 'Waiting', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Clock },
  resolved: { label: 'Resolved', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
  closed: { label: 'Closed', color: 'text-gray-500', bg: 'bg-gray-500/10', icon: CheckCircle2 },
};

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-gray-400' },
  medium: { label: 'Medium', color: 'text-blue-400' },
  high: { label: 'High', color: 'text-amber-400' },
  urgent: { label: 'Urgent', color: 'text-red-400' },
};

const CATEGORIES: { value: TicketCategory; label: string }[] = [
  { value: 'claim', label: 'Claim Issue' },
  { value: 'policy', label: 'Policy Change' },
  { value: 'payment', label: 'Payment / Billing' },
  { value: 'technical', label: 'Technical Problem' },
  { value: 'other', label: 'Other' },
];

export const SupportTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all');
  const [reply, setReply] = useState('');
  const [newForm, setNewForm] = useState({ subject: '', category: 'claim' as TicketCategory, message: '', priority: 'medium' as TicketPriority });

  const filtered = tickets.filter((t) => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const submitReply = () => {
    if (!reply.trim() || !selectedTicket) return;
    const newMsg: TicketMessage = {
      id: Date.now().toString(),
      role: 'customer',
      text: reply,
      timestamp: new Date().toISOString(),
    };
    const updated = { ...selectedTicket, messages: [...selectedTicket.messages, newMsg], updatedAt: new Date().toISOString() };
    setTickets((prev) => prev.map((t) => (t.id === selectedTicket.id ? updated : t)));
    setSelectedTicket(updated);
    setReply('');
  };

  const submitNewTicket = () => {
    if (!newForm.subject || !newForm.message) return;
    const ticket: SupportTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: newForm.subject,
      category: newForm.category,
      status: 'open',
      priority: newForm.priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [{ id: '1', role: 'customer', text: newForm.message, timestamp: new Date().toISOString() }],
    };
    setTickets((prev) => [ticket, ...prev]);
    setShowNewForm(false);
    setNewForm({ subject: '', category: 'claim', message: '', priority: 'medium' });
    setSelectedTicket(ticket);
  };

  if (selectedTicket) {
    const sc = STATUS_CONFIG[selectedTicket.status];
    const StatusIcon = sc.icon;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedTicket(null)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <ChevronRight size={16} className="rotate-180" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-gray-200">{selectedTicket.subject}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[10px] font-mono text-gray-500">{selectedTicket.id}</span>
              <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold', sc.bg, sc.color)}>
                <StatusIcon size={9} /> {sc.label}
              </span>
              <span className={cn('text-[10px] font-bold', PRIORITY_CONFIG[selectedTicket.priority].color)}>
                {PRIORITY_CONFIG[selectedTicket.priority].label} Priority
              </span>
              {selectedTicket.assignedTo && (
                <span className="text-[10px] text-gray-500">Assigned to: {selectedTicket.assignedTo}</span>
              )}
            </div>
          </div>
        </div>

        <GlassPanel className="space-y-4">
          <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
            {selectedTicket.messages.map((msg) => (
              <div key={msg.id} className={cn('flex gap-3', msg.role === 'customer' ? 'flex-row-reverse' : 'flex-row')}>
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5',
                  msg.role === 'customer' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-blue-500/20 text-blue-400'
                )}>
                  {msg.role === 'customer' ? 'Me' : msg.agentName?.split(' ').map((n) => n[0]).join('') ?? 'AG'}
                </div>
                <div className={cn('max-w-[80%] space-y-1', msg.role === 'customer' && 'items-end flex flex-col')}>
                  {msg.agentName && <p className="text-[9px] text-gray-600">{msg.agentName} · Support Agent</p>}
                  <div className={cn(
                    'px-3 py-2.5 rounded-xl text-xs leading-relaxed',
                    msg.role === 'customer'
                      ? 'bg-[#10B981]/10 border border-[#10B981]/20 text-gray-200 rounded-tr-none'
                      : 'bg-white/[0.04] border border-white/[0.07] text-gray-300 rounded-tl-none'
                  )}>
                    {msg.text}
                  </div>
                  <p className="text-[9px] text-gray-700 px-1">{formatRelativeTime(msg.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
            <div className="flex gap-2 pt-3 border-t border-white/[0.06]">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Add a reply..."
                rows={2}
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#10B981]/40 resize-none transition-colors"
              />
              <button
                onClick={submitReply}
                disabled={!reply.trim()}
                className="w-9 h-9 rounded-lg bg-[#10B981] text-white flex items-center justify-center hover:bg-[#059669] disabled:opacity-40 self-end transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          )}
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-gray-200 flex items-center gap-2">
            <Ticket size={16} className="text-[#10B981]" /> Support Tickets
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Track your support requests and get updates from our team.</p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs font-bold hover:bg-[#10B981]/20 transition-colors"
        >
          <Plus size={14} /> New Ticket
        </button>
      </div>

      {/* New Ticket Form */}
      {showNewForm && (
        <GlassPanel className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-300">Create Support Ticket</h3>
            <button onClick={() => setShowNewForm(false)} className="text-gray-600 hover:text-gray-300"><X size={14} /></button>
          </div>
          <input
            placeholder="Subject *"
            value={newForm.subject}
            onChange={(e) => setNewForm((p) => ({ ...p, subject: e.target.value }))}
            className="w-full h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#10B981]/40 transition-colors"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={newForm.category}
              onChange={(e) => setNewForm((p) => ({ ...p, category: e.target.value as TicketCategory }))}
              className="h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-xs text-gray-200 focus:outline-none focus:border-[#10B981]/40 transition-colors"
            >
              {CATEGORIES.map((c) => <option key={c.value} value={c.value} className="bg-[#0F1629]">{c.label}</option>)}
            </select>
            <select
              value={newForm.priority}
              onChange={(e) => setNewForm((p) => ({ ...p, priority: e.target.value as TicketPriority }))}
              className="h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-xs text-gray-200 focus:outline-none focus:border-[#10B981]/40 transition-colors"
            >
              <option value="low" className="bg-[#0F1629]">Low Priority</option>
              <option value="medium" className="bg-[#0F1629]">Medium Priority</option>
              <option value="high" className="bg-[#0F1629]">High Priority</option>
              <option value="urgent" className="bg-[#0F1629]">Urgent</option>
            </select>
          </div>
          <textarea
            placeholder="Describe your issue in detail... *"
            value={newForm.message}
            onChange={(e) => setNewForm((p) => ({ ...p, message: e.target.value }))}
            rows={3}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#10B981]/40 resize-none transition-colors"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowNewForm(false)} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
            <button
              onClick={submitNewTicket}
              disabled={!newForm.subject || !newForm.message}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#10B981] text-white hover:bg-[#059669] disabled:opacity-40 transition-colors"
            >
              Submit Ticket
            </button>
          </div>
        </GlassPanel>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-32 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg pl-8 pr-3 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#10B981]/40 transition-colors"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'open', 'in_progress', 'resolved'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors',
                filterStatus === s ? 'bg-[#10B981]/15 text-[#10B981]' : 'text-gray-500 hover:text-gray-300 bg-white/[0.03]'
              )}
            >
              {s === 'all' ? 'All' : s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-600">
            <Ticket size={32} className="mb-3" />
            <p className="text-sm font-medium">No tickets found</p>
            <p className="text-xs mt-1">Create a new ticket to get support</p>
          </div>
        )}
        {filtered.map((ticket) => {
          const sc = STATUS_CONFIG[ticket.status];
          const StatusIcon = sc.icon;
          return (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="w-full text-left p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-[#10B981]/20 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-mono text-gray-600">{ticket.id}</span>
                    <span className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold', sc.bg, sc.color)}>
                      <StatusIcon size={8} /> {sc.label}
                    </span>
                    <span className={cn('text-[9px] font-bold', PRIORITY_CONFIG[ticket.priority].color)}>
                      {PRIORITY_CONFIG[ticket.priority].label}
                    </span>
                    {ticket.referenceId && (
                      <span className="text-[9px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">
                        {ticket.referenceId}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-200 truncate group-hover:text-white transition-colors">{ticket.subject}</p>
                  {ticket.messages.length > 0 && (
                    <p className="text-[10px] text-gray-500 mt-1 truncate">
                      {ticket.messages[ticket.messages.length - 1].text}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-gray-600">{formatRelativeTime(ticket.updatedAt)}</p>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <MessageSquare size={10} className="text-gray-600" />
                    <span className="text-[10px] text-gray-600">{ticket.messages.length}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
