import { useState } from 'react';
import { FileText, Search, Plus, ChevronRight, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Modal } from '@/components/ui/Modal';
import { ClaimTracker } from '@/components/ui/ClaimTracker';
import { mockCustomerClaims, CustomerClaim } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { cn } from '@/utils/cn';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  submitted:    { label: 'Submitted',    color: 'text-gray-400 bg-gray-500/10 border-gray-500/20',          icon: Clock },
  under_review: { label: 'Under Review', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',          icon: Clock },
  pending_info: { label: 'Pending Info', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',       icon: AlertCircle },
  approved:     { label: 'Approved',     color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
  rejected:     { label: 'Rejected',     color: 'text-red-400 bg-red-500/10 border-red-500/20',             icon: XCircle },
  escalated:    { label: 'Escalated',    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',    icon: AlertCircle },
};

const claimTypeLabels: Record<string, string> = {
  auto_collision:   'Auto – Collision',
  auto_theft:       'Auto – Theft',
  property_damage:  'Property Damage',
  medical:          'Medical',
  liability:        'Liability',
  natural_disaster: 'Natural Disaster',
};

export const CustomerClaims = () => {
  const [search, setSearch] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<CustomerClaim | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = mockCustomerClaims.filter((c) => {
    const matchesSearch =
      c.claimNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.policyNumber.toLowerCase().includes(search.toLowerCase()) ||
      claimTypeLabels[c.type]?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Claims</h1>
          <p className="text-sm text-gray-500 mt-1">Track the status of your insurance claims.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] text-white text-sm font-bold hover:bg-[#059669] transition-all self-start sm:self-auto">
          <Plus size={15} /> File New Claim
        </button>
      </div>

      {/* Filters */}
      <GlassPanel className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by claim ID or policy…"
              className="w-full h-9 pl-9 pr-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#10B981]/40"
              aria-label="Search claims"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'submitted', 'under_review', 'pending_info', 'approved', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border',
                  statusFilter === s
                    ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                    : 'bg-white/[0.03] border-white/[0.08] text-gray-500 hover:border-white/20'
                )}
              >
                {s === 'all' ? 'All' : statusConfig[s]?.label ?? s}
              </button>
            ))}
          </div>
        </div>
      </GlassPanel>

      {/* Claims list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <GlassPanel>
            <div className="flex flex-col items-center justify-center py-12">
              <FileText size={40} className="text-gray-700 mb-3" />
              <p className="text-gray-500 text-sm font-medium">No claims found.</p>
              <p className="text-gray-600 text-xs mt-1">Try adjusting your search or filters.</p>
            </div>
          </GlassPanel>
        ) : (
          filtered.map((claim) => {
            const cfg = statusConfig[claim.status];
            const Icon = cfg?.icon ?? Clock;
            return (
              <div
                key={claim.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.03] transition-all cursor-pointer group"
                onClick={() => setSelectedClaim(claim)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedClaim(claim)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-[#10B981]/10 text-[#10B981] shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-mono font-bold text-[#10B981]">{claim.claimNumber}</span>
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold uppercase', cfg?.color)}>
                        <Icon size={9} /> {cfg?.label ?? claim.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{claimTypeLabels[claim.type] ?? claim.type} · {claim.policyNumber}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">{claim.description}</p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-1 shrink-0">
                  <p className="text-lg font-bold text-white tabular-nums">{formatCurrency(claim.amount)}</p>
                  <p className="text-[10px] text-gray-600">Filed {formatDate(claim.submittedAt)}</p>
                  <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors hidden sm:block" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Claim detail modal with tracker */}
      <Modal isOpen={!!selectedClaim} onClose={() => setSelectedClaim(null)} title="Claim Details">
        {selectedClaim && (
          <div className="space-y-6">
            {/* Basic info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Claim Amount</p>
                <p className="text-xl font-bold text-white tabular-nums mt-1">{formatCurrency(selectedClaim.amount)}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Policy</p>
                <p className="text-sm font-mono font-bold text-gray-200 mt-1">{selectedClaim.policyNumber}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Description</p>
              <p className="text-xs text-gray-400 leading-relaxed">{selectedClaim.description}</p>
            </div>

            {/* Claim tracker */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.01]">
              <ClaimTracker
                claimNumber={selectedClaim.claimNumber}
                currentStatus={selectedClaim.status}
                submittedAt={selectedClaim.submittedAt}
                updatedAt={selectedClaim.updatedAt}
              />
            </div>

            {selectedClaim.status === 'pending_info' && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/[0.07] border border-amber-500/20">
                <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-400">Action Required</p>
                  <p className="text-xs text-gray-400 mt-1">We need additional documents to process your claim. Please upload the requested files as soon as possible.</p>
                  <button className="mt-2 text-xs text-[#10B981] hover:underline font-medium">Upload documents →</button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
