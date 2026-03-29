import { useState } from 'react';
import { Calculator, LayoutGrid } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { QuoteCalculator } from '@/components/ui/QuoteCalculator';
import { PolicyComparison } from '@/components/ui/PolicyComparison';
import { cn } from '@/utils/cn';
import { useToast } from '@/context/ToastContext';

type View = 'calculator' | 'comparison';

export const Quote = () => {
  const [view, setView] = useState<View>('calculator');
  const { success } = useToast();

  const handlePlanSelect = (planId: string) => {
    success('Plan Selected', `You selected the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan. Continue to purchase.`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Get a Quote</h1>
        <p className="text-sm text-gray-500 mt-1">Compare plans or get a personalised instant quote.</p>
      </div>

      {/* View toggle */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] gap-1">
          <button
            onClick={() => setView('calculator')}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all',
              view === 'calculator'
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            <Calculator size={15} /> Quote Calculator
          </button>
          <button
            onClick={() => setView('comparison')}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all',
              view === 'comparison'
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            <LayoutGrid size={15} /> Compare Plans
          </button>
        </div>
      </div>

      {/* Content */}
      <GlassPanel>
        {view === 'calculator' ? (
          <QuoteCalculator />
        ) : (
          <PolicyComparison onSelect={handlePlanSelect} />
        )}
      </GlassPanel>

      {/* Trust badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'No Commitment', desc: 'Cancel anytime' },
          { label: 'Instant Coverage', desc: 'Active same day' },
          { label: 'Secure & Private', desc: 'Your data is safe' },
          { label: '24/7 Support', desc: 'We\'re always here' },
        ].map((item) => (
          <div key={item.label} className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs font-bold text-gray-300">{item.label}</p>
            <p className="text-[10px] text-gray-600 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
