import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
  options?: string[];
}

const BOT_RESPONSES: Record<string, { text: string; options?: string[] }> = {
  default: {
    text: "I'm here to help! You can ask me about your claims, policies, or payments.",
    options: ['Check claim status', 'View my policies', 'Make a payment', 'Talk to an agent'],
  },
  claim: {
    text: "Your most recent claim (CLM-2024-0042) is currently Under Review. Our team typically processes claims within 3–5 business days. Would you like more details?",
    options: ['Get claim details', 'Upload documents', 'Talk to an agent'],
  },
  policy: {
    text: "You have 2 active policies: Auto (POL-7821) and Home (POL-4392). Your next renewal is in 185 days. Would you like to view coverage details?",
    options: ['View coverage', 'Compare plans', 'Get a quote'],
  },
  payment: {
    text: "You have 2 upcoming payments totalling $3,600. Your next payment of $1,200 is due in 15 days for your Auto policy.",
    options: ['Pay now', 'Set up auto-pay', 'Payment history'],
  },
  agent: {
    text: "Connecting you to a live agent... Our agents are available Mon–Fri, 9am–6pm EST. Expected wait time: 2 minutes. Would you prefer a callback instead?",
    options: ['Request callback', 'Continue with AI', 'Leave a message'],
  },
  documents: {
    text: "To upload documents for your claim, go to Claims → Select your claim → Attachments tab. Accepted formats: PDF, JPG, PNG (max 10MB each).",
    options: ['Go to claims', 'Talk to an agent'],
  },
  quote: {
    text: "I can help you get an instant quote! Head to our Quote Calculator for a personalized estimate in under 60 seconds.",
    options: ['Get a quote', 'Compare plans', 'Talk to an agent'],
  },
  callback: {
    text: "A callback has been scheduled. One of our agents will call you within 30 minutes at your registered number. Is there anything else I can help you with?",
    options: ['Yes, something else', 'No, thank you'],
  },
  thanks: {
    text: "You're welcome! Is there anything else I can help you with today?",
    options: ['Yes, something else', 'No, thank you'],
  },
  bye: {
    text: "Thank you for chatting with INSURAI support. Have a great day! 😊",
  },
};

const getResponse = (input: string): { text: string; options?: string[] } => {
  const lower = input.toLowerCase();
  if (lower.includes('claim') || lower.includes('status')) return BOT_RESPONSES.claim;
  if (lower.includes('policy') || lower.includes('policies') || lower.includes('coverage')) return BOT_RESPONSES.policy;
  if (lower.includes('payment') || lower.includes('pay') || lower.includes('bill')) return BOT_RESPONSES.payment;
  if (lower.includes('agent') || lower.includes('human') || lower.includes('person')) return BOT_RESPONSES.agent;
  if (lower.includes('document') || lower.includes('upload') || lower.includes('file')) return BOT_RESPONSES.documents;
  if (lower.includes('quote') || lower.includes('price') || lower.includes('cost')) return BOT_RESPONSES.quote;
  if (lower.includes('callback') || lower.includes('call')) return BOT_RESPONSES.callback;
  if (lower.includes('thank') || lower.includes('thanks')) return BOT_RESPONSES.thanks;
  if (lower.includes('bye') || lower.includes('no, thank')) return BOT_RESPONSES.bye;
  return BOT_RESPONSES.default;
};

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      text: "Hi! I'm INSURAI Assistant 👋 How can I help you today?",
      timestamp: new Date(),
      options: ['Check claim status', 'View my policies', 'Make a payment', 'Talk to an agent'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
      setUnreadCount(0);
    }
  }, [messages, isOpen, isMinimized]);

  const addBotMessage = (text: string, options?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const newMsg: Message = {
        id: Date.now().toString(),
        role: 'bot',
        text,
        timestamp: new Date(),
        options,
      };
      setMessages((prev) => [...prev, newMsg]);
      if (!isOpen || isMinimized) setUnreadCount((c) => c + 1);
    }, 800 + Math.random() * 600);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const response = getResponse(text);
    addBotMessage(response.text, response.options);
  };

  const handleOptionClick = (option: string) => sendMessage(option);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-20 right-4 z-50 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#0F1629] shadow-2xl shadow-black/60 flex flex-col overflow-hidden transition-all duration-300',
            isMinimized ? 'h-14' : 'h-[480px]'
          )}
          role="dialog"
          aria-label="INSURAI Chat Support"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#10B981]/10 border-b border-[#10B981]/20 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                  <Bot size={16} className="text-[#10B981]" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0F1629]" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-200">INSURAI Assistant</p>
                <p className="text-[10px] text-[#10B981]">Online · Typically replies instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized((p) => !p)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                {isMinimized ? <ChevronDown size={14} /> : <Minimize2 size={14} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close chat"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1',
                      msg.role === 'bot' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-blue-500/20 text-blue-400'
                    )}>
                      {msg.role === 'bot' ? <Bot size={12} /> : <User size={12} />}
                    </div>
                    <div className={cn('flex flex-col gap-2 max-w-[80%]', msg.role === 'user' && 'items-end')}>
                      <div className={cn(
                        'px-3 py-2 rounded-xl text-xs leading-relaxed',
                        msg.role === 'bot'
                          ? 'bg-white/[0.05] border border-white/[0.08] text-gray-300 rounded-tl-none'
                          : 'bg-[#10B981]/20 border border-[#10B981]/30 text-gray-200 rounded-tr-none'
                      )}>
                        {msg.text}
                      </div>
                      {msg.options && msg.role === 'bot' && (
                        <div className="flex flex-wrap gap-1.5">
                          {msg.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleOptionClick(opt)}
                              className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/20 transition-colors"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="text-[9px] text-gray-600 px-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                      <Bot size={12} className="text-[#10B981]" />
                    </div>
                    <div className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-white/[0.06] flex gap-2 shrink-0">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#10B981]/40 transition-colors"
                  aria-label="Chat message input"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-lg bg-[#10B981] text-white flex items-center justify-center hover:bg-[#059669] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => { setIsOpen((p) => !p); setUnreadCount(0); }}
        className="fixed bottom-4 right-4 z-50 w-13 h-13 w-12 h-12 rounded-full bg-[#10B981] text-white shadow-lg shadow-[#10B981]/30 flex items-center justify-center hover:bg-[#059669] hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label={isOpen ? 'Close chat' : 'Open chat support'}
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0A0F1A]">
            {unreadCount}
          </span>
        )}
      </button>
    </>
  );
};
