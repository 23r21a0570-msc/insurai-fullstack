import { useState } from 'react';
import { Shield, Car, Home, Heart, Briefcase, QrCode, Download, Share2, Copy, Check, Smartphone } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { CustomerPolicy } from '@/data/mockData';
import { useToast } from '@/context/ToastContext';

const typeConfig: Record<string, { icon: React.ReactNode; gradient: string; label: string }> = {
  auto:     { icon: <Car size={28} />,       gradient: 'from-blue-600 to-blue-900',    label: 'Auto Insurance' },
  home:     { icon: <Home size={28} />,      gradient: 'from-amber-600 to-amber-900',  label: 'Home Insurance' },
  health:   { icon: <Heart size={28} />,     gradient: 'from-rose-600 to-rose-900',    label: 'Health Insurance' },
  life:     { icon: <Shield size={28} />,    gradient: 'from-purple-600 to-purple-900',label: 'Life Insurance' },
  business: { icon: <Briefcase size={28} />, gradient: 'from-orange-600 to-orange-900',label: 'Business Insurance' },
};

interface DigitalPolicyCardProps {
  policy: CustomerPolicy;
  holderName?: string;
}

export const DigitalPolicyCard = ({ policy, holderName = 'Maruthi' }: DigitalPolicyCardProps) => {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const { success } = useToast();
  const config = typeConfig[policy.type] || typeConfig.auto;

  const copyPolicyNumber = () => {
    navigator.clipboard.writeText(policy.policyNumber).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    success('Copied!', `Policy number ${policy.policyNumber} copied`);
  };

  const downloadCard = () => {
    success('Downloading', 'Your digital policy card is being prepared');
  };

  const shareCard = () => {
    if (navigator.share) {
      navigator.share({ title: `Insurance Policy ${policy.policyNumber}`, text: `My ${config.label} — ${policy.policyNumber}` });
    } else {
      success('Link copied', 'Policy card link copied to clipboard');
    }
  };

  return (
    <div className="space-y-4">
      {/* The Card */}
      <div className={cn(
        'relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-gradient-to-br shadow-2xl cursor-pointer select-none',
        config.gradient
      )}
        style={{ aspectRatio: '1.586' }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-4 border-white" />
          <div className="absolute top-8 right-8 w-24 h-24 rounded-full border-4 border-white" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full border-4 border-white" />
        </div>

        <div className="relative h-full p-6 flex flex-col justify-between">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">INSURAI</p>
                <p className="text-xs font-bold text-white">{config.label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/50 uppercase">Status</p>
              <p className={cn(
                'text-xs font-bold uppercase',
                policy.status === 'active' ? 'text-green-300' : 'text-yellow-300'
              )}>● {policy.status}</p>
            </div>
          </div>

          {/* Middle: icon */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-white">
              {config.icon}
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Policy Holder</p>
              <p className="text-base font-bold text-white">{holderName}</p>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Policy Number</p>
              <p className="text-sm font-mono font-bold text-white tracking-widest">{policy.policyNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Valid Until</p>
              <p className="text-sm font-mono font-bold text-white">{formatDate(policy.endDate, 'MM/yy')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage details strip */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Coverage', value: formatCurrency(policy.coverageAmount, true) },
          { label: 'Premium', value: `${formatCurrency(policy.premium)}/yr` },
          { label: 'Deductible', value: formatCurrency(policy.deductible) },
        ].map(item => (
          <div key={item.label} className="py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">{item.label}</p>
            <p className="text-xs font-bold text-white mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={copyPolicyNumber}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/10 transition-all"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy Number'}
        </button>
        <button
          onClick={() => setShowQR(v => !v)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all',
            showQR ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
          )}
        >
          <QrCode size={13} /> QR Code
        </button>
        <button
          onClick={downloadCard}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/10 transition-all"
        >
          <Download size={13} /> Download
        </button>
        <button
          onClick={shareCard}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/10 transition-all"
        >
          <Share2 size={13} /> Share
        </button>
        <button
          onClick={() => success('Wallet', 'Policy card added to digital wallet')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/10 transition-all"
        >
          <Smartphone size={13} /> Add to Wallet
        </button>
      </div>

      {/* QR Code (mock SVG) */}
      {showQR && (
        <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/[0.02] border border-white/[0.08] animate-fade-in">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Scan to verify</p>
          {/* Mock QR code using SVG */}
          <div className="w-32 h-32 bg-white rounded-lg p-2 flex items-center justify-center">
            <svg viewBox="0 0 21 21" className="w-full h-full">
              {/* Simple QR-like pattern */}
              {[
                [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
                [0,1],[6,1],[0,2],[2,2],[3,2],[4,2],[6,2],
                [0,3],[2,3],[4,3],[6,3],[0,4],[2,4],[3,4],[4,4],[6,4],
                [0,5],[6,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],
                [8,0],[10,0],[12,0],[9,1],[11,1],[8,2],[10,2],[12,2],
                [14,0],[15,0],[16,0],[17,0],[18,0],[19,0],[20,0],
                [14,1],[20,1],[14,2],[16,2],[18,2],[20,2],
                [14,3],[16,3],[18,3],[20,3],[14,4],[20,4],
                [14,5],[20,5],[14,6],[15,6],[16,6],[17,6],[18,6],[19,6],[20,6],
                [0,8],[2,8],[4,8],[6,8],[8,8],[1,9],[3,9],[5,9],[7,9],[9,9],
                [0,10],[2,10],[4,10],[6,10],[0,11],[1,11],[3,11],[5,11],
                [8,12],[9,12],[10,12],[8,13],[10,13],[8,14],[9,14],
                [14,8],[16,8],[18,8],[20,8],[15,9],[17,9],[19,9],
                [14,10],[16,10],[18,10],[20,10],[14,11],[15,11],[17,11],[19,11],
                [0,14],[1,14],[2,14],[4,14],[6,14],
                [0,15],[2,15],[3,15],[5,15],[0,16],[1,16],[2,16],[3,16],[4,16],[5,16],[6,16],
                [0,17],[2,17],[4,17],[6,17],[0,18],[1,18],[3,18],[5,18],
                [0,19],[2,19],[3,19],[4,19],[6,19],[0,20],[2,20],[4,20],[6,20],
                [8,16],[9,16],[11,16],[12,16],[8,17],[10,17],[11,17],[8,18],[9,18],[11,18],[12,18],
                [14,14],[16,14],[18,14],[20,14],[14,15],[17,15],[19,15],
                [14,16],[16,16],[18,16],[20,16],[15,17],[17,17],[19,17],
                [14,18],[15,18],[16,18],[18,18],[20,18],[14,19],[17,19],[18,19],
                [14,20],[16,20],[17,20],[19,20],[20,20],
              ].map(([x, y], i) => (
                <rect key={i} x={x} y={y} width={1} height={1} fill="#000" />
              ))}
            </svg>
          </div>
          <p className="text-[10px] text-gray-600 font-mono">{policy.policyNumber}</p>
        </div>
      )}
    </div>
  );
};
