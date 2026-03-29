import { useState } from 'react';
import { Trophy, Car, DollarSign, Star, Crown, Medal } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/utils/cn';

type Category = 'safest' | 'savers' | 'loyal';

const LEADERBOARD_DATA: Record<Category, { rank: number; name: string; value: string; avatar: string; isYou?: boolean }[]> = {
  safest: [
    { rank: 1, name: 'Sarah M.',     value: '3 yrs claim-free', avatar: 'SM' },
    { rank: 2, name: 'James K.',     value: '2.5 yrs clean',    avatar: 'JK' },
    { rank: 3, name: 'Maruthi R.',   value: '2 yrs claim-free', avatar: 'MR', isYou: true },
    { rank: 4, name: 'Emily T.',     value: '18 mo clean',      avatar: 'ET' },
    { rank: 5, name: 'Robert L.',    value: '14 mo clean',      avatar: 'RL' },
  ],
  savers: [
    { rank: 1, name: 'Diana P.',    value: '$1,240 saved',   avatar: 'DP' },
    { rank: 2, name: 'Chris B.',    value: '$980 saved',     avatar: 'CB' },
    { rank: 3, name: 'Anna W.',     value: '$870 saved',     avatar: 'AW' },
    { rank: 4, name: 'Maruthi R.', value: '$640 saved',     avatar: 'MR', isYou: true },
    { rank: 5, name: 'Mark D.',    value: '$510 saved',     avatar: 'MD' },
  ],
  loyal: [
    { rank: 1, name: 'Helen K.',    value: '8 years member',  avatar: 'HK' },
    { rank: 2, name: 'Tom S.',      value: '6 years member',  avatar: 'TS' },
    { rank: 3, name: 'Grace L.',    value: '5 years member',  avatar: 'GL' },
    { rank: 4, name: 'Maruthi R.', value: '3 years member',  avatar: 'MR', isYou: true },
    { rank: 5, name: 'Paul R.',     value: '2 years member',  avatar: 'PR' },
  ],
};

const CATEGORIES = [
  { id: 'safest' as Category, label: 'Safest Drivers',  icon: Car },
  { id: 'savers' as Category, label: 'Top Savers',      icon: DollarSign },
  { id: 'loyal'  as Category, label: 'Most Loyal',      icon: Star },
];

const rankConfig = [
  { icon: Crown, color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  { icon: Medal, color: 'text-gray-300  bg-gray-300/10  border-gray-300/20' },
  { icon: Medal, color: 'text-amber-600 bg-amber-600/10 border-amber-600/20' },
];

export const Leaderboard = () => {
  const [active, setActive] = useState<Category>('safest');
  const entries = LEADERBOARD_DATA[active];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="text-yellow-400" size={22} />
        <div>
          <h2 className="text-lg font-bold text-white">Leaderboard</h2>
          <p className="text-xs text-gray-500">See how you rank among policyholders.</p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all',
                active === cat.id
                  ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
                  : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:text-white hover:border-white/10'
              )}
            >
              <Icon size={14} /> {cat.label}
            </button>
          );
        })}
      </div>

      {/* Rankings */}
      <GlassPanel className="space-y-2">
        {entries.map((entry) => {
          const cfg = rankConfig[entry.rank - 1];
          const RankIcon = cfg?.icon ?? Trophy;
          return (
            <div
              key={entry.rank}
              className={cn(
                'flex items-center gap-4 p-3 rounded-xl transition-colors',
                entry.isYou
                  ? 'bg-[#10B981]/[0.07] border border-[#10B981]/20'
                  : 'hover:bg-white/[0.03]'
              )}
            >
              {/* Rank */}
              <div className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold',
                cfg ? cfg.color : 'bg-white/5 border-white/10 text-gray-500'
              )}>
                {entry.rank <= 3 ? <RankIcon size={14} /> : <span>{entry.rank}</span>}
              </div>

              {/* Avatar */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#10B981]/15 text-[#10B981] text-xs font-bold">
                {entry.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-200 truncate">
                  {entry.name}
                  {entry.isYou && (
                    <span className="ml-2 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981]">
                      You
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">{entry.value}</p>
              </div>
            </div>
          );
        })}
      </GlassPanel>

      <p className="text-center text-xs text-gray-600">
        Rankings update weekly · Based on anonymised data
      </p>
    </div>
  );
};
