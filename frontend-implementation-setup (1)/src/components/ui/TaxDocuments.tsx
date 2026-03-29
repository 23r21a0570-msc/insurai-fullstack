import { useState } from 'react';
import { FileText, Download, Eye, Filter, Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useToast } from '@/context/ToastContext';

interface TaxDoc {
  id: string;
  type: '1099-MISC' | '1099-INT' | 'Schedule A' | 'Premium Summary' | 'Claims Summary';
  year: number;
  description: string;
  amount?: number;
  issuedDate: string;
  policyNumber: string;
  status: 'available' | 'processing';
}

const TAX_DOCS: TaxDoc[] = [
  {
    id: 'td_1', type: '1099-MISC', year: 2024,
    description: 'Miscellaneous income — insurance claim payment', amount: 12500,
    issuedDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    policyNumber: 'POL-7821', status: 'available',
  },
  {
    id: 'td_2', type: 'Premium Summary', year: 2024,
    description: 'Annual premium payments summary for tax deduction',
    amount: 4400, issuedDate: new Date(Date.now() - 45 * 86400000).toISOString(),
    policyNumber: 'ALL', status: 'available',
  },
  {
    id: 'td_3', type: 'Claims Summary', year: 2024,
    description: 'Summary of all claims filed and paid', amount: 21700,
    issuedDate: new Date(Date.now() - 60 * 86400000).toISOString(),
    policyNumber: 'ALL', status: 'available',
  },
  {
    id: 'td_4', type: '1099-MISC', year: 2023,
    description: 'Miscellaneous income — insurance claim payment', amount: 8200,
    issuedDate: new Date(Date.now() - 400 * 86400000).toISOString(),
    policyNumber: 'POL-7821', status: 'available',
  },
  {
    id: 'td_5', type: 'Premium Summary', year: 2023,
    description: 'Annual premium payments summary', amount: 3600,
    issuedDate: new Date(Date.now() - 380 * 86400000).toISOString(),
    policyNumber: 'ALL', status: 'available',
  },
  {
    id: 'td_6', type: 'Premium Summary', year: 2025,
    description: '2025 annual summary — in preparation', amount: undefined,
    issuedDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    policyNumber: 'ALL', status: 'processing',
  },
];

const DOC_COLORS: Record<string, string> = {
  '1099-MISC':       'text-blue-400   bg-blue-500/10   border-blue-500/20',
  '1099-INT':        'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  'Schedule A':      'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Premium Summary': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Claims Summary':  'text-amber-400  bg-amber-500/10  border-amber-500/20',
};

export const TaxDocuments = () => {
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [search,     setSearch]     = useState('');
  const [previewing, setPreviewing] = useState<string | null>(null);
  const { success } = useToast();

  const years   = [...new Set(TAX_DOCS.map(d => d.year))].sort((a, b) => b - a);
  const filtered = TAX_DOCS.filter(d => {
    const matchYear = yearFilter === 'all' || d.year === yearFilter;
    const matchSearch = d.type.toLowerCase().includes(search.toLowerCase())
                     || d.description.toLowerCase().includes(search.toLowerCase())
                     || d.policyNumber.toLowerCase().includes(search.toLowerCase());
    return matchYear && matchSearch;
  });

  const handleDownload = (doc: TaxDoc) => {
    success(`Downloading ${doc.type}`, `${doc.year} ${doc.type} for ${doc.policyNumber}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Tax Documents</h3>
          <p className="text-xs text-gray-500 mt-0.5">Download 1099s, premium summaries, and claims reports for your tax filings.</p>
        </div>
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search documents…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg pl-8 pr-3 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/40"
          />
        </div>
      </div>

      {/* Year filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider mr-2">
          <Filter size={12} /> Year:
        </div>
        {['all', ...years].map(y => (
          <button
            key={y}
            onClick={() => setYearFilter(y as number | 'all')}
            className={cn(
              'px-3 py-1 rounded-full text-[10px] font-bold border transition-all',
              yearFilter === y
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'border-white/[0.08] text-gray-500 hover:border-white/20'
            )}
          >
            {y === 'all' ? 'All Years' : y}
          </button>
        ))}
      </div>

      {/* Document list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-10 text-center rounded-xl border border-dashed border-white/10">
            <FileText size={32} className="text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No documents found</p>
          </div>
        ) : (
          filtered.map(doc => (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/10 transition-all"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] shrink-0">
                  <FileText size={18} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border', DOC_COLORS[doc.type])}>
                      {doc.type}
                    </span>
                    <span className="text-[10px] font-bold text-gray-600">{doc.year}</span>
                    {doc.status === 'processing' && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">PROCESSING</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-200 mt-1 truncate">{doc.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-gray-500">Policy: {doc.policyNumber}</span>
                    <span className="text-[10px] text-gray-600">·</span>
                    <span className="text-[10px] text-gray-500">Issued {formatDate(doc.issuedDate)}</span>
                    {doc.amount && (
                      <>
                        <span className="text-[10px] text-gray-600">·</span>
                        <span className="text-[10px] font-bold text-gray-300">{formatCurrency(doc.amount)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {doc.status === 'available' ? (
                  <>
                    <button
                      onClick={() => setPreviewing(doc.id === previewing ? null : doc.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] text-[10px] font-bold text-gray-400 hover:text-white hover:border-white/20 transition-all"
                    >
                      <Eye size={12} /> Preview
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    >
                      <Download size={12} /> Download
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] text-gray-600 italic">Available after filing season</span>
                )}
              </div>

              {/* Preview panel */}
              {previewing === doc.id && (
                <div className="w-full mt-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] font-mono text-[10px] text-gray-400 leading-relaxed">
                  <p className="text-gray-200 font-bold mb-2">{doc.type} — Tax Year {doc.year}</p>
                  <p>Payer: INSURAI Insurance Group</p>
                  <p>EIN: 12-3456789</p>
                  <p>Recipient: Maruthi</p>
                  <p>Policy: {doc.policyNumber}</p>
                  {doc.amount && <p>Amount: {formatCurrency(doc.amount)}</p>}
                  <p className="mt-2 text-gray-600">For tax questions, consult your tax advisor.</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer note */}
      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
        <p className="text-xs text-blue-300 font-medium mb-1">📋 Tax Filing Reminder</p>
        <p className="text-[11px] text-gray-400">
          Premium payments for health insurance may be deductible on Schedule A (itemized deductions). 
          Claim payouts may be taxable income. Consult a tax professional for personalized advice.
        </p>
      </div>
    </div>
  );
};
