import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, FileText, X, CheckCircle } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/context/ToastContext';

const CLAIM_TYPES = [
  { label: 'Auto — Collision', value: 'auto_collision' },
  { label: 'Auto — Theft', value: 'auto_theft' },
  { label: 'Property Damage', value: 'property_damage' },
  { label: 'Medical', value: 'medical' },
  { label: 'Liability', value: 'liability' },
  { label: 'Natural Disaster', value: 'natural_disaster' },
];

const STEPS = ['Claimant', 'Incident', 'Documents', 'Review'];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  policyNumber: '',
  type: 'auto_collision',
  description: '',
  amount: '',
  incidentDate: '',
};

export const NewClaim = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (field: keyof typeof initialForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    success('Claim submitted', 'Your claim has been received and is being reviewed.');
    navigate('/claims');
  };

  const canNextStep0 = form.name && form.email && form.phone && form.policyNumber;
  const canNextStep1 = form.description && form.amount && form.incidentDate;

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => (step === 0 ? navigate('/claims') : setStep(step - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">New Claim</h1>
          <p className="text-sm text-gray-500">Submit a new insurance claim for review.</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, idx) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
              idx < step
                ? 'bg-[#10B981] text-white'
                : idx === step
                ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                : 'bg-white/[0.04] text-gray-600 border border-white/[0.08]'
            }`}>
              {idx < step ? <CheckCircle size={14} /> : idx + 1}
            </div>
            <span className={`text-xs font-medium ${idx === step ? 'text-gray-200' : 'text-gray-600'}`}>
              {label}
            </span>
            {idx < STEPS.length - 1 && <div className="w-8 h-px bg-white/[0.08]" />}
          </div>
        ))}
      </div>

      {/* Step 0: Claimant */}
      {step === 0 && (
        <GlassPanel>
          <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Claimant Details</h3>
          <div className="space-y-4">
            <Input label="Full Name" placeholder="John Smith" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Email" type="email" placeholder="john@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} required />
              <Input label="Phone" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
            </div>
            <Input label="Policy Number" placeholder="POL-1234" value={form.policyNumber} onChange={(e) => set('policyNumber', e.target.value)} required />
          </div>
          <div className="mt-6 flex justify-end">
            <Button disabled={!canNextStep0} onClick={() => setStep(1)}>Continue</Button>
          </div>
        </GlassPanel>
      )}

      {/* Step 1: Incident */}
      {step === 1 && (
        <GlassPanel>
          <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Incident Details</h3>
          <div className="space-y-4">
            <Select label="Claim Type" options={CLAIM_TYPES} value={form.type} onChange={(e) => set('type', e.target.value)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Claim Amount ($)" type="number" placeholder="15000" value={form.amount} onChange={(e) => set('amount', e.target.value)} required />
              <Input label="Incident Date" type="date" value={form.incidentDate} onChange={(e) => set('incidentDate', e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
              <textarea
                rows={4}
                placeholder="Describe what happened in detail..."
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 resize-none transition-all"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button disabled={!canNextStep1} onClick={() => setStep(2)}>Continue</Button>
          </div>
        </GlassPanel>
      )}

      {/* Step 2: Documents */}
      {step === 2 && (
        <GlassPanel>
          <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Supporting Documents</h3>
          <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/[0.10] bg-white/[0.02] p-10 cursor-pointer hover:border-[#10B981]/30 hover:bg-[#10B981]/[0.03] transition-all">
            <Upload size={28} className="text-gray-600" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-300">Click to upload files</p>
              <p className="text-xs text-gray-600 mt-1">PDF, JPG, PNG, ZIP up to 10MB each</p>
            </div>
            <input type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.zip" />
          </label>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <FileText size={15} className="text-gray-500" />
                    <span className="text-xs text-gray-300 truncate max-w-[240px]">{file.name}</span>
                    <span className="text-[10px] text-gray-600">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button onClick={() => removeFile(idx)} className="text-gray-600 hover:text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setStep(3)}>Skip for now</Button>
            <Button onClick={() => setStep(3)}>Continue</Button>
          </div>
        </GlassPanel>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <GlassPanel>
          <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Review & Submit</h3>
          <div className="space-y-4">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.06]">
              {[
                { label: 'Name', value: form.name },
                { label: 'Email', value: form.email },
                { label: 'Phone', value: form.phone },
                { label: 'Policy Number', value: form.policyNumber },
                { label: 'Claim Type', value: CLAIM_TYPES.find(t => t.value === form.type)?.label },
                { label: 'Amount', value: form.amount ? `$${Number(form.amount).toLocaleString()}` : '—' },
                { label: 'Incident Date', value: form.incidentDate || '—' },
                { label: 'Documents', value: files.length > 0 ? `${files.length} file(s) attached` : 'None' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-gray-600 font-medium">{label}</span>
                  <span className="text-sm text-gray-200 font-semibold">{value}</span>
                </div>
              ))}
            </div>
            {form.description && (
              <div>
                <p className="text-xs text-gray-600 font-medium mb-2">Description</p>
                <p className="text-sm text-gray-300 bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 leading-relaxed">{form.description}</p>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button isLoading={isSubmitting} onClick={handleSubmit}>Submit Claim</Button>
          </div>
        </GlassPanel>
      )}
    </div>
  );
};
