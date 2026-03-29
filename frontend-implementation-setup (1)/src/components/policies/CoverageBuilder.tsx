import { useState } from 'react';
import { Plus, Trash2, GripVertical, Check, DollarSign } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

interface CoverageModule {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  isRequired: boolean;
  isEnabled: boolean;
  category: 'core' | 'optional' | 'rider';
  limit: number;
  deductible: number;
}

const INITIAL_MODULES: CoverageModule[] = [
  { id: '1', name: 'Bodily Injury Liability',  description: 'Covers injuries to others in accidents you cause.',        basePrice: 420,  isRequired: true,  isEnabled: true,  category: 'core',     limit: 100000, deductible: 0    },
  { id: '2', name: 'Property Damage Liability', description: 'Covers damage to others\' property.',                       basePrice: 180,  isRequired: true,  isEnabled: true,  category: 'core',     limit: 50000,  deductible: 0    },
  { id: '3', name: 'Collision Coverage',         description: 'Covers your vehicle in a collision.',                       basePrice: 600,  isRequired: false, isEnabled: true,  category: 'core',     limit: 0,      deductible: 1000 },
  { id: '4', name: 'Comprehensive Coverage',     description: 'Covers theft, fire, weather, and non-collision damage.',   basePrice: 240,  isRequired: false, isEnabled: true,  category: 'core',     limit: 0,      deductible: 500  },
  { id: '5', name: 'Roadside Assistance',        description: '24/7 towing, battery, and lockout service.',               basePrice: 60,   isRequired: false, isEnabled: false, category: 'optional', limit: 5000,   deductible: 0    },
  { id: '6', name: 'Rental Reimbursement',       description: 'Covers rental car costs while yours is being repaired.',   basePrice: 48,   isRequired: false, isEnabled: false, category: 'optional', limit: 3000,   deductible: 0    },
  { id: '7', name: 'Gap Insurance',              description: 'Covers the difference between ACV and loan balance.',      basePrice: 120,  isRequired: false, isEnabled: false, category: 'rider',    limit: 0,      deductible: 0    },
  { id: '8', name: 'New Car Replacement',        description: 'Replaces totaled new car with same make/model.',           basePrice: 180,  isRequired: false, isEnabled: false, category: 'rider',    limit: 0,      deductible: 0    },
];

const categoryColor: Record<string, string> = {
  core:     'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20',
  optional: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  rider:    'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

export const CoverageBuilder = () => {
  const { success } = useToast();
  const [modules, setModules] = useState<CoverageModule[]>(INITIAL_MODULES);
  const [newModule, setNewModule] = useState({ name: '', description: '', basePrice: '', category: 'optional' as CoverageModule['category'] });
  const [showAdd, setShowAdd] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | CoverageModule['category']>('all');

  const toggle = (id: string) => {
    setModules(prev => prev.map(m => m.id === id && !m.isRequired ? { ...m, isEnabled: !m.isEnabled } : m));
  };

  const remove = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
    success('Module removed', 'Coverage module deleted from builder.');
  };

  const addModule = (e: React.FormEvent) => {
    e.preventDefault();
    const mod: CoverageModule = {
      id: `mod_${Date.now()}`,
      name: newModule.name,
      description: newModule.description,
      basePrice: Number(newModule.basePrice),
      isRequired: false,
      isEnabled: false,
      category: newModule.category,
      limit: 0,
      deductible: 0,
    };
    setModules(prev => [...prev, mod]);
    setNewModule({ name: '', description: '', basePrice: '', category: 'optional' });
    setShowAdd(false);
    success('Module added', `"${mod.name}" added to coverage builder.`);
  };

  const saveTemplate = () => {
    success('Template saved', 'Coverage configuration saved as product template.');
  };

  const filtered = activeCategory === 'all' ? modules : modules.filter(m => m.category === activeCategory);
  const totalPremium = modules.filter(m => m.isEnabled).reduce((s, m) => s + m.basePrice, 0);
  const enabledCount = modules.filter(m => m.isEnabled).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Coverage Builder</h2>
          <p className="text-sm text-gray-500 mt-0.5">Configure modular coverage components for policy products.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowAdd(true)}>Add Module</Button>
          <Button size="sm" leftIcon={<Check size={14} />} onClick={saveTemplate}>Save Template</Button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Modules', value: enabledCount, sub: `of ${modules.length} total` },
          { label: 'Base Annual Premium', value: `$${totalPremium.toLocaleString()}`, sub: `$${Math.round(totalPremium / 12)}/month` },
          { label: 'Coverage Packages', value: '3', sub: 'Core, Optional, Riders' },
        ].map(s => (
          <GlassPanel key={s.label} className="text-center py-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs font-semibold text-gray-400 mt-1">{s.label}</p>
            <p className="text-[10px] text-gray-600 mt-0.5">{s.sub}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-1 rounded-xl bg-white/[0.03] border border-white/[0.06] p-1 w-fit">
        {(['all', 'core', 'optional', 'rider'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all',
              activeCategory === cat ? 'bg-white/[0.08] text-gray-100' : 'text-gray-500 hover:text-gray-300'
            )}
          >
            {cat === 'all' ? 'All Modules' : cat}
          </button>
        ))}
      </div>

      {/* Module list */}
      <div className="space-y-3">
        {filtered.map(mod => (
          <GlassPanel key={mod.id} className={cn('transition-all', mod.isEnabled ? 'border-white/10' : 'opacity-60')}>
            <div className="flex items-start gap-4">
              <div className="mt-1 text-gray-700 cursor-grab"><GripVertical size={18} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-bold text-gray-200">{mod.name}</p>
                  <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase border', categoryColor[mod.category])}>{mod.category}</span>
                  {mod.isRequired && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase text-amber-400 bg-amber-500/10 border border-amber-500/20">Required</span>}
                </div>
                <p className="text-xs text-gray-500">{mod.description}</p>
                <div className="flex gap-4 mt-2">
                  <span className="flex items-center gap-1 text-xs text-gray-600"><DollarSign size={10} />{mod.basePrice.toLocaleString()}/yr</span>
                  {mod.limit > 0 && <span className="text-xs text-gray-600">Limit: ${mod.limit.toLocaleString()}</span>}
                  {mod.deductible > 0 && <span className="text-xs text-gray-600">Deductible: ${mod.deductible.toLocaleString()}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggle(mod.id)}
                  disabled={mod.isRequired}
                  className={cn(
                    'relative h-5 w-9 rounded-full transition-all duration-200',
                    mod.isEnabled ? 'bg-[#10B981]' : 'bg-white/[0.10]',
                    mod.isRequired && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <span className={cn('absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200', mod.isEnabled ? 'translate-x-4' : 'translate-x-0')} />
                </button>
                {!mod.isRequired && (
                  <button onClick={() => remove(mod.id)} className="text-gray-700 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Add Module form */}
      {showAdd && (
        <GlassPanel className="border-[#10B981]/20">
          <h3 className="text-sm font-bold text-gray-300 mb-4">New Coverage Module</h3>
          <form onSubmit={addModule} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Module Name" placeholder="e.g. Roadside Assistance" value={newModule.name}
                onChange={e => setNewModule({ ...newModule, name: e.target.value })} required />
              <Input label="Base Price ($/yr)" type="number" placeholder="120" value={newModule.basePrice}
                onChange={e => setNewModule({ ...newModule, basePrice: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
              <textarea rows={2} value={newModule.description}
                onChange={e => setNewModule({ ...newModule, description: e.target.value })}
                placeholder="Describe what this coverage includes..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 resize-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</label>
              <div className="flex gap-2">
                {(['core', 'optional', 'rider'] as const).map(cat => (
                  <button key={cat} type="button"
                    onClick={() => setNewModule({ ...newModule, category: cat })}
                    className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all', newModule.category === cat ? categoryColor[cat] : 'text-gray-600 border-white/[0.06] hover:border-white/10')}
                  >{cat}</button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit" leftIcon={<Plus size={14} />}>Add Module</Button>
            </div>
          </form>
        </GlassPanel>
      )}
    </div>
  );
};
