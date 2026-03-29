import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, MoreVertical, Search, Phone, Video } from 'lucide-react';
import { cn } from '@/utils/cn';
import { mockUsers } from '@/data/mockData';
import { formatRelativeTime } from '@/utils/formatters';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  fileName?: string;
  claimRef?: string;
  read: boolean;
}

interface Thread {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage: string;
  lastAt: string;
  unread: number;
  claimRef?: string;
  messages: Message[];
}

function makeTs(minsAgo: number) {
  return new Date(Date.now() - minsAgo * 60000).toISOString();
}

const THREADS: Thread[] = [
  {
    id: 'thread_1',
    participants: ['user_1', 'user_2'],
    participantNames: ['Sarah Chen', 'Mike Ross'],
    lastMessage: 'Can you verify the repair estimate for CLM-2024-1042?',
    lastAt: makeTs(5),
    unread: 2,
    claimRef: 'CLM-2024-1042',
    messages: [
      { id: 'm1', senderId: 'user_2', senderName: 'Mike Ross', content: 'Hey Sarah, CLM-2024-1042 has a suspicious repair estimate — $14,500 for bumper damage. Industry avg is $3-4K.', timestamp: makeTs(35), type: 'text', read: true },
      { id: 'm2', senderId: 'user_1', senderName: 'Sarah Chen', content: 'Agreed. I flagged it for manual review. The risk score just came in at 89.', timestamp: makeTs(30), type: 'text', read: true },
      { id: 'm3', senderId: 'user_2', senderName: 'Mike Ross', content: 'Can you verify the repair estimate for CLM-2024-1042?', timestamp: makeTs(5), type: 'text', read: false },
      { id: 'm4', senderId: 'user_2', senderName: 'Mike Ross', content: 'repair_estimate.pdf', timestamp: makeTs(4), type: 'file', fileName: 'repair_estimate.pdf', read: false },
    ],
  },
  {
    id: 'thread_2',
    participants: ['user_1', 'user_3'],
    participantNames: ['Emily Wang', 'James Wilson'],
    lastMessage: 'Escalating CLM-2024-1039 to fraud review team',
    lastAt: makeTs(45),
    unread: 0,
    claimRef: 'CLM-2024-1039',
    messages: [
      { id: 'm5', senderId: 'user_3', senderName: 'James Wilson', content: 'Emily, CLM-2024-1039 has duplicate claim patterns with CLM-2024-0987 from last quarter.', timestamp: makeTs(90), type: 'text', read: true },
      { id: 'm6', senderId: 'user_1', senderName: 'Emily Wang', content: 'I see it. Same claimant name, different SSN. Cross-referencing now.', timestamp: makeTs(80), type: 'text', read: true },
      { id: 'm7', senderId: 'system', senderName: 'System', content: 'Claim CLM-2024-1039 status changed to: Escalated', timestamp: makeTs(60), type: 'system', read: true },
      { id: 'm8', senderId: 'user_1', senderName: 'Emily Wang', content: 'Escalating CLM-2024-1039 to fraud review team', timestamp: makeTs(45), type: 'text', read: true },
    ],
  },
  {
    id: 'thread_3',
    participants: ['user_1', 'user_4'],
    participantNames: ['Sarah Chen', 'Alex Thompson'],
    lastMessage: 'The underwriting policy allows this under Section 4.2',
    lastAt: makeTs(120),
    unread: 0,
    messages: [
      { id: 'm9', senderId: 'user_1', senderName: 'Sarah Chen', content: 'Quick question on policy coverage for natural disaster claims — does Section 3.8 apply here?', timestamp: makeTs(180), type: 'text', read: true },
      { id: 'm10', senderId: 'user_4', senderName: 'Alex Thompson', content: 'The underwriting policy allows this under Section 4.2', timestamp: makeTs(120), type: 'text', read: true },
    ],
  },
];

const CURRENT_USER = mockUsers[0];

export const InternalMessaging = () => {
  const [activeThread, setActiveThread] = useState<string>(THREADS[0].id);
  const [message, setMessage] = useState('');
  const [threads, setThreads] = useState<Thread[]>(THREADS);
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const thread = threads.find((t) => t.id === activeThread);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread, thread?.messages.length]);

  const sendMessage = () => {
    if (!message.trim() || !thread) return;
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      content: message,
      timestamp: new Date().toISOString(),
      type: 'text',
      read: true,
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread
          ? { ...t, messages: [...t.messages, newMsg], lastMessage: message, lastAt: newMsg.timestamp, unread: 0 }
          : t
      )
    );
    setMessage('');
  };

  const filteredThreads = threads.filter(
    (t) =>
      t.participantNames.some((n) => n.toLowerCase().includes(search.toLowerCase())) ||
      (t.claimRef && t.claimRef.toLowerCase().includes(search.toLowerCase()))
  );

  const getAvatar = (name: string) => name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="flex rounded-xl border border-white/[0.06] overflow-hidden bg-white/[0.01]" style={{ height: 560 }}>
      {/* Thread list */}
      <div className="w-64 shrink-0 border-r border-white/[0.06] flex flex-col bg-white/[0.02]">
        <div className="p-3 border-b border-white/[0.06]">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Messages</p>
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-lg border border-white/[0.07] bg-white/[0.04] pl-7 pr-3 py-1.5 text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredThreads.map((t) => {
            const otherName = t.participantNames.find((n) => n !== CURRENT_USER.name) ?? t.participantNames[0];
            return (
              <button
                key={t.id}
                onClick={() => setActiveThread(t.id)}
                className={cn(
                  'w-full text-left p-3 border-b border-white/[0.04] transition-all',
                  activeThread === t.id ? 'bg-[#10B981]/[0.08]' : 'hover:bg-white/[0.04]'
                )}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center text-[10px] font-bold shrink-0">
                    {getAvatar(otherName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-200 truncate">{otherName}</p>
                      {t.unread > 0 && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#10B981] text-[8px] font-bold text-white shrink-0 ml-1">
                          {t.unread}
                        </span>
                      )}
                    </div>
                    {t.claimRef && (
                      <p className="text-[9px] font-mono text-[#10B981] mb-0.5">{t.claimRef}</p>
                    )}
                    <p className="text-[10px] text-gray-600 truncate">{t.lastMessage}</p>
                    <p className="text-[9px] text-gray-700 mt-0.5">{formatRelativeTime(t.lastAt)}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      {thread ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center text-[10px] font-bold">
                {getAvatar(thread.participantNames.find((n) => n !== CURRENT_USER.name) ?? thread.participantNames[0])}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-200">
                  {thread.participantNames.find((n) => n !== CURRENT_USER.name) ?? thread.participantNames[0]}
                </p>
                {thread.claimRef && (
                  <p className="text-[10px] font-mono text-[#10B981]">Re: {thread.claimRef}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-colors" title="Call">
                <Phone size={15} />
              </button>
              <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-colors" title="Video">
                <Video size={15} />
              </button>
              <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-colors">
                <MoreVertical size={15} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {thread.messages.map((msg) => {
              const isMe = msg.senderId === CURRENT_USER.id || msg.senderName === CURRENT_USER.name;
              const isSystem = msg.type === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex items-center justify-center">
                    <span className="text-[9px] text-gray-600 bg-white/[0.03] border border-white/[0.05] px-3 py-1 rounded-full">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={cn('flex gap-2', isMe && 'flex-row-reverse')}>
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-white/[0.08] text-[9px] font-bold text-gray-400 flex items-center justify-center shrink-0 mt-1">
                      {getAvatar(msg.senderName)}
                    </div>
                  )}
                  <div className={cn('max-w-[70%] space-y-1', isMe && 'items-end flex flex-col')}>
                    {!isMe && <p className="text-[9px] text-gray-600 px-1">{msg.senderName}</p>}
                    <div className={cn(
                      'rounded-2xl px-3 py-2 text-xs leading-relaxed',
                      isMe ? 'bg-[#10B981] text-white rounded-tr-sm' : 'bg-white/[0.06] text-gray-300 rounded-tl-sm',
                      msg.type === 'file' && 'flex items-center gap-2'
                    )}>
                      {msg.type === 'file' ? (
                        <>
                          <Paperclip size={12} />
                          <span className="underline cursor-pointer">{msg.fileName}</span>
                        </>
                      ) : msg.content}
                    </div>
                    <p className={cn('text-[9px] text-gray-700 px-1', isMe && 'text-right')}>
                      {formatRelativeTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-colors shrink-0">
                <Paperclip size={15} />
              </button>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Type a message... (Enter to send)"
                className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-2 text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 transition-all"
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="p-2 rounded-xl bg-[#10B981] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#059669] transition-colors shrink-0"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-600">Select a conversation</p>
        </div>
      )}
    </div>
  );
};
