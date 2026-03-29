import { useState } from 'react';
import { Star, Gift, Trophy, Zap, Shield, Heart, Car, Home, Award, Flame } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Leaderboard } from '@/components/ui/Leaderboard';
import { Challenges } from '@/components/ui/Challenges';
import { Streaks } from '@/components/ui/Streaks';
import { DailyTasks } from '@/components/ui/DailyTasks';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

// ─── Data ────────────────────────────────────────────────────────────────────
const TIERS = [
  { name: 'Bronze',   min: 0,    max: 999,  color: 'text-amber-600',  bg: 'bg-amber-600/10 border-amber-600/20',   icon: Shield },
  { name: 'Silver',   min: 1000, max: 2499, color: 'text-gray-300',   bg: 'bg-gray-400/10  border-gray-400/20',    icon: Star },
  { name: 'Gold',     min: 2500, max: 4999, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: Trophy },
  { name: 'Platinum', min: 5000, max: Infinity, color: 'text-cyan-300',bg: 'bg-cyan-400/10 border-cyan-400/20',   icon: Award },
];

const BADGES = [
  { id: 'safe_driver',  label: 'Safe Driver',   icon: Car,    desc: 'No at-fault claims for 12 months', earned: true,  color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'loyal',        label: 'Loyal Member',  icon: Heart,  desc: 'Active member for 1+ year',        earned: true,  color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  { id: 'home_hero',    label: 'Home Hero',     icon: Home,   desc: 'Active home insurance policy',     earned: true,  color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'fast_filer',   label: 'Fast Filer',    icon: Zap,    desc: 'Submitted complete claim docs',    earned: false, color: 'text-gray-600 bg-gray-500/5 border-gray-500/10' },
  { id: 'bundle_boss',  label: 'Bundle Boss',   icon: Gift,   desc: 'Holds 3+ active policies',        earned: false, color: 'text-gray-600 bg-gray-500/5 border-gray-500/10' },
  { id: 'top_saver',    label: 'Top Saver',     icon: Trophy, desc: 'Saved $500+ through discounts',   earned: false, color: 'text-gray-600 bg-gray-500/5 border-gray-500/10' },
];

const HISTORY = [
  { id: 'h1', desc: 'Premium payment on time',         points: +50,  date: '2025-06-01' },
  { id: 'h2', desc: 'Profile completed (100%)',         points: +100, date: '2025-05-28' },
  { id: 'h3', desc: 'Referral bonus — James W.',        points: +250, date: '2025-05-20' },
  { id: 'h4', desc: 'Claim filed & approved',           points: +75,  date: '2025-05-10' },
  { id: 'h5', desc: 'Annual renewal discount applied',  points: +150, date: '2025-04-15' },
  { id: 'h6', desc: 'Redeemed: $20 premium discount',  points: -200, date: '2025-04-01' },
];

const REWARDS_STORE = [
  { id: 'r1', label: '$10 Premium Discount',         cost: 100, icon: Gift },
  { id: 'r2', label: '$25 Premium Discount',         cost: 250, icon: Gift },
  { id: 'r3', label: '$50 Premium Discount',         cost: 500, icon: Gift },
  { id: 'r4', label: 'Free Roadside Assist (1 yr)',  cost: 750, icon: Car },
];

type RewardTab = 'overview' | 'challenges' | 'streaks' | 'leaderboard' | 'tasks';

// ─── Component ────────────────────────────────────────────────────────────────
export const Rewards = () => {
  const { success } = useToast();
  const [tab, setTab] = useState<RewardTab>('overview');

  const totalPoints = HISTORY.reduce((sum, h) => sum + h.points, 0); // 425
  const currentTier = TIERS.find((t) => totalPoints >= t.min && totalPoints <= t.max) ?? TIERS[0];
  const nextTier    = TIERS[TIERS.indexOf(currentTier) + 1];
  const progress    = nextTier
    ? Math.round(((totalPoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100)
    : 100;

  const TierIcon = currentTier.icon;

  const handleRedeem = (label: string, cost: number) => {
    if (totalPoints < cost) return;
    success(`Redeemed: ${label}`, `${cost} points deducted from your balance.`);
  };

  const TABS: { id: RewardTab; label: string; icon: typeof Trophy }[] = [
    { id: 'overview',     label: 'Overview',    icon: Trophy },
    { id: 'challenges',   label: 'Challenges',  icon: Zap },
    { id: 'streaks',      label: 'Streaks',     icon: Flame },
    { id: 'leaderboard',  label: 'Leaderboard', icon: Award },
    { id: 'tasks',        label: 'Daily Tasks', icon: Star },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="text-yellow-400" size={24} /> Rewards & Loyalty
        </h1>
        <p className="text-sm text-gray-500 mt-1">Earn points, complete challenges, climb the leaderboard.</p>
      </div>

      {/* Tier Card — always visible */}
      <GlassPanel className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={cn('p-4 rounded-2xl border', currentTier.bg)}>
              <TierIcon className={currentTier.color} size={28} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Current Tier</p>
              <h2 className={cn('text-2xl font-bold', currentTier.color)}>{currentTier.name}</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                <span className="font-bold text-white tabular-nums">{totalPoints.toLocaleString()}</span> points
              </p>
            </div>
          </div>
          {nextTier && (
            <div className="flex-1 max-w-xs w-full">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>{currentTier.name}</span>
                <span className={cn('font-bold', TIERS[TIERS.indexOf(currentTier) + 1]?.color)}>{nextTier.name}</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1.5">
                {(nextTier.min - totalPoints).toLocaleString()} more points to {nextTier.name}
              </p>
            </div>
          )}
        </div>
      </GlassPanel>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] flex-wrap">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all flex-1 justify-center',
                tab === t.id
                  ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
              )}
            >
              <Icon size={13} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ── Overview ── */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Badges + Redeem */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Tasks quick panel */}
            <DailyTasks />

            {/* Badges */}
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Achievement Badges</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {BADGES.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.id}
                      className={cn(
                        'p-4 rounded-xl border text-center flex flex-col items-center gap-2 transition-opacity',
                        badge.earned ? badge.color : 'text-gray-700 bg-white/[0.02] border-white/5 opacity-50'
                      )}
                    >
                      <Icon size={24} />
                      <p className="text-xs font-bold">{badge.label}</p>
                      <p className="text-[10px] text-center opacity-70 leading-relaxed">{badge.desc}</p>
                      {badge.earned && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 uppercase tracking-widest">Earned</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Redeem */}
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Redeem Points</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {REWARDS_STORE.map((item) => {
                  const Icon = item.icon;
                  const canAfford = totalPoints >= item.cost;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#10B981]/10">
                          <Icon size={16} className="text-[#10B981]" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-200">{item.label}</p>
                          <p className={cn('text-[10px] font-bold', canAfford ? 'text-[#10B981]' : 'text-gray-600')}>
                            {item.cost.toLocaleString()} pts
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={canAfford ? 'primary' : 'secondary'}
                        disabled={!canAfford}
                        onClick={() => handleRedeem(item.label, item.cost)}
                        className="text-xs px-3 h-7"
                      >
                        {canAfford ? 'Redeem' : 'Need more'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Points History */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Points History</h2>
            <GlassPanel className="divide-y divide-white/[0.04]">
              {HISTORY.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-xs text-gray-300 leading-snug">{entry.desc}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">{entry.date}</p>
                  </div>
                  <span className={cn('text-sm font-bold tabular-nums ml-3 shrink-0', entry.points > 0 ? 'text-[#10B981]' : 'text-red-400')}>
                    {entry.points > 0 ? `+${entry.points}` : entry.points}
                  </span>
                </div>
              ))}
            </GlassPanel>
            <div className="p-4 rounded-xl bg-[#10B981]/5 border border-[#10B981]/20 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available</span>
              <span className="text-xl font-bold text-[#10B981] tabular-nums">{totalPoints.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Other tabs delegate to sub-components ── */}
      {tab === 'challenges'  && <Challenges />}
      {tab === 'streaks'     && <Streaks />}
      {tab === 'leaderboard' && <Leaderboard />}
      {tab === 'tasks'       && (
        <div className="max-w-lg">
          <DailyTasks />
        </div>
      )}
    </div>
  );
};
