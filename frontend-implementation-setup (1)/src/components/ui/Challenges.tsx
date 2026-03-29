import { useState } from 'react';
import { Zap, CheckCircle2, Clock, Gift, Lock } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

type ChallengeStatus = 'completed' | 'active' | 'locked';
type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  status: ChallengeStatus;
  difficulty: ChallengeDifficulty;
  endsIn: string;
  category: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'c1', title: 'On-Time Streak',
    description: 'Make 3 consecutive on-time payments.',
    reward: 150, progress: 2, total: 3, status: 'active',
    difficulty: 'easy', endsIn: '12 days', category: 'Payments',
  },
  {
    id: 'c2', title: 'Document Pro',
    description: 'Upload all required documents for a claim within 24 hours of filing.',
    reward: 200, progress: 0, total: 1, status: 'active',
    difficulty: 'medium', endsIn: '30 days', category: 'Claims',
  },
  {
    id: 'c3', title: 'Policy Explorer',
    description: 'View and compare all your active policy details.',
    reward: 75, progress: 3, total: 3, status: 'completed',
    difficulty: 'easy', endsIn: 'Done', category: 'Policies',
  },
  {
    id: 'c4', title: 'Referral Champion',
    description: 'Successfully refer 3 friends who activate a policy.',
    reward: 500, progress: 1, total: 3, status: 'active',
    difficulty: 'hard', endsIn: '60 days', category: 'Referrals',
  },
  {
    id: 'c5', title: 'Bundle Master',
    description: 'Hold 3 or more active policies simultaneously.',
    reward: 300, progress: 2, total: 3, status: 'active',
    difficulty: 'hard', endsIn: 'Ongoing', category: 'Policies',
  },
  {
    id: 'c6', title: 'Safety Star',
    description: 'Complete 12 months without an at-fault claim.',
    reward: 400, progress: 0, total: 12, status: 'locked',
    difficulty: 'hard', endsIn: '—', category: 'Safety',
  },
];

const difficultyConfig: Record<ChallengeDifficulty, { label: string; color: string }> = {
  easy:   { label: 'Easy',   color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  medium: { label: 'Medium', color: 'text-amber-400   bg-amber-500/10   border-amber-500/20' },
  hard:   { label: 'Hard',   color: 'text-red-400     bg-red-500/10     border-red-500/20' },
};

export const Challenges = () => {
  const { success } = useToast();
  const [claimed, setClaimed] = useState<string[]>([]);

  const handleClaim = (c: Challenge) => {
    if (claimed.includes(c.id)) return;
    setClaimed((prev) => [...prev, c.id]);
    success(`🎉 +${c.reward} pts`, `Challenge "${c.title}" reward claimed!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Zap className="text-[#10B981]" size={22} />
        <div>
          <h2 className="text-lg font-bold text-white">Challenges</h2>
          <p className="text-xs text-gray-500">Complete tasks to earn bonus points and badges.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CHALLENGES.map((c) => {
          const pct       = Math.round((c.progress / c.total) * 100);
          const diff      = difficultyConfig[c.difficulty];
          const isClaimed = claimed.includes(c.id);

          return (
            <GlassPanel
              key={c.id}
              className={cn(
                'space-y-4',
                c.status === 'completed' && 'border-[#10B981]/20',
                c.status === 'locked'    && 'opacity-50'
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest', diff.color)}>
                      {diff.label}
                    </span>
                    <span className="text-[10px] text-gray-600 uppercase font-semibold tracking-widest">{c.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{c.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{c.description}</p>
                </div>

                {/* Status icon */}
                <div className="shrink-0">
                  {c.status === 'completed' ? (
                    <CheckCircle2 className="text-[#10B981]" size={20} />
                  ) : c.status === 'locked' ? (
                    <Lock className="text-gray-600" size={18} />
                  ) : (
                    <Clock className="text-amber-400" size={18} />
                  )}
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                  <span>{c.progress} / {c.total} {c.status === 'completed' ? 'Complete' : 'Progress'}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-700',
                      c.status === 'completed' ? 'bg-[#10B981]' : 'bg-gradient-to-r from-amber-400 to-amber-500'
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Gift size={14} className="text-[#10B981]" />
                  <span className="font-bold text-[#10B981]">+{c.reward} pts</span>
                  {c.status !== 'completed' && (
                    <span className="text-gray-600">· Ends in {c.endsIn}</span>
                  )}
                </div>

                {c.status === 'completed' && (
                  <Button
                    size="sm"
                    variant={isClaimed ? 'secondary' : 'primary'}
                    disabled={isClaimed}
                    onClick={() => handleClaim(c)}
                    className="text-xs h-7 px-3"
                  >
                    {isClaimed ? '✓ Claimed' : 'Claim Reward'}
                  </Button>
                )}
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
};
