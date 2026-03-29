import { useState } from 'react';
import {
  HelpCircle, MessageSquare, Ticket, PlayCircle, Bell, Phone,
  Video, Calendar, ChevronRight, Clock, Star
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { LiveChat } from '@/components/support/LiveChat';
import { SupportTickets } from '@/components/support/SupportTickets';
import { FAQKnowledgeBase } from '@/components/support/FAQKnowledgeBase';
import { VideoTutorials } from '@/components/support/VideoTutorials';
import { NotificationPreferences } from '@/components/support/NotificationPreferences';
import { useToast } from '@/context/ToastContext';

type SupportTab = 'overview' | 'live-chat' | 'tickets' | 'faq' | 'videos' | 'notifications';

const TABS: { id: SupportTab; label: string; icon: typeof HelpCircle; badge?: string }[] = [
  { id: 'overview', label: 'Overview', icon: HelpCircle },
  { id: 'live-chat', label: 'Live Chat', icon: MessageSquare, badge: 'Online' },
  { id: 'tickets', label: 'Tickets', icon: Ticket, badge: '2' },
  { id: 'faq', label: 'Help Center', icon: HelpCircle },
  { id: 'videos', label: 'Tutorials', icon: PlayCircle },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const QUICK_STATS = [
  { label: 'Avg Response Time', value: '< 2 min', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Customer Rating', value: '4.9 / 5', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { label: 'Open Tickets', value: '2', icon: Ticket, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Support Hours', value: '24/7', icon: Phone, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const CONTACT_OPTIONS = [
  {
    id: 'live-chat' as SupportTab,
    title: 'Live Chat',
    description: 'Chat with a support agent in real-time. Average wait: ~2 min.',
    icon: MessageSquare,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    badge: 'Online',
    badgeColor: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    id: 'tickets' as SupportTab,
    title: 'Submit a Ticket',
    description: 'Email-based support with full issue tracking. Response within 4 hours.',
    icon: Ticket,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    badge: '4h response',
    badgeColor: 'bg-amber-500/10 text-amber-400',
  },
  {
    id: 'videos' as SupportTab,
    title: 'Video Tutorials',
    description: 'Self-serve with step-by-step video guides for all features.',
    icon: PlayCircle,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    badge: '10 videos',
    badgeColor: 'bg-purple-500/10 text-purple-400',
  },
  {
    id: 'faq' as SupportTab,
    title: 'Help Center & FAQs',
    description: 'Browse answers to the most common questions instantly.',
    icon: HelpCircle,
    color: 'text-[#10B981]',
    bg: 'bg-[#10B981]/10',
    border: 'border-[#10B981]/20',
    badge: '50+ articles',
    badgeColor: 'bg-[#10B981]/10 text-[#10B981]',
  },
];

export const CustomerSupport = () => {
  const [activeTab, setActiveTab] = useState<SupportTab>('overview');
  const { success } = useToast();

  const [callbackForm, setCallbackForm] = useState({ name: '', phone: '', time: 'asap', reason: '' });
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [videoCallScheduled, setVideoCallScheduled] = useState(false);

  const scheduleCallback = () => {
    success('Callback scheduled', 'An agent will call you within 30 minutes at your registered number.');
    setShowCallbackForm(false);
  };

  const scheduleVideoCall = () => {
    setVideoCallScheduled(true);
    success('Video call scheduled', 'Check your email for the meeting link.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <HelpCircle className="text-[#10B981]" size={24} />
          Support Center
        </h1>
        <p className="text-sm text-gray-500 mt-1">We're here to help — 24/7 support for all your insurance needs.</p>
      </div>

      {/* Tab Navigation */}
      <div
        className="flex gap-1 p-1 bg-white/[0.02] rounded-xl border border-white/[0.06] overflow-x-auto hide-scrollbar"
        role="tablist"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap relative',
                activeTab === tab.id ? 'bg-[#10B981]/15 text-[#10B981]' : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <Icon size={13} />
              {tab.label}
              {tab.badge && (
                <span className={cn(
                  'px-1.5 py-0.5 rounded-full text-[9px] font-bold',
                  tab.badge === 'Online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-gray-400'
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <GlassPanel key={stat.label} className="text-center py-4">
                  <div className={cn('w-9 h-9 rounded-xl mx-auto flex items-center justify-center mb-2', stat.bg)}>
                    <Icon size={18} className={stat.color} />
                  </div>
                  <p className="text-lg font-bold text-gray-100">{stat.value}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{stat.label}</p>
                </GlassPanel>
              );
            })}
          </div>

          {/* Contact Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CONTACT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => setActiveTab(opt.id)}
                  className={cn(
                    'text-left p-5 rounded-xl border transition-all group hover:scale-[1.01]',
                    opt.border,
                    'bg-white/[0.02] hover:bg-white/[0.04]'
                  )}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={cn('p-2.5 rounded-xl', opt.bg)}>
                      <Icon size={20} className={opt.color} />
                    </div>
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', opt.badgeColor)}>
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{opt.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{opt.description}</p>
                  <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-gray-600 group-hover:text-gray-400 transition-colors">
                    Get started <ChevronRight size={11} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Callback & Video Call */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Callback */}
            <GlassPanel>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10">
                  <Phone size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-200">Request Callback</p>
                  <p className="text-xs text-gray-500">We'll call you within 30 minutes</p>
                </div>
              </div>
              {!showCallbackForm ? (
                <button
                  onClick={() => setShowCallbackForm(true)}
                  className="w-full py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
                >
                  Schedule Callback
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    placeholder="Your name"
                    value={callbackForm.name}
                    onChange={(e) => setCallbackForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#10B981]/40 transition-colors"
                  />
                  <input
                    placeholder="Phone number"
                    value={callbackForm.phone}
                    onChange={(e) => setCallbackForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#10B981]/40 transition-colors"
                  />
                  <select
                    value={callbackForm.reason}
                    onChange={(e) => setCallbackForm((p) => ({ ...p, reason: e.target.value }))}
                    className="w-full h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-xs text-gray-200 focus:outline-none focus:border-[#10B981]/40 transition-colors"
                  >
                    <option value="" className="bg-[#0F1629]">Reason for call</option>
                    <option value="claim" className="bg-[#0F1629]">Claim inquiry</option>
                    <option value="policy" className="bg-[#0F1629]">Policy question</option>
                    <option value="payment" className="bg-[#0F1629]">Payment issue</option>
                    <option value="other" className="bg-[#0F1629]">Other</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => setShowCallbackForm(false)} className="flex-1 py-1.5 rounded-lg bg-white/5 text-xs text-gray-400 hover:text-white transition-colors">Cancel</button>
                    <button
                      onClick={scheduleCallback}
                      disabled={!callbackForm.name || !callbackForm.phone}
                      className="flex-1 py-1.5 rounded-lg bg-[#10B981] text-white text-xs font-bold hover:bg-[#059669] disabled:opacity-40 transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </GlassPanel>

            {/* Video Call */}
            <GlassPanel>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10">
                  <Video size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-200">Video Consultation</p>
                  <p className="text-xs text-gray-500">Screen share with a specialist</p>
                </div>
              </div>
              {videoCallScheduled ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Calendar size={13} className="text-blue-400" />
                  <p className="text-xs text-blue-400 font-semibold">Video call confirmed — check your email</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {['Today 2:00 PM', 'Today 4:30 PM', 'Tomorrow 10:00 AM', 'Tomorrow 2:00 PM'].map((slot) => (
                      <button
                        key={slot}
                        onClick={scheduleVideoCall}
                        className="py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] text-gray-400 hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-400 transition-colors font-medium"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </GlassPanel>
          </div>

          {/* Emergency Contact */}
          <GlassPanel className="border-red-500/20 bg-red-500/[0.02]">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="p-3 rounded-xl bg-red-500/10">
                <Phone size={20} className="text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-200">24/7 Emergency Hotline</p>
                <p className="text-xs text-gray-500">For urgent claims and emergencies — accidents, floods, medical emergencies</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-red-400 font-mono">1-800-INSURAI</p>
                <p className="text-[10px] text-gray-600">Available 24/7 · Free call</p>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* LIVE CHAT TAB */}
      {activeTab === 'live-chat' && (
        <div className="space-y-4">
          <GlassPanel>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Connect with a live support agent for immediate assistance. Average wait time is under 2 minutes during business hours. Our AI assistant is available 24/7 for common questions.
            </p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs text-gray-300"><span className="font-bold text-emerald-400">3 agents online</span> — Mon–Fri 9am–8pm EST. AI chatbot available 24/7.</p>
            </div>
          </GlassPanel>
          <LiveChat />
        </div>
      )}

      {/* TICKETS TAB */}
      {activeTab === 'tickets' && <SupportTickets />}

      {/* FAQ TAB */}
      {activeTab === 'faq' && <FAQKnowledgeBase />}

      {/* VIDEOS TAB */}
      {activeTab === 'videos' && <VideoTutorials />}

      {/* NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && <NotificationPreferences />}
    </div>
  );
};
