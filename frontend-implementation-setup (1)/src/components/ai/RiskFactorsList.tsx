import { RiskFactor } from '@/types';
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/cn';

const categoryColors: Record<string, string> = {
  behavioral: '#8B5CF6',
  financial: '#F59E0B',
  historical: '#3B82F6',
  document: '#EF4444',
  pattern: '#EC4899',
};

const impactColors: Record<string, { text: string; bg: string }> = {
  high: { text: 'text-red-400', bg: 'bg-red-500/10' },
  medium: { text: 'text-amber-400', bg: 'bg-amber-500/10' },
  low: { text: 'text-blue-400', bg: 'bg-blue-500/10' },
};

export const RiskFactorsList = ({ factors }: { factors: RiskFactor[] }) => {
  if (factors.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-400">No Risk Factors Detected</p>
          <p className="text-xs text-gray-500 mt-0.5">This claim exhibits no anomalous patterns.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2">
        <AlertCircle size={11} />
        Risk Indicators ({factors.length})
      </h4>

      {factors.map((factor) => {
        const impact = impactColors[factor.impact] || impactColors.low;
        const catColor = categoryColors[factor.category] || '#6B7280';

        return (
          <div
            key={factor.id}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <div className={cn('mt-0.5 p-1 rounded-md shrink-0', impact.bg)}>
                  <TrendingUp size={12} className={impact.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-gray-200">{factor.name}</p>
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border"
                      style={{
                        color: catColor,
                        backgroundColor: `${catColor}15`,
                        borderColor: `${catColor}30`,
                      }}
                    >
                      {factor.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{factor.description}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={cn('text-sm font-mono font-bold', impact.text)}>
                  +{factor.score}
                </span>
                <p className="text-[9px] text-gray-600 uppercase">{factor.impact}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
