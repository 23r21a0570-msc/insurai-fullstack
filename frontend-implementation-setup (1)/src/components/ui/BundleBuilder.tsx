import { useState } from 'react';
import { Car, Home, Heart, Briefcase, Shield, Check, ArrowRight, Tag } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatters';
import { useToast } from '@/context/ToastContext';

interface PolicyType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  basePrice: number;
  color: string;
}

interface Bundle {
  id: string;
  name: string;
  policies: string[];
  discount: number;
  tag: string;
}

const policyTypes: PolicyType[] = [
  { id: 'auto', name: 'Auto Insurance', icon: <Car size={24} />, description: 'Vehicle collision, theft, liability', basePrice: 120, color: 'blue' },
  { id: 'home', name: 'Home Insurance', icon: <Home size={24} />, description: 'Property damage, liability, contents', basePrice: 180, color: 'amber' },
  { id: 'health', name: 'Health Insurance', icon: <Heart size={24} />, description: 'Medical, dental, vision coverage', basePrice: 250, color: 'rose' },
  { id: 'life', name: 'Life Insurance', icon: <Shield size={24} />, description: 'Term or whole life protection', basePrice: 40, color: 'purple' },
  { id: 'business', name: 'Business Insurance', icon: <Briefcase size={24} />, description: 'Commercial liability, property', basePrice: 350, color: 'orange' },
];

const bundles: Bundle[] = [
  { id: 'home_auto', name: 'Home & Auto Bundle', policies: ['auto', 'home'], discount: 12, tag: 'Most Popular' },
  { id: 'home_auto_life', name: 'Family Protection Bundle', policies: ['auto', 'home', 'life'], discount: 18, tag: 'Best Value' },
  { id: 'complete', name: 'Complete Coverage', policies: ['auto', 'home', 'health', 'life'], discount: 25, tag: 'Maximum Savings' },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400',   icon: 'bg-blue-500/20 text-blue-400' },
  amber:  { bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  text: 'text-amber-400',  icon: 'bg-amber-500/20 text-amber-400' },
  rose:   { bg: 'bg-rose-500/10',   border: 'border-rose-500/30',   text: 'text-rose-400',   icon: 'bg-rose-500/20 text-rose-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: 'bg-purple-500/20 text-purple-400' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: 'bg-orange-500/20 text-orange-400' },
};

export const BundleBuilder = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set(['auto']));
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const { success, error } = useToast();

  const togglePolicy = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size === 1) return prev; // keep at least one
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const applyBundle = (bundle: Bundle) => {
    setSelected(new Set(bundle.policies));
    success('Bundle Applied', `${bundle.name} selected — save ${bundle.discount}%`);
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE20') {
      setPromoApplied(true);
      success('Promo Applied!', 'SAVE20 — extra 20% discount applied');
    } else {
      error('Invalid Code', 'This promo code is not valid or has expired');
    }
  };

  // Calculate pricing
  const selectedPolicies = policyTypes.filter(p => selected.has(p.id));
  const subtotal = selectedPolicies.reduce((sum, p) => sum + p.basePrice, 0);

  // Find best bundle match
  const matchingBundle = bundles
    .filter(b => b.policies.every(p => selected.has(p)) && selected.size === b.policies.length)
    .sort((a, b) => b.discount - a.discount)[0];

  const bundleDiscount = matchingBundle ? matchingBundle.discount : (selected.size >= 3 ? 10 : selected.size >= 2 ? 5 : 0);
  const promoDiscount = promoApplied ? 20 : 0;
  const totalDiscount = Math.min(bundleDiscount + promoDiscount, 40);
  const discountAmount = (subtotal * totalDiscount) / 100;
  const total = subtotal - discountAmount;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Tag className="text-emerald-400" size={22} />
          Bundle Builder
        </h2>
        <p className="text-sm text-gray-500 mt-1">Combine policies to unlock multi-policy discounts</p>
      </div>

      {/* Suggested bundles */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Suggested Bundles</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {bundles.map(bundle => (
            <button
              key={bundle.id}
              onClick={() => applyBundle(bundle)}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/30 hover:bg-emerald-500/[0.04] transition-all text-left group relative"
            >
              {bundle.tag && (
                <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase">
                  {bundle.tag}
                </span>
              )}
              <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{bundle.name}</p>
              <p className="text-xs text-gray-500 mt-1">{bundle.policies.map(p => policyTypes.find(pt => pt.id === p)?.name).join(' + ')}</p>
              <p className="text-lg font-bold text-emerald-400 mt-2">Save {bundle.discount}%</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom policy selector */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Build Your Own</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {policyTypes.map(policy => {
            const isSelected = selected.has(policy.id);
            const colors = colorClasses[policy.color];
            return (
              <button
                key={policy.id}
                onClick={() => togglePolicy(policy.id)}
                className={cn(
                  'p-4 rounded-xl border transition-all text-left relative',
                  isSelected ? `${colors.bg} ${colors.border}` : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.15]'
                )}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check size={11} className="text-white" />
                  </div>
                )}
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', colors.icon)}>
                  {policy.icon}
                </div>
                <p className="text-sm font-bold text-white">{policy.name}</p>
                <p className="text-xs text-gray-500 mt-1">{policy.description}</p>
                <p className={cn('text-base font-bold mt-3', isSelected ? colors.text : 'text-gray-300')}>
                  {formatCurrency(policy.basePrice)}<span className="text-xs font-normal text-gray-500">/mo</span>
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Promo code */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Promo code (try SAVE20)"
          value={promoCode}
          onChange={e => setPromoCode(e.target.value.toUpperCase())}
          disabled={promoApplied}
          className={cn(
            'flex-1 h-10 rounded-lg border bg-white/5 px-3 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all',
            promoApplied ? 'border-emerald-500/30 text-emerald-400' : 'border-white/10 text-gray-200'
          )}
        />
        <button
          onClick={applyPromo}
          disabled={promoApplied || !promoCode}
          className="px-4 h-10 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {promoApplied ? '✓ Applied' : 'Apply'}
        </button>
      </div>

      {/* Pricing summary */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-5 space-y-3">
        <p className="text-sm font-bold text-gray-300 uppercase tracking-wide">Price Summary</p>

        {selectedPolicies.map(p => (
          <div key={p.id} className="flex justify-between text-sm">
            <span className="text-gray-400">{p.name}</span>
            <span className="text-gray-200 font-mono">{formatCurrency(p.basePrice)}/mo</span>
          </div>
        ))}

        <div className="border-t border-white/[0.06] pt-3 space-y-2">
          {matchingBundle && (
            <div className="flex justify-between text-sm">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <Tag size={12} /> {matchingBundle.name} discount
              </span>
              <span className="text-emerald-400 font-mono">-{matchingBundle.discount}%</span>
            </div>
          )}
          {!matchingBundle && bundleDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-emerald-400">Multi-policy discount</span>
              <span className="text-emerald-400 font-mono">-{bundleDiscount}%</span>
            </div>
          )}
          {promoApplied && (
            <div className="flex justify-between text-sm">
              <span className="text-emerald-400">Promo SAVE20</span>
              <span className="text-emerald-400 font-mono">-20%</span>
            </div>
          )}
          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">You save</span>
              <span className="text-emerald-400 font-semibold font-mono">-{formatCurrency(discountAmount)}/mo</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold pt-1">
            <span className="text-white">Monthly Total</span>
            <span className="text-white font-mono">{formatCurrency(total)}/mo</span>
          </div>
          <p className="text-[10px] text-gray-600">
            Annual: {formatCurrency(total * 10)} (save 2 months with yearly billing)
          </p>
        </div>

        <button
          onClick={() => success('Bundle saved!', `Your custom bundle will be applied at checkout.`)}
          className="w-full h-11 rounded-lg bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 mt-2"
        >
          Continue to Checkout <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
