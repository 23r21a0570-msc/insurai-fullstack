import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, User, Mail, Shield, FileText,
  CreditCard, CheckCircle,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable, Column } from '@/components/ui/DataTable';
import { formatCurrency, formatDate, formatRelativeTime, getInitials } from '@/utils/formatters';
import {
  mockCustomerClaims, mockCustomerPolicies, mockCustomerUser,
  CustomerClaim, CustomerPolicy,
} from '@/data/mockData';

// Tiny helper so we don't need a full cn import just for one spot
const cl = (...args: string[]) => args.filter(Boolean).join(' ');

export const CustomerDetail = () => {
  const { _id } = useParams() as { _id?: string };
  void _id; // reserved for real API lookup
  const navigate = useNavigate();

  const customer = mockCustomerUser;
  const policies = mockCustomerPolicies;
  const claims   = mockCustomerClaims;

  const totalCoverage  = policies.reduce((s, p) => s + p.coverageAmount, 0);
  const totalPremium   = policies.reduce((s, p) => s + p.premium, 0);
  const activePolicies = policies.filter(p => p.status === 'active').length;
  const openClaims     = claims.filter(
    c => ['submitted', 'under_review', 'pending_info'].includes(c.status)
  ).length;

  // ── Claim columns ───────────────────────────────────────────
  const claimColumns: Column<CustomerClaim>[] = [
    {
      key: 'claimNumber',
      header: 'Claim ID',
      render: (item) => (
        <span className="font-mono text-[#10B981] text-xs font-semibold">{item.claimNumber}</span>
      ),
    },
    { key: 'policyNumber', header: 'Policy', accessor: 'policyNumber' },
    {
      key: 'status',
      header: 'Status',
      render: (item) => {
        // CustomerClaim has its own status - map to ClaimStatus for badge
        return (
          <StatusBadge status={item.status} size="sm" />
        );
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item) => formatCurrency(item.amount),
    },
    {
      key: 'submittedAt',
      header: 'Filed',
      render: (item) => formatDate(item.submittedAt),
    },
  ];

  // ── Policy columns ──────────────────────────────────────────
  const policyColumns: Column<CustomerPolicy>[] = [
    {
      key: 'policyNumber',
      header: 'Policy No.',
      render: (item) => (
        <span className="font-mono font-semibold text-gray-200">{item.policyNumber}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (item) => <span className="capitalize">{item.type}</span>,
    },
    {
      key: 'coverageAmount',
      header: 'Coverage',
      render: (item) => formatCurrency(item.coverageAmount),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span className={cl(
          'inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold border',
          item.status === 'active'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        )}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'endDate',
      header: 'Expires',
      render: (item) => formatDate(item.endDate),
    },
  ];

  const quickStats = [
    { label: 'Active Policies', value: activePolicies,                          icon: Shield,      color: 'text-[#10B981]' },
    { label: 'Open Claims',     value: openClaims,                              icon: FileText,    color: 'text-amber-400'  },
    { label: 'Total Coverage',  value: formatCurrency(totalCoverage, true),     icon: CheckCircle, color: 'text-blue-400'   },
    { label: 'Monthly Premium', value: formatCurrency(totalPremium, true),      icon: CreditCard,  color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/users')}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Customer Profile</h1>
            <p className="text-sm text-gray-500">Full account overview</p>
          </div>
        </div>
        <Button variant="secondary" size="sm">Edit Profile</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Identity */}
        <div className="space-y-4">
          <GlassPanel>
            <div className="flex flex-col items-center text-center py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#10B981]/20 text-[#10B981] text-xl font-bold mb-3">
                {getInitials(customer.name)}
              </div>
              <h2 className="text-lg font-bold text-white">{customer.name}</h2>
              <p className="text-xs text-gray-500 capitalize mt-0.5">{customer.role}</p>
              <span className="mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>

            <div className="border-t border-white/[0.06] pt-4 space-y-3 mt-2">
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <Mail size={14} className="text-gray-600 shrink-0" />
                {customer.email}
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <User size={14} className="text-gray-600 shrink-0" />
                ID: {customer.id}
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <CheckCircle size={14} className="text-gray-600 shrink-0" />
                Joined {formatDate(customer.createdAt)}
              </div>
              {customer.lastLogin && (
                <div className="flex items-center gap-2.5 text-sm text-gray-400">
                  <Shield size={14} className="text-gray-600 shrink-0" />
                  Last login {formatRelativeTime(customer.lastLogin)}
                </div>
              )}
            </div>
          </GlassPanel>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {quickStats.map(stat => {
              const Icon = stat.icon;
              return (
                <GlassPanel key={stat.label} className="!p-4">
                  <Icon size={16} className={cl(stat.color, 'mb-2')} />
                  <p className="text-base font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{stat.label}</p>
                </GlassPanel>
              );
            })}
          </div>
        </div>

        {/* Right — Policies & Claims */}
        <div className="lg:col-span-2 space-y-6">
          <GlassPanel>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <Shield size={14} className="text-[#10B981]" /> Policies
            </h3>
            <DataTable
              data={policies}
              columns={policyColumns}
              emptyMessage="No policies found"
            />
          </GlassPanel>

          <GlassPanel>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <FileText size={14} className="text-[#10B981]" /> Claims History
            </h3>
            <DataTable
              data={claims}
              columns={claimColumns}
              emptyMessage="No claims found"
            />
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
