import { useState } from 'react';
import { Scale, Upload, FileText, ChevronRight, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/context/ToastContext';

type AppealStep = 'reason' | 'evidence' | 'statement' | 'review' | 'submitted';

const DENIAL_REASONS = [
  { id: 'policy_exclusion', label: 'Policy Exclusion', description: 'Claim falls under a policy exclusion clause' },
  { id: 'insufficient_evidence', label: 'Insufficient Evidence', description: 'Documentation did not support the claimed loss' },
  { id: 'pre_existing', label: 'Pre-existing Condition', description: 'Damage existed before policy effective date' },
  { id: 'late_filing', label: 'Late Filing', description: 'Claim was not filed within required timeframe' },
  { id: 'coverage_limit', label: 'Coverage Limit Exceeded', description: 'Claim amount exceeds policy coverage limits' },
];

const APPEAL_GROUNDS = [
  { id: 'new_evidence', label: 'New Supporting Evidence', description: 'I have additional documentation not previously provided' },
  { id: 'policy_misinterpretation', label: 'Policy Misinterpretation', description: 'The denial was based on incorrect policy interpretation' },
  { id: 'factual_error', label: 'Factual Error in Decision', description: 'The decision contains factual inaccuracies' },
  { id: 'procedural_error', label: 'Procedural Error', description: 'Proper review procedures were not followed' },
];

export const ClaimAppeal = ({ claimNumber, onClose }: { claimNumber: string; onClose?: () => void }) => {
  const [step, setStep] = useState<AppealStep>('reason');
  const [selectedDenialReason, setSelectedDenialReason] = useState<string>('');
  const [selectedGrounds, setSelectedGrounds] = useState<string[]>([]);
  const [statement, setStatement] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success } = useToast();

  const toggleGround = (id: string) => {
    setSelectedGrounds((prev) => prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setStep('submitted');
    success('Appeal Submitted', `Your appeal for claim ${claimNumber} has been received.`);
  };

  const Steps: { id: AppealStep; label: string }[] = [
    { id: 'reason', label: 'Denial Reason' },
    { id: 'evidence', label: 'Appeal Grounds' },
    { id: 'statement', label: 'Statement' },
    { id: 'review', label: 'Review' },
  ];

  const currentStepIdx = Steps.findIndex((s) => s.id === step);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Scale size={20} />
          </div>
          <div>
            <p className="text-base font-bold text-white">Appeal Denied Claim</p>
            <p className="text-xs text-gray-500">Claim {claimNumber} · Your right to appeal is protected</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06]">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Progress */}
      {step !== 'submitted' && (
        <div className="flex items-center gap-1">
          {Steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1 flex-1">
              <div className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all shrink-0',
                i < currentStepIdx ? 'bg-[#10B981] text-white' :
                i === currentStepIdx ? 'border-2 border-[#10B981] text-[#10B981]' :
                'border border-white/[0.10] text-gray-700'
              )}>
                {i < currentStepIdx ? <CheckCircle size={11} /> : i + 1}
              </div>
              <span className={cn('text-[10px] font-medium hidden sm:block', i === currentStepIdx ? 'text-gray-300' : 'text-gray-600')}>
                {s.label}
              </span>
              {i < Steps.length - 1 && <div className="flex-1 h-px bg-white/[0.06] mx-1" />}
            </div>
          ))}
        </div>
      )}

      {/* Denial Reason step */}
      {step === 'reason' && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/20">
            <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              Select the reason stated in your denial letter. This helps us tailor your appeal to address the specific grounds for denial.
            </p>
          </div>
          {DENIAL_REASONS.map((reason) => (
            <button
              key={reason.id}
              onClick={() => setSelectedDenialReason(reason.id)}
              className={cn(
                'w-full text-left p-4 rounded-xl border transition-all',
                selectedDenialReason === reason.id
                  ? 'border-amber-500/30 bg-amber-500/[0.06]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
              )}
            >
              <p className={cn('text-sm font-bold', selectedDenialReason === reason.id ? 'text-amber-400' : 'text-gray-200')}>{reason.label}</p>
              <p className="text-xs text-gray-500 mt-1">{reason.description}</p>
            </button>
          ))}
          <button
            disabled={!selectedDenialReason}
            onClick={() => setStep('evidence')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#10B981]/15 text-[#10B981] text-sm font-bold border border-[#10B981]/20 hover:bg-[#10B981]/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Continue <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* Appeal Grounds step */}
      {step === 'evidence' && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">Select all grounds that apply to your appeal (at least one required)</p>
          {APPEAL_GROUNDS.map((ground) => (
            <button
              key={ground.id}
              onClick={() => toggleGround(ground.id)}
              className={cn(
                'w-full text-left p-4 rounded-xl border transition-all',
                selectedGrounds.includes(ground.id)
                  ? 'border-[#10B981]/30 bg-[#10B981]/[0.06]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn('w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition-all shrink-0', selectedGrounds.includes(ground.id) ? 'bg-[#10B981] border-[#10B981]' : 'border-white/[0.20]')}>
                  {selectedGrounds.includes(ground.id) && <CheckCircle size={10} className="text-white" />}
                </div>
                <div>
                  <p className={cn('text-sm font-bold', selectedGrounds.includes(ground.id) ? 'text-[#10B981]' : 'text-gray-200')}>{ground.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{ground.description}</p>
                </div>
              </div>
            </button>
          ))}

          {/* File upload */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Supporting Documents (optional but recommended)</label>
            <label className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-white/[0.10] bg-white/[0.01] cursor-pointer hover:border-[#10B981]/30 transition-all">
              <Upload size={18} className="text-gray-600" />
              <div>
                <p className="text-sm text-gray-400 font-medium">Upload evidence files</p>
                <p className="text-xs text-gray-600">Photos, reports, receipts, expert opinions</p>
              </div>
              <input type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
            </label>
            {files.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <FileText size={12} className="text-gray-500" />
                    <span className="text-xs text-gray-300 flex-1 truncate">{f.name}</span>
                    <button onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep('reason')} className="px-4 py-2.5 rounded-xl text-xs text-gray-500 border border-white/[0.06] hover:border-white/[0.12]">Back</button>
            <button
              disabled={selectedGrounds.length === 0}
              onClick={() => setStep('statement')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#10B981]/15 text-[#10B981] text-sm font-bold border border-[#10B981]/20 hover:bg-[#10B981]/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Continue <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Statement step */}
      {step === 'statement' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Written Appeal Statement <span className="text-red-400">*</span></label>
            <textarea
              rows={8}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Explain in detail why you believe the claim should be reconsidered. Include specific facts, dates, and references to your policy coverage. The more detailed your statement, the better your chances of a successful appeal..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 resize-none transition-all"
            />
            <p className="text-[10px] text-gray-600 mt-1">{statement.length} characters · Minimum 100 recommended</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep('evidence')} className="px-4 py-2.5 rounded-xl text-xs text-gray-500 border border-white/[0.06] hover:border-white/[0.12]">Back</button>
            <button
              disabled={statement.trim().length < 50}
              onClick={() => setStep('review')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#10B981]/15 text-[#10B981] text-sm font-bold border border-[#10B981]/20 hover:bg-[#10B981]/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Review Appeal <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Review step */}
      {step === 'review' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Appeal Summary</p>
          <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
            <div className="p-4">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Denial Reason Cited</p>
              <p className="text-sm text-gray-200 font-medium">{DENIAL_REASONS.find(r => r.id === selectedDenialReason)?.label}</p>
            </div>
            <div className="p-4">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Appeal Grounds</p>
              <div className="space-y-1">
                {selectedGrounds.map((g) => (
                  <div key={g} className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle size={11} className="text-[#10B981]" /> {APPEAL_GROUNDS.find(ag => ag.id === g)?.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Evidence Files</p>
              <p className="text-sm text-gray-200">{files.length > 0 ? `${files.length} file(s) attached` : 'No files'}</p>
            </div>
            <div className="p-4">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Statement Preview</p>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{statement}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-500/[0.06] border border-blue-500/20">
            <Scale size={14} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400">By submitting, you confirm that all information provided is accurate to the best of your knowledge. Appeals are typically reviewed within 5-10 business days.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep('statement')} className="px-4 py-2.5 rounded-xl text-xs text-gray-500 border border-white/[0.06] hover:border-white/[0.12]">Back</button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/15 text-amber-400 text-sm font-bold border border-amber-500/20 hover:bg-amber-500/25 transition-all disabled:opacity-60"
            >
              {isSubmitting ? <span className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" /> : <Scale size={15} />}
              Submit Appeal
            </button>
          </div>
        </div>
      )}

      {/* Submitted */}
      {step === 'submitted' && (
        <div className="flex flex-col items-center py-8 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#10B981]/15 flex items-center justify-center">
            <CheckCircle size={32} className="text-[#10B981]" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">Appeal Submitted!</p>
            <p className="text-sm text-gray-500 mt-1">Reference: APP-{claimNumber}-2025</p>
          </div>
          <div className="space-y-2 w-full">
            {[
              { label: 'Status', value: 'Under Review' },
              { label: 'Assigned Reviewer', value: 'Senior Claims Committee' },
              { label: 'Expected Decision', value: '5-10 business days' },
              { label: 'Notification', value: 'Email & SMS updates' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <span className="text-xs text-gray-600">{label}</span>
                <span className="text-xs font-bold text-gray-300">{value}</span>
              </div>
            ))}
          </div>
          {onClose && (
            <button onClick={onClose} className="text-sm text-[#10B981] hover:underline font-medium">
              Return to Claim Details
            </button>
          )}
        </div>
      )}
    </div>
  );
};
