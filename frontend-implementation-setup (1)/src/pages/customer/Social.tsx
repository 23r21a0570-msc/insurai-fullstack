import { useState } from 'react';
import { Share2, Heart, MessageCircle, Star, Twitter, Facebook, Copy, CheckCircle2, Award, Shield } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';

// ─── Data ──────────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 't1', name: 'Sarah M.', location: 'Austin, TX', avatar: 'SM',
    text: 'Filed my first claim after a fender-bender and it was approved in under 48 hours. The whole process was seamless.',
    rating: 5, claimType: 'Auto Collision', date: 'Dec 2025',
  },
  {
    id: 't2', name: 'James K.', location: 'Portland, OR', avatar: 'JK',
    text: 'The bundling discount saved me $612 a year. Switching from my old provider was the best financial decision I made.',
    rating: 5, claimType: 'Bundle Savings', date: 'Nov 2025',
  },
  {
    id: 't3', name: 'Maria L.', location: 'Chicago, IL', avatar: 'ML',
    text: 'Customer support is incredible. Chat connected me with a live agent in under 2 minutes when I had a billing question.',
    rating: 5, claimType: 'Customer Support', date: 'Jan 2026',
  },
  {
    id: 't4', name: 'David C.', location: 'Miami, FL', avatar: 'DC',
    text: 'The AI chatbot helped me understand my policy in plain English. No confusing jargon. Finally an insurance company that makes sense.',
    rating: 5, claimType: 'Policy Guidance', date: 'Dec 2025',
  },
];

const LIVE_FEED = [
  { id: 'f1', text: 'John from Texas had their Auto claim approved',     time: '2 min ago',  icon: CheckCircle2, color: 'text-[#10B981]' },
  { id: 'f2', text: 'Emily from California saved $78/mo by bundling',    time: '8 min ago',  icon: Star, color: 'text-amber-400' },
  { id: 'f3', text: 'Michael in NY filed a Home claim and was approved', time: '15 min ago', icon: CheckCircle2, color: 'text-[#10B981]' },
  { id: 'f4', text: 'Amanda earned the Safe Driver badge',               time: '23 min ago', icon: Award, color: 'text-blue-400' },
  { id: 'f5', text: 'Carlos upgraded to Premium coverage',              time: '31 min ago', icon: Shield, color: 'text-purple-400' },
];

const SHARE_ACHIEVEMENTS = [
  { id: 'sa1', label: 'Safe Driver Badge',   emoji: '🚗', desc: 'No at-fault claims for 12 months', earned: true },
  { id: 'sa2', label: 'Loyal Member',        emoji: '❤️', desc: '1+ year active member',           earned: true },
  { id: 'sa3', label: 'Home Hero',           emoji: '🏠', desc: 'Active Home Insurance',           earned: true },
  { id: 'sa4', label: 'Bundle Boss',         emoji: '📦', desc: 'Hold 3+ active policies',         earned: false },
];

// ─── Component ────────────────────────────────────────────────────────────────
export const Social = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [liked, setLiked] = useState<string[]>([]);
  const [shareOpen, setShareOpen] = useState<string | null>(null);

  const handleLike = (id: string) => {
    setLiked((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => success('Copied!', 'Link copied to clipboard.'));
  };

  const handleShare = (platform: string, achievement: string) => {
    const msg = `I just earned the "${achievement}" badge on INSURAI! 🎉 Check it out at insurai.com`;
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=https://insurai.com`, '_blank');
    } else {
      handleCopy(msg);
    }
    setShareOpen(null);
    success('Shared!', `Posted to ${platform}.`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Share2 className="text-[#10B981]" size={24} /> Community & Social
        </h1>
        <p className="text-sm text-gray-500 mt-1">Share your achievements, read success stories, and see what others are doing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Testimonials */}
        <div className="lg:col-span-2 space-y-6">

          {/* Submit Testimonial */}
          <GlassPanel>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Share Your Story</h2>
            <textarea
              rows={3}
              placeholder={`How has INSURAI helped you, ${user?.name?.split(' ')[0] ?? 'there'}?`}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#10B981]/50 resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className="text-yellow-400 fill-yellow-400 cursor-pointer hover:scale-110 transition-transform" />
                ))}
              </div>
              <Button size="sm" className="text-xs" onClick={() => success('Thank you!', 'Your story has been submitted for review.')}>
                Submit Review
              </Button>
            </div>
          </GlassPanel>

          {/* Testimonials */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Customer Stories</h2>
            {TESTIMONIALS.map((t) => (
              <GlassPanel key={t.id}>
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="ml-2 text-[10px] font-bold text-amber-400 uppercase tracking-widest">{t.claimType}</span>
                </div>

                {/* Quote */}
                <p className="text-sm text-gray-300 leading-relaxed italic mb-4">"{t.text}"</p>

                {/* Author + Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#10B981]/15 text-[#10B981] text-xs font-bold flex items-center justify-center">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-200">{t.name}</p>
                      <p className="text-[10px] text-gray-600">{t.location} · {t.date}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLike(t.id)}
                    className={cn(
                      'flex items-center gap-1 text-xs font-semibold transition-colors',
                      liked.includes(t.id) ? 'text-pink-400' : 'text-gray-600 hover:text-pink-400'
                    )}
                  >
                    <Heart size={14} className={liked.includes(t.id) ? 'fill-pink-400' : ''} />
                    <span>Helpful</span>
                  </button>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Share Your Achievements */}
          <GlassPanel>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Share Achievements</h2>
            <div className="space-y-3">
              {SHARE_ACHIEVEMENTS.map((a) => (
                <div key={a.id} className={cn('p-3 rounded-xl border', a.earned ? 'bg-white/[0.03] border-white/[0.08]' : 'opacity-40 border-white/[0.04]')}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{a.emoji}</span>
                      <div>
                        <p className="text-xs font-bold text-gray-200">{a.label}</p>
                        <p className="text-[10px] text-gray-500">{a.desc}</p>
                      </div>
                    </div>
                    {a.earned && (
                      <div className="relative">
                        <button
                          onClick={() => setShareOpen(shareOpen === a.id ? null : a.id)}
                          className="p-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 transition-colors"
                        >
                          <Share2 size={13} />
                        </button>
                        {shareOpen === a.id && (
                          <div className="absolute right-0 top-8 z-10 w-40 bg-[#0D1424] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                            {[
                              { id: 'twitter',  label: 'Twitter / X',  icon: Twitter },
                              { id: 'facebook', label: 'Facebook',     icon: Facebook },
                              { id: 'copy',     label: 'Copy Link',    icon: Copy },
                            ].map((p) => {
                              const Icon = p.icon;
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => handleShare(p.id, a.label)}
                                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                >
                                  <Icon size={13} /> {p.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Live Activity Feed */}
          <GlassPanel>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Activity</h2>
            </div>
            <div className="space-y-3">
              {LIVE_FEED.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.id} className="flex items-start gap-2">
                    <Icon size={14} className={cn(f.color, 'shrink-0 mt-0.5')} />
                    <div>
                      <p className="text-xs text-gray-300 leading-snug">{f.text}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">{f.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassPanel>

          {/* Community Forum CTA */}
          <GlassPanel className="text-center">
            <MessageCircle size={28} className="text-blue-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Join the Community Forum</h3>
            <p className="text-xs text-gray-500 mb-4">Ask questions, share tips, and connect with other policyholders.</p>
            <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => success('Coming Soon', 'The community forum is launching soon!')}>
              Visit Forum
            </Button>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
