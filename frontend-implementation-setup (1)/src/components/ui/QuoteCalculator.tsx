import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Zap, Share2, Mail } from 'lucide-react';
import { cn } from '@/utils/cn';

interface QuoteData {
  age: number;
  zip: string;
  gender: 'male' | 'female' | 'other';
  coverageType: 'auto' | 'home' | 'health';
  coverageAmount: number;
  deductible: number;
  smoker: boolean;
}

const baseRates: Record<string, number> = { auto: 120, home: 90, health: 180 };

const calculatePrice = (data: Partial<QuoteData>): number => {
  let base = baseRates[data.coverageType ?? 'auto'] ?? 120;
  const age = data.age ?? 30;
  const coverage = data.coverageAmount ?? 100000;
  const deductible = data.deductible ?? 500;

  // Age factor
  if (age < 25) base *= 1.4;
  else if (age < 35) base *= 1.0;
  else if (age < 50) base *= 0.95;
  else if (age < 65) base *= 1.1;
  else base *= 1.3;

  // Coverage factor
  base *= coverage / 100000;

  // Deductible discount
  if (deductible >= 1000) base *= 0.85;
  else if (deductible >= 500) base *= 0.92;

  // Smoker
  if (data.smoker) base *= 1.35;

  return Math.round(base);
};

const steps = ['Basic Info', 'Coverage', 'Health', 'Your Quote'];

export const QuoteCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quote, setQuote] = useState<Partial<QuoteData>>({
    age: 35,
    zip: '',
    gender: 'male',
    coverageType: 'auto',
    coverageAmount: 100000,
    deductible: 500,
    smoker: false,
  });
  const [saved, setSaved] = useState(false);

  const currentPrice = calculatePrice(quote);

  const updateQuote = (updates: Partial<QuoteData>) => {
    setQuote((prev) => ({ ...prev, ...updates }));
  };

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const formatPrice = (p: number) => `$${p.toLocaleString()}`;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs font-bold uppercase tracking-widest">
          <Zap size={12} /> Get Your Quote in 60 Seconds
        </div>
        <h2 className="text-xl font-bold text-white">Instant Quote Calculator</h2>
        <p className="text-xs text-gray-500">No personal info sold. No spam.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {steps.map((step, idx) => (
          <div key={step} className="flex items-center flex-1">
            <div className={cn(
              'flex items-center gap-1.5 flex-1',
              idx < currentStep ? 'cursor-pointer' : ''
            )} onClick={() => idx < currentStep && setCurrentStep(idx)}>
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all',
                idx < currentStep ? 'bg-[#10B981] text-white'
                  : idx === currentStep ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                  : 'bg-white/[0.04] text-gray-600 border border-white/[0.08]'
              )}>
                {idx < currentStep ? <Check size={10} /> : idx + 1}
              </div>
              <span className={cn(
                'text-[10px] font-medium hidden sm:block',
                idx === currentStep ? 'text-gray-300' : 'text-gray-600'
              )}>{step}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={cn('h-px flex-1 mx-2', idx < currentStep ? 'bg-[#10B981]' : 'bg-white/10')} />
            )}
          </div>
        ))}
      </div>

      {/* Live price indicator */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#10B981]/[0.06] border border-[#10B981]/20">
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Estimated Monthly</p>
          <p className="text-3xl font-bold text-white tabular-nums">{formatPrice(currentPrice)}<span className="text-sm text-gray-500 font-normal">/mo</span></p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500">Annual savings</p>
          <p className="text-sm font-bold text-[#10B981]">Save ${Math.round(currentPrice * 12 * 0.1).toLocaleString()}</p>
          <p className="text-[10px] text-gray-600">with annual billing</p>
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-4 min-h-[200px]">
        {/* Step 1: Basic Info */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-300">Tell us about yourself</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Coverage Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['auto', 'home', 'health'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => updateQuote({ coverageType: type })}
                      className={cn(
                        'py-2 px-3 rounded-lg border text-xs font-medium capitalize transition-all',
                        quote.coverageType === type
                          ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                          : 'bg-white/[0.03] border-white/[0.08] text-gray-500 hover:border-white/20'
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Age</label>
                  <input
                    type="number"
                    value={quote.age}
                    onChange={(e) => updateQuote({ age: parseInt(e.target.value) || 0 })}
                    min="18" max="85"
                    className="w-full h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#10B981]/40"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">ZIP Code</label>
                  <input
                    type="text"
                    value={quote.zip}
                    onChange={(e) => updateQuote({ zip: e.target.value })}
                    placeholder="12345"
                    maxLength={5}
                    className="w-full h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#10B981]/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Gender</label>
                <div className="flex gap-2">
                  {(['male', 'female', 'other'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => updateQuote({ gender: g })}
                      className={cn(
                        'flex-1 py-1.5 rounded-lg border text-xs font-medium capitalize transition-all',
                        quote.gender === g
                          ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                          : 'bg-white/[0.03] border-white/[0.08] text-gray-500 hover:border-white/20'
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Coverage */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-300">Choose your coverage</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Coverage Amount</label>
                  <span className="text-xs font-bold text-[#10B981]">${(quote.coverageAmount ?? 100000).toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="25000" max="500000" step="25000"
                  value={quote.coverageAmount}
                  onChange={(e) => updateQuote({ coverageAmount: parseInt(e.target.value) })}
                  className="w-full accent-[#10B981]"
                />
                <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                  <span>$25K</span><span>$500K</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Deductible</label>
                  <span className="text-xs font-bold text-[#10B981]">${(quote.deductible ?? 500).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[250, 500, 1000, 2000].map((d) => (
                    <button
                      key={d}
                      onClick={() => updateQuote({ deductible: d })}
                      className={cn(
                        'py-1.5 rounded-lg border text-xs font-medium transition-all',
                        quote.deductible === d
                          ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                          : 'bg-white/[0.03] border-white/[0.08] text-gray-500 hover:border-white/20'
                      )}
                    >
                      ${d >= 1000 ? `${d/1000}K` : d}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-600 mt-1.5">Higher deductible = lower monthly premium</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Health */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-300">A few quick questions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <div>
                  <p className="text-sm font-medium text-gray-200">Do you smoke or use tobacco?</p>
                  <p className="text-xs text-gray-500 mt-0.5">Affects health & life insurance rates</p>
                </div>
                <button
                  onClick={() => updateQuote({ smoker: !quote.smoker })}
                  className={cn(
                    'relative w-11 h-6 rounded-full transition-colors shrink-0',
                    quote.smoker ? 'bg-[#10B981]' : 'bg-white/10'
                  )}
                  role="switch"
                  aria-checked={quote.smoker}
                >
                  <span className={cn(
                    'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                    quote.smoker ? 'translate-x-6' : 'translate-x-1'
                  )} />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/[0.05] border border-blue-500/20">
                <p className="text-xs text-blue-400 font-medium">💡 Your quote factors in:</p>
                <ul className="mt-2 space-y-1">
                  {[
                    `Age: ${quote.age} years old`,
                    `Coverage: $${(quote.coverageAmount ?? 100000).toLocaleString()}`,
                    `Deductible: $${(quote.deductible ?? 500).toLocaleString()}`,
                    quote.smoker ? 'Tobacco use: +35% adjustment' : 'Non-smoker: No adjustment',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <Check size={10} className="text-blue-400 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Your Quote */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-300">Your personalised quote is ready!</h3>

            <div className="rounded-xl bg-[#10B981]/[0.06] border border-[#10B981]/20 p-4 text-center">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Your monthly premium</p>
              <p className="text-5xl font-bold text-white tabular-nums my-2">{formatPrice(currentPrice)}</p>
              <p className="text-xs text-gray-500">or <span className="text-[#10B981] font-bold">{formatPrice(Math.round(currentPrice * 12 * 0.9))}/year</span> (save 10%)</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-center">
                <p className="text-[10px] text-gray-500">Coverage</p>
                <p className="text-sm font-bold text-gray-200">${(quote.coverageAmount ?? 100000).toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-center">
                <p className="text-[10px] text-gray-500">Deductible</p>
                <p className="text-sm font-bold text-gray-200">${(quote.deductible ?? 500).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSaved(true)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all',
                  saved
                    ? 'bg-[#10B981] text-white'
                    : 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] hover:bg-[#10B981]/25'
                )}
              >
                {saved ? <><Check size={13} /> Saved!</> : <><Check size={13} /> Save Quote</>}
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-bold text-gray-400 hover:bg-white/[0.07] transition-all">
                <Mail size={13} /> Email Me
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-bold text-gray-400 hover:bg-white/[0.07] transition-all">
                <Share2 size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentStep > 0 && (
          <button
            onClick={prev}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-gray-400 hover:bg-white/[0.07] transition-all"
          >
            <ChevronLeft size={14} /> Back
          </button>
        )}
        {currentStep < steps.length - 1 && (
          <button
            onClick={next}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#10B981] text-white text-xs font-bold hover:bg-[#059669] transition-all"
          >
            Continue <ChevronRight size={14} />
          </button>
        )}
        {currentStep === steps.length - 1 && (
          <button className="flex-1 py-2.5 rounded-lg bg-[#10B981] text-white text-xs font-bold hover:bg-[#059669] transition-all">
            Get This Policy →
          </button>
        )}
      </div>
    </div>
  );
};
