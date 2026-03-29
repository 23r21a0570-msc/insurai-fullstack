import { useRef, useState, useEffect, useCallback } from 'react';
import { PenTool, Trash2, Check, Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/context/ToastContext';

interface DigitalSignatureProps {
  onSigned: (dataUrl: string) => void;
  label?: string;
}

export const DigitalSignature = ({ onSigned, label = 'Sign here' }: DigitalSignatureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const { success } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e);
    lastPosRef.current = pos;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && lastPosRef.current) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastPosRef.current = pos;
      setHasSignature(true);
    }
  };

  const stopDraw = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
      setIsSigned(false);
    }
  }, []);

  const confirmSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSigned(dataUrl);
    setIsSigned(true);
    success('Signature captured', 'Your digital signature has been applied to the claim form.');
  };

  const downloadSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PenTool size={14} className="text-[#10B981]" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Digital Signature</p>
        </div>
        {isSigned && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <Check size={12} /> Signed
          </span>
        )}
      </div>

      <div className="relative rounded-xl border-2 border-dashed border-white/[0.10] bg-white/[0.02] overflow-hidden" style={{ height: 140 }}>
        <canvas
          ref={canvasRef}
          className={cn('w-full h-full cursor-crosshair touch-none', isSigned && 'pointer-events-none')}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          aria-label="Signature pad"
          role="img"
        />
        {!hasSignature && !isSigned && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-sm text-gray-700 font-medium">{label}</p>
          </div>
        )}
        {/* Baseline */}
        <div className="absolute bottom-8 left-6 right-6 h-px bg-white/[0.08]" />
        <p className="absolute bottom-2 left-6 text-[10px] text-gray-700">Signature</p>
      </div>

      {isSigned ? (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <p className="text-xs text-emerald-400 font-medium flex-1">Signature applied successfully.</p>
          <button onClick={downloadSignature} className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1">
            <Download size={11} /> Save
          </button>
          <button onClick={clearSignature} className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1">
            <Trash2 size={11} /> Clear
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={clearSignature}
            disabled={!hasSignature}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-red-400 hover:bg-red-400/10 border border-white/[0.06] transition-all disabled:opacity-40"
          >
            <Trash2 size={12} /> Clear
          </button>
          <button
            onClick={confirmSignature}
            disabled={!hasSignature}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={13} /> Confirm Signature
          </button>
        </div>
      )}
    </div>
  );
};
