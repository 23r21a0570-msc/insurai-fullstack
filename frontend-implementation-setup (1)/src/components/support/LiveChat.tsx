import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, X, Send, Bot, Paperclip, Phone, Video,
  Star, ChevronDown, CheckCheck, FileText
} from 'lucide-react';
import { cn } from '@/utils/cn';

type AgentStatus = 'bot' | 'waiting' | 'connected' | 'ended';

interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'bot' | 'system';
  text: string;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  attachmentName?: string;
  agentName?: string;
}

const AGENT = { name: 'Sarah Mitchell', avatar: 'SM', dept: 'Claims Support', rating: 4.9 };

const QUICK_REPLIES = [
  'What is the status of my claim?',
  'How long does processing take?',
  'I need to upload documents',
  'Request a callback',
  'Talk to a human agent',
];

const BOT_AUTO_REPLIES: Record<string, string> = {
  'claim status': 'Your most recent claim CLM-2024-0042 is Under Review. Processing usually takes 3–5 business days.',
  'documents': 'You can upload documents directly in Claims → Select Claim → Attachments tab. We accept PDF, JPG, PNG (max 10 MB).',
  'payment': 'Your next payment of $1,200 is due in 15 days. You can pay via the Payments section.',
  'policy': 'You have 2 active policies: Auto (POL-7821) renewed in 185 days, and Home (POL-4392).',
  'callback': 'I\'ll arrange a callback for you. A specialist will call your registered number within 30 minutes.',
  'human': 'Connecting you to a live agent now. Expected wait time: ~2 minutes...',
  'agent': 'Connecting you to a live agent now. Expected wait time: ~2 minutes...',
};

const getBotReply = (text: string): { reply: string; escalate?: boolean } => {
  const lower = text.toLowerCase();
  for (const [key, reply] of Object.entries(BOT_AUTO_REPLIES)) {
    if (lower.includes(key)) {
      return { reply, escalate: key === 'human' || key === 'agent' || key === 'callback' };
    }
  }
  return {
    reply: 'I understand your concern. Let me connect you with a specialist who can assist you further. Would you prefer to continue with me or speak with a live agent?',
  };
};

export const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('bot');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [waitTime, setWaitTime] = useState(120);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [unread, setUnread] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'bot',
      text: "Hi! I'm the INSURAI virtual assistant. How can I help you today? I can answer questions or connect you with a live agent.",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
      setUnread(0);
    }
  }, [messages, isOpen, isMinimized]);

  // Countdown for wait time
  useEffect(() => {
    if (agentStatus !== 'waiting') return;
    if (waitTime <= 0) {
      connectAgent();
      return;
    }
    const timer = setTimeout(() => setWaitTime((w) => w - 1), 1000);
    return () => clearTimeout(timer);
  }, [agentStatus, waitTime]);

  const addMessage = (msg: Omit<ChatMessage, 'id'>) => {
    const id = Date.now().toString() + Math.random();
    setMessages((prev) => [...prev, { id, ...msg }]);
    if (!isOpen || isMinimized) setUnread((u) => u + 1);
  };

  const addSystemMessage = (text: string) => {
    addMessage({ role: 'system', text, timestamp: new Date() });
  };

  const connectAgent = () => {
    setAgentStatus('connected');
    addSystemMessage(`✓ Connected to ${AGENT.name} · ${AGENT.dept}`);
    setTimeout(() => {
      addMessage({
        role: 'agent',
        text: `Hi there! I'm ${AGENT.name} from our ${AGENT.dept} team. I can see your account details. How can I help you today?`,
        timestamp: new Date(),
        agentName: AGENT.name,
        status: 'read',
      });
    }, 1200);
  };

  const simulateTyping = (reply: string, role: 'bot' | 'agent' = 'bot') => {
    setIsTyping(true);
    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      setIsTyping(false);
      addMessage({ role, text: reply, timestamp: new Date(), agentName: role === 'agent' ? AGENT.name : undefined, status: 'read' });
    }, delay);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    addMessage({ role: 'user', text, timestamp: new Date(), status: 'read' });
    setInput('');

    if (agentStatus === 'bot') {
      const { reply, escalate } = getBotReply(text);
      simulateTyping(reply, 'bot');
      if (escalate) {
        setTimeout(() => {
          setAgentStatus('waiting');
          addSystemMessage('Searching for available agents...');
        }, 2000);
      }
    } else if (agentStatus === 'connected') {
      simulateTyping(
        "I've noted that. Let me look into this for you right away. Is there anything else you'd like to add?",
        'agent'
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addMessage({ role: 'user', text: `Attached: ${file.name}`, timestamp: new Date(), attachmentName: file.name, status: 'read' });
    setTimeout(() => {
      simulateTyping('Thanks for the attachment! I can see the file has been received. I\'ll review it now.', agentStatus === 'connected' ? 'agent' : 'bot');
    }, 500);
  };

  const endChat = () => {
    setAgentStatus('ended');
    addSystemMessage('Chat session ended. Thank you for contacting INSURAI support.');
    setShowRating(true);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-20 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label="Open live chat"
      >
        <MessageSquare size={15} />
        Live Support
        {unread > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold">
            {unread}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={cn(
        'fixed bottom-20 right-20 z-40 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#0F1629] shadow-2xl shadow-black/60 flex flex-col overflow-hidden transition-all duration-300',
        isMinimized ? 'h-14' : 'h-[520px]'
      )}
      role="dialog"
      aria-label="Live Chat Support"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600/10 border-b border-blue-600/20 shrink-0">
        <div className="flex items-center gap-2.5">
          {agentStatus === 'connected' ? (
            <>
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-[11px] font-bold text-blue-400">
                  {AGENT.avatar}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#0F1629]" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-200">{AGENT.name}</p>
                <p className="text-[10px] text-blue-400">{AGENT.dept} · ⭐ {AGENT.rating}</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Bot size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-200">
                  {agentStatus === 'waiting' ? 'Connecting to agent...' : 'INSURAI Support'}
                </p>
                <p className="text-[10px] text-blue-400">
                  {agentStatus === 'waiting'
                    ? `Est. wait: ${Math.floor(waitTime / 60)}:${String(waitTime % 60).padStart(2, '0')}`
                    : 'Virtual Assistant'}
                </p>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          {agentStatus === 'connected' && (
            <>
              <button className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="Voice call">
                <Phone size={13} />
              </button>
              <button className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="Video call">
                <Video size={13} />
              </button>
            </>
          )}
          <button onClick={() => setIsMinimized((p) => !p)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors" aria-label="Minimize">
            <ChevronDown size={14} />
          </button>
          <button onClick={() => { agentStatus === 'connected' ? endChat() : setIsOpen(false); }} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close">
            <X size={14} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.role === 'system' ? (
                  <div className="flex items-center gap-2 py-1">
                    <div className="flex-1 h-px bg-white/5" />
                    <p className="text-[10px] text-gray-600 px-2">{msg.text}</p>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                ) : (
                  <div className={cn('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                    {msg.role !== 'user' && (
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1 text-[9px] font-bold text-blue-400">
                        {msg.role === 'agent' ? AGENT.avatar : <Bot size={11} />}
                      </div>
                    )}
                    <div className={cn('max-w-[78%] flex flex-col gap-1', msg.role === 'user' && 'items-end')}>
                      {msg.agentName && <p className="text-[9px] text-gray-600 px-1">{msg.agentName}</p>}
                      <div className={cn(
                        'px-3 py-2 rounded-xl text-xs leading-relaxed',
                        msg.role === 'user'
                          ? 'bg-blue-600/20 border border-blue-500/30 text-gray-200 rounded-tr-none'
                          : 'bg-white/[0.04] border border-white/[0.07] text-gray-300 rounded-tl-none'
                      )}>
                        {msg.attachmentName ? (
                          <div className="flex items-center gap-2">
                            <FileText size={12} className="text-blue-400" />
                            <span>{msg.attachmentName}</span>
                          </div>
                        ) : msg.text}
                      </div>
                      <div className={cn('flex items-center gap-1 px-1', msg.role === 'user' && 'flex-row-reverse')}>
                        <p className="text-[9px] text-gray-700">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        {msg.role === 'user' && msg.status === 'read' && <CheckCheck size={10} className="text-blue-400" />}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[9px] font-bold text-blue-400">
                  {agentStatus === 'connected' ? AGENT.avatar : <Bot size={11} />}
                </div>
                <div className="px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] flex gap-1">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Rating */}
            {showRating && (
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center space-y-2">
                <p className="text-xs font-semibold text-gray-300">How was your experience?</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setRating(s)} className={cn('p-1 transition-colors', s <= rating ? 'text-amber-400' : 'text-gray-700 hover:text-amber-400')}>
                      <Star size={18} fill={s <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <button onClick={() => { setShowRating(false); }} className="text-[10px] text-blue-400 hover:underline font-semibold">
                    Submit rating ({rating}/5)
                  </button>
                )}
              </div>
            )}

            {/* Quick replies */}
            {agentStatus === 'bot' && messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_REPLIES.map((r) => (
                  <button
                    key={r}
                    onClick={() => sendMessage(r)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {agentStatus !== 'ended' && (
            <form onSubmit={handleSubmit} className="p-3 border-t border-white/[0.06] flex items-center gap-2 shrink-0">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,.pdf" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-600 hover:text-blue-400 transition-colors" aria-label="Attach file">
                <Paperclip size={16} />
              </button>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={agentStatus === 'waiting' ? 'Waiting for agent…' : 'Type a message…'}
                disabled={agentStatus === 'waiting'}
                className="flex-1 h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/40 disabled:opacity-50 transition-colors"
                aria-label="Chat input"
              />
              <button
                type="submit"
                disabled={!input.trim() || agentStatus === 'waiting'}
                className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                aria-label="Send"
              >
                <Send size={14} />
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};
