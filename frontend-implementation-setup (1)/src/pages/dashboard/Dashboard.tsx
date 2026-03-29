import { useState } from 'react';
import {
  FileText,
  Clock,
  ShieldAlert,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Brain,
  ArrowRight,
  HelpCircle,
  BarChart2,
  TrendingDown,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { StatCard } from '@/components/ui/StatCard';
import { ClaimsTrendChart } from '@/components/charts/ClaimsTrendChart';
import { RiskDistributionChart } from '@/components/charts/RiskDistributionChart';
import { ClaimTypeChart } from '@/components/charts/ClaimTypeChart';
import { FraudTrendChart } from '@/components/charts/FraudTrendChart';
import { ClaimStatusChart } from '@/components/charts/ClaimStatusChart';
import { OnboardingWizard, hasCompletedOnboarding } from '@/components/ui/OnboardingWizard';
import { getDashboardStats, getRecentActivity, getFraudAlerts } from '@/data/mockData';
import { formatRelativeTime } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import { Tooltip } from '@/components/ui/Tooltip';
import type { ElementType } from 'react';

const activityIconMap: Record<string, { icon: ElementType; color: string }> = {
  claim_approved: { icon: CheckCircle, color: '#10B981' },
  fraud_alert: { icon: AlertTriangle, color: '#EF4444' },
  claim_submitted: { icon: FileText, color: '#3B82F6' },
  ai_analysis: { icon: Brain, color: '#8B5CF6' },
  claim_escalated: { icon: ShieldAlert, color: '#F59E0B' },
};

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const stats = getDashboardStats();
  const activity = getRecentActivity();
  const fraudAlerts = getFraudAlerts().slice(0, 2);
  const [showOnboarding, setShowOnboarding] = useState(() => !hasCompletedOnboarding());
  const [chartView, setChartView] = useState<'volume' | 'status'>('volume');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting}, <span className="text-[#10B981]">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your claims today.
          </p>
        </div>
        <button
          onClick={() => setShowOnboarding(true)}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors mt-1"
          title="Show tour"
        >
          <HelpCircle size={14} />
          <span className="hidden sm:inline">Tour</span>
        </button>
      </div>

      {/* Stat Cards — clickable drill-downs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Tooltip content="Click to view all claims" side="bottom">
          <div onClick={() => navigate('/claims')} className="cursor-pointer w-full">
            <StatCard
              label="Total Claims"
              value={stats.totalClaims}
              change={stats.claimsChange}
              icon={<FileText size={16} />}
              iconColor="#3B82F6"
            />
          </div>
        </Tooltip>
        <Tooltip content="Claims awaiting review — click to open queue" side="bottom">
          <div onClick={() => navigate('/queue')} className="cursor-pointer w-full">
            <StatCard
              label="Pending Review"
              value={stats.pendingReview}
              change={stats.pendingChange}
              icon={<Clock size={16} />}
              iconColor="#F59E0B"
            />
          </div>
        </Tooltip>
        <Tooltip content="AI-flagged suspicious claims — click to investigate" side="bottom">
          <div onClick={() => navigate('/fraud')} className="cursor-pointer w-full">
            <StatCard
              label="Fraud Detected"
              value={stats.fraudDetected}
              change={stats.fraudChange}
              icon={<ShieldAlert size={16} />}
              iconColor="#EF4444"
            />
          </div>
        </Tooltip>
        <Tooltip content="Percentage of claims approved this month" side="bottom">
          <div onClick={() => navigate('/claims')} className="cursor-pointer w-full">
            <StatCard
              label="Approval Rate"
              value={`${stats.approvalRate}%`}
              change={stats.approvalChange}
              icon={<CheckCircle size={16} />}
              iconColor="#10B981"
            />
          </div>
        </Tooltip>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <GlassPanel className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-200">Claims Overview</h3>
              <p className="text-xs text-gray-600 mt-0.5">Last 30 days</p>
            </div>
            <div className="flex gap-1 rounded-lg bg-white/[0.04] border border-white/[0.06] p-1">
              <button
                onClick={() => setChartView('volume')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all ${
                  chartView === 'volume'
                    ? 'bg-white/[0.10] text-gray-200'
                    : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                <TrendingUp size={11} /> Volume
              </button>
              <button
                onClick={() => setChartView('status')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all ${
                  chartView === 'status'
                    ? 'bg-white/[0.10] text-gray-200'
                    : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                <BarChart2 size={11} /> By Status
              </button>
            </div>
          </div>
          <div className="h-56">
            {chartView === 'volume' ? <ClaimsTrendChart days={30} /> : <ClaimStatusChart />}
          </div>
        </GlassPanel>

        <GlassPanel>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-200">Risk Distribution</h3>
            <p className="text-xs text-gray-600 mt-0.5">Portfolio breakdown</p>
          </div>
          <div className="h-56">
            <RiskDistributionChart />
          </div>
        </GlassPanel>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-200">Claims by Type</h3>
              <p className="text-xs text-gray-600 mt-0.5">Volume by category</p>
            </div>
          </div>
          <div className="h-48">
            <ClaimTypeChart />
          </div>
        </GlassPanel>

        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-200">Fraud Trend</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                <span className="text-red-400">—</span> Flagged &nbsp;
                <span className="text-amber-400">—</span> Confirmed · 12 months
              </p>
            </div>
            <TrendingDown size={14} className="text-red-400" />
          </div>
          <div className="h-48">
            <FraudTrendChart />
          </div>
        </GlassPanel>
      </div>

      {/* Activity + Fraud */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-200">Recent Activity</h3>
            <Link
              to="/claims"
              className="text-[10px] text-[#10B981] font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={10} />
            </Link>
          </div>
          <div className="space-y-4">
            {activity.map((item) => {
              const cfg = activityIconMap[item.type] || { icon: FileText, color: '#6B7280' };
              const Icon = cfg.icon;
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5"
                    style={{ backgroundColor: `${cfg.color}18` }}
                  >
                    <Icon size={13} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-200 truncate">{item.title}</p>
                    <p className="text-[11px] text-gray-500 truncate">{item.description}</p>
                  </div>
                  <span className="text-[10px] text-gray-600 shrink-0 tabular-nums">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassPanel>

        {/* Fraud Alerts */}
        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-200">Active Fraud Alerts</h3>
            <Link
              to="/fraud"
              className="text-[10px] text-red-400 font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={10} />
            </Link>
          </div>
          <div className="space-y-3">
            {fraudAlerts.map((alert) => (
              <Link
                key={alert.id}
                to={`/claims/${alert.claimId}`}
                className="block rounded-xl border border-red-500/10 bg-red-500/[0.04] p-3 hover:border-red-500/20 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                        style={{
                          color: alert.severity === 'critical' ? '#EF4444' : '#F59E0B',
                          backgroundColor: alert.severity === 'critical' ? '#EF444420' : '#F59E0B20',
                        }}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono truncate">
                        {alert.claimNumber}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-200 truncate">{alert.type}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{alert.description}</p>
                  </div>
                  <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                </div>
              </Link>
            ))}
          </div>

          <Link
            to="/queue"
            className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-white/[0.05] transition-all"
          >
            <Clock size={13} />
            Go to My Queue — {stats.pendingReview} claims pending
            <ArrowRight size={12} className="ml-auto" />
          </Link>
        </GlassPanel>
      </div>

      {/* Onboarding */}
      <OnboardingWizard isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </div>
  );
};
