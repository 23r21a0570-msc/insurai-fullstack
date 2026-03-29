import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, User, DollarSign, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { RiskBadge, StatusBadge } from '@/components/ui/Badge';
import { mockClaims } from '@/data/mockData';
import { formatCurrency, formatRelativeTime, formatClaimType } from '@/utils/formatters';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

export const ClaimQueue = () => {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [processed, setProcessed] = useState<Set<string>>(new Set());

  // Simulate "my queue": unassigned or pending claims, sorted by risk
  const queue = [...mockClaims]
    .filter((c) => ['submitted', 'under_review', 'pending_info'].includes(c.status))
    .sort((a, b) => PRIORITY_ORDER[a.riskLevel] - PRIORITY_ORDER[b.riskLevel])
    .slice(0, 20);

  const pending = queue.filter((c) => !processed.has(c.id));
  const done = queue.filter((c) => processed.has(c.id));

  const handleApprove = (id: string, claimNumber: string) => {
    setProcessed((prev) => new Set([...prev, id]));
    success('Claim Approved', `${claimNumber} has been approved.`);
  };

  const handleReject = (id: string, claimNumber: string) => {
    setProcessed((prev) => new Set([...prev, id]));
    toastError('Claim Rejected', `${claimNumber} has been rejected.`);
  };

  const riskColors: Record<string, string> = {
    critical: '#EF4444',
    high: '#F59E0B',
    medium: '#3B82F6',
    low: '#10B981',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Clock size={22} className="text-[#10B981]" />
            My Queue
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Claims assigned to you, sorted by priority. {pending.length} pending, {done.length} processed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07]">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-xs text-gray-400 font-medium">{pending.length} pending</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07]">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            <span className="text-xs text-gray-400 font-medium">{done.length} done</span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Critical', count: queue.filter(c => c.riskLevel === 'critical').length, color: '#EF4444' },
          { label: 'High Risk', count: queue.filter(c => c.riskLevel === 'high').length, color: '#F59E0B' },
          { label: 'Medium', count: queue.filter(c => c.riskLevel === 'medium').length, color: '#3B82F6' },
          { label: 'Low', count: queue.filter(c => c.riskLevel === 'low').length, color: '#10B981' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center gap-3"
            style={{ borderLeftColor: item.color, borderLeftWidth: 3 }}
          >
            <div>
              <p className="text-xl font-bold text-gray-100 tabular-nums">{item.count}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Queue list */}
      {pending.length === 0 ? (
        <GlassPanel className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle size={48} className="text-[#10B981] mb-4" />
          <h3 className="text-lg font-bold text-gray-200 mb-1">Queue cleared!</h3>
          <p className="text-sm text-gray-500">You've processed all claims in your queue.</p>
        </GlassPanel>
      ) : (
        <div className="space-y-3">
          {pending.map((claim, idx) => (
            <div
              key={claim.id}
              className={cn(
                'group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]',
                processed.has(claim.id) && 'opacity-50'
              )}
            >
              <div className="flex items-start gap-4">
                {/* Priority indicator */}
                <div
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                  style={{
                    backgroundColor: `${riskColors[claim.riskLevel]}15`,
                    color: riskColors[claim.riskLevel],
                  }}
                >
                  {idx + 1}
                </div>

                {/* Claim info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-mono text-sm font-bold text-[#10B981]">{claim.claimNumber}</span>
                    <StatusBadge status={claim.status} />
                    <RiskBadge level={claim.riskLevel} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <User size={11} />
                      <span className="truncate">{claim.claimant.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <DollarSign size={11} />
                      <span className="font-semibold text-gray-300">{formatCurrency(claim.amount)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <AlertTriangle size={11} />
                      <span>Risk: {claim.riskScore}/100</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock size={11} />
                      <span>{formatRelativeTime(claim.submittedAt)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-1">
                    {formatClaimType(claim.type)} — {claim.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/claims/${claim.id}`)}
                    className="h-8 w-8 text-gray-600 hover:text-gray-300"
                    title="View details"
                  >
                    <ChevronRight size={16} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<XCircle size={13} />}
                    onClick={() => handleReject(claim.id, claim.claimNumber)}
                    className="h-8 text-xs"
                  >
                    Reject
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    leftIcon={<CheckCircle size={13} />}
                    onClick={() => handleApprove(claim.id, claim.claimNumber)}
                    className="h-8 text-xs"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Processed section */}
      {done.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Processed ({done.length})</p>
          <div className="space-y-2">
            {done.map((claim) => (
              <div
                key={claim.id}
                className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.01] p-3 opacity-60"
              >
                <CheckCircle size={14} className="text-[#10B981] shrink-0" />
                <span className="font-mono text-xs text-gray-500">{claim.claimNumber}</span>
                <span className="text-xs text-gray-600">{claim.claimant.name}</span>
                <span className="ml-auto text-xs text-gray-600">{formatCurrency(claim.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
