import { useState } from 'react';
import {
  ShieldCheck, Package, Tag, CreditCard, Users, TrendingUp,
  AlertCircle, RefreshCw, FileText, PenLine,
  Calendar, ToggleLeft, ToggleRight, X, Check
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { PolicyAddons } from '@/components/ui/PolicyAddons';
import { BundleBuilder } from '@/components/ui/BundleBuilder';
import { DigitalPolicyCard } from '@/components/ui/DigitalPolicyCard';
import { BeneficiaryManager } from '@/components/ui/BeneficiaryManager';
import { PolicyROICalculator } from '@/components/ui/PolicyROICalculator';
import { mockCustomerPolicies } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import { useToast } from '@/context/ToastContext';

type Tab =
  | 'overview'
  | 'digital_card'
  | 'addons'
  | 'bundles'
  | 'beneficiaries'
  | 'mid_term'
  | 'roi';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',     label: 'Overview',        icon: <ShieldCheck size={15} /> },
  { id: 'digital_card', label: 'Digital Card',    icon: <CreditCard size={15} /> },
  { id: 'addons',       label: 'Add-ons',         icon: <Package size={15} /> },
  { id: 'bundles',      label: 'Bundles',         icon: <Tag size={15} /> },
  { id: 'beneficiaries',label: 'Beneficiaries',   icon: <Users size={15} /> },
  { id: 'mid_term',     label: 'Policy Changes',  icon: <PenLine size={15} /> },
  { id: 'roi',          label: 'ROI Calculator',  icon: <TrendingUp size={15} /> },
];

interface MidTermChange {
  id: string;
  type: string;
  description: string;
  impact: string;
  impactType: 'increase' | 'decrease' | 'neutral';
}

const midTermChanges: MidTermChange[] = [
  { id: 'coverage_up', type: 'Increase Coverage', description: 'Raise your coverage limit for better protection', impact: '+$15/mo', impactType: 'increase' },
  { id: 'coverage_down', type: 'Decrease Coverage', description: 'Lower your coverage limit to reduce premium', impact: '-$20/mo', impactType: 'decrease' },
  { id: 'deductible_up', type: 'Raise Deductible', description: 'Pay more out-of-pocket to lower your premium', impact: '-$25/mo', impactType: 'decrease' },
  { id: 'deductible_down', type: 'Lower Deductible', description: 'Pay less out-of-pocket, higher premium', impact: '+$30/mo', impactType: 'increase' },
  { id: 'add_driver', type: 'Add Additional Driver', description: 'Add a family member or household driver', impact: '+$18/mo', impactType: 'increase' },
  { id: 'change_address', type: 'Update Address', description: 'Notify us of a change in your primary address', impact: 'Varies', impactType: 'neutral' },
  { id: 'transfer', type: 'Transfer Ownership', description: 'Transfer this policy to another person', impact: 'No change', impactType: 'neutral' },
  { id: 'suspend', type: 'Suspend Policy', description: 'Temporarily suspend coverage (not available for all policies)', impact: 'Full refund for suspended period', impactType: 'decrease' },
];

export const PolicyManagement = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedPolicy, setSelectedPolicy] = useState(mockCustomerPolicies[0]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);
  const [selectedChange, setSelectedChange] = useState<string | null>(null);
  const { success, error } = useToast();

  const handleMidTermChange = (change: MidTermChange) => {
    setSelectedChange(change.id);
    success('Request Submitted', `Your request to "${change.type}" has been submitted for review.`);
    setTimeout(() => setSelectedChange(null), 3000);
  };

  const handleCancel = () => {
    setShowCancelModal(false);
    error('Cancellation Initiated', 'Your policy cancellation has been initiated. Refund will be processed in 5-7 days.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={24} />
            Policy Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage coverage, add-ons, beneficiaries, and more</p>
        </div>

        {/* Policy selector */}
        <div className="flex gap-2 flex-wrap">
          {mockCustomerPolicies.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPolicy(p)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize',
                selectedPolicy.id === p.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
              )}
            >
              {p.type} ({p.policyNumber})
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
            )}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Policy summary */}
          <GlassPanel>
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-white capitalize">{selectedPolicy.type} Insurance</h2>
                  <span className={cn(
                    'px-2 py-0.5 rounded border text-[10px] font-bold uppercase',
                    selectedPolicy.status === 'active'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  )}>
                    {selectedPolicy.status}
                  </span>
                </div>
                <p className="text-xs font-mono text-gray-500 mt-1">{selectedPolicy.policyNumber}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAutoRenew(v => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/10 transition-all"
                >
                  {autoRenew
                    ? <ToggleRight size={16} className="text-emerald-400" />
                    : <ToggleLeft size={16} className="text-gray-500" />}
                  Auto-Renew {autoRenew ? 'On' : 'Off'}
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all"
                >
                  <X size={13} /> Cancel Policy
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Coverage Amount', value: formatCurrency(selectedPolicy.coverageAmount) },
                { label: 'Annual Premium', value: formatCurrency(selectedPolicy.premium) },
                { label: 'Deductible', value: formatCurrency(selectedPolicy.deductible) },
                { label: 'Monthly Cost', value: formatCurrency(Math.round(selectedPolicy.premium / 12)) },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">{item.label}</p>
                  <p className="text-base font-bold text-white mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <Calendar size={16} className="text-gray-500" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Start Date</p>
                  <p className="text-sm font-semibold text-white">{formatDate(selectedPolicy.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <Calendar size={16} className="text-gray-500" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">End Date</p>
                  <p className="text-sm font-semibold text-white">{formatDate(selectedPolicy.endDate)}</p>
                </div>
              </div>
            </div>
          </GlassPanel>

          {/* Documents */}
          <GlassPanel>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <FileText size={16} className="text-emerald-400" /> Policy Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'Policy Schedule', size: '245 KB', date: formatDate(selectedPolicy.startDate) },
                { name: 'Certificate of Insurance', size: '182 KB', date: formatDate(selectedPolicy.startDate) },
                { name: 'Terms & Conditions', size: '1.2 MB', date: '2024-01-01' },
                { name: 'Coverage Summary', size: '98 KB', date: formatDate(selectedPolicy.startDate) },
              ].map(doc => (
                <div key={doc.name} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors group">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
                    <div>
                      <p className="text-xs font-semibold text-gray-200">{doc.name}</p>
                      <p className="text-[10px] text-gray-600">{doc.size} · {doc.date}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => success('Downloading', `${doc.name} is being prepared`)}
                    className="text-[10px] font-bold text-emerald-400 hover:underline"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Renewal info */}
          {selectedPolicy.status === 'active' && (
            <GlassPanel className="border-emerald-500/10 bg-emerald-500/[0.02]">
              <div className="flex items-start gap-3">
                <RefreshCw size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">Policy Renewal</p>
                  <p className="text-xs text-gray-400 mt-1">
                    This policy renews on <span className="text-white font-semibold">{formatDate(selectedPolicy.endDate)}</span>.
                    Auto-renewal is currently <span className={autoRenew ? 'text-emerald-400' : 'text-amber-400'}>{autoRenew ? 'enabled' : 'disabled'}</span>.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Renewal premium (estimated): <span className="text-white font-semibold">{formatCurrency(selectedPolicy.premium)}/year</span>
                  </p>
                </div>
              </div>
            </GlassPanel>
          )}
        </div>
      )}

      {activeTab === 'digital_card' && (
        <GlassPanel>
          <DigitalPolicyCard policy={selectedPolicy} holderName="Maruthi" />
        </GlassPanel>
      )}

      {activeTab === 'addons' && (
        <GlassPanel>
          <PolicyAddons />
        </GlassPanel>
      )}

      {activeTab === 'bundles' && (
        <GlassPanel>
          <BundleBuilder />
        </GlassPanel>
      )}

      {activeTab === 'beneficiaries' && (
        <GlassPanel>
          <BeneficiaryManager />
        </GlassPanel>
      )}

      {activeTab === 'mid_term' && (
        <div className="space-y-4">
          <GlassPanel>
            <div className="flex items-start gap-3 mb-6">
              <AlertCircle size={18} className="text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">Mid-Term Policy Changes</p>
                <p className="text-xs text-gray-400 mt-1">
                  Changes are effective from the next billing cycle. Some changes may require documentation or additional review.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {midTermChanges.map(change => (
                <div
                  key={change.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all',
                    selectedChange === change.id
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.15]'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{change.type}</p>
                      <p className="text-xs text-gray-500 mt-1">{change.description}</p>
                    </div>
                    <span className={cn(
                      'text-xs font-bold whitespace-nowrap',
                      change.impactType === 'increase' ? 'text-red-400' :
                      change.impactType === 'decrease' ? 'text-emerald-400' : 'text-gray-400'
                    )}>
                      {change.impact}
                    </span>
                  </div>
                  <button
                    onClick={() => handleMidTermChange(change)}
                    disabled={selectedChange === change.id}
                    className={cn(
                      'mt-3 w-full py-2 rounded-lg text-xs font-bold transition-all',
                      selectedChange === change.id
                        ? 'bg-emerald-500 text-white cursor-default flex items-center justify-center gap-1.5'
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                    )}
                  >
                    {selectedChange === change.id ? (
                      <><Check size={12} /> Submitted</>
                    ) : 'Request Change'}
                  </button>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Policy version history */}
          <GlassPanel>
            <h3 className="text-sm font-bold text-white mb-4">Policy Change History</h3>
            <div className="space-y-3">
              {[
                { date: formatDate(selectedPolicy.startDate), action: 'Policy Issued', detail: `Coverage: ${formatCurrency(selectedPolicy.coverageAmount)}, Premium: ${formatCurrency(selectedPolicy.premium)}/yr` },
                { date: formatDate(new Date(Date.now() - 30 * 86400000).toISOString()), action: 'Coverage Updated', detail: 'Added roadside assistance add-on (+$8/mo)' },
                { date: formatDate(new Date(Date.now() - 10 * 86400000).toISOString()), action: 'Payment Method Changed', detail: 'Card ending in 4242 added as primary' },
              ].map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                    {i < 2 && <div className="w-0.5 h-full bg-white/[0.06] mt-1" />}
                  </div>
                  <div className="pb-3">
                    <p className="text-xs font-bold text-white">{entry.action}</p>
                    <p className="text-xs text-gray-500">{entry.detail}</p>
                    <p className="text-[10px] text-gray-600 mt-1 font-mono">{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}

      {activeTab === 'roi' && (
        <GlassPanel>
          <PolicyROICalculator />
        </GlassPanel>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0F1629] border border-red-500/20 p-6 shadow-2xl animate-scale-in space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertCircle className="text-red-400" size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Cancel Policy?</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Cancelling policy <span className="font-mono text-gray-200">{selectedPolicy.policyNumber}</span> will:
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-gray-400 pl-4">
              <li>• Remove all coverage effective immediately</li>
              <li>• Refund unused premium (pro-rated)</li>
              <li>• Cancel any pending add-ons</li>
              <li>• Cannot be reversed without re-applying</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
              >
                Yes, Cancel Policy
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Keep Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
