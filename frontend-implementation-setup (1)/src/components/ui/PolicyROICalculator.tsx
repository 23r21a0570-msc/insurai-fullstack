import { useState } from 'react';
import { TrendingUp, Shield, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface ROIData {
  year: number;
  premium: number;
  claimsReceived: number;
  netValue: number;
  coverageUtilization: number;
}

export const PolicyROICalculator = () => {
  const [inputs, setInputs] = useState({
    annualPremium: 1200,
    coverageAmount: 150000,
    yearsHeld: 3,
    claimsFiled: 1,
    avgClaimAmount: 8500,
    deductible: 1000,
  });
  const [showDetails, setShowDetails] = useState(false);

  const update = (key: string, val: number) =>
    setInputs(prev => ({ ...prev, [key]: val }));

  // Calculations
  const totalPremiumsPaid = inputs.annualPremium * inputs.yearsHeld;
  const totalClaimsReceived = Math.max(0, inputs.claimsFiled * inputs.avgClaimAmount - inputs.deductible * inputs.claimsFiled);
  const netValue = totalClaimsReceived - totalPremiumsPaid;
  const roi = totalPremiumsPaid > 0 ? ((totalClaimsReceived / totalPremiumsPaid) * 100) : 0;
  const breakEvenYear = inputs.annualPremium > 0 ? Math.ceil(totalClaimsReceived / inputs.annualPremium) : 0;
  const coverageAdequacy = inputs.coverageAmount > 0 ? Math.min((inputs.coverageAmount / 200000) * 100, 100) : 0;

  const yearlyData: ROIData[] = Array.from({ length: inputs.yearsHeld }, (_, i) => {
    const yr = i + 1;
    const premPaid = inputs.annualPremium * yr;
    const claimsRec = yr === inputs.yearsHeld ? totalClaimsReceived : 0;
    return {
      year: yr,
      premium: inputs.annualPremium,
      claimsReceived: claimsRec,
      netValue: claimsRec - premPaid,
      coverageUtilization: Math.round((inputs.avgClaimAmount / inputs.coverageAmount) * 100),
    };
  });

  const adequacyLabel = coverageAdequacy >= 80 ? 'Excellent' : coverageAdequacy >= 50 ? 'Good' : 'Consider increasing';
  const adequacyColor = coverageAdequacy >= 80 ? 'text-emerald-400' : coverageAdequacy >= 50 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="text-emerald-400" size={20} />
          Policy ROI Calculator
        </h3>
        <p className="text-xs text-gray-500 mt-1">Understand the value you're getting from your coverage</p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Annual Premium ($)', key: 'annualPremium', min: 100, max: 10000, step: 100 },
          { label: 'Coverage Amount ($)', key: 'coverageAmount', min: 10000, max: 1000000, step: 10000 },
          { label: 'Years Held', key: 'yearsHeld', min: 1, max: 20, step: 1 },
          { label: 'Claims Filed', key: 'claimsFiled', min: 0, max: 10, step: 1 },
          { label: 'Avg Claim Amount ($)', key: 'avgClaimAmount', min: 0, max: 100000, step: 500 },
          { label: 'Deductible ($)', key: 'deductible', min: 0, max: 5000, step: 250 },
        ].map(field => (
          <div key={field.key}>
            <div className="flex justify-between mb-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">{field.label}</label>
              <span className="text-xs font-mono text-emerald-400">
                {field.key === 'yearsHeld' || field.key === 'claimsFiled'
                  ? inputs[field.key as keyof typeof inputs]
                  : formatCurrency(inputs[field.key as keyof typeof inputs])}
              </span>
            </div>
            <input
              type="range"
              min={field.min}
              max={field.max}
              step={field.step}
              value={inputs[field.key as keyof typeof inputs]}
              onChange={e => update(field.key, Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Premiums', value: formatCurrency(totalPremiumsPaid), color: 'text-gray-200', bg: 'bg-white/[0.03]' },
          { label: 'Claims Received', value: formatCurrency(totalClaimsReceived), color: 'text-blue-400', bg: 'bg-blue-500/[0.05]' },
          { label: 'Net Value', value: `${netValue >= 0 ? '+' : ''}${formatCurrency(netValue)}`, color: netValue >= 0 ? 'text-emerald-400' : 'text-red-400', bg: netValue >= 0 ? 'bg-emerald-500/[0.05]' : 'bg-red-500/[0.05]' },
          { label: 'Claim ROI', value: `${roi.toFixed(0)}%`, color: roi >= 100 ? 'text-emerald-400' : 'text-amber-400', bg: 'bg-amber-500/[0.05]' },
        ].map(item => (
          <div key={item.label} className={cn('p-3 rounded-xl border border-white/[0.06] text-center', item.bg)}>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide mb-1">{item.label}</p>
            <p className={cn('text-base font-bold font-mono', item.color)}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Coverage Adequacy */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-white flex items-center gap-2">
            <Shield size={16} className="text-emerald-400" /> Coverage Adequacy
          </p>
          <span className={cn('text-xs font-bold', adequacyColor)}>{adequacyLabel}</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-700', coverageAdequacy >= 80 ? 'bg-emerald-500' : coverageAdequacy >= 50 ? 'bg-amber-500' : 'bg-red-500')}
            style={{ width: `${coverageAdequacy}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          Your coverage of {formatCurrency(inputs.coverageAmount)} covers ~{Math.round(coverageAdequacy)}% of recommended amount for this policy type.
        </p>
      </div>

      {/* Insights */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2">
        <p className="text-sm font-bold text-gray-300 flex items-center gap-2"><Info size={14} className="text-blue-400" /> Insights</p>
        <ul className="space-y-1.5 text-xs text-gray-400">
          <li>• You've paid {formatCurrency(totalPremiumsPaid)} in premiums over {inputs.yearsHeld} year{inputs.yearsHeld > 1 ? 's' : ''}</li>
          <li>• {inputs.claimsFiled === 0 ? 'No claims filed — you may qualify for a no-claims discount' : `Received ${formatCurrency(totalClaimsReceived)} back from ${inputs.claimsFiled} claim${inputs.claimsFiled > 1 ? 's' : ''}`}</li>
          {breakEvenYear > 0 && inputs.claimsFiled > 0 && <li>• Break-even in year {breakEvenYear} based on current claim rate</li>}
          {netValue < 0 && <li>• That's {formatCurrency(Math.abs(netValue))} more paid than received — but you had {formatCurrency(inputs.coverageAmount)} protection the whole time</li>}
          <li>• Average industry ROI for {inputs.yearsHeld === 1 ? '1 year' : `${inputs.yearsHeld} years`}: 40-80%</li>
        </ul>
      </div>

      {/* Year-by-year */}
      <button
        onClick={() => setShowDetails(v => !v)}
        className="flex items-center gap-2 text-xs text-gray-500 hover:text-emerald-400 transition-colors"
      >
        {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showDetails ? 'Hide' : 'Show'} year-by-year breakdown
      </button>

      {showDetails && (
        <div className="overflow-x-auto animate-fade-in">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Year', 'Premium', 'Claims', 'Net', 'Claim %'].map(h => (
                  <th key={h} className="py-2 px-3 text-left text-gray-500 uppercase font-bold tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {yearlyData.map(row => (
                <tr key={row.year} className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-gray-400">Year {row.year}</td>
                  <td className="py-2 px-3 text-gray-300 font-mono">{formatCurrency(row.premium)}</td>
                  <td className="py-2 px-3 font-mono text-blue-400">{formatCurrency(row.claimsReceived)}</td>
                  <td className={cn('py-2 px-3 font-mono font-bold', row.netValue >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {row.netValue >= 0 ? '+' : ''}{formatCurrency(row.netValue)}
                  </td>
                  <td className="py-2 px-3 text-gray-400">{row.coverageUtilization}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
