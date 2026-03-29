import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, FileText, CreditCard,
  Clock, CheckCircle2, XCircle, AlertCircle, ChevronRight,
} from 'lucide-react';
import { AIRecommendations } from '@/components/ui/AIRecommendations';
import { DailyTasks } from '@/components/ui/DailyTasks';
import { useAuth } from '@/context/AuthContext';
import { CustomerOverviewCard } from '@/components/ui/CustomerOverviewCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { DataTable } from '@/components/ui/DataTable';
import {
  mockCustomerPolicies,
  mockCustomerClaims,
  mockCustomerPayments,
  CustomerClaim,
} from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { cn } from '@/utils/cn';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  submitted:    { label: 'Submitted',    color: 'text-gray-400 bg-gray-500/10 border-gray-500/20',        icon: Clock },
  under_review: { label: 'Under Review', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',        icon: Clock },
  pending_info: { label: 'Pending Info', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',     icon: AlertCircle },
  approved:     { label: 'Approved',     color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
  rejected:     { label: 'Rejected',     color: 'text-red-400 bg-red-500/10 border-red-500/20',           icon: XCircle },
  escalated:    { label: 'Escalated',    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',  icon: AlertCircle },
};

const claimTypeLabels: Record<string, string> = {
  auto_collision:   'Auto – Collision',
  auto_theft:       'Auto – Theft',
  property_damage:  'Property Damage',
  medical:          'Medical',
  liability:        'Liability',
  natural_disaster: 'Natural Disaster',
};

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const activePolicies = mockCustomerPolicies.filter((p) => p.status === 'active').length;
  const pendingClaims  = mockCustomerClaims.filter((c) => ['submitted', 'under_review', 'pending_info'].includes(c.status)).length;
  const upcomingPayments = mockCustomerPayments.filter((p) => p.status === 'upcoming');
  const nextPaymentTotal = upcomingPayments.reduce((sum, p) => sum + p.amount, 0);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Table columns
  const columns: Array<{ key: string; header: string; render: (c: CustomerClaim) => React.ReactNode }> = [
    {
      key: 'claimNumber',
      header: 'Claim ID',
      render: (c) => <span className="font-mono text-[#10B981] font-bold text-xs">{c.claimNumber}</span>,
    },
    {
      key: 'policyNumber',
      header: 'Policy',
      render: (c) => <span className="text-xs text-gray-400 font-mono">{c.policyNumber}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (c) => <span className="text-xs text-gray-300">{claimTypeLabels[c.type] ?? c.type}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => {
        const cfg = statusConfig[c.status];
        const Icon = cfg?.icon ?? Clock;
        return (
          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider', cfg?.color)}>
            <Icon size={10} />
            {cfg?.label ?? c.status}
          </span>
        );
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (c) => <span className="text-sm font-semibold text-gray-200 tabular-nums">{formatCurrency(c.amount)}</span>,
    },
    {
      key: 'submittedAt',
      header: 'Filed',
      render: (c) => <span className="text-xs text-gray-500">{formatDate(c.submittedAt)}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting()}, <span className="text-[#10B981]">{user?.name ?? 'there'}</span> 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your policies, claims, and upcoming payments.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CustomerOverviewCard
          title="Active Policies"
          value={activePolicies}
          description={`${mockCustomerPolicies.length} total policies in your account`}
          icon={<ShieldCheck size={20} />}
          accent="emerald"
          onClick={() => navigate('/customer/policies')}
        />
        <CustomerOverviewCard
          title="Pending Claims"
          value={pendingClaims}
          description={`${mockCustomerClaims.length} total claims across all policies`}
          icon={<FileText size={20} />}
          accent="blue"
          onClick={() => navigate('/customer/claims')}
        />
        <CustomerOverviewCard
          title="Upcoming Payments"
          value={formatCurrency(nextPaymentTotal)}
          description={`${upcomingPayments.length} payment${upcomingPayments.length !== 1 ? 's' : ''} due soon`}
          icon={<CreditCard size={20} />}
          accent="amber"
          onClick={() => navigate('/customer/payments')}
        />
      </div>

      {/* AI Recommendations */}
      <AIRecommendations />

      {/* Daily Tasks */}
      <DailyTasks />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Claims Table — takes up 2 cols */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Recent Claims</h2>
            <button
              onClick={() => navigate('/customer/claims')}
              className="flex items-center gap-1 text-xs text-[#10B981] hover:underline"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl">
            <DataTable
              data={mockCustomerClaims.slice(0, 4)}
              columns={columns}
              onRowClick={(c) => navigate(`/customer/claims/${c.id}`)}
              emptyMessage="No claims found."
            />
          </div>
        </div>

        {/* Right column: Policies + Payments */}
        <div className="space-y-6">
          {/* Active Policies */}
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">My Policies</h2>
              <button
                onClick={() => navigate('/customer/policies')}
                className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
              >
                See all <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {mockCustomerPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.10] transition-colors cursor-pointer"
                  onClick={() => navigate('/customer/policies')}
                >
                  <div>
                    <p className="text-xs font-bold text-gray-200 capitalize">{policy.type} Insurance</p>
                    <p className="text-[10px] text-gray-600 font-mono mt-0.5">{policy.policyNumber}</p>
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-[9px] font-bold uppercase border',
                    policy.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : policy.status === 'pending'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  )}>
                    {policy.status}
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Upcoming Payments */}
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Upcoming Payments</h2>
              <button
                onClick={() => navigate('/customer/payments')}
                className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
              >
                See all <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {upcomingPayments.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-4">No upcoming payments.</p>
              ) : (
                upcomingPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/10"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-200 font-mono">{payment.policyNumber}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Due {formatDate(payment.dueDate)}</p>
                    </div>
                    <p className="text-sm font-bold text-amber-400 tabular-nums">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
