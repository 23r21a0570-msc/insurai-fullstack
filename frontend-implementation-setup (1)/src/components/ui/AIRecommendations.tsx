import { Brain, ArrowRight, X, TrendingUp, Shield, DollarSign, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';

type RecType = 'savings' | 'coverage' | 'payment' | 'risk';

interface Recommendation {
  id: string;
  type: RecType;
  title: string;
  description: string;
  cta: string;
  link: string;
  impact: string;
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'r1', type: 'savings',
    title: 'Bundle & Save $45/month',
    description: 'You have Auto and Health policies separately. Bundling them qualifies you for an 18% multi-policy discount.',
    cta: 'Explore Bundle', link: '/customer/policy-management',
    impact: '-$540/yr',
  },
  {
    id: 'r2', type: 'coverage',
    title: 'Your Home Coverage May Be Insufficient',
    description: 'Based on recent property value trends in your area, your current $250K coverage could be under-insured by ~22%.',
    cta: 'Review Coverage', link: '/customer/policy-management',
    impact: '+$75K coverage',
  },
  {
    id: 'r3', type: 'payment',
    title: 'Switch to Annual Billing — Save 10%',
    description: 'You\'re currently on monthly billing. Switching to annual for your Auto policy saves $195 immediately.',
    cta: 'Switch to Annual', link: '/customer/payments',
    impact: '-$195/yr',
  },
  {
    id: 'r4', type: 'risk',
    title: 'Add Roadside Assistance for $8/mo',
    description: 'Customers with your driving profile use roadside assistance 2× per year on average. Cover yourself before you need it.',
    cta: 'Add Add-on', link: '/customer/policy-management',
    impact: '$0 on breakdowns',
  },
];

const typeConfig: Record<RecType, { icon: typeof Brain; color: string; bg: string }> = {
  savings:  { icon: DollarSign,   color: 'text-[#10B981]', bg: 'bg-[#10B981]/10 border-[#10B981]/20' },
  coverage: { icon: Shield,       color: 'text-blue-400',  bg: 'bg-blue-500/10   border-blue-500/20' },
  payment:  { icon: TrendingUp,   color: 'text-amber-400', bg: 'bg-amber-500/10  border-amber-500/20' },
  risk:     { icon: AlertCircle,  color: 'text-purple-400',bg: 'bg-purple-500/10 border-purple-500/20' },
};

export const AIRecommendations = () => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState<string[]>([]);

  const visible = RECOMMENDATIONS.filter((r) => !dismissed.includes(r.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="text-purple-400" size={18} />
        <h3 className="text-sm font-bold text-white">AI Recommendations</h3>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
          {visible.length} new
        </span>
      </div>

      {visible.length === 0 ? (
        <GlassPanel>
          <p className="text-xs text-center text-gray-500 py-4">No new recommendations. Check back later!</p>
        </GlassPanel>
      ) : (
        <div className="space-y-3">
          {visible.map((rec) => {
            const cfg = typeConfig[rec.type];
            const Icon = cfg.icon;
            return (
              <GlassPanel key={rec.id} className="relative">
                <button
                  onClick={() => setDismissed((p) => [...p, rec.id])}
                  className="absolute top-3 right-3 p-1 rounded text-gray-600 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Dismiss"
                >
                  <X size={12} />
                </button>

                <div className="flex items-start gap-3 pr-6">
                  <div className={cn('p-2 rounded-lg border shrink-0', cfg.bg)}>
                    <Icon size={16} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{rec.description}</p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => navigate(rec.link)}
                        className={cn('flex items-center gap-1 text-xs font-semibold', cfg.color, 'hover:underline')}
                      >
                        {rec.cta} <ArrowRight size={12} />
                      </button>
                      <span className={cn('text-xs font-bold px-2 py-0.5 rounded border', cfg.bg, cfg.color)}>
                        {rec.impact}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      )}
    </div>
  );
};
