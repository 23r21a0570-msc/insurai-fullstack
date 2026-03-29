import { useState } from 'react';
import { TrendingUp, Save, RotateCcw, Info, Plus, Trash2 } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

interface PricingFactor {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  category: 'risk' | 'discount' | 'surcharge';
  isActive: boolean;
}

interface PricingTier {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  baseRate: number;
}

const INITIAL_FACTORS: PricingFactor[] = [
  { id: '1', name: 'Safe Driver Discount',     description: 'No accidents in 3+ years',         multiplier: 0.85, category: 'discount',  isActive: true  },
  { id: '2', name: 'Multi-Policy Discount',    description: '2+ policies with same carrier',     multiplier: 0.88, category: 'discount',  isActive: true  },
  { id: '3', name: 'Young Driver Surcharge',   description: 'Drivers under 25 years old',        multiplier: 1.35, category: 'surcharge', isActive: true  },
  { id: '4', name: 'High-Risk Occupation',     description: 'High-risk job classifications',      multiplier: 1.20, category: 'surcharge', isActive: true  },
  { id: '5', name: 'Claims History Risk',      description: '2+ claims in last 5 years',         multiplier: 1.45, category: 'risk',      isActive: true  },
  { id: '6', name: 'Credit Score Discount',    description: 'Excellent credit (750+)',            multiplier: 0.92, category: 'discount',  isActive: false },
  { id: '7', name: 'Loyalty Discount',         description: '5+ years with carrier',             multiplier: 0.90, category: 'discount',  isActive: true  },
  { id: '8', name: 'Urban Area Surcharge',     description: 'High-density metropolitan areas',   multiplier: 1.15, category: 'surcharge', isActive: false },
];

const INITIAL_TIERS: PricingTier[] = [
  { id: '1', name: 'Young Adult',  minAge: 18, maxAge: 24, baseRate: 1800 },
  { id: '2', name: 'Adult',        minAge: 25, maxAge: 45, baseRate: 1200 },
  { id: '3', name: 'Senior Adult', minAge: 46, maxAge: 65, baseRate: 1400 },
  { id: '4', name: 'Senior',       minAge: 66, maxAge: 99, baseRate: 1650 },
];

const categoryStyle: Record<string, string> = {
  discount:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  surcharge: 'text-red-400 bg-red-500/10 border-red-500/20',
  risk:      'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

const TABS = ['Rating Factors', 'Age Tiers', 'Calculator'] as const;
type Tab = typeof TABS[number];

export const PricingEngine = () => {
  const { success } = useToast();
  const [tab, setTab] = useState<Tab>('Rating Factors');
  const [factors, setFactors] = useState<PricingFactor[]>(INITIAL_FACTORS);
  const [tiers, setTiers] = useState<PricingTier[]>(INITIAL_TIERS);
  const [showAddFactor, setShowAddFactor] = useState(false);
  const [newFactor, setNewFactor] = useState({ name: '', description: '', multiplier: '', category: 'discount' as PricingFactor['category'] });

  // Calculator state
  const [calcAge, setCalcAge] = useState(30);
  const [calcCoverage, setCalcCoverage] = useState(150000);
  const [selectedFactors, setSelectedFactors] = useState<string[]>(['1', '2', '7']);

  const toggleFactor = (id: string) => setFactors(prev => prev.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
  const removeFactor = (id: string) => { setFactors(prev => prev.filter(f => f.id !== id)); success('Factor removed', 'Pricing factor deleted.'); };
  const toggleCalcFactor = (id: string) => setSelectedFactors(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const addFactor = (e: React.FormEvent) => {
    e.preventDefault();
    const f: PricingFactor = { id: `f_${Date.now()}`, name: newFactor.name, description: newFactor.description, multiplier: Number(newFactor.multiplier), category: newFactor.category, isActive: true };
    setFactors(prev => [...prev, f]);
    setNewFactor({ name: '', description: '', multiplier: '', category: 'discount' });
    setShowAddFactor(false);
    success('Factor added', `"${f.name}" added to pricing engine.`);
  };

  // Calculate premium
  const tier = tiers.find(t => calcAge >= t.minAge && calcAge <= t.maxAge);
  const baseRate = tier?.baseRate ?? 1200;
  const coverageMultiplier = calcCoverage / 100000;
  const factorMultiplier = factors
    .filter(f => selectedFactors.includes(f.id))
    .reduce((acc, f) => acc * f.multiplier, 1);
  const calculatedPremium = Math.round(baseRate * coverageMultiplier * factorMultiplier);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Pricing Engine</h2>
          <p className="text-sm text-gray-500 mt-0.5">Configure rating factors, age tiers, and dynamic pricing rules.</p>
        </div>
        <Button size="sm" leftIcon={<Save size={14} />} onClick={() => success('Saved', 'Pricing configuration saved.')}>
          Save Configuration
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-white/[0.03] border border-white/[0.06] p-1 w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all', tab === t ? 'bg-white/[0.08] text-gray-100' : 'text-gray-500 hover:text-gray-300')}>
            {t}
          </button>
        ))}
      </div>

      {/* Rating Factors */}
      {tab === 'Rating Factors' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button variant="secondary" size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowAddFactor(true)}>Add Factor</Button>
          </div>
          {factors.map(f => (
            <GlassPanel key={f.id} className={cn(!f.isActive && 'opacity-50')}>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-200">{f.name}</span>
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase border', categoryStyle[f.category])}>{f.category}</span>
                  </div>
                  <p className="text-xs text-gray-500">{f.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className={cn('text-lg font-mono font-bold', f.multiplier < 1 ? 'text-emerald-400' : 'text-red-400')}>
                      {f.multiplier < 1 ? `−${Math.round((1 - f.multiplier) * 100)}%` : `+${Math.round((f.multiplier - 1) * 100)}%`}
                    </p>
                    <p className="text-[10px] text-gray-600">×{f.multiplier}</p>
                  </div>
                  <button onClick={() => toggleFactor(f.id)}
                    className={cn('relative h-5 w-9 rounded-full transition-all duration-200', f.isActive ? 'bg-[#10B981]' : 'bg-white/[0.10]')}>
                    <span className={cn('absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200', f.isActive ? 'translate-x-4' : 'translate-x-0')} />
                  </button>
                  <button onClick={() => removeFactor(f.id)} className="text-gray-700 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </GlassPanel>
          ))}
          {showAddFactor && (
            <GlassPanel className="border-[#10B981]/20">
              <h3 className="text-sm font-bold text-gray-300 mb-4">New Rating Factor</h3>
              <form onSubmit={addFactor} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Factor Name" placeholder="e.g. Loyalty Discount" value={newFactor.name} onChange={e => setNewFactor({ ...newFactor, name: e.target.value })} required />
                  <Input label="Multiplier" type="number" step="0.01" placeholder="0.90 for discount, 1.25 for surcharge" value={newFactor.multiplier} onChange={e => setNewFactor({ ...newFactor, multiplier: e.target.value })} required />
                </div>
                <Input label="Description" placeholder="When this factor applies..." value={newFactor.description} onChange={e => setNewFactor({ ...newFactor, description: e.target.value })} />
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</label>
                  <div className="flex gap-2">
                    {(['discount', 'surcharge', 'risk'] as const).map(cat => (
                      <button key={cat} type="button" onClick={() => setNewFactor({ ...newFactor, category: cat })}
                        className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all', newFactor.category === cat ? categoryStyle[cat] : 'text-gray-600 border-white/[0.06]')}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={() => setShowAddFactor(false)}>Cancel</Button>
                  <Button type="submit">Add Factor</Button>
                </div>
              </form>
            </GlassPanel>
          )}
        </div>
      )}

      {/* Age Tiers */}
      {tab === 'Age Tiers' && (
        <div className="space-y-3">
          {tiers.map(t => (
            <GlassPanel key={t.id}>
              <div className="grid grid-cols-4 gap-4 items-center">
                <div>
                  <p className="text-sm font-bold text-gray-200">{t.name}</p>
                  <p className="text-xs text-gray-500">Ages {t.minAge}–{t.maxAge}</p>
                </div>
                <Input label="Min Age" type="number" value={String(t.minAge)}
                  onChange={e => setTiers(prev => prev.map(x => x.id === t.id ? { ...x, minAge: Number(e.target.value) } : x))} />
                <Input label="Max Age" type="number" value={String(t.maxAge)}
                  onChange={e => setTiers(prev => prev.map(x => x.id === t.id ? { ...x, maxAge: Number(e.target.value) } : x))} />
                <Input label="Base Rate ($)" type="number" value={String(t.baseRate)}
                  onChange={e => setTiers(prev => prev.map(x => x.id === t.id ? { ...x, baseRate: Number(e.target.value) } : x))} />
              </div>
            </GlassPanel>
          ))}
          <Button variant="secondary" size="sm" leftIcon={<RotateCcw size={14} />} onClick={() => setTiers(INITIAL_TIERS)}>Reset to Defaults</Button>
        </div>
      )}

      {/* Premium Calculator */}
      {tab === 'Calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <GlassPanel>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Inputs</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between"><label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Policyholder Age</label><span className="text-sm font-bold text-[#10B981]">{calcAge} years</span></div>
                  <input type="range" min={18} max={85} value={calcAge} onChange={e => setCalcAge(Number(e.target.value))} className="w-full accent-[#10B981]" />
                  <div className="flex justify-between text-[10px] text-gray-600"><span>18</span><span>85</span></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Coverage Amount</label><span className="text-sm font-bold text-[#10B981]">${calcCoverage.toLocaleString()}</span></div>
                  <input type="range" min={50000} max={500000} step={25000} value={calcCoverage} onChange={e => setCalcCoverage(Number(e.target.value))} className="w-full accent-[#10B981]" />
                  <div className="flex justify-between text-[10px] text-gray-600"><span>$50K</span><span>$500K</span></div>
                </div>
              </div>
            </GlassPanel>
            <GlassPanel>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Apply Rating Factors</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {factors.filter(f => f.isActive).map(f => (
                  <button key={f.id} onClick={() => toggleCalcFactor(f.id)}
                    className={cn('w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all', selectedFactors.includes(f.id) ? 'bg-[#10B981]/10 border-[#10B981]/30' : 'border-white/[0.06] hover:border-white/10')}>
                    <span className="text-xs font-medium text-gray-300">{f.name}</span>
                    <span className={cn('text-xs font-mono font-bold', f.multiplier < 1 ? 'text-emerald-400' : 'text-red-400')}>
                      {f.multiplier < 1 ? `−${Math.round((1 - f.multiplier) * 100)}%` : `+${Math.round((f.multiplier - 1) * 100)}%`}
                    </span>
                  </button>
                ))}
              </div>
            </GlassPanel>
          </div>
          <GlassPanel className="flex flex-col justify-center items-center py-12 text-center border-[#10B981]/20 bg-[#10B981]/[0.02]">
            <TrendingUp size={32} className="text-[#10B981] mb-4" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Calculated Annual Premium</p>
            <p className="text-5xl font-bold text-white tabular-nums">${calculatedPremium.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">${Math.round(calculatedPremium / 12).toLocaleString()}/month</p>
            <div className="mt-6 w-full space-y-2">
              <div className="flex justify-between text-xs"><span className="text-gray-500">Base Rate ({tier?.name})</span><span className="text-gray-300">${baseRate.toLocaleString()}</span></div>
              <div className="flex justify-between text-xs"><span className="text-gray-500">Coverage Multiplier</span><span className="text-gray-300">×{coverageMultiplier.toFixed(2)}</span></div>
              <div className="flex justify-between text-xs"><span className="text-gray-500">Rating Factors</span><span className={cn('font-mono', factorMultiplier < 1 ? 'text-emerald-400' : 'text-red-400')}>×{factorMultiplier.toFixed(3)}</span></div>
              <div className="h-px bg-white/[0.06] my-2" />
              <div className="flex justify-between text-sm font-bold"><span className="text-gray-300">Total Premium</span><span className="text-[#10B981]">${calculatedPremium.toLocaleString()}/yr</span></div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-gray-600">
              <Info size={10} /><span>Rates shown are indicative only</span>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
