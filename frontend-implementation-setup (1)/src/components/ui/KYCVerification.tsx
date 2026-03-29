import { useState, useRef } from 'react';
import { Upload, Camera, CheckCircle2, AlertCircle, ArrowRight, FileText, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/cn';
import { useToast } from '@/context/ToastContext';

type DocType = 'passport' | 'drivers_license' | 'national_id';
type KYCStep = 'select_doc' | 'upload_front' | 'upload_back' | 'selfie' | 'processing' | 'complete' | 'failed';

interface KYCVerificationProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const DOC_TYPES: { id: DocType; label: string; desc: string }[] = [
  { id: 'passport',         label: 'Passport',          desc: 'International travel document' },
  { id: 'drivers_license',  label: "Driver's License",  desc: 'State or national issued' },
  { id: 'national_id',      label: 'National ID',       desc: 'Government issued identity card' },
];

const ProcessingStep = ({ label, done, active }: { label: string; done: boolean; active: boolean }) => (
  <div className={cn('flex items-center gap-3 py-2', active && 'animate-pulse')}>
    <div className={cn(
      'w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500',
      done ? 'bg-[#10B981]' : active ? 'bg-[#10B981]/30 border border-[#10B981]/50' : 'bg-white/[0.04] border border-white/10'
    )}>
      {done && <CheckCircle2 size={14} className="text-white" />}
      {active && <div className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />}
    </div>
    <span className={cn(
      'text-sm transition-colors duration-300',
      done ? 'text-gray-200' : active ? 'text-white font-medium' : 'text-gray-600'
    )}>
      {label}
    </span>
  </div>
);

export const KYCVerification = ({ onComplete, onSkip }: KYCVerificationProps) => {
  const { success, error } = useToast();
  const [step, setStep]           = useState<KYCStep>('select_doc');
  const [docType, setDocType]     = useState<DocType>('passport');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile]   = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [processingStep, setProcessingStep] = useState(0);
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef  = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (f: File) => void,
    next: KYCStep
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { error('File too large', 'Maximum file size is 10MB.'); return; }
    setter(file);
    setTimeout(() => setStep(next), 500);
  };

  const startProcessing = async () => {
    setStep('processing');
    const steps = ['Uploading documents…', 'Checking document authenticity…', 'Running liveness check…', 'Verifying identity…', 'Finalising…'];
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
    }
    // 90% chance of success in demo
    if (Math.random() < 0.9) {
      setStep('complete');
      success('Identity verified', 'Your KYC verification is complete.');
    } else {
      setStep('failed');
    }
  };

  const UploadZone = ({
    label, desc, file, inputRef, accept, onChange, capture,
  }: {
    label: string; desc: string; file: File | null;
    inputRef: React.RefObject<HTMLInputElement | null>;
    accept: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    capture?: 'user' | 'environment';
  }) => (
    <div>
      <input ref={inputRef} type="file" accept={accept} capture={capture} className="sr-only" onChange={onChange} aria-label={label} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          'w-full rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200',
          file
            ? 'border-[#10B981]/50 bg-[#10B981]/[0.04]'
            : 'border-white/[0.10] bg-white/[0.02] hover:border-white/[0.20] hover:bg-white/[0.04]'
        )}
      >
        {file ? (
          <>
            <CheckCircle2 size={36} className="mx-auto text-[#10B981] mb-2" />
            <p className="text-sm font-semibold text-[#10B981]">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(0)} KB · Click to replace</p>
          </>
        ) : (
          <>
            <div className="mx-auto w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-3">
              {capture === 'user' ? <Camera size={24} className="text-gray-400" /> : <Upload size={24} className="text-gray-400" />}
            </div>
            <p className="text-sm font-semibold text-gray-200">{label}</p>
            <p className="text-xs text-gray-500 mt-1">{desc}</p>
            <p className="text-[10px] text-gray-600 mt-2">JPG, PNG, PDF · Max 10MB</p>
          </>
        )}
      </button>
    </div>
  );

  // ── SELECT DOCUMENT TYPE ────────────────────────────────────────────────
  if (step === 'select_doc') return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/15 mb-3">
          <FileText size={28} className="text-blue-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Identity Verification</h3>
        <p className="text-sm text-gray-500 mt-1">Select the document you'd like to use.</p>
      </div>
      <div className="space-y-2">
        {DOC_TYPES.map(d => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDocType(d.id)}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all',
              docType === d.id
                ? 'border-[#10B981]/40 bg-[#10B981]/[0.06]'
                : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16]'
            )}
            aria-pressed={docType === d.id}
          >
            <div className={cn('p-2.5 rounded-xl', docType === d.id ? 'bg-[#10B981]/20' : 'bg-white/[0.04]')}>
              <FileText size={18} className={docType === d.id ? 'text-[#10B981]' : 'text-gray-400'} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{d.label}</p>
              <p className="text-xs text-gray-500">{d.desc}</p>
            </div>
            <div className={cn('ml-auto w-4 h-4 rounded-full border-2 transition-all', docType === d.id ? 'border-[#10B981] bg-[#10B981]' : 'border-white/20')} />
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        {onSkip && <Button variant="ghost" size="sm" className="flex-1" onClick={onSkip}>Skip for now</Button>}
        <Button className="flex-1" rightIcon={<ArrowRight size={15} />} onClick={() => setStep('upload_front')}>
          Continue
        </Button>
      </div>
    </div>
  );

  // ── UPLOAD FRONT ────────────────────────────────────────────────────────
  if (step === 'upload_front') return (
    <div className="space-y-5">
      <div className="text-center">
        <h3 className="text-base font-bold text-white mb-1">Front of {DOC_TYPES.find(d => d.id === docType)?.label}</h3>
        <p className="text-xs text-gray-500">Make sure all text is clearly visible.</p>
      </div>
      <UploadZone
        label="Upload Front Side"
        desc="Take a photo or upload a file"
        file={frontFile}
        inputRef={frontRef}
        accept="image/*,.pdf"
        capture="environment"
        onChange={e => handleFile(e, setFrontFile, docType === 'passport' ? 'selfie' : 'upload_back')}
      />
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={() => setStep('select_doc')}>Back</Button>
        <Button
          className="flex-1"
          disabled={!frontFile}
          rightIcon={<ArrowRight size={15} />}
          onClick={() => setStep(docType === 'passport' ? 'selfie' : 'upload_back')}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  // ── UPLOAD BACK ─────────────────────────────────────────────────────────
  if (step === 'upload_back') return (
    <div className="space-y-5">
      <div className="text-center">
        <h3 className="text-base font-bold text-white mb-1">Back of {DOC_TYPES.find(d => d.id === docType)?.label}</h3>
        <p className="text-xs text-gray-500">Include the barcode or magnetic strip side.</p>
      </div>
      <UploadZone
        label="Upload Back Side"
        desc="Take a photo or upload a file"
        file={backFile}
        inputRef={backRef}
        accept="image/*,.pdf"
        capture="environment"
        onChange={e => handleFile(e, setBackFile, 'selfie')}
      />
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={() => setStep('upload_front')}>Back</Button>
        <Button
          className="flex-1"
          disabled={!backFile}
          rightIcon={<ArrowRight size={15} />}
          onClick={() => setStep('selfie')}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  // ── SELFIE ──────────────────────────────────────────────────────────────
  if (step === 'selfie') return (
    <div className="space-y-5">
      <div className="text-center">
        <h3 className="text-base font-bold text-white mb-1">Selfie Verification</h3>
        <p className="text-xs text-gray-500">We'll compare this with your document photo.</p>
      </div>
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tips for a good selfie:</p>
        {['Face the camera directly', 'Good lighting — no shadows', 'Remove glasses or hat', 'Neutral expression'].map(t => (
          <p key={t} className="text-xs text-gray-500 flex items-center gap-2">
            <CheckCircle2 size={11} className="text-[#10B981]" /> {t}
          </p>
        ))}
      </div>
      <UploadZone
        label="Take a Selfie"
        desc="Use your front-facing camera"
        file={selfieFile}
        inputRef={selfieRef}
        accept="image/*"
        capture="user"
        onChange={e => handleFile(e, setSelfieFile, 'processing')}
      />
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={() => setStep(docType === 'passport' ? 'upload_front' : 'upload_back')}>Back</Button>
        <Button
          className="flex-1"
          disabled={!selfieFile}
          onClick={startProcessing}
        >
          Submit for Verification
        </Button>
      </div>
    </div>
  );

  // ── PROCESSING ──────────────────────────────────────────────────────────
  if (step === 'processing') return (
    <div className="space-y-5 py-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#10B981]/15 mb-4">
          <RefreshCw size={28} className="text-[#10B981] animate-spin" />
        </div>
        <h3 className="text-lg font-bold text-white">Verifying Identity…</h3>
        <p className="text-sm text-gray-500 mt-1">This usually takes 10–30 seconds.</p>
      </div>
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-1">
        {[
          'Uploading documents',
          'Checking document authenticity',
          'Running liveness check',
          'Verifying identity',
          'Finalising',
        ].map((label, i) => (
          <ProcessingStep key={label} label={label} done={processingStep > i} active={processingStep === i} />
        ))}
      </div>
      <p className="text-[10px] text-center text-gray-600">Your data is encrypted and processed securely.</p>
    </div>
  );

  // ── COMPLETE ────────────────────────────────────────────────────────────
  if (step === 'complete') return (
    <div className="text-center space-y-5 py-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#10B981]/20">
        <CheckCircle2 size={40} className="text-[#10B981]" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">Identity Verified!</h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-xs mx-auto">
          Your identity has been successfully verified. You now have full access to all platform features.
        </p>
      </div>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-semibold">
        <CheckCircle2 size={16} /> KYC Status: Verified
      </div>
      <Button className="w-full" onClick={onComplete}>Continue to Dashboard</Button>
    </div>
  );

  // ── FAILED ──────────────────────────────────────────────────────────────
  return (
    <div className="text-center space-y-5 py-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20">
        <AlertCircle size={40} className="text-red-400" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">Verification Failed</h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-xs mx-auto">
          We couldn't verify your identity. This may be due to poor image quality or a mismatch. Please try again.
        </p>
      </div>
      <div className="space-y-2">
        <Button className="w-full" leftIcon={<RefreshCw size={15} />} onClick={() => { setStep('select_doc'); setFrontFile(null); setBackFile(null); setSelfieFile(null); }}>
          Try Again
        </Button>
        {onSkip && (
          <Button variant="ghost" className="w-full" onClick={onSkip}>Skip for now</Button>
        )}
      </div>
    </div>
  );
};
