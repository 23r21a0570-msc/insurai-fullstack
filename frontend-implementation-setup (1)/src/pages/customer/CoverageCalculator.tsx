import { useState } from 'react';
import { Calculator, Home, Car, Heart, Briefcase, ChevronRight, Info, Shield } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatters';

type CoverageType = 'auto' | 'home' | 'health' | 'life';

interface QuizAnswers {
  type: CoverageType;
  // Auto
  carValue: number;
  hasLoan: boolean;
  drivingRecord: 'clean' | 'minor' | 'major';
  // Home
  homeValue: number;
  hasPool: boolean;
  homeAge: 'new' | 'mid' | 'old';
  // Health
  age: number;
  smoker: boolean;
  familySize: number;
  // Life
  income: number;
  dependents: number;
  hasDebts: boolean;
}

const TYPE_OPTIONS: { id: CoverageType; label: string; icon: typeof Car; desc: string }[] = [
  { id: 'auto',   label: 'Auto',   icon: Car,       desc: 'Vehicle protection' },
  { id: 'home',   label: 'Home',   icon: Home,      desc: 'Property coverage' },
  { id: 'health', label: 'Health', icon: Heart,     desc: 'Medical coverage' },
  { id: 'life',   label: 'Life',   icon: Briefcase, desc: 'Income protection' },
];

const DRIVING_OPTIONS = [
  { value: 'clean', label: 'Clean record' },
  { value: 'minor', label: '1–2 minor incidents' },
  { value: 'major', label: '3+ or major incidents' },
];

// Simple coverage estimator
function estimateCoverage(answers: QuizAnswers): {
  recommended: number;
  premium: number;
  deductible: number;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (answers.type === 'auto') {
    let coverage = answers.carValue;
    let premium = Math.round(coverage * 0.018);
    if (answers.hasLoan) { coverage += 10000; reasons.push('Loan requires comprehensive coverage'); }
    if (answers.drivingRecord === 'minor') { premium = Math.round(premium * 1.2); reasons.push('+20% for minor incidents on record'); }
    if (answers.drivingRecord === 'major') { premium = Math.round(premium * 1.5); reasons.push('+50% for major incidents on record'); }
    reasons.push(`Base coverage matches vehicle value ($${answers.carValue.toLocaleString()})`);
    return { recommended: coverage, premium, deductible: 1000, reasons };
  }

  if (answers.type === 'home') {
    let coverage = answers.homeValue;
    let premium = Math.round(coverage * 0.005);
    if (answers.hasPool) { premium = Math.round(premium * 1.15); reasons.push('+15% liability for swimming pool'); }
    if (answers.homeAge === 'old') { premium = Math.round(premium * 1.2); reasons.push('+20% for older home structure'); }
    reasons.push('Replacement cost coverage recommended for your home value');
    return { recommended: coverage, premium, deductible: 2500, reasons };
  }

  if (answers.type === 'health') {
    const baseCoverage = 100000 * answers.familySize;
    let premium = 400 + (answers.age * 10) + (answers.familySize * 150);
    if (answers.smoker) { premium = Math.round(premium * 1.4); reasons.push('+40% tobacco surcharge'); }
    reasons.push(`Coverage scaled for family of ${answers.familySize}`);
    reasons.push(`Age-adjusted base rate applied`);
    return { recommended: baseCoverage, premium, deductible: 500, reasons };
  }

  // Life
  const recommended = answers.income * 10 + (answers.dependents * 50000);
  let premium = Math.round(recommended * 0.003);
  if (answers.hasDebts) { reasons.push('Additional coverage recommended to cover outstanding debts'); }
  reasons.push(`10× annual income rule applied ($${answers.income.toLocaleString()}/yr)`);
  reasons.push(`${answers.dependents} dependents factored in`);
  return { recommended, premium, deductible: 0, reasons };
}

export const CoverageCalculator = () => {
  const { success } = useToast();
  const [step, setStep] = useState<'type' | 'details' | 'result'>('type');
  const [answers, setAnswers] = useState<QuizAnswers>({
    type: 'auto',
    carValue: 30000,
    hasLoan: true,
    drivingRecord: 'clean',
    homeValue: 350000,
    hasPool: false,
    homeAge: 'mid',
    age: 35,
    smoker: false,
    familySize: 2,
    income: 80000,
    dependents: 2,
    hasDebts: true,
  });

  const set = <K extends keyof QuizAnswers>(k: K, v: QuizAnswers[K]) =>
    setAnswers((p) => ({ ...p, [k]: v }));

  const result = step === 'result' ? estimateCoverage(answers) : null;

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calculator className="text-[#10B981]" size={24} /> Coverage Calculator
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Answer a few quick questions and we'll recommend the right coverage amount for you.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {(['type', 'details', 'result'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors',
              step === s ? 'bg-[#10B981] text-white' :
              (['type', 'details', 'result'].indexOf(step) > i) ? 'bg-[#10B981]/30 text-[#10B981]' :
              'bg-white/5 text-gray-600'
            )}>
              {i + 1}
            </div>
            <span className={cn('text-xs font-medium capitalize', step === s ? 'text-white' : 'text-gray-600')}>{s}</span>
            {i < 2 && <ChevronRight size={14} className="text-gray-700" />}
          </div>
        ))}
      </div>

      {/* Step 1: Type */}
      {step === 'type' && (
        <GlassPanel className="space-y-6">
          <h2 className="text-sm font-bold text-gray-300">What type of coverage are you exploring?</h2>
          <div className="grid grid-cols-2 gap-3">
            {TYPE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => set('type', opt.id)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-5 rounded-xl border transition-all text-center',
                    answers.type === opt.id
                      ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981]'
                      : 'bg-white/[0.02] border-white/[0.06] text-gray-400 hover:border-white/20'
                  )}
                >
                  <Icon size={24} />
                  <span className="text-sm font-bold">{opt.label}</span>
                  <span className="text-xs opacity-70">{opt.desc}</span>
                </button>
              );
            })}
          </div>
          <Button className="w-full" onClick={() => setStep('details')} rightIcon={<ChevronRight size={14} />}>
            Continue
          </Button>
        </GlassPanel>
      )}

      {/* Step 2: Details */}
      {step === 'details' && (
        <GlassPanel className="space-y-6">
          <h2 className="text-sm font-bold text-gray-300 capitalize">{answers.type} Coverage Details</h2>

          {/* AUTO */}
          {answers.type === 'auto' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Vehicle Value: <span className="text-[#10B981]">{formatCurrency(answers.carValue)}</span>
                </label>
                <input
                  type="range" min={5000} max={100000} step={1000}
                  value={answers.carValue}
                  onChange={(e) => set('carValue', +e.target.value)}
                  className="w-full accent-[#10B981]"
                />
                <div className="flex justify-between text-xs text-gray-600"><span>$5K</span><span>$100K</span></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                <span className="text-sm text-gray-300">Have a car loan?</span>
                <button
                  onClick={() => set('hasLoan', !answers.hasLoan)}
                  className={cn('h-5 w-9 rounded-full transition-colors', answers.hasLoan ? 'bg-[#10B981]' : 'bg-white/10')}
                >
                  <span className={cn('block h-4 w-4 mx-0.5 rounded-full bg-white shadow transition-transform', answers.hasLoan && 'translate-x-4')} />
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Driving Record</label>
                <div className="grid grid-cols-3 gap-2">
                  {DRIVING_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => set('drivingRecord', opt.value as QuizAnswers['drivingRecord'])}
                      className={cn(
                        'p-2 rounded-lg text-xs font-medium border transition-all',
                        answers.drivingRecord === opt.value
                          ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981]'
                          : 'bg-white/[0.02] border-white/[0.06] text-gray-400 hover:border-white/20'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* HOME */}
          {answers.type === 'home' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Home Value: <span className="text-[#10B981]">{formatCurrency(answers.homeValue)}</span>
                </label>
                <input type="range" min={50000} max={2000000} step={10000}
                  value={answers.homeValue} onChange={(e) => set('homeValue', +e.target.value)}
                  className="w-full accent-[#10B981]" />
                <div className="flex justify-between text-xs text-gray-600"><span>$50K</span><span>$2M</span></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                <span className="text-sm text-gray-300">Swimming pool?</span>
                <button onClick={() => set('hasPool', !answers.hasPool)}
                  className={cn('h-5 w-9 rounded-full transition-colors', answers.hasPool ? 'bg-[#10B981]' : 'bg-white/10')}>
                  <span className={cn('block h-4 w-4 mx-0.5 rounded-full bg-white shadow transition-transform', answers.hasPool && 'translate-x-4')} />
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Home Age</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ value: 'new', label: '< 10 years' }, { value: 'mid', label: '10–30 years' }, { value: 'old', label: '30+ years' }].map((opt) => (
                    <button key={opt.value} onClick={() => set('homeAge', opt.value as QuizAnswers['homeAge'])}
                      className={cn('p-2 rounded-lg text-xs font-medium border transition-all',
                        answers.homeAge === opt.value ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981]' : 'bg-white/[0.02] border-white/[0.06] text-gray-400 hover:border-white/20')}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* HEALTH */}
          {answers.type === 'health' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Age: <span className="text-[#10B981]">{answers.age}</span></label>
                <input type="range" min={18} max={75} value={answers.age} onChange={(e) => set('age', +e.target.value)} className="w-full accent-[#10B981]" />
                <div className="flex justify-between text-xs text-gray-600"><span>18</span><span>75</span></div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Family Members to Cover: <span className="text-[#10B981]">{answers.familySize}</span></label>
                <input type="range" min={1} max={8} value={answers.familySize} onChange={(e) => set('familySize', +e.target.value)} className="w-full accent-[#10B981]" />
                <div className="flex justify-between text-xs text-gray-600"><span>1 (just you)</span><span>8</span></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                <span className="text-sm text-gray-300">Tobacco user?</span>
                <button onClick={() => set('smoker', !answers.smoker)}
                  className={cn('h-5 w-9 rounded-full transition-colors', answers.smoker ? 'bg-red-500' : 'bg-white/10')}>
                  <span className={cn('block h-4 w-4 mx-0.5 rounded-full bg-white shadow transition-transform', answers.smoker && 'translate-x-4')} />
                </button>
              </div>
            </div>
          )}

          {/* LIFE */}
          {answers.type === 'life' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Annual Income: <span className="text-[#10B981]">{formatCurrency(answers.income)}</span>
                </label>
                <input type="range" min={20000} max={500000} step={5000} value={answers.income} onChange={(e) => set('income', +e.target.value)} className="w-full accent-[#10B981]" />
                <div className="flex justify-between text-xs text-gray-600"><span>$20K</span><span>$500K</span></div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Number of Dependents: <span className="text-[#10B981]">{answers.dependents}</span></label>
                <input type="range" min={0} max={8} value={answers.dependents} onChange={(e) => set('dependents', +e.target.value)} className="w-full accent-[#10B981]" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>8</span></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                <span className="text-sm text-gray-300">Outstanding debts (mortgage, loans)?</span>
                <button onClick={() => set('hasDebts', !answers.hasDebts)}
                  className={cn('h-5 w-9 rounded-full transition-colors', answers.hasDebts ? 'bg-[#10B981]' : 'bg-white/10')}>
                  <span className={cn('block h-4 w-4 mx-0.5 rounded-full bg-white shadow transition-transform', answers.hasDebts && 'translate-x-4')} />
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setStep('type')}>Back</Button>
            <Button className="flex-1" onClick={() => setStep('result')} rightIcon={<Calculator size={14} />}>
              Calculate Coverage
            </Button>
          </div>
        </GlassPanel>
      )}

      {/* Step 3: Result */}
      {step === 'result' && result && (
        <div className="space-y-4">
          <GlassPanel className="border-[#10B981]/20 bg-[#10B981]/[0.03]">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-[#10B981]" size={20} />
              <h2 className="text-sm font-bold text-[#10B981] uppercase tracking-widest">Recommended Coverage</h2>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Coverage</p>
                <p className="text-lg font-bold text-white tabular-nums">{formatCurrency(result.recommended)}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Est. Premium</p>
                <p className="text-lg font-bold text-[#10B981] tabular-nums">{formatCurrency(result.premium)}<span className="text-xs text-gray-500">/yr</span></p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Deductible</p>
                <p className="text-lg font-bold text-white tabular-nums">{result.deductible === 0 ? 'N/A' : formatCurrency(result.deductible)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <Info size={12} /> Why this coverage?
              </p>
              <ul className="space-y-1">
                {result.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="text-[#10B981] mt-0.5 shrink-0">·</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </GlassPanel>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep('details')}>Recalculate</Button>
            <Button
              className="flex-1"
              leftIcon={<Shield size={14} />}
              onClick={() => { success('Quote saved!', 'Your recommended coverage has been saved. Proceed to get a quote.'); }}
            >
              Get a Quote for This Coverage
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
