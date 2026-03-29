import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Shield, FileText, DollarSign,
  Calendar, CheckCircle, AlertTriangle, User,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, capitalize } from '@/utils/formatters';
import { getPolicyById, mockClaims } from '@/data/mockData';
import { Claim } from '@/types';

export const PolicyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const policy = getPolicyById(id || '');

  if (!policy) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Shield size={40} className="text-gray-700" />
        <h2 className="text-xl font-bold text-white">Policy not found</h2>
        <p className="text-gray-500 text-sm">The policy you're looking for doesn't exist.</p>
        <Button variant="secondary" onClick={() => navigate('/policies')}>
          Back to Policies
        </Button>
      </div>
    );
  }

  // Filter mock claims by policy number
  const linkedClaims = mockClaims.filter(c => c.policyNumber === policy.policyNumber);

  const statusColor = policy.status === 'active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : policy.status === 'expired' ? 'text-red-400 bg-red-500/10 border-red-500/20'
    : policy.status === 'cancelled' ? 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

  const claimColumns: Column<Claim>[] = [
    {
      key: 'claimNumber',
      header: 'Claim ID',
      render: (item) => (
        <span
          className="font-mono text-[#10B981] text-xs font-semibold cursor-pointer hover:underline"
          onClick={(e) => { e.stopPropagation(); navigate(`/claims/${item.id}`); }}
        >
          {item.claimNumber}
        </span>
      ),
    },
    {
      key: 'claimant',
      header: 'Claimant',
      render: (item) => item.claimant.name,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item) => formatCurrency(item.amount),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: 'riskScore',
      header: 'Risk',
      render: (item) => (
        <span className={`font-mono text-xs font-bold ${
          item.riskScore >= 70 ? 'text-red-400' :
          item.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'
        }`}>
          {item.riskScore}
        </span>
      ),
    },
    {
      key: 'submittedAt',
      header: 'Filed',
      render: (item) => formatDate(item.submittedAt),
    },
  ];

  const details = [
    { label: 'Policy Number',   value: policy.policyNumber,                    icon: Shield     },
    { label: 'Holder',          value: policy.holderName,                       icon: User       },
    { label: 'Type',            value: capitalize(policy.type),                 icon: FileText   },
    { label: 'Coverage Amount', value: formatCurrency(policy.coverageAmount),   icon: DollarSign },
    { label: 'Annual Premium',  value: formatCurrency(policy.premium),          icon: DollarSign },
    { label: 'Deductible',      value: formatCurrency(policy.deductible),       icon: DollarSign },
    { label: 'Start Date',      value: formatDate(policy.startDate),            icon: Calendar   },
    { label: 'End Date',        value: formatDate(policy.endDate),              icon: Calendar   },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/policies')}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-white font-mono">{policy.policyNumber}</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusColor}`}>
                {policy.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">{policy.holderName} · {capitalize(policy.type)} Insurance</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Edit Policy</Button>
          {policy.status === 'active' && (
            <Button variant="danger" size="sm">Cancel Policy</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Details */}
        <div className="space-y-4">
          <GlassPanel>
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Policy Details</h3>
            <div className="space-y-4">
              {details.map(d => {
                const Icon = d.icon;
                return (
                  <div key={d.label} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                      <Icon size={14} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">{d.label}</p>
                      <p className="text-sm text-gray-200 mt-0.5">{d.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassPanel>

          {/* Summary metrics */}
          <div className="grid grid-cols-2 gap-3">
            <GlassPanel className="!p-4">
              <FileText size={16} className="text-blue-400 mb-2" />
              <p className="text-xl font-bold text-white">{policy.claimsCount}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Total Claims</p>
            </GlassPanel>
            <GlassPanel className="!p-4">
              <DollarSign size={16} className="text-purple-400 mb-2" />
              <p className="text-xl font-bold text-white">{formatCurrency(policy.totalClaimsAmount, true)}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Claims Paid</p>
            </GlassPanel>
          </div>

          {/* Status indicator */}
          <GlassPanel>
            <div className="flex items-center gap-3">
              {policy.status === 'active' ? (
                <CheckCircle size={20} className="text-emerald-400" />
              ) : (
                <AlertTriangle size={20} className="text-amber-400" />
              )}
              <div>
                <p className="text-sm font-semibold text-white">
                  {policy.status === 'active' ? 'Policy Active' : 'Policy Inactive'}
                </p>
                <p className="text-xs text-gray-500">
                  {policy.status === 'active'
                    ? `Expires ${formatDate(policy.endDate)}`
                    : `Status: ${capitalize(policy.status)}`}
                </p>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Right — Claims */}
        <div className="lg:col-span-2">
          <GlassPanel>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <FileText size={14} className="text-[#10B981]" />
              Associated Claims ({linkedClaims.length})
            </h3>
            <DataTable
              data={linkedClaims}
              columns={claimColumns}
              onRowClick={(c) => navigate(`/claims/${c.id}`)}
              emptyMessage="No claims associated with this policy"
            />
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
