import { AIAnalysis } from '@/types';
import { Brain, ShieldAlert, ShieldCheck, Zap, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatRelativeTime } from '@/utils/formatters';

const recommendationConfig = {
  approve: {
    icon: ShieldCheck,
    color: '#10B981',
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/20',
    title: 'Looks Good',
    description: 'Risk score is within normal range. No major issues detected.',
  },
  review: {
    icon: Zap,
    color: '#3B82F6',
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/20',
    title: 'Needs a Review',
    description: 'Some risk indicators found. A manual review is suggested before processing.',
  },
  investigate: {
    icon: ShieldAlert,
    color: '#F59E0B',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    title: 'Further Check Needed',
    description: 'This claim has patterns that may need a closer look. Please verify the details.',
  },
  reject: {
    icon: ShieldAlert,
    color: '#EF4444',
    bg: 'bg-red-500/5',
    border: 'border-red-500/20',
    title: 'High Risk',
    description: 'Multiple risk indicators found. Consider rejecting or investigating further.',
  },
};

export const AIInsightCard = ({ analysis }: { analysis: AIAnalysis }) => {
  const cfg = recommendationConfig[analysis.recommendation];
  const Icon = cfg.icon;

  return (
    <div className={cn('rounded-xl border p-5 animate-fade-in', cfg.bg, cfg.border)}>
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
          style={{ backgroundColor: `${cfg.color}20` }}
        >
          <Icon size={16} style={{ color: cfg.color }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Brain size={11} className="text-gray-600" />
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">AI Summary</p>
          </div>
          <p className="text-sm font-bold text-gray-100 leading-tight">{cfg.title}</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed mb-5">{cfg.description}</p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-4">
        <div>
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter mb-1">Confidence</p>
          <p className="text-base font-mono font-bold text-gray-100">{analysis.confidence}%</p>
          <div className="mt-1 h-1 w-full rounded-full bg-white/[0.06]">
            <div
              className="h-1 rounded-full transition-all"
              style={{ width: `${analysis.confidence}%`, backgroundColor: cfg.color }}
            />
          </div>
        </div>
        <div>
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter mb-1">Fraud Prob.</p>
          <p className="text-base font-mono font-bold" style={{ color: cfg.color }}>
            {analysis.fraudProbability}%
          </p>
          <div className="mt-1 h-1 w-full rounded-full bg-white/[0.06]">
            <div
              className="h-1 rounded-full transition-all"
              style={{ width: `${analysis.fraudProbability}%`, backgroundColor: cfg.color }}
            />
          </div>
        </div>
        <div>
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter mb-1">Model</p>
          <p className="text-sm font-mono font-bold text-gray-200">{analysis.modelVersion}</p>
          <p className="text-[9px] text-gray-600 mt-1">{analysis.processingTimeMs}ms</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-1.5 text-[10px] text-gray-600">
        <Clock size={10} />
        <span>Analyzed {formatRelativeTime(analysis.analyzedAt)}</span>
      </div>
    </div>
  );
};
