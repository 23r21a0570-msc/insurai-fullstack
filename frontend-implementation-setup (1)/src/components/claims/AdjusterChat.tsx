import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Phone, Video, Paperclip, X, ChevronDown, CheckCheck } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatRelativeTime } from '@/utils/formatters';
import { getInitials } from '@/utils/formatters';

interface Message {
  id: string;
  sender: 'adjuster' | 'customer';
  text: string;
  timestamp: string;
  read: boolean;
}

const MOCK_ADJUSTER = {
  name: 'Sarah Chen',
  role: 'Senior Claims Adjuster',
  avatar: null,
  isOnline: true,
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'adjuster',
    text: "Hello! I'm Sarah, your assigned adjuster for this claim. I've reviewed the initial details and have a few questions.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
  },
  {
    id: '2',
    sender: 'adjuster',
    text: 'Could you please provide the police report number? Also, do you have photos of the damage from multiple angles?',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    read: true,
  },
  {
    id: '3',
    sender: 'customer',
    text: 'Hi Sarah! The police report number is PR-2024-8847. I uploaded 6 photos in the attachments section.',
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    read: true,
  },
  {
    id: '4',
    sender: 'adjuster',
    text: "Perfect, thank you! I can see the photos. The damage looks consistent with what was described. I'll schedule an inspection for this week.",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: true,
  },
];

const BOT_RESPONSES = [
  "I'll look into that right away and get back to you shortly.",
  'Thank you for the information. I have noted this in your claim file.',
  'Could you clarify the date of the incident? I want to make sure our records are accurate.',
  "I've escalated this to my supervisor for review. You should hear back within 24 hours.",
  "The inspection has been scheduled. You'll receive a confirmation email shortly.",
  "I can see the documents you've uploaded. They look complete. We're making good progress on this claim.",
];

interface AdjusterChatProps {
  claimNumber: string;
}

export const AdjusterChat = ({ claimNumber }: AdjusterChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'customer',
      text: input.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Simulate adjuster typing and response
    setIsTyping(true);
    const delay = 1500 + Math.random() * 1500;
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: `msg_${Date.now()}_r`,
        sender: 'adjuster',
        text: BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)],
        timestamp: new Date().toISOString(),
        read: false,
      };
      setMessages((prev) => [...prev, response]);
      if (!isOpen) setUnreadCount((c) => c + 1);
    }, delay);
  };

  return (
    <div className="space-y-0">
      {/* Chat panel */}
      {isOpen && (
        <div className="rounded-xl border border-white/[0.08] bg-[#0F1629] overflow-hidden flex flex-col" style={{ height: 480 }}>
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center text-sm font-bold">
                  {getInitials(MOCK_ADJUSTER.name)}
                </div>
                {MOCK_ADJUSTER.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0F1629]" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-200">{MOCK_ADJUSTER.name}</p>
                <p className="text-[10px] text-gray-500">{MOCK_ADJUSTER.role} · {MOCK_ADJUSTER.isOnline ? 'Online' : 'Away'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all" title="Voice call">
                <Phone size={15} />
              </button>
              <button className="p-2 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-400/10 transition-all" title="Video call">
                <Video size={15} />
              </button>
              <button className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.05] transition-all" title="Attach file">
                <Paperclip size={15} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.05] transition-all">
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Claim context banner */}
          <div className="px-4 py-2 bg-[#10B981]/[0.05] border-b border-[#10B981]/10">
            <p className="text-[10px] text-[#10B981] font-medium">Claim {claimNumber} · Messages are encrypted and stored securely</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn('flex gap-2.5', msg.sender === 'customer' && 'flex-row-reverse')}>
                {msg.sender === 'adjuster' && (
                  <div className="w-7 h-7 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                    {getInitials(MOCK_ADJUSTER.name)}
                  </div>
                )}
                <div className={cn('max-w-[75%] space-y-1', msg.sender === 'customer' && 'items-end flex flex-col')}>
                  <div className={cn(
                    'px-3 py-2.5 rounded-2xl text-sm leading-relaxed',
                    msg.sender === 'adjuster'
                      ? 'bg-white/[0.05] text-gray-300 rounded-tl-sm'
                      : 'bg-[#10B981]/20 text-white rounded-tr-sm border border-[#10B981]/15'
                  )}>
                    {msg.text}
                  </div>
                  <div className={cn('flex items-center gap-1', msg.sender === 'customer' && 'flex-row-reverse')}>
                    <span className="text-[10px] text-gray-600">{formatRelativeTime(msg.timestamp)}</span>
                    {msg.sender === 'customer' && (
                      <CheckCheck size={11} className={msg.read ? 'text-[#10B981]' : 'text-gray-600'} />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-end">
                <div className="w-7 h-7 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center text-xs font-bold shrink-0">
                  {getInitials(MOCK_ADJUSTER.name)}
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.05] flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 transition-all"
                aria-label="Message to adjuster"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all group"
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <MessageSquare size={16} className="text-gray-400 group-hover:text-white transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#10B981] text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
            Chat with Adjuster
          </span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
          </span>
        </div>
        <ChevronDown size={14} className={cn('text-gray-600 transition-transform', isOpen && 'rotate-180')} />
      </button>
    </div>
  );
};
