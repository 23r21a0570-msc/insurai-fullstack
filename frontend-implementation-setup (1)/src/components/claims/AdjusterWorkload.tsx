import { useState } from 'react';
import { Users, AlertTriangle, CheckCircle, ArrowRight, Shuffle } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { mockClaims, mockUsers } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import { useToast } from '@/context/ToastContext';

interface AdjusterStats {
  id: string;
  name: string;
  role: string;
  avatar: string;
  activeClaims: number;
  maxCapacity: number;
  criticalCount: number;
  highCount: number;
  avgProcessingDays: number;
  approvalRate: number;
  totalValue: number;
  status: 'available' | 'busy' | 'overloaded';
}

const ADJUSTERS: AdjusterStats[] = mockUsers
  .filter((u) => ['agent', 'analyst', 'manager'].includes(u.role))
  .map((u, i) => {
    const assignedClaims = mockClaims.filter((c) => c.assignedToName === u.name);
    const maxCap = u.role === 'manager' ? 8 : u.role === 'analyst' ? 12 : 15;
    const active = Math.min(assignedClaims.length + i * 2, maxCap + 3);
    const critical = assignedClaims.filter((c) => c.riskLevel === 'critical').length;
    const high = assignedClaims.filter((c) => c.riskLevel === 'high').length;
    const totalVal = assignedClaims.reduce((s, c) => s + c.amount, 0) + i * 15000;
    const utilization = active / maxCap;
    return {
      id: u.id,
      name: u.name,
      role: u.role,
      avatar: u.name.split(' ').map((n) => n[0]).join(''),
      activeClaims: active,
      maxCapacity: maxCap,
      criticalCount: critical,
      highCount: high,
      avgProcessingDays: 4 + i * 0.8,
      approvalRate: 82 - i * 3,
      totalValue: totalVal,
      status: utilization > 1 ? 'overloaded' : utilization > 0.8 ? 'busy' : 'available',
    };
  });

const UNASSIGNED = mockClaims
  .filter((c) => !c.assignedToName && ['submitted', 'under_review'].includes(c.status))
  .slice(0, 8);

export const AdjusterWorkload = () => {
  const { success } = useToast();
  const [_dragging, setDragging] = useState<string | null>(null);
  const [autoAssigning, setAutoAssigning] = useState(false);
  const [assigned, setAssigned] = useState<Record<string, string>>({});

  const handleAssign = (claimId: string, adjusterId: string, adjusterName: string) => {
    setAssigned((prev) => ({ ...prev, [claimId]: adjusterId }));
    const claim = UNASSIGNED.find((c) => c.id === claimId);
    success('Claim Assigned', `${claim?.claimNumber} assigned to ${adjusterName}`);
  };

  const handleAutoAssign = async () => {
    setAutoAssigning(true);
    await new Promise((r) => setTimeout(r, 1500));
    const newAssignments: Record<string, string> = {};
    UNASSIGNED.forEach((claim, i) => {
      const available = ADJUSTERS.filter((a) => a.status !== 'overloaded');
      const best = available.sort((x, y) => x.activeClaims / x.maxCapacity - y.activeClaims / y.maxCapacity)[i % available.length];
      if (best) newAssignments[claim.id] = best.id;
    });
    setAssigned(newAssignments);
    setAutoAssigning(false);
    success('Auto-Assignment Complete', `${UNASSIGNED.length} claims distributed across ${ADJUSTERS.length} adjusters`);
  };

  const statusConfig = {
    available: { label: 'Available', color: '#10B981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    busy: { label: 'Busy', color: '#F59E0B', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    overloaded: { label: 'Overloaded', color: '#EF4444', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  };

  const totalCapacity = ADJUSTERS.reduce((s, a) => s + a.maxCapacity, 0);
  const totalActive = ADJUSTERS.reduce((s, a) => s + a.activeClaims, 0);
  const overallUtilization = Math.round((totalActive / totalCapacity) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-200 flex items-center gap-2">
            <Users size={18} className="text-[#10B981]" /> Adjuster Workload
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Team capacity — {overallUtilization}% utilized · {UNASSIGNED.length} unassigned claims</p>
        </div>
        <Button
          size="sm"
          leftIcon={autoAssigning ? undefined : <Shuffle size={14} />}
          isLoading={autoAssigning}
          onClick={handleAutoAssign}
        >
          {autoAssigning ? 'Assigning...' : 'AI Auto-Assign'}
        </Button>
      </div>

      {/* Team capacity bar */}
      <GlassPanel>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Team Capacity Overview</p>
          <span className={cn(
            'text-xs font-bold px-2 py-0.5 rounded-full',
            overallUtilization > 90 ? 'text-red-400 bg-red-500/10' :
            overallUtilization > 75 ? 'text-amber-400 bg-amber-500/10' :
            'text-emerald-400 bg-emerald-500/10'
          )}>
            {overallUtilization}% utilized
          </span>
        </div>
        <div className="h-3 rounded-full bg-white/[0.05] overflow-hidden flex">
          {ADJUSTERS.map((a) => (
            <div
              key={a.id}
              className="h-full transition-all"
              style={{
                width: `${(a.activeClaims / totalCapacity) * 100}%`,
                backgroundColor: statusConfig[a.status].color,
                opacity: 0.7,
              }}
              title={`${a.name}: ${a.activeClaims}/${a.maxCapacity}`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {ADJUSTERS.map((a) => (
            <div key={a.id} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusConfig[a.status].color }} />
              <span className="text-[10px] text-gray-500">{a.name.split(' ')[0]}: {a.activeClaims}/{a.maxCapacity}</span>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Adjuster cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ADJUSTERS.map((adj) => {
          const cfg = statusConfig[adj.status];
          const utilization = (adj.activeClaims / adj.maxCapacity) * 100;
          return (
            <GlassPanel key={adj.id} className={cn('border', cfg.border)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center text-sm font-bold">
                    {adj.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-200">{adj.name}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{adj.role}</p>
                  </div>
                </div>
                <span className={cn('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border', cfg.bg, cfg.border)} style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
              </div>

              {/* Capacity bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-gray-600">Workload</span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: cfg.color }}>
                    {adj.activeClaims}/{adj.maxCapacity} claims
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(utilization, 100)}%`, backgroundColor: cfg.color, opacity: 0.7 }}
                  />
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: 'Critical', value: adj.criticalCount, color: '#EF4444' },
                  { label: 'Approval', value: `${adj.approvalRate}%`, color: '#10B981' },
                  { label: 'Avg Days', value: adj.avgProcessingDays.toFixed(1), color: '#3B82F6' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-2">
                    <p className="text-sm font-bold tabular-nums" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-[9px] text-gray-600 uppercase tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] text-gray-600">Portfolio: {formatCurrency(adj.totalValue, true)}</span>
                {adj.status === 'overloaded' && (
                  <div className="flex items-center gap-1 text-[10px] text-red-400">
                    <AlertTriangle size={10} />
                    <span>Redistribute needed</span>
                  </div>
                )}
                {adj.status === 'available' && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <CheckCircle size={10} />
                    <span>Ready for more</span>
                  </div>
                )}
              </div>
            </GlassPanel>
          );
        })}
      </div>

      {/* Unassigned Claims */}
      {UNASSIGNED.length > 0 && (
        <GlassPanel>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Unassigned Claims ({UNASSIGNED.filter((c) => !assigned[c.id]).length} remaining)
          </p>
          <div className="space-y-2">
            {UNASSIGNED.map((claim) => {
              const isAssigned = !!assigned[claim.id];
              const assignedAdj = ADJUSTERS.find((a) => a.id === assigned[claim.id]);
              return (
                <div
                  key={claim.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-3 transition-all',
                    isAssigned
                      ? 'border-emerald-500/20 bg-emerald-500/[0.03] opacity-60'
                      : 'border-white/[0.06] bg-white/[0.02]'
                  )}
                  draggable
                  onDragStart={() => setDragging(claim.id)}
                  onDragEnd={() => setDragging(null)}
                >
                  <div className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    claim.riskLevel === 'critical' ? 'bg-red-400' :
                    claim.riskLevel === 'high' ? 'bg-amber-400' :
                    claim.riskLevel === 'medium' ? 'bg-blue-400' : 'bg-emerald-400'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#10B981]">{claim.claimNumber}</span>
                      <span className="text-xs text-gray-500 truncate">{claim.claimant.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-600">{formatCurrency(claim.amount)} · {claim.riskLevel} risk</span>
                  </div>

                  {isAssigned ? (
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle size={13} />
                      <span className="text-xs font-medium">{assignedAdj?.name.split(' ')[0]}</span>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      {ADJUSTERS.filter((a) => a.status !== 'overloaded').slice(0, 2).map((adj) => (
                        <button
                          key={adj.id}
                          onClick={() => handleAssign(claim.id, adj.id, adj.name)}
                          className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-gray-200 hover:bg-white/[0.08] transition-colors"
                          title={`Assign to ${adj.name}`}
                        >
                          <ArrowRight size={10} />
                          {adj.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </GlassPanel>
      )}
    </div>
  );
};
