import { useState } from 'react';
import { Users, Copy, Check, Share2, Gift, ChevronRight, Mail, MessageSquare } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

const REFERRALS = [
  { id: 'r1', name: 'James Wilson',    email: 'james.w@email.com',  status: 'active',  reward: 250, joinedAt: '2025-05-20' },
  { id: 'r2', name: 'Priya Patel',     email: 'priya.p@email.com',  status: 'pending', reward: 0,   joinedAt: '2025-06-01' },
  { id: 'r3', name: 'Carlos Mendez',   email: 'c.mendez@email.com', status: 'active',  reward: 250, joinedAt: '2025-04-10' },
];

const STEPS = [
  { n: '01', title: 'Share your link',     desc: 'Copy your unique referral link and share it with friends and family.' },
  { n: '02', title: 'They sign up',        desc: 'Your friend creates an account and purchases any active policy.' },
  { n: '03', title: 'Both earn rewards',   desc: 'You get 250 points and they get a $25 discount on their first premium.' },
];

export const Referral = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const referralCode = `INS-${(user?.name?.split(' ')[0] ?? 'USER').toUpperCase()}-2025`;
  const referralLink = `https://insurai.com/join?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    success('Link copied!', 'Your referral link is ready to share.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    success('Invitation sent!', `An invite has been sent to ${emailInput}.`);
    setEmailInput('');
  };

  const totalEarned   = REFERRALS.filter((r) => r.status === 'active').reduce((s, r) => s + r.reward, 0);
  const activeCount   = REFERRALS.filter((r) => r.status === 'active').length;
  const _pendingCount = REFERRALS.filter((r) => r.status === 'pending').length; void _pendingCount;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="text-[#10B981]" size={24} /> Refer & Earn
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Invite friends. When they join, you both earn rewards.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Referred', value: REFERRALS.length },
          { label: 'Active Referrals', value: activeCount },
          { label: 'Points Earned', value: totalEarned },
        ].map((s) => (
          <GlassPanel key={s.label} className="text-center">
            <p className="text-2xl font-bold text-white tabular-nums">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">{s.label}</p>
          </GlassPanel>
        ))}
      </div>

      {/* How it works */}
      <GlassPanel>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.n} className="flex items-start gap-3">
              <span className="text-2xl font-black text-[#10B981]/30 shrink-0 leading-none font-mono">{step.n}</span>
              <div>
                <p className="text-sm font-bold text-gray-200">{step.title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="hidden sm:block shrink-0 text-gray-700 mt-1 ml-auto" size={16} />
              )}
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Share Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassPanel className="space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Your Referral Link</h2>

          <div className="flex gap-2">
            <div className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-[#10B981] font-mono truncate flex items-center">
              {referralLink}
            </div>
            <Button
              size="sm"
              variant={copied ? 'secondary' : 'primary'}
              onClick={handleCopy}
              leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}
              className="shrink-0"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="font-bold text-gray-500">Code:</span>
            <code className="bg-white/5 px-2 py-0.5 rounded font-mono">{referralCode}</code>
          </div>

          <div className="border-t border-white/[0.06] pt-4">
            <p className="text-xs text-gray-500 mb-3 font-semibold">Share via</p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Mail size={14} />}
                onClick={() => window.open(`mailto:?subject=Join INSURAI&body=Use my referral link: ${referralLink}`)}
              >
                Email
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<MessageSquare size={14} />}
                onClick={() => success('Copied for SMS', 'Paste in your messaging app.')}
              >
                SMS
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Share2 size={14} />}
                onClick={handleCopy}
              >
                More
              </Button>
            </div>
          </div>
        </GlassPanel>

        {/* Email Invite */}
        <GlassPanel className="space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Invite by Email</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Send a personalised invite directly. We'll email them with your referral link and a $25 first-premium discount.
          </p>
          <form onSubmit={handleEmailInvite} className="space-y-3">
            <Input
              type="email"
              placeholder="friend@email.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              leftIcon={<Mail size={14} />}
              required
            />
            <Button type="submit" className="w-full" leftIcon={<Gift size={14} />}>
              Send Invitation
            </Button>
          </form>

          <div className="p-3 rounded-lg bg-[#10B981]/5 border border-[#10B981]/15 text-xs text-[#10B981]">
            🎁 Both you and your friend earn rewards when they activate their first policy.
          </div>
        </GlassPanel>
      </div>

      {/* Referral List */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Your Referrals</h2>
        <GlassPanel>
          <div className="divide-y divide-white/[0.04]">
            {REFERRALS.map((ref) => (
              <div key={ref.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                    {ref.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{ref.name}</p>
                    <p className="text-xs text-gray-600">{ref.email} · Joined {ref.joinedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {ref.reward > 0 && (
                    <span className="text-sm font-bold text-[#10B981] tabular-nums">+{ref.reward} pts</span>
                  )}
                  <span className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-bold uppercase border',
                    ref.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  )}>
                    {ref.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
