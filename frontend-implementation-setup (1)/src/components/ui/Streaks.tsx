import { Flame, CheckCircle2, Circle, Star, Calendar } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/utils/cn';

interface StreakItem {
  id: string;
  label: string;
  current: number;
  best: number;
  unit: string;
  icon: typeof Flame;
  iconColor: string;
  bgColor: string;
  days: boolean[]; // last 7 activity flags
}

const STREAKS: StreakItem[] = [
  {
    id: 's1',
    label: 'Payment Streak',
    current: 5, best: 12,
    unit: 'months on-time',
    icon: Flame,
    iconColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/20',
    days: [true, true, false, true, true, true, true],
  },
  {
    id: 's2',
    label: 'Login Streak',
    current: 7, best: 21,
    unit: 'consecutive days',
    icon: Star,
    iconColor: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10 border-yellow-500/20',
    days: [true, true, true, true, true, true, true],
  },
  {
    id: 's3',
    label: 'Claim-Free Streak',
    current: 18, best: 24,
    unit: 'months without a claim',
    icon: CheckCircle2,
    iconColor: 'text-[#10B981]',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    days: [true, true, true, true, true, true, true],
  },
];

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const Streaks = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Flame className="text-orange-400" size={22} />
        <div>
          <h2 className="text-lg font-bold text-white">Streaks</h2>
          <p className="text-xs text-gray-500">Keep your streaks alive to earn bonus multipliers.</p>
        </div>
      </div>

      <div className="space-y-4">
        {STREAKS.map((streak) => {
          const Icon = streak.icon;
          return (
            <GlassPanel key={streak.id} className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2.5 rounded-xl border', streak.bgColor)}>
                    <Icon className={streak.iconColor} size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{streak.label}</h3>
                    <p className="text-xs text-gray-500">{streak.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn('text-2xl font-bold tabular-nums', streak.iconColor)}>{streak.current}</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider">current</p>
                </div>
              </div>

              {/* 7-day activity grid */}
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2 font-bold">Last 7 Days</p>
                <div className="flex gap-1.5">
                  {streak.days.map((active, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      {active ? (
                        <div className={cn('w-full h-6 rounded-md border flex items-center justify-center', streak.bgColor)}>
                          <Icon size={10} className={streak.iconColor} />
                        </div>
                      ) : (
                        <div className="w-full h-6 rounded-md bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                          <Circle size={8} className="text-gray-700" />
                        </div>
                      )}
                      <p className="text-[9px] text-gray-700 font-medium">{DAY_LABELS[i]}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best streak */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar size={12} />
                  <span>Best ever: <span className="font-bold text-gray-300">{streak.best}</span> {streak.unit.split(' ').slice(-1)}</span>
                </div>
                {streak.current >= streak.best && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                    🏆 New Record!
                  </span>
                )}
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
};
