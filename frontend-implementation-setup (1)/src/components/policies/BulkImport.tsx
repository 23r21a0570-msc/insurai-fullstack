import { useState, useRef } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, FileText, X, Play } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

interface ImportRow {
  row: number;
  holderName: string;
  holderEmail: string;
  type: string;
  coverage: string;
  premium: string;
  status: 'valid' | 'error';
  error?: string;
}

const SAMPLE_CSV = `holderName,holderEmail,type,coverageAmount,premium,deductible,startDate,endDate
John Smith,john@email.com,auto,150000,1200,1000,2024-01-01,2025-01-01
Emily Johnson,emily@email.com,home,350000,2400,2500,2024-02-01,2025-02-01
Michael Brown,michael@email.com,health,100000,3600,500,2024-03-01,2025-03-01
Sarah Davis,sarah@email.com,life,500000,4800,0,2024-04-01,2025-04-01
David Wilson,david@email.com,business,750000,6000,5000,2024-05-01,2025-05-01`;

const MOCK_PREVIEW: ImportRow[] = [
  { row: 1, holderName: 'John Smith',    holderEmail: 'john@email.com',    type: 'auto',     coverage: '$150,000', premium: '$1,200', status: 'valid' },
  { row: 2, holderName: 'Emily Johnson', holderEmail: 'emily@email.com',   type: 'home',     coverage: '$350,000', premium: '$2,400', status: 'valid' },
  { row: 3, holderName: 'Michael Brown', holderEmail: 'michael@email.com', type: 'health',   coverage: '$100,000', premium: '$3,600', status: 'valid' },
  { row: 4, holderName: 'Sarah Davis',   holderEmail: 'sarah@email.com',   type: 'life',     coverage: '$500,000', premium: '$4,800', status: 'valid' },
  { row: 5, holderName: 'David Wilson',  holderEmail: '',                   type: 'business', coverage: '$750,000', premium: '$6,000', status: 'error', error: 'Email is required' },
];

export const BulkImport = () => {
  const { success, error } = useToast();
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'done'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [imported, setImported] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      setFileName(file.name);
      setStep('preview');
    } else {
      error('Invalid file', 'Please upload a CSV file.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setFileName(file.name); setStep('preview'); }
  };

  const handleImport = async () => {
    const validRows = MOCK_PREVIEW.filter(r => r.status === 'valid').length;
    setStep('importing');
    setProgress(0);
    setImported(0);
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(r => setTimeout(r, 300));
      setProgress(i);
      setImported(Math.floor((i / 100) * validRows));
    }
    setProgress(100);
    setImported(validRows);
    setStep('done');
    success('Import complete', `${validRows} policies imported successfully.`);
  };

  const reset = () => {
    setStep('upload');
    setFileName('');
    setProgress(0);
    setImported(0);
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sample_policies.csv'; a.click();
    URL.revokeObjectURL(url);
    success('Downloaded', 'Sample CSV file downloaded.');
  };

  const validCount  = MOCK_PREVIEW.filter(r => r.status === 'valid').length;
  const errorCount  = MOCK_PREVIEW.filter(r => r.status === 'error').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Bulk Policy Import</h2>
          <p className="text-sm text-gray-500 mt-0.5">Upload a CSV file to import multiple policies at once.</p>
        </div>
        <Button variant="secondary" size="sm" leftIcon={<Download size={14} />} onClick={downloadSample}>
          Sample CSV
        </Button>
      </div>

      {/* Step: Upload */}
      {step === 'upload' && (
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all',
            isDragging ? 'border-[#10B981] bg-[#10B981]/5' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
          )}
        >
          <div className="h-16 w-16 rounded-2xl bg-[#10B981]/10 flex items-center justify-center">
            <Upload size={28} className="text-[#10B981]" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-gray-200">Drop your CSV file here</p>
            <p className="text-sm text-gray-500 mt-1">or click to browse — max 10MB, CSV format only</p>
          </div>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
        </div>
      )}

      {/* Step: Preview */}
      {step === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[#10B981]" />
              <span className="text-sm font-medium text-gray-300">{fileName}</span>
            </div>
            <button onClick={reset} className="text-gray-600 hover:text-gray-300"><X size={16} /></button>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle size={14} className="text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">{validCount} valid rows</span>
            </div>
            {errorCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle size={14} className="text-red-400" />
                <span className="text-sm text-red-400 font-medium">{errorCount} errors</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.03]">
                  {['Row', 'Name', 'Email', 'Type', 'Coverage', 'Premium', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {MOCK_PREVIEW.map(row => (
                  <tr key={row.row} className={cn('transition-colors', row.status === 'error' ? 'bg-red-500/5' : 'hover:bg-white/[0.02]')}>
                    <td className="px-4 py-3 text-xs text-gray-600 font-mono">{row.row}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{row.holderName}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{row.holderEmail || <span className="text-red-400">missing</span>}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 capitalize">{row.type}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 tabular-nums">{row.coverage}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 tabular-nums">{row.premium}</td>
                    <td className="px-4 py-3">
                      {row.status === 'valid' ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle size={12} /> Valid</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-red-400"><AlertCircle size={12} /> {row.error}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={reset}>Cancel</Button>
            <Button leftIcon={<Play size={14} />} onClick={handleImport} disabled={validCount === 0}>
              Import {validCount} Policies
            </Button>
          </div>
        </div>
      )}

      {/* Step: Importing */}
      {step === 'importing' && (
        <GlassPanel className="flex flex-col items-center gap-6 py-12">
          <div className="h-16 w-16 rounded-2xl bg-[#10B981]/10 flex items-center justify-center">
            <Upload size={28} className="text-[#10B981] animate-bounce" />
          </div>
          <div className="w-full max-w-sm space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Importing policies...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#10B981] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 text-center">{imported} of {validCount} policies processed</p>
          </div>
        </GlassPanel>
      )}

      {/* Step: Done */}
      {step === 'done' && (
        <GlassPanel className="flex flex-col items-center gap-6 py-12">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-white">Import Complete!</h3>
            <p className="text-gray-500 mt-2">{imported} policies imported · {errorCount} skipped due to errors</p>
          </div>
          <Button onClick={reset}>Import Another File</Button>
        </GlassPanel>
      )}
    </div>
  );
};
