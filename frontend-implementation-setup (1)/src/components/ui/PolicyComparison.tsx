import { useState } from 'react';
import { Check, X, Star, Zap, Shield, Crown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatters';

interface PlanFeature {
  name: string;
  basic: boolean | string;
  premium: boolean | string;
  elite: boolean | string;
}

interface Plan {
  id: string;
  name: string;
  icon: typeof Shield;
  monthlyPrice: number;
  annualPrice: number;
  coverage: number;
  deductible: number;
  color: string;
  highlight?: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    icon: Shield,
    monthlyPrice: 150,
    annualPrice: 1620,
    coverage: 50000,
    deductible: 1000,
    color: 'border-white/10',
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: Star,
    monthlyPrice: 250,
    annualPrice: 2700,
    coverage: 100000,
    deductible: 500,
    color: 'border-[#10B981]/40',
    highlight: true,
    badge: 'Recommended',
  },
  {
    id: 'elite',
    name: 'Elite',
    icon: Crown,
    monthlyPrice: 400,
    annualPrice: 4320,
    coverage: 250000,
    deductible: 0,
    color: 'border-purple-500/30',
  },
];

const FEATURES: PlanFeature[] = [
  { name: 'Collision Coverage', basic: true, premium: true, elite: true },
  { name: 'Theft Protection', basic: true, premium: true, elite: true },
  { name: 'Roadside Assistance', basic: false, premium: true, elite: true },
  { name: 'Rental Car Coverage', basic: false, premium: true, elite: true },
  { name: 'Gap Insurance', basic: false, premium: false, elite: true },
  { name: 'New Car Replacement', basic: false, premium: false, elite: true },
  { name: 'Claim-Free Discount', basic: '5%', premium: '10%', elite: '15%' },
  { name: 'Claims Support', basic: 'Standard', premium: 'Priority', elite: '24/7 Dedicated' },
];

interface PolicyComparisonProps {
  onSelect?: (planId: string) => void;
}

export const PolicyComparison = ({ onSelect }: PolicyComparisonProps) => {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelect = (planId: string) => {
    setSelectedPlan(planId);
    onSelect?.(planId);
  };

  const renderFeatureValue = (val: boolean | string) => {
    if (typeof val === 'boolean') {
      return val
        ? <Check size={14} className="text-[#10B981]" />
        : <X size={14} className="text-gray-600" />;
    }
    return <span className="text-xs text-gray-300 font-medium">{val}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Billing toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
          <button
            onClick={() => setBilling('monthly')}
            className={cn(
              'px-4 py-1.5 rounded-md text-xs font-medium transition-all',
              billing === 'monthly' ? 'bg-[#10B981] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={cn(
              'px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5',
              billing === 'annual' ? 'bg-[#10B981] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
            )}
          >
            Annual
            <span className="text-[9px] bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">Save 10%</span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const price = billing === 'monthly' ? plan.monthlyPrice : Math.round(plan.annualPrice / 12);
          const isSelected = selectedPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-xl border p-5 transition-all duration-200 cursor-pointer',
                plan.highlight ? 'bg-[#10B981]/[0.04]' : 'bg-white/[0.02]',
                plan.color,
                isSelected && 'ring-2 ring-[#10B981] ring-offset-2 ring-offset-[#0A0F1A]',
                'hover:border-white/20'
              )}
              onClick={() => handleSelect(plan.id)}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#10B981] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#10B981]/30">
                    <Zap size={10} /> {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <div className={cn('p-2 rounded-lg', plan.highlight ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-white/[0.05] text-gray-400')}>
                  <Icon size={16} />
                </div>
                <h3 className="font-bold text-gray-200">{plan.name}</h3>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white tabular-nums">${price}</span>
                  <span className="text-xs text-gray-500">/mo</span>
                </div>
                {billing === 'annual' && (
                  <p className="text-[10px] text-[#10B981] mt-0.5">Billed annually (${plan.annualPrice}/yr)</p>
                )}
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Coverage</span>
                  <span className="text-gray-200 font-medium">{formatCurrency(plan.coverage, true)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Deductible</span>
                  <span className="text-gray-200 font-medium">{plan.deductible === 0 ? '$0' : formatCurrency(plan.deductible, true)}</span>
                </div>
              </div>

              <button
                onClick={() => handleSelect(plan.id)}
                className={cn(
                  'mt-auto w-full py-2 rounded-lg text-xs font-bold transition-all',
                  isSelected
                    ? 'bg-[#10B981] text-white'
                    : plan.highlight
                    ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981]/30'
                    : 'bg-white/[0.05] text-gray-400 border border-white/[0.08] hover:bg-white/[0.08]'
                )}
              >
                {isSelected ? '✓ Selected' : `Choose ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Feature comparison table */}
      <div className="rounded-xl border border-white/[0.08] overflow-hidden">
        <div className="grid grid-cols-4 gap-0 bg-white/[0.03] border-b border-white/[0.08]">
          <div className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Feature</div>
          {PLANS.map((p) => (
            <div key={p.id} className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
              {p.name}
            </div>
          ))}
        </div>
        {FEATURES.map((feature, idx) => (
          <div
            key={feature.name}
            className={cn('grid grid-cols-4 gap-0 border-b border-white/[0.04] last:border-0', idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]')}
          >
            <div className="px-4 py-3 text-xs text-gray-400">{feature.name}</div>
            <div className="px-4 py-3 flex items-center justify-center">{renderFeatureValue(feature.basic)}</div>
            <div className="px-4 py-3 flex items-center justify-center bg-[#10B981]/[0.02]">{renderFeatureValue(feature.premium)}</div>
            <div className="px-4 py-3 flex items-center justify-center">{renderFeatureValue(feature.elite)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
