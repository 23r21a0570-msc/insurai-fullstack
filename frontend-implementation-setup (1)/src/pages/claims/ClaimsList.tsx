import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Download, FileText, X, CheckSquare,
  Square, CheckCircle, XCircle, Users, ChevronDown,
} from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { RiskBadge, StatusBadge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { mockClaims, mockUsers } from '@/data/mockData';
import { formatCurrency, formatDate, formatClaimType } from '@/utils/formatters';
import type { Claim, ClaimStatus, RiskLevel } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

const STATUS_FILTERS: { label: string; value: ClaimStatus }[] = [
  { label: 'Under Review', value: 'under_review' },
  { label: 'Pending Info', value: 'pending_info' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Escalated', value: 'escalated' },
];

const RISK_FILTERS: { label: string; value: RiskLevel }[] = [
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

const PAGE_SIZE = 15;
const AGENTS = mockUsers.filter((u) => ['agent', 'analyst', 'manager'].includes(u.role));

export const ClaimsList = () => {
  const navigate = useNavigate();
  const { success } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClaimStatus[]>([]);
  const [riskFilter, setRiskFilter] = useState<RiskLevel[]>([]);
  const [page, setPage] = useState(1);

  // Bulk selection
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkModal, setBulkModal] = useState<'approve' | 'reject' | 'assign' | null>(null);
  const [assignTo, setAssignTo] = useState('');
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 200);

  const filtered = useMemo(() => {
    let data = mockClaims;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      data = data.filter(
        (c: Claim) =>
          c.claimNumber.toLowerCase().includes(q) ||
          c.claimant.name.toLowerCase().includes(q) ||
          c.policyNumber.toLowerCase().includes(q)
      );
    }
    if (statusFilter.length) {
      data = data.filter((c: Claim) => statusFilter.includes(c.status));
    }
    if (riskFilter.length) {
      data = data.filter((c: Claim) => riskFilter.includes(c.riskLevel));
    }
    return data;
  }, [debouncedSearch, statusFilter, riskFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageIds = new Set(paginated.map((c) => c.id));
  const allPageSelected = pageIds.size > 0 && [...pageIds].every((id) => selected.has(id));
  const somePageSelected = [...pageIds].some((id) => selected.has(id));

  const toggleStatus = (s: ClaimStatus) => {
    setPage(1);
    setStatusFilter((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const toggleRisk = (r: RiskLevel) => {
    setPage(1);
    setRiskFilter((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);
  };

  const clearFilters = () => {
    setStatusFilter([]);
    setRiskFilter([]);
    setSearch('');
    setPage(1);
  };

  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelected((prev) => { const next = new Set(prev); pageIds.forEach((id) => next.delete(id)); return next; });
    } else {
      setSelected((prev) => { const next = new Set(prev); pageIds.forEach((id) => next.add(id)); return next; });
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const handleBulkAction = (action: 'approve' | 'reject' | 'assign') => {
    setBulkMenuOpen(false);
    if (action === 'assign') { setBulkModal('assign'); return; }
    setBulkModal(action);
  };

  const confirmBulkAction = () => {
    const count = selected.size;
    if (bulkModal === 'approve') success(`${count} claims approved`, 'All selected claims have been approved.');
    if (bulkModal === 'reject') success(`${count} claims rejected`, 'All selected claims have been rejected.');
    if (bulkModal === 'assign') success(`${count} claims assigned`, `Assigned to ${AGENTS.find(a => a.id === assignTo)?.name ?? 'agent'}.`);
    setSelected(new Set());
    setBulkModal(null);
    setAssignTo('');
  };

  const hasFilters = statusFilter.length > 0 || riskFilter.length > 0 || search.length > 0;

  const columns: Column<Claim>[] = [
    {
      key: 'select',
      header: '',
      width: '40px',
      render: (item) => (
        <button
          onClick={(e) => toggleSelect(item.id, e)}
          className="flex items-center justify-center text-gray-600 hover:text-[#10B981] transition-colors"
          aria-label={selected.has(item.id) ? 'Deselect claim' : 'Select claim'}
        >
          {selected.has(item.id)
            ? <CheckSquare size={16} className="text-[#10B981]" />
            : <Square size={16} />
          }
        </button>
      ),
    },
    {
      key: 'claimNumber',
      header: 'Claim ID',
      sortable: true,
      accessor: 'claimNumber',
      render: (item) => (
        <span className="font-mono text-xs font-bold text-[#10B981]">{item.claimNumber}</span>
      ),
    },
    {
      key: 'claimant',
      header: 'Claimant',
      render: (item) => (
        <div>
          <p className="text-sm font-semibold text-gray-200">{item.claimant.name}</p>
          <p className="text-xs text-gray-600 font-mono">{item.policyNumber}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      accessor: 'type',
      render: (item) => (
        <span className="text-xs text-gray-400">{formatClaimType(item.type)}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      accessor: 'amount',
      align: 'right',
      render: (item) => (
        <span className="text-sm font-semibold text-gray-200 tabular-nums">
          {formatCurrency(item.amount)}
        </span>
      ),
    },
    {
      key: 'riskLevel',
      header: 'Risk',
      sortable: true,
      accessor: 'riskLevel',
      render: (item) => <RiskBadge level={item.riskLevel} />,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      accessor: 'status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'submittedAt',
      header: 'Submitted',
      sortable: true,
      accessor: 'submittedAt',
      render: (item) => (
        <span className="text-xs text-gray-500">{formatDate(item.submittedAt)}</span>
      ),
    },
    {
      key: 'assignedToName',
      header: 'Assigned To',
      render: (item) =>
        item.assignedToName ? (
          <span className="text-xs text-gray-400">{item.assignedToName}</span>
        ) : (
          <span className="text-xs text-gray-700 italic">Unassigned</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Claims</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and triage active insurance claims across all policies.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download size={14} />}
            onClick={() => success('Export started', 'CSV download will begin shortly.')}
          >
            Export CSV
          </Button>
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => navigate('/claims/new')}>
            New Claim
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by claim ID, claimant name, or policy number..."
            className="h-9 w-full rounded-lg border border-white/[0.07] bg-white/[0.04] pl-9 pr-4 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 transition-all"
            aria-label="Search claims"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest shrink-0">Status:</span>
          {STATUS_FILTERS.map((sf) => (
            <button
              key={sf.value}
              onClick={() => toggleStatus(sf.value)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all',
                statusFilter.includes(sf.value)
                  ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
                  : 'bg-white/[0.03] border-white/[0.07] text-gray-500 hover:text-gray-300'
              )}
              aria-pressed={statusFilter.includes(sf.value)}
            >
              {sf.label}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-white/[0.08]" />
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest shrink-0">Risk:</span>
          {RISK_FILTERS.map((rf) => (
            <button
              key={rf.value}
              onClick={() => toggleRisk(rf.value)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all',
                riskFilter.includes(rf.value)
                  ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
                  : 'bg-white/[0.03] border-white/[0.07] text-gray-500 hover:text-gray-300'
              )}
              aria-pressed={riskFilter.includes(rf.value)}
            >
              {rf.label}
            </button>
          ))}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-[10px] text-gray-500 hover:text-red-400 transition-colors"
              aria-label="Clear all filters"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[11px] text-gray-600">
            Showing {paginated.length} of {filtered.length} records
            {hasFilters && ` (filtered from ${mockClaims.length} total)`}
          </p>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#10B981]/20 bg-[#10B981]/[0.05] px-4 py-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelected(new Set())}
              className="text-gray-500 hover:text-gray-300 transition-colors"
              aria-label="Clear selection"
            >
              <X size={14} />
            </button>
            <span className="text-sm font-semibold text-gray-200">
              {selected.size} claim{selected.size !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="success"
              size="sm"
              leftIcon={<CheckCircle size={13} />}
              onClick={() => handleBulkAction('approve')}
            >
              Approve All
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<XCircle size={13} />}
              onClick={() => handleBulkAction('reject')}
            >
              Reject All
            </Button>
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Users size={13} />}
                rightIcon={<ChevronDown size={12} />}
                onClick={() => setBulkMenuOpen((p) => !p)}
              >
                Assign
              </Button>
              {bulkMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setBulkMenuOpen(false)} />
                  <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-white/[0.08] bg-[#0F1629] shadow-2xl overflow-hidden animate-fade-in">
                    {AGENTS.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => { setAssignTo(a.id); setBulkMenuOpen(false); setBulkModal('assign'); }}
                        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-400 hover:bg-white/[0.06] hover:text-gray-200 transition-colors text-left"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#10B981]/15 text-[#10B981] text-[10px] font-bold">
                          {a.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">{a.name}</p>
                          <p className="text-[10px] text-gray-600 capitalize">{a.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Select All header */}
      <div className="flex items-center gap-3 px-4">
        <button
          onClick={toggleSelectAll}
          className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest hover:text-gray-400 transition-colors"
          aria-label={allPageSelected ? 'Deselect all on this page' : 'Select all on this page'}
        >
          {allPageSelected ? (
            <CheckSquare size={14} className="text-[#10B981]" />
          ) : somePageSelected ? (
            <CheckSquare size={14} className="text-gray-500 opacity-60" />
          ) : (
            <Square size={14} />
          )}
          {allPageSelected ? 'Deselect page' : 'Select page'}
        </button>
      </div>

      {/* Table */}
      <DataTable
        data={paginated}
        columns={columns}
        onRowClick={(claim) => navigate(`/claims/${claim.id}`)}
        emptyMessage="No claims match your current filters"
        emptyIcon={<FileText size={36} />}
        keyExtractor={(item) => item.id}
        rowClassName={(item) =>
          selected.has(item.id) ? 'bg-[#10B981]/[0.04] border-l-2 border-[#10B981]/40' : ''
        }
      />

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <Pagination
          page={page}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

      {/* Bulk Confirm Modal */}
      <Modal
        isOpen={bulkModal !== null}
        onClose={() => { setBulkModal(null); setAssignTo(''); }}
        title={
          bulkModal === 'approve'
            ? 'Approve Claims'
            : bulkModal === 'reject'
            ? 'Reject Claims'
            : 'Assign Claims'
        }
      >
        <div className="space-y-4">
          {bulkModal === 'assign' ? (
            <>
              <p className="text-sm text-gray-400">
                Assign <span className="font-bold text-gray-200">{selected.size} claim{selected.size !== 1 ? 's' : ''}</span> to a team member.
              </p>
              <div className="space-y-2">
                {AGENTS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAssignTo(a.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all',
                      assignTo === a.id
                        ? 'border-[#10B981]/30 bg-[#10B981]/[0.06]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                    )}
                    aria-pressed={assignTo === a.id}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/15 text-[#10B981] text-xs font-bold">
                      {a.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-200">{a.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{a.role} · {a.department}</p>
                    </div>
                    {assignTo === a.id && <CheckCircle size={16} className="ml-auto text-[#10B981]" />}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400">
              Are you sure you want to{' '}
              <span className={cn('font-bold', bulkModal === 'approve' ? 'text-[#10B981]' : 'text-red-400')}>
                {bulkModal}
              </span>{' '}
              <span className="font-bold text-gray-200">{selected.size} claim{selected.size !== 1 ? 's' : ''}</span>?
              This action cannot be undone.
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
            <Button variant="secondary" onClick={() => { setBulkModal(null); setAssignTo(''); }}>
              Cancel
            </Button>
            <Button
              variant={bulkModal === 'reject' ? 'danger' : 'primary'}
              onClick={confirmBulkAction}
              disabled={bulkModal === 'assign' && !assignTo}
            >
              {bulkModal === 'approve' ? 'Approve All' : bulkModal === 'reject' ? 'Reject All' : 'Assign'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
