import { useState } from 'react';
import { CheckSquare, Square, Zap, RefreshCw } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

interface Task {
  id: string;
  label: string;
  points: number;
  link?: string;
}

const INITIAL_TASKS: Task[] = [
  { id: 't1', label: 'Log in to your account today',                points: 5,   link: '' },
  { id: 't2', label: 'Review your active policy details',           points: 10,  link: '/customer/policies' },
  { id: 't3', label: 'Check your upcoming payment schedule',        points: 10,  link: '/customer/payments' },
  { id: 't4', label: 'View your current rewards balance',           points: 5,   link: '/customer/rewards' },
  { id: 't5', label: 'Open the Coverage Calculator tool',           points: 15,  link: '/customer/calculator' },
  { id: 't6', label: 'Read one article in the Education Hub',       points: 20,  link: '/customer/learn' },
];

export const DailyTasks = () => {
  const { success } = useToast();
  const [completed, setCompleted] = useState<string[]>(['t1']); // login already done

  const toggle = (task: Task) => {
    if (completed.includes(task.id)) return;
    setCompleted((prev) => [...prev, task.id]);
    success(`+${task.points} pts`, `"${task.label}" completed!`);
  };

  const totalEarned = INITIAL_TASKS.filter((t) => completed.includes(t.id)).reduce((s, t) => s + t.points, 0);
  const totalPossible = INITIAL_TASKS.reduce((s, t) => s + t.points, 0);
  const pct = Math.round((totalEarned / totalPossible) * 100);

  const now = new Date();
  const resetTime = new Date(now);
  resetTime.setHours(24, 0, 0, 0);
  const hoursLeft = Math.ceil((resetTime.getTime() - now.getTime()) / 3_600_000);

  return (
    <GlassPanel className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-[#10B981]" size={18} />
          <h3 className="text-sm font-bold text-white">Daily Tasks</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
          <RefreshCw size={10} />
          <span>Resets in {hoursLeft}h</span>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
          <span>{totalEarned} / {totalPossible} pts today</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-teal-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {INITIAL_TASKS.map((task) => {
          const done = completed.includes(task.id);
          return (
            <button
              key={task.id}
              onClick={() => toggle(task)}
              disabled={done}
              className={cn(
                'w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all',
                done
                  ? 'bg-[#10B981]/[0.06] border-[#10B981]/20 opacity-70 cursor-default'
                  : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10 cursor-pointer'
              )}
            >
              {done
                ? <CheckSquare size={16} className="text-[#10B981] shrink-0" />
                : <Square      size={16} className="text-gray-600 shrink-0" />
              }
              <span className={cn('flex-1 text-xs', done ? 'text-gray-400 line-through' : 'text-gray-200')}>
                {task.label}
              </span>
              <span className={cn('text-[10px] font-bold shrink-0', done ? 'text-[#10B981]' : 'text-gray-600')}>
                +{task.points}
              </span>
            </button>
          );
        })}
      </div>

      {/* Completion banner */}
      {completed.length === INITIAL_TASKS.length && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20">
          <Zap size={16} className="text-[#10B981]" />
          <p className="text-xs font-semibold text-[#10B981]">All tasks complete! Bonus 2× multiplier applied. 🎉</p>
        </div>
      )}
    </GlassPanel>
  );
};
