import { useState } from 'react';
import { Copy, AlertTriangle, CheckCircle, Search, ExternalLink, Shield } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { mockClaims } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useToast } from '@/context/ToastContext';

interface DuplicateGroup {
  id: string;
  matchType: 'exact' | 'similar' | 'suspicious';
  confidence: number;
  matchReasons: string[];
  claims: typeof mockClaims;
  totalAmount: number;
}

// Generate mock duplicate groups from existing claims
function generateDuplicateGroups(): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];

  // Group 1: Same claimant, similar amounts
  const group1Claims = mockClaims.filter((c) => c.claimant.name === mockClaims[0].claimant.name).slice(0, 2);
  if (group1Claims.length >= 2) {
    groups.push({
      id: 'dup_1',
      matchType: 'exact',
      confidence: 96,
      matchReasons: ['Same claimant name', 'Same phone number', 'Similar claim amount (±5%)', 'Same claim type'],
      claims: group1Claims,
      totalAmount: group1Claims.reduce((s, c) => s + c.amount, 0),
    });
  }

  // Group 2: Cross-reference suspicious
  const group2Claims = mockClaims
    .filter((c) => c.riskLevel === 'critical' && c.amount > 30000)
    .slice(0, 3);
  if (group2Claims.length >= 2) {
    groups.push({
      id: 'dup_2',
      matchType: 'suspicious',
      confidence: 78,
      matchReasons: ['Same repair shop', 'Claims filed within 48 hours', 'Overlapping policy periods'],
      claims: group2Claims.slice(0, 2),
      totalAmount: group2Claims.slice(0, 2).reduce((s, c) => s + c.amount, 0),
    });
  }

  // Group 3: Similar pattern
  const group3Claims = mockClaims
    .filter((c) => c.type === 'auto_collision')
    .slice(5, 7);
  if (group3Claims.length >= 2) {
    groups.push({
      id: 'dup_3',
      matchType: 'similar',
      confidence: 64,
      matchReasons: ['Same accident description pattern', 'Same date of loss', 'Matching vehicle model'],
      claims: group3Claims,
      totalAmount: group3Claims.reduce((s, c) => s + c.amount, 0),
    });
  }

  // Add 2 more groups for richer demo
  groups.push({
    id: 'dup_4',
    matchType: 'suspicious',
    confidence: 88,
    matchReasons: ['Same IP address at submission', 'Identical document metadata', 'Shared witness contact'],
    claims: mockClaims.slice(10, 12),
    totalAmount: mockClaims.slice(10, 12).reduce((s, c) => s + c.amount, 0),
  });

  groups.push({
    id: 'dup_5',
    matchType: 'similar',
    confidence: 55,
    matchReasons: ['Similar incident location (2km radius)', 'Same adjuster workshop', 'Comparable damage description'],
    claims: mockClaims.slice(20, 22),
    totalAmount: mockClaims.slice(20, 22).reduce((s, c) => s + c.amount, 0),
  });

  return groups;
}

const DUPLICATE_GROUPS = generateDuplicateGroups();

export const DuplicateDetector = () => {
  const { success } = useToast();
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState('2 hours ago');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'exact' | 'similar' | 'suspicious'>('all');

  const handleScan = async () => {
    setScanning(true);
    await new Promise((r) => setTimeout(r, 2000));
    setScanning(false);
    setLastScan('just now');
    success('Scan Complete', `Found ${DUPLICATE_GROUPS.length} potential duplicate groups across ${mockClaims.length} claims.`);
  };

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
    success('Group Dismissed', 'Duplicate group marked as reviewed.');
  };

  const matchConfig = {
    exact: { label: 'Exact Match', color: '#EF4444', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: Copy },
    suspicious: { label: 'Suspicious', color: '#F59E0B', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle },
    similar: { label: 'Similar Pattern', color: '#3B82F6', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Search },
  };

  const activeGroups = DUPLICATE_GROUPS.filter(
    (g) => !dismissed.has(g.id) && (filter === 'all' || g.matchType === filter)
  );

  const totalPotentialSavings = activeGroups.reduce((s, g) => s + g.totalAmount * 0.6, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-[#10B981]" />
            <h3 className="text-base font-bold text-gray-200">Duplicate Claim Detector</h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            AI cross-reference analysis · Last scan: {lastScan}
          </p>
        </div>
        <Button size="sm" isLoading={scanning} onClick={handleScan} leftIcon={scanning ? undefined : <Search size={14} />}>
          {scanning ? 'Scanning...' : 'Run Full Scan'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Exact Duplicates', value: DUPLICATE_GROUPS.filter((g) => g.matchType === 'exact').length, color: '#EF4444', bg: 'bg-red-500/10' },
          { label: 'Suspicious Groups', value: DUPLICATE_GROUPS.filter((g) => g.matchType === 'suspicious').length, color: '#F59E0B', bg: 'bg-amber-500/10' },
          { label: 'Similar Patterns', value: DUPLICATE_GROUPS.filter((g) => g.matchType === 'similar').length, color: '#3B82F6', bg: 'bg-blue-500/10' },
          { label: 'Potential Savings', value: formatCurrency(totalPotentialSavings, true), color: '#10B981', bg: 'bg-emerald-500/10' },
        ].map((stat) => (
          <GlassPanel key={stat.label} className="text-center">
            <p className="text-2xl font-bold tabular-nums" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">{stat.label}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'exact', 'suspicious', 'similar'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all',
              filter === f
                ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
                : 'border-white/[0.07] text-gray-500 hover:text-gray-300'
            )}
          >
            {f === 'all' ? 'All Groups' : matchConfig[f].label}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-gray-600">{activeGroups.length} active groups</span>
      </div>

      {/* Duplicate groups */}
      <div className="space-y-4">
        {activeGroups.map((group) => {
          const cfg = matchConfig[group.matchType];
          const MatchIcon = cfg.icon;
          return (
            <GlassPanel key={group.id} className={cn('border', cfg.border)}>
              {/* Group header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-xl', cfg.bg)}>
                    <MatchIcon size={16} style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', cfg.bg, cfg.border)} style={{ color: cfg.color }}>
                        {group.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{group.claims.length} claims · {formatCurrency(group.totalAmount)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDismiss(group.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-400 border border-white/[0.08] hover:text-gray-200 hover:bg-white/[0.06] transition-colors"
                  >
                    <CheckCircle size={12} /> Dismiss
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors"
                    style={{ color: cfg.color, backgroundColor: `${cfg.color}15`, borderColor: `${cfg.color}33` }}
                  >
                    Investigate <ExternalLink size={10} />
                  </button>
                </div>
              </div>

              {/* Match reasons */}
              <div className="mb-4 flex flex-wrap gap-2">
                {group.matchReasons.map((reason, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-gray-400 font-mono">
                    {reason}
                  </span>
                ))}
              </div>

              {/* Claims in group */}
              <div className="space-y-2">
                {group.claims.map((claim, idx) => (
                  <div key={claim.id} className="flex items-center gap-3 rounded-lg bg-white/[0.02] border border-white/[0.05] p-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-[10px] font-bold text-gray-400">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-2">
                      <span className="font-mono text-xs font-bold text-[#10B981]">{claim.claimNumber}</span>
                      <span className="text-xs text-gray-400 truncate">{claim.claimant.name}</span>
                      <span className="text-xs font-semibold text-gray-300">{formatCurrency(claim.amount)}</span>
                      <span className="text-[10px] text-gray-600">{formatDate(claim.submittedAt)}</span>
                    </div>
                    <button className="shrink-0 text-gray-600 hover:text-[#10B981] transition-colors">
                      <ExternalLink size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Confidence breakdown */}
              <div className="mt-4 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-600">Match Confidence</span>
                  <span className="text-[10px] font-bold" style={{ color: cfg.color }}>{group.confidence}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${group.confidence}%`, backgroundColor: cfg.color, opacity: 0.7 }}
                  />
                </div>
              </div>
            </GlassPanel>
          );
        })}

        {activeGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-white/[0.08]">
            <CheckCircle size={36} className="text-emerald-400 mb-3" />
            <p className="text-sm font-medium text-gray-300">No duplicate groups found</p>
            <p className="text-xs text-gray-600 mt-1">All claims appear to be unique in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};
