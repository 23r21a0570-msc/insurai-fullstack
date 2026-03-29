import { useState } from 'react';
import { Shield, Car, Heart, Home, Umbrella, Zap, Package, Check, Plus, Info } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatters';
import { useToast } from '@/context/ToastContext';

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  frequency: 'month' | 'year';
  icon: React.ReactNode;
  category: string;
  popular?: boolean;
  details: string[];
}

const addons: Addon[] = [
  {
    id: 'roadside',
    name: 'Roadside Assistance',
    description: '24/7 towing, jump-start, flat tire, and lockout service',
    price: 8,
    frequency: 'month',
    icon: <Car size={20} />,
    category: 'Auto',
    popular: true,
    details: ['Up to 50 miles towing', 'Flat tire change', 'Jump-start service', 'Lockout assistance', 'Fuel delivery'],
  },
  {
    id: 'rental',
    name: 'Rental Car Coverage',
    description: 'Covers rental car costs while your vehicle is being repaired',
    price: 12,
    frequency: 'month',
    icon: <Car size={20} />,
    category: 'Auto',
    details: ['Up to $50/day rental', 'Maximum 30 days', 'All vehicle classes', 'No deductible'],
  },
  {
    id: 'gap',
    name: 'GAP Insurance',
    description: 'Covers the difference between car value and loan balance',
    price: 25,
    frequency: 'month',
    icon: <Shield size={20} />,
    category: 'Auto',
    details: ['Loan/lease payoff protection', 'New vehicle replacement', 'No out-of-pocket costs', 'Transferable'],
  },
  {
    id: 'dental',
    name: 'Dental Coverage',
    description: 'Comprehensive dental care including cleanings, fillings, and major work',
    price: 35,
    frequency: 'month',
    icon: <Heart size={20} />,
    category: 'Health',
    popular: true,
    details: ['2 cleanings/year', 'X-rays included', '80% coverage on fillings', '50% coverage on crowns', 'Orthodontics available'],
  },
  {
    id: 'vision',
    name: 'Vision Coverage',
    description: 'Eye exams, glasses, and contact lens coverage',
    price: 18,
    frequency: 'month',
    icon: <Heart size={20} />,
    category: 'Health',
    details: ['Annual eye exam', '$150 frames allowance', '$120 contact lens allowance', 'LASIK discount 15%'],
  },
  {
    id: 'flood',
    name: 'Flood Protection',
    description: 'Additional flood coverage beyond standard home policy',
    price: 45,
    frequency: 'month',
    icon: <Home size={20} />,
    category: 'Home',
    details: ['$250K structure coverage', '$100K contents coverage', '30-day waiting period', 'Basement coverage'],
  },
  {
    id: 'jewelry',
    name: 'Jewelry & Valuables',
    description: 'Scheduled personal property coverage for high-value items',
    price: 20,
    frequency: 'month',
    icon: <Package size={20} />,
    category: 'Home',
    details: ['Agreed value coverage', 'No deductible on claims', 'Worldwide coverage', 'Mysterious disappearance'],
  },
  {
    id: 'umbrella',
    name: 'Umbrella Policy',
    description: 'Extra liability coverage beyond your primary policy limits',
    price: 15,
    frequency: 'month',
    icon: <Umbrella size={20} />,
    category: 'Liability',
    popular: true,
    details: ['$1M additional liability', 'Covers all policies', 'Legal defense costs', 'Personal injury coverage'],
  },
  {
    id: 'cyber',
    name: 'Cyber Protection',
    description: 'Coverage for identity theft, cyberbullying, and data breaches',
    price: 10,
    frequency: 'month',
    icon: <Zap size={20} />,
    category: 'Digital',
    details: ['Identity restoration', 'Credit monitoring', 'Fraud reimbursement', 'Cyber extortion coverage'],
  },
];

const categories = ['All', 'Auto', 'Health', 'Home', 'Liability', 'Digital'];

export const PolicyAddons = () => {
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedAddon, setExpandedAddon] = useState<string | null>(null);
  const { success } = useToast();

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        success('Add-on added', `${addons.find(a => a.id === id)?.name} has been added to your policy.`);
      }
      return next;
    });
  };

  const filteredAddons = addons.filter(a =>
    activeCategory === 'All' || a.category === activeCategory
  );

  const totalMonthly = Array.from(selectedAddons).reduce((sum, id) => {
    const addon = addons.find(a => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="text-emerald-400" size={22} />
            Add-ons Marketplace
          </h2>
          <p className="text-sm text-gray-500 mt-1">Enhance your coverage with optional riders and endorsements</p>
        </div>
        {selectedAddons.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Check size={16} className="text-emerald-400" />
            <span className="text-sm font-semibold text-white">{selectedAddons.size} selected</span>
            <span className="text-xs text-gray-400">+{formatCurrency(totalMonthly)}/mo</span>
          </div>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
              activeCategory === cat
                ? 'bg-emerald-500 text-white'
                : 'bg-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/10'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Addons grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAddons.map(addon => {
          const isSelected = selectedAddons.has(addon.id);
          const isExpanded = expandedAddon === addon.id;

          return (
            <div
              key={addon.id}
              className={cn(
                'relative rounded-xl border p-4 transition-all duration-200',
                isSelected
                  ? 'bg-emerald-500/[0.08] border-emerald-500/30'
                  : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.15]'
              )}
            >
              {addon.popular && (
                <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wide">
                  Popular
                </span>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400'
                  )}>
                    {addon.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{addon.name}</p>
                    <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">{addon.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleAddon(addon.id)}
                  className={cn(
                    'shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all',
                    isSelected
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                  )}
                  aria-label={isSelected ? `Remove ${addon.name}` : `Add ${addon.name}`}
                >
                  {isSelected ? <Check size={16} /> : <Plus size={16} />}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3 leading-relaxed">{addon.description}</p>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <span className="text-lg font-bold text-white">${addon.price}</span>
                  <span className="text-xs text-gray-500">/{addon.frequency}</span>
                </div>
                <button
                  onClick={() => setExpandedAddon(isExpanded ? null : addon.id)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-400 transition-colors"
                >
                  <Info size={12} />
                  {isExpanded ? 'Less' : 'Details'}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-1.5 animate-fade-in">
                  {addon.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check size={11} className="text-emerald-400 shrink-0" />
                      <span className="text-xs text-gray-400">{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary bar */}
      {selectedAddons.size > 0 && (
        <div className="sticky bottom-0 p-4 rounded-xl bg-[#0F1629] border border-emerald-500/20 shadow-2xl flex items-center justify-between gap-4 flex-wrap animate-fade-in">
          <div>
            <p className="text-sm font-bold text-white">{selectedAddons.size} add-on{selectedAddons.size > 1 ? 's' : ''} selected</p>
            <p className="text-xs text-gray-500">+{formatCurrency(totalMonthly)}/month to your premium</p>
          </div>
          <button
            onClick={() => success('Add-ons saved', 'Your selected add-ons have been applied to your policy.')}
            className="px-6 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors"
          >
            Apply Add-ons
          </button>
        </div>
      )}
    </div>
  );
};
