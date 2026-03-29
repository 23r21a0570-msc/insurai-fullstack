import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Star, RefreshCw } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

interface Competitor {
  name: string;
  logo: string;
  color: string;
  products: Record<string, { premium: number; coverage: number; rating: number; claimTime: number }>;
}

const OUR_PRODUCTS = {
  auto:     { premium: 1200, coverage: 150000, rating: 4.5, claimTime: 5 },
  home:     { premium: 1800, coverage: 350000, rating: 4.3, claimTime: 7 },
  health:   { premium: 3600, coverage: 100000, rating: 4.1, claimTime: 3 },
  life:     { premium: 900,  coverage: 500000, rating: 4.6, claimTime: 10 },
};

const COMPETITORS: Competitor[] = [
  {
    name: 'SafeGuard',
    logo: 'SG',
    color: 'text-blue-400',
    products: {
      auto:   { premium: 1350, coverage: 150000, rating: 4.2, claimTime: 7  },
      home:   { premium: 1950, coverage: 350000, rating: 4.0, claimTime: 9  },
      health: { premium: 3900, coverage: 100000, rating: 3.8, claimTime: 5  },
      life:   { premium: 1050, coverage: 500000, rating: 4.3, claimTime: 14 },
    },
  },
  {
    name: 'ClearPath',
    logo: 'CP',
    color: 'text-purple-400',
    products: {
      auto:   { premium: 1100, coverage: 125000, rating: 4.4, claimTime: 6  },
      home:   { premium: 1700, coverage: 300000, rating: 4.5, claimTime: 6  },
      health: { premium: 3300, coverage: 100000, rating: 4.3, claimTime: 4  },
      life:   { premium: 850,  coverage: 500000, rating: 4.1, claimTime: 12 },
    },
  },
  {
    name: 'TrustFirst',
    logo: 'TF',
    color: 'text-amber-400',
    products: {
      auto:   { premium: 1450, coverage: 175000, rating: 3.9, claimTime: 8  },
      home:   { premium: 2100, coverage: 400000, rating: 4.1, claimTime: 10 },
      health: { premium: 4200, coverage: 125000, rating: 3.6, claimTime: 6  },
      life:   { premium: 980,  coverage: 600000, rating: 4.4, claimTime: 11 },
    },
  },
];

const PRODUCT_TYPES = ['auto', 'home', 'health', 'life'] as const;
type ProductType = typeof PRODUCT_TYPES[number];

const formatPremium = (n: number) => `$${n.toLocaleString()}/yr`;
const formatCoverage = (n: number) => `$${(n / 1000).toFixed(0)}K`;
const formatDays = (n: number) => `${n}d avg`;

const DeltaIndicator = ({ ours, theirs, lower = false }: { ours: number; theirs: number; lower?: boolean }) => {
  const better = lower ? ours <= theirs : ours >= theirs;
  const pct = Math.abs(Math.round(((ours - theirs) / theirs) * 100));
  if (pct === 0) return <span className="flex items-center gap-0.5 text-[10px] text-gray-500"><Minus size={10} />Same</span>;
  return better
    ? <span className="flex items-center gap-0.5 text-[10px] text-emerald-400"><TrendingUp size={10} />+{pct}% better</span>
    : <span className="flex items-center gap-0.5 text-[10px] text-red-400"><TrendingDown size={10} />{pct}% worse</span>;
};

export const CompetitorBenchmark = () => {
  const { success } = useToast();
  const [activeProduct, setActiveProduct] = useState<ProductType>('auto');
  const [lastUpdated] = useState('Today, 9:32 AM');

  const ours = OUR_PRODUCTS[activeProduct];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Competitor Benchmarking</h2>
          <p className="text-sm text-gray-500 mt-0.5">Compare our products against market competitors.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600">Updated: {lastUpdated}</span>
          <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} />} onClick={() => success('Refreshed', 'Competitor data refreshed.')}>Refresh</Button>
        </div>
      </div>

      {/* Product selector */}
      <div className="flex gap-1 rounded-xl bg-white/[0.03] border border-white/[0.06] p-1 w-fit">
        {PRODUCT_TYPES.map(t => (
          <button key={t} onClick={() => setActiveProduct(t)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all', activeProduct === t ? 'bg-white/[0.08] text-gray-100' : 'text-gray-500 hover:text-gray-300')}>
            {t}
          </button>
        ))}
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.03]">
              <th className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Metric</th>
              <th className="px-4 py-3 text-[10px] font-bold text-[#10B981] uppercase tracking-widest">INSURAI ★</th>
              {COMPETITORS.map(c => (
                <th key={c.name} className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">{c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {/* Annual Premium */}
            <tr className="hover:bg-white/[0.02]">
              <td className="px-4 py-3 text-xs font-medium text-gray-400">Annual Premium</td>
              <td className="px-4 py-3">
                <p className="text-sm font-bold text-[#10B981]">{formatPremium(ours.premium)}</p>
                <p className="text-[10px] text-gray-600">our price</p>
              </td>
              {COMPETITORS.map(c => (
                <td key={c.name} className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-300">{formatPremium(c.products[activeProduct].premium)}</p>
                  <DeltaIndicator ours={ours.premium} theirs={c.products[activeProduct].premium} lower />
                </td>
              ))}
            </tr>
            {/* Coverage */}
            <tr className="hover:bg-white/[0.02]">
              <td className="px-4 py-3 text-xs font-medium text-gray-400">Coverage Limit</td>
              <td className="px-4 py-3">
                <p className="text-sm font-bold text-[#10B981]">{formatCoverage(ours.coverage)}</p>
                <p className="text-[10px] text-gray-600">our limit</p>
              </td>
              {COMPETITORS.map(c => (
                <td key={c.name} className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-300">{formatCoverage(c.products[activeProduct].coverage)}</p>
                  <DeltaIndicator ours={ours.coverage} theirs={c.products[activeProduct].coverage} />
                </td>
              ))}
            </tr>
            {/* Customer Rating */}
            <tr className="hover:bg-white/[0.02]">
              <td className="px-4 py-3 text-xs font-medium text-gray-400">Customer Rating</td>
              <td className="px-4 py-3">
                <p className="text-sm font-bold text-[#10B981] flex items-center gap-1"><Star size={12} />{ours.rating}</p>
                <p className="text-[10px] text-gray-600">out of 5</p>
              </td>
              {COMPETITORS.map(c => (
                <td key={c.name} className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-300 flex items-center gap-1"><Star size={12} className="text-gray-600" />{c.products[activeProduct].rating}</p>
                  <DeltaIndicator ours={ours.rating} theirs={c.products[activeProduct].rating} />
                </td>
              ))}
            </tr>
            {/* Claim Processing */}
            <tr className="hover:bg-white/[0.02]">
              <td className="px-4 py-3 text-xs font-medium text-gray-400">Claim Processing</td>
              <td className="px-4 py-3">
                <p className="text-sm font-bold text-[#10B981]">{formatDays(ours.claimTime)}</p>
                <p className="text-[10px] text-gray-600">faster = better</p>
              </td>
              {COMPETITORS.map(c => (
                <td key={c.name} className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-300">{formatDays(c.products[activeProduct].claimTime)}</p>
                  <DeltaIndicator ours={ours.claimTime} theirs={c.products[activeProduct].claimTime} lower />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-3 gap-4">
        <GlassPanel className="text-center py-6 border-emerald-500/10 bg-emerald-500/[0.02]">
          <p className="text-2xl font-bold text-emerald-400">
            {COMPETITORS.filter(c => ours.premium <= c.products[activeProduct].premium).length}/{COMPETITORS.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Competitors We Beat on Price</p>
        </GlassPanel>
        <GlassPanel className="text-center py-6">
          <p className="text-2xl font-bold text-white">
            #{[...COMPETITORS.map(c => c.products[activeProduct].rating), ours.rating].sort((a, b) => b - a).indexOf(ours.rating) + 1}
          </p>
          <p className="text-xs text-gray-500 mt-1">Rating Rank in Market</p>
        </GlassPanel>
        <GlassPanel className="text-center py-6 border-blue-500/10 bg-blue-500/[0.02]">
          <p className="text-2xl font-bold text-blue-400">
            #{[...COMPETITORS.map(c => c.products[activeProduct].claimTime), ours.claimTime].sort((a, b) => a - b).indexOf(ours.claimTime) + 1}
          </p>
          <p className="text-xs text-gray-500 mt-1">Fastest Claims Processing</p>
        </GlassPanel>
      </div>
    </div>
  );
};
