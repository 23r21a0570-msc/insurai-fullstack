import { useState, useRef } from 'react';
import { Camera, Scan, CheckCircle, DollarSign, Clock, ZoomIn, RefreshCw, Download, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useToast } from '@/context/ToastContext';

interface DamageResult {
  area: string;
  severity: 'minor' | 'moderate' | 'severe';
  estimatedCost: number;
  confidence: number;
  description: string;
}

const mockDamageResults: DamageResult[] = [
  { area: 'Front Bumper', severity: 'moderate', estimatedCost: 1850, confidence: 91, description: 'Cracked bumper cover with paint damage. Replacement recommended.' },
  { area: 'Hood', severity: 'minor', estimatedCost: 650, confidence: 87, description: 'Surface scratches and small dents. PDR treatment possible.' },
  { area: 'Headlight Assembly', severity: 'severe', estimatedCost: 2400, confidence: 94, description: 'Shattered housing. Full replacement required.' },
  { area: 'Fender (Left)', severity: 'moderate', estimatedCost: 1200, confidence: 88, description: 'Creased metal with paint damage. Repair and respray needed.' },
];

const severityConfig = {
  minor: { color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', label: 'Minor' },
  moderate: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', label: 'Moderate' },
  severe: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', label: 'Severe' },
};

export const ARDamageAssessment = ({ onEstimateReady }: { onEstimateReady?: (total: number) => void }) => {
  const [phase, setPhase] = useState<'idle' | 'camera' | 'scanning' | 'results'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [results, setResults] = useState<DamageResult[]>([]);
  const [selectedArea, setSelectedArea] = useState<DamageResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { success, info } = useToast();

  const startScan = () => {
    setPhase('scanning');
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setResults(mockDamageResults);
          setPhase('results');
          const total = mockDamageResults.reduce((sum, r) => sum + r.estimatedCost, 0);
          onEstimateReady?.(total);
          success('AI Assessment Complete', `Estimated damage: $${total.toLocaleString()}`);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      info('Photo received', 'Running AI damage detection...');
      setPhase('camera');
      setTimeout(startScan, 800);
    }
  };

  const totalEstimate = results.reduce((sum, r) => sum + r.estimatedCost, 0);
  const totalLabor = Math.round(totalEstimate * 0.35);
  const totalParts = totalEstimate - totalLabor;

  const reset = () => {
    setPhase('idle');
    setScanProgress(0);
    setResults([]);
    setSelectedArea(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Scan className="text-amber-400" size={22} /> AI Damage Assessment
          </h2>
          <p className="text-sm text-gray-500">Take photos of damage — AI estimates repair costs instantly</p>
        </div>
        {phase === 'results' && (
          <button onClick={reset} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <RefreshCw size={12} /> Rescan
          </button>
        )}
      </div>

      {/* Idle state */}
      {phase === 'idle' && (
        <GlassPanel className="text-center py-12">
          <div className="w-20 h-20 rounded-2xl bg-amber-400/10 flex items-center justify-center mx-auto mb-6">
            <Camera size={40} className="text-amber-400" />
          </div>
          <h3 className="text-lg font-bold mb-2">Capture Damage Photos</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8">
            Take or upload photos of the damaged area. Our AI will analyze damage severity and estimate repair costs in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-400/20 transition-all font-medium"
            >
              <Camera size={18} /> Upload Photo
            </button>
            <button
              onClick={() => { setPhase('camera'); setTimeout(startScan, 500); }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 border border-[#10B981]/20 transition-all font-medium"
            >
              <Scan size={18} /> Demo Scan
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />

          <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white font-bold">1</div>
              <span>Take photo</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white font-bold">2</div>
              <span>AI analyzes damage</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white font-bold">3</div>
              <span>Get instant estimate</span>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Camera / prep phase */}
      {phase === 'camera' && (
        <GlassPanel className="text-center py-8">
          <div className="w-16 h-16 rounded-xl bg-amber-400/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Camera size={32} className="text-amber-400" />
          </div>
          <p className="text-sm text-gray-400">Preparing AI vision engine...</p>
        </GlassPanel>
      )}

      {/* Scanning */}
      {phase === 'scanning' && (
        <GlassPanel>
          {/* Mock camera view with scan overlay */}
          <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 mb-4">
            {/* Simulated damaged car */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">🚗</div>
                <p className="text-xs text-gray-500">Scanning vehicle...</p>
              </div>
            </div>

            {/* Scan line animation */}
            <div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
              style={{ top: `${scanProgress}%`, transition: 'top 0.1s linear' }}
            />

            {/* Corner markers */}
            {['top-2 left-2 border-l-2 border-t-2', 'top-2 right-2 border-r-2 border-t-2', 'bottom-2 left-2 border-l-2 border-b-2', 'bottom-2 right-2 border-r-2 border-b-2'].map((c, i) => (
              <div key={i} className={cn('absolute w-6 h-6 border-amber-400', c)} />
            ))}

            {/* Detected areas */}
            {scanProgress > 30 && (
              <div className="absolute top-8 left-8 border-2 border-red-400 w-24 h-16 rounded-lg animate-pulse">
                <span className="text-[9px] text-red-400 bg-black/60 px-1">Front Bumper</span>
              </div>
            )}
            {scanProgress > 50 && (
              <div className="absolute top-4 left-28 border-2 border-amber-400 w-20 h-10 rounded-lg animate-pulse">
                <span className="text-[9px] text-amber-400 bg-black/60 px-1">Hood</span>
              </div>
            )}
            {scanProgress > 70 && (
              <div className="absolute top-8 right-8 border-2 border-red-400 w-16 h-14 rounded-lg animate-pulse">
                <span className="text-[9px] text-red-400 bg-black/60 px-1">Headlight</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">AI Analysis Progress</span>
              <span className="font-mono font-bold text-amber-400">{scanProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-100"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Object Detection', 'Damage Classification', 'Cost Estimation', 'Report Generation'].map((step, i) => (
                <span
                  key={step}
                  className={cn('text-[10px] px-2 py-0.5 rounded-full', scanProgress > (i + 1) * 22 ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-white/5 text-gray-600')}
                >
                  {scanProgress > (i + 1) * 22 ? '✓ ' : ''}{step}
                </span>
              ))}
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Results */}
      {phase === 'results' && (
        <div className="space-y-4">
          {/* Summary */}
          <GlassPanel className="bg-amber-500/5 border-amber-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400">
                  <DollarSign size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Total Damage Estimate</p>
                  <p className="text-3xl font-bold">${totalEstimate.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Processing time</p>
                <p className="text-sm font-bold flex items-center gap-1 justify-end"><Clock size={14} /> 3.7 seconds</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 text-center">
              <div>
                <p className="text-lg font-bold">${totalParts.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Parts</p>
              </div>
              <div>
                <p className="text-lg font-bold">${totalLabor.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Labor</p>
              </div>
              <div>
                <p className="text-lg font-bold text-amber-400">{results.length} Areas</p>
                <p className="text-xs text-gray-500">Affected</p>
              </div>
            </div>
          </GlassPanel>

          {/* Damage breakdown */}
          <div className="grid grid-cols-1 gap-3">
            {results.map(result => {
              const cfg = severityConfig[result.severity];
              const isSelected = selectedArea?.area === result.area;
              return (
                <button
                  key={result.area}
                  onClick={() => setSelectedArea(isSelected ? null : result)}
                  className={cn('text-left p-4 rounded-xl border transition-all', isSelected ? `${cfg.bg} ${cfg.border}` : 'bg-white/[0.02] border-white/5 hover:border-white/10')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={cn('text-[10px] px-2 py-0.5 rounded font-bold uppercase', cfg.bg, cfg.color, `border ${cfg.border}`)}>
                        {cfg.label}
                      </span>
                      <span className="font-semibold">{result.area}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold font-mono">${result.estimatedCost.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">{result.confidence}% confident</span>
                      <ChevronRight size={16} className={cn('text-gray-500 transition-transform', isSelected && 'rotate-90')} />
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-sm text-gray-300">{result.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-white/5">
                          <div className={cn('h-full rounded-full', cfg.bg.replace('bg-', 'bg-').replace('/10', '/40'))} style={{ width: `${result.confidence}%`, backgroundColor: cfg.color.replace('text-', '') }} />
                        </div>
                        <span className="text-xs text-gray-500">AI confidence</span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 border border-[#10B981]/20 transition-all font-medium text-sm">
              <CheckCircle size={16} /> Use This Estimate
            </button>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-gray-300 text-sm">
              <Download size={16} /> Download Report
            </button>
            <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-gray-300 text-sm">
              <ZoomIn size={16} /> Add Photo
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
        </div>
      )}
    </div>
  );
};
