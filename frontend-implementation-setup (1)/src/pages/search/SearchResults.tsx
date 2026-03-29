import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, FileText, Shield, User, ArrowRight } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { StatusBadge, RiskBadge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { mockClaims, mockPolicies, mockUsers } from '@/data/mockData';
import { cn } from '@/utils/cn';
import { useDebounce } from '@/hooks/useDebounce';

type ResultType = 'all' | 'claims' | 'policies' | 'users';

export const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<ResultType>('all');
  const debouncedQuery = useDebounce(query, 250);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery });
    }
  }, [debouncedQuery, setSearchParams]);

  const q = debouncedQuery.toLowerCase();

  const claimResults = q
    ? mockClaims.filter(
        c =>
          c.claimNumber.toLowerCase().includes(q) ||
          c.claimant.name.toLowerCase().includes(q) ||
          c.policyNumber.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      )
    : [];

  const policyResults = q
    ? mockPolicies.filter(
        p =>
          p.policyNumber.toLowerCase().includes(q) ||
          p.holderName.toLowerCase().includes(q) ||
          p.holderEmail.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      )
    : [];

  const userResults = q
    ? mockUsers.filter(
        u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
      )
    : [];

  const totalResults = claimResults.length + policyResults.length + userResults.length;

  const tabs: { id: ResultType; label: string; count: number; icon: typeof Search }[] = [
    { id: 'all',      label: 'All',      count: totalResults,          icon: Search   },
    { id: 'claims',   label: 'Claims',   count: claimResults.length,   icon: FileText },
    { id: 'policies', label: 'Policies', count: policyResults.length,  icon: Shield   },
    { id: 'users',    label: 'Users',    count: userResults.length,    icon: User     },
  ];

  const showClaims   = activeTab === 'all' || activeTab === 'claims';
  const showPolicies = activeTab === 'all' || activeTab === 'policies';
  const showUsers    = activeTab === 'all' || activeTab === 'users';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Search size={22} className="text-[#10B981]" /> Search
        </h1>
        <p className="text-sm text-gray-500 mt-1">Search across claims, policies, and team members.</p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by claim ID, name, policy number…"
          className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-all"
          aria-label="Search"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/[0.06] pb-0 overflow-x-auto hide-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap shrink-0',
                activeTab === tab.id
                  ? 'border-[#10B981] text-[#10B981]'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              )}
            >
              <Icon size={14} />
              {tab.label}
              {tab.count > 0 && (
                <span className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  activeTab === tab.id
                    ? 'bg-[#10B981]/20 text-[#10B981]'
                    : 'bg-white/10 text-gray-500'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* No query state */}
      {!q && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search size={40} className="text-gray-700 mb-4" />
          <p className="text-gray-500 font-medium">Start typing to search</p>
          <p className="text-gray-700 text-sm mt-1">Search across all claims, policies, and users</p>
        </div>
      )}

      {/* No results state */}
      {q && totalResults === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search size={40} className="text-gray-700 mb-4" />
          <p className="text-gray-400 font-medium">No results for "{q}"</p>
          <p className="text-gray-600 text-sm mt-1">Try a different search term</p>
        </div>
      )}

      {/* Claims Results */}
      {showClaims && claimResults.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <FileText size={12} /> Claims ({claimResults.length})
          </h2>
          <GlassPanel className="!p-0 overflow-hidden">
            <div className="divide-y divide-white/[0.04]">
              {claimResults.slice(0, activeTab === 'all' ? 5 : 20).map(claim => (
                <button
                  key={claim.id}
                  onClick={() => navigate(`/claims/${claim.id}`)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors text-left group"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#10B981]/10">
                    <FileText size={16} className="text-[#10B981]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-sm font-bold text-white">{claim.claimNumber}</span>
                      <StatusBadge status={claim.status} size="sm" />
                      <RiskBadge level={claim.riskLevel} size="sm" />
                    </div>
                    <p className="text-xs text-gray-500 truncate">{claim.claimant.name} · {claim.policyNumber} · {formatDate(claim.submittedAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-white">{formatCurrency(claim.amount)}</p>
                    <ArrowRight size={14} className="text-gray-600 group-hover:text-[#10B981] ml-auto mt-1 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
            {activeTab === 'all' && claimResults.length > 5 && (
              <button
                onClick={() => setActiveTab('claims')}
                className="w-full py-3 text-xs text-[#10B981] hover:bg-white/[0.02] transition-colors font-semibold border-t border-white/[0.04]"
              >
                View all {claimResults.length} claims →
              </button>
            )}
          </GlassPanel>
        </div>
      )}

      {/* Policy Results */}
      {showPolicies && policyResults.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Shield size={12} /> Policies ({policyResults.length})
          </h2>
          <GlassPanel className="!p-0 overflow-hidden">
            <div className="divide-y divide-white/[0.04]">
              {policyResults.slice(0, activeTab === 'all' ? 5 : 20).map(policy => (
                <button
                  key={policy.id}
                  onClick={() => navigate(`/policies/${policy.id}`)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors text-left group"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                    <Shield size={16} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-sm font-bold text-white">{policy.policyNumber}</span>
                      <span className={cn(
                        'inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold border',
                        policy.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      )}>
                        {policy.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {policy.holderName} · {policy.type} · expires {formatDate(policy.endDate)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-white">{formatCurrency(policy.coverageAmount, true)}</p>
                    <p className="text-[10px] text-gray-600">coverage</p>
                  </div>
                </button>
              ))}
            </div>
            {activeTab === 'all' && policyResults.length > 5 && (
              <button
                onClick={() => setActiveTab('policies')}
                className="w-full py-3 text-xs text-[#10B981] hover:bg-white/[0.02] transition-colors font-semibold border-t border-white/[0.04]"
              >
                View all {policyResults.length} policies →
              </button>
            )}
          </GlassPanel>
        </div>
      )}

      {/* User Results */}
      {showUsers && userResults.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <User size={12} /> Team Members ({userResults.length})
          </h2>
          <GlassPanel className="!p-0 overflow-hidden">
            <div className="divide-y divide-white/[0.04]">
              {userResults.slice(0, activeTab === 'all' ? 5 : 20).map(user => (
                <button
                  key={user.id}
                  onClick={() => navigate('/users')}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors text-left"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email} · {user.role}</p>
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-bold shrink-0',
                    user.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-500'
                  )}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </button>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
