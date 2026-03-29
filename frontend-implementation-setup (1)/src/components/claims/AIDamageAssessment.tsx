import { useState, useRef } from 'react';
import { Camera, Upload, Zap, AlertTriangle, CheckCircle, X, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatters';
import { useToast } from '@/context/ToastContext';

interface DamageResult {
  severity: 'minor' | 'moderate' | 'severe' | 'total_loss';
  confidence: number;
  estimatedCost: number;
  components: { part: string; damage: string; cost: number }[];
  recommendation: string;
}

const MOCK_RESULTS: DamageResult[] = [
  {
    severity: 'moderate',
    confidence: 89,
    estimatedCost: 4800,
    components: [
      { part: 'Front Bumper', damage: 'Cracked & dented', cost: 1200 },
      { part: 'Hood', damage: 'Dented, paint damage', cost: 1800 },
      { part: 'Headlights (Left)', damage: 'Shattered assembly', cost: 950 },
      { part: 'Radiator Grille', damage: 'Broken mounting', cost: 450 },
      { part: 'Fender (Left)', damage: 'Minor dents', cost: 400 },
    ],
    recommendation: 'Moderate collision damage. Vehicle is repairable. Recommend getting 2 additional quotes.',
  },
  {
    severity: 'minor',
    confidence: 94,
    estimatedCost: 1200,
    components: [
      { part: 'Rear Bumper', damage: 'Surface scratches', cost: 600 },
      { part: 'Trunk Lid', damage: 'Minor dent', cost: 400 },
      { part: 'Tail Light (Right)', damage: 'Cracked lens', cost: 200 },
    ],
    recommendation: 'Minor collision damage. Straightforward repair expected within 3-5 days.',
  },
  {
    severity: 'severe',
    confidence: 82,
    estimatedCost: 18500,
    components: [
      { part: 'Frame/Chassis', damage: 'Structural deformation', cost: 7500 },
      { part: 'Engine Compartment', damage: 'Fire/heat damage', cost: 5000 },
      { part: 'Airbag System', damage: 'All deployed', cost: 3200 },
      { part: 'Electrical System', damage: 'Major damage', cost: 1800 },
      { part: 'Interior Dashboard', damage: 'Destroyed', cost: 1000 },
    ],
    recommendation: 'Severe structural damage detected. Vehicle may be declared a total loss. Adjuster inspection required.',
  },
];

const severityConfig = {
  minor:      { label: 'Minor Damage',  color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  moderate:   { label: 'Moderate',      color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  severe:     { label: 'Severe Damage', color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20' },
  total_loss: { label: 'Total Loss',    color: 'text-red-500',     bg: 'bg-red-500/15',     border: 'border-red-500/30' },
};

interface AIDamageAssessmentProps {
  onEstimateApplied?: (amount: number) => void;
}

export const AIDamageAssessment = ({ onEstimateApplied }: AIDamageAssessmentProps) => {
  const [stage, setStage] = useState<'idle' | 'uploaded' | 'analyzing' | 'result'>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DamageResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { success } = useToast();

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStage('uploaded');
  };

  const runAnalysis = () => {
    setStage('analyzing');
    setAnalysisProgress(0);
    const steps = [10, 25, 40, 58, 72, 85, 95, 100];
    steps.forEach((progress, i) => {
      setTimeout(() => {
        setAnalysisProgress(progress);
        if (progress === 100) {
          setTimeout(() => {
            const mockResult = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
            setResult(mockResult);
            setStage('result');
          }, 400);
        }
      }, i * 400);
    });
  };

  const reset = () => {
    setStage('idle');
    setPreviewUrl(null);
    setResult(null);
    setAnalysisProgress(0);
  };

  const applyEstimate = () => {
    if (result && onEstimateApplied) {
      onEstimateApplied(result.estimatedCost);
      success('Estimate applied', `${formatCurrency(result.estimatedCost)} added to claim amount.`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-[#10B981]" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Damage Assessment</p>
        </div>
        {stage !== 'idle' && (
          <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1">
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </div>

      {/* Idle — upload zone */}
      {stage === 'idle' && (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] p-8 cursor-pointer hover:border-[#10B981]/30 hover:bg-[#10B981]/[0.02] transition-all"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/10 text-[#10B981]">
            <Camera size={22} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-300">Upload damage photo</p>
            <p className="text-xs text-gray-600 mt-1">AI will estimate repair costs instantly</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-gray-700">
            <span className="flex items-center gap-1"><Camera size={10} /> Camera</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Upload size={10} /> File</span>
          </div>
          <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileSelect(e.target.files)} />
        </div>
      )}

      {/* Uploaded — preview */}
      {stage === 'uploaded' && previewUrl && (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-white/[0.08]">
            <img src={previewUrl} alt="Damage" className="w-full h-48 object-cover" />
            <button onClick={reset} className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all">
              <X size={14} />
            </button>
          </div>
          <button
            onClick={runAnalysis}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#10B981]/15 text-[#10B981] font-bold text-sm border border-[#10B981]/20 hover:bg-[#10B981]/25 transition-all"
          >
            <Zap size={16} /> Analyze Damage with AI
          </button>
        </div>
      )}

      {/* Analyzing */}
      {stage === 'analyzing' && (
        <div className="space-y-4 p-6 rounded-xl border border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#10B981]/30 border-t-[#10B981] animate-spin" />
            <div>
              <p className="text-sm font-bold text-gray-200">Analyzing damage...</p>
              <p className="text-xs text-gray-500">Processing image with AI model v3.1</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                {analysisProgress < 30 ? 'Detecting damage regions...'
                  : analysisProgress < 60 ? 'Classifying component damage...'
                  : analysisProgress < 90 ? 'Estimating repair costs...'
                  : 'Generating report...'}
              </span>
              <span className="font-mono text-[#10B981]">{analysisProgress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#10B981] transition-all duration-400"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
          </div>
          {[
            { step: 10, label: 'Image preprocessing' },
            { step: 40, label: 'Damage detection' },
            { step: 70, label: 'Cost estimation' },
            { step: 95, label: 'Report compilation' },
          ].map(({ step, label }) => (
            <div key={step} className={cn('flex items-center gap-2 text-xs transition-colors', analysisProgress >= step ? 'text-[#10B981]' : 'text-gray-700')}>
              {analysisProgress >= step ? <CheckCircle size={12} /> : <div className="w-3 h-3 rounded-full border border-current" />}
              {label}
            </div>
          ))}
        </div>
      )}

      {/* Result */}
      {stage === 'result' && result && (() => {
        const cfg = severityConfig[result.severity];
        return (
          <div className="space-y-3">
            {/* Severity header */}
            <div className={cn('flex items-center justify-between p-4 rounded-xl border', cfg.bg, cfg.border)}>
              <div className="flex items-center gap-3">
                <AlertTriangle size={18} className={cfg.color} />
                <div>
                  <p className={cn('text-sm font-bold', cfg.color)}>{cfg.label}</p>
                  <p className="text-xs text-gray-500">AI Confidence: {result.confidence}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Estimated Cost</p>
                <p className="text-xl font-bold text-white tabular-nums">{formatCurrency(result.estimatedCost)}</p>
              </div>
            </div>

            {/* Component breakdown */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
              <div className="px-4 py-2.5 border-b border-white/[0.06]">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Component Breakdown</p>
              </div>
              {result.components.map((comp, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-200">{comp.part}</p>
                    <p className="text-xs text-gray-500">{comp.damage}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-300 tabular-nums">{formatCurrency(comp.cost)}</p>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/[0.06] border border-blue-500/20">
              <Zap size={14} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">{result.recommendation}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {onEstimateApplied && (
                <button
                  onClick={applyEstimate}
                  className="flex-1 py-2.5 rounded-xl bg-[#10B981]/15 text-[#10B981] text-sm font-bold border border-[#10B981]/20 hover:bg-[#10B981]/25 transition-all"
                >
                  Apply Estimate to Claim
                </button>
              )}
              <button onClick={reset} className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-gray-400 text-sm font-medium border border-white/[0.08] hover:bg-white/[0.08] transition-all">
                New Photo
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
