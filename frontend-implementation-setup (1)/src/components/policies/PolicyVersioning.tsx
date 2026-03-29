import { useState } from 'react';
import { History, GitBranch, Eye, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

interface PolicyVersion {
  id: string;
  version: string;
  policyNumber: string;
  holderName: string;
  changedBy: string;
  changedAt: string;
  changes: { field: string; from: string; to: string }[];
  status: 'current' | 'previous' | 'draft';
  reason: string;
}

const MOCK_VERSIONS: PolicyVersion[] = [
  {
    id: 'v5', version: '5.0', policyNumber: 'POL-1001', holderName: 'John Smith',
    changedBy: 'Maruthi (Admin)', changedAt: '2025-01-10T10:30:00Z', status: 'current',
    reason: 'Annual renewal with coverage increase',
    changes: [
      { field: 'Coverage Amount', from: '$150,000', to: '$175,000' },
      { field: 'Annual Premium',  from: '$1,200',   to: '$1,350'   },
      { field: 'Expiry Date',     from: '2025-01-01', to: '2026-01-01' },
    ],
  },
  {
    id: 'v4', version: '4.0', policyNumber: 'POL-1001', holderName: 'John Smith',
    changedBy: 'Sarah Chen',   changedAt: '2024-06-15T14:00:00Z', status: 'previous',
    reason: 'Customer requested deductible change',
    changes: [
      { field: 'Deductible', from: '$1,500', to: '$1,000' },
      { field: 'Premium',    from: '$1,100', to: '$1,200' },
    ],
  },
  {
    id: 'v3', version: '3.0', policyNumber: 'POL-1001', holderName: 'John Smith',
    changedBy: 'Mike Ross',    changedAt: '2024-01-01T00:00:00Z', status: 'previous',
    reason: 'Annual renewal',
    changes: [
      { field: 'Coverage Amount', from: '$125,000', to: '$150,000' },
      { field: 'Expiry Date',     from: '2024-01-01', to: '2025-01-01' },
    ],
  },
  {
    id: 'v2', version: '2.0', policyNumber: 'POL-1001', holderName: 'John Smith',
    changedBy: 'Emily Wang',   changedAt: '2023-03-20T09:00:00Z', status: 'previous',
    reason: 'Added roadside assistance rider',
    changes: [
      { field: 'Add-on',   from: 'None',   to: 'Roadside Assistance' },
      { field: 'Premium',  from: '$1,000', to: '$1,100'              },
    ],
  },
  {
    id: 'v1', version: '1.0', policyNumber: 'POL-1001', holderName: 'John Smith',
    changedBy: 'System',       changedAt: '2023-01-01T00:00:00Z', status: 'previous',
    reason: 'Initial policy creation',
    changes: [],
  },
];

export const PolicyVersioning = () => {
  const { success } = useToast();
  const [expanded, setExpanded] = useState<string | null>('v5');
  const [compareModal, setCompareModal] = useState<{ a: PolicyVersion; b: PolicyVersion } | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleExpand = (id: string) => setExpanded(prev => prev === id ? null : id);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id)
      ? prev.filter(x => x !== id)
      : prev.length < 2 ? [...prev, id] : [prev[1], id]
    );
  };

  const handleCompare = () => {
    const [a, b] = selected.map(id => MOCK_VERSIONS.find(v => v.id === id)!);
    if (a && b) setCompareModal({ a, b });
  };

  const handleRestore = (version: PolicyVersion) => {
    success('Version restored', `Policy restored to version ${version.version}.`);
  };

  const statusStyle: Record<string, string> = {
    current:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    previous: 'text-gray-500 bg-gray-500/10 border-gray-500/20',
    draft:    'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Policy Version History</h2>
          <p className="text-sm text-gray-500 mt-0.5">Track all changes made to policies with full audit trail.</p>
        </div>
        {selected.length === 2 && (
          <Button size="sm" leftIcon={<GitBranch size={14} />} onClick={handleCompare}>Compare Versions</Button>
        )}
      </div>

      <div className="space-y-3">
        {MOCK_VERSIONS.map(v => (
          <GlassPanel key={v.id} className={cn(selected.includes(v.id) && 'border-[#10B981]/30 bg-[#10B981]/[0.02]')}>
            <div className="flex items-start gap-3">
              {/* Select checkbox */}
              <button
                onClick={() => toggleSelect(v.id)}
                className={cn('mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-all', selected.includes(v.id) ? 'bg-[#10B981] border-[#10B981]' : 'border-white/20 hover:border-white/40')}
              >
                {selected.includes(v.id) && <div className="h-2 w-2 rounded-sm bg-white" />}
              </button>

              {/* Version icon */}
              <div className="h-8 w-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                <History size={14} className="text-gray-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-gray-200">v{v.version}</span>
                  <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase border', statusStyle[v.status])}>{v.status}</span>
                  <span className="text-xs text-gray-500">{v.policyNumber} · {v.holderName}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{v.reason}</p>
                <p className="text-[10px] text-gray-600 mt-1">By {v.changedBy} · {new Date(v.changedAt).toLocaleString()}</p>

                {v.changes.length > 0 && (
                  <button onClick={() => toggleExpand(v.id)} className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300 mt-2 transition-colors">
                    {expanded === v.id ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    {v.changes.length} change{v.changes.length > 1 ? 's' : ''}
                  </button>
                )}

                {expanded === v.id && v.changes.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {v.changes.map(c => (
                      <div key={c.field} className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 w-32 shrink-0">{c.field}</span>
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-mono">{c.from}</span>
                        <span className="text-gray-600">→</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">{c.to}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                <Button variant="secondary" size="sm" leftIcon={<Eye size={12} />} onClick={() => success('Viewing', `Viewing policy version ${v.version}.`)}>View</Button>
                {v.status === 'previous' && (
                  <Button variant="secondary" size="sm" leftIcon={<RotateCcw size={12} />} onClick={() => handleRestore(v)}>Restore</Button>
                )}
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Compare Modal */}
      {compareModal && (
        <Modal isOpen={!!compareModal} onClose={() => setCompareModal(null)} title={`Compare v${compareModal.a.version} vs v${compareModal.b.version}`} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-gray-500 font-semibold uppercase tracking-wider">Field</div>
              <div className="text-gray-400 font-semibold">v{compareModal.a.version} <span className="text-[10px] text-gray-600">({new Date(compareModal.a.changedAt).toLocaleDateString()})</span></div>
              <div className="text-gray-400 font-semibold">v{compareModal.b.version} <span className="text-[10px] text-gray-600">({new Date(compareModal.b.changedAt).toLocaleDateString()})</span></div>
            </div>
            {['Coverage Amount', 'Annual Premium', 'Deductible', 'Expiry Date', 'Add-ons'].map(field => {
              const aChange = compareModal.a.changes.find(c => c.field === field);
              const bChange = compareModal.b.changes.find(c => c.field === field);
              return (
                <div key={field} className="grid grid-cols-3 gap-3 p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-xs text-gray-500">{field}</span>
                  <span className="text-xs text-gray-300">{aChange ? aChange.to : '—'}</span>
                  <span className="text-xs text-gray-300">{bChange ? bChange.to : '—'}</span>
                </div>
              );
            })}
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setCompareModal(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
