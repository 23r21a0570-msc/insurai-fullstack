import { useState } from 'react';
import {
  FileCheck, Upload, Layers, TrendingUp, Brain,
  GitBranch, BarChart3, Package, Search, Plus, Edit, Zap,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DataTable, Column } from '@/components/ui/DataTable';
import { BulkImport } from '@/components/policies/BulkImport';
import { CoverageBuilder } from '@/components/policies/CoverageBuilder';
import { PricingEngine } from '@/components/policies/PricingEngine';
import { UnderwritingEngine } from '@/components/policies/UnderwritingEngine';
import { ProductCatalog } from '@/components/policies/ProductCatalog';
import { CompetitorBenchmark } from '@/components/policies/CompetitorBenchmark';
import { PolicyVersioning } from '@/components/policies/PolicyVersioning';
import { mockPolicies, getPolicyRules } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useToast } from '@/context/ToastContext';
import { useDebounce } from '@/hooks/useDebounce';
import type { Policy, PolicyRule } from '@/types';
import { cn } from '@/utils/cn';

// ─── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'policies',    label: 'Policies',      icon: FileCheck  },
  { id: 'import',      label: 'Bulk Import',   icon: Upload     },
  { id: 'coverage',    label: 'Coverage',      icon: Layers     },
  { id: 'pricing',     label: 'Pricing',       icon: TrendingUp },
  { id: 'underwriting',label: 'Underwriting',  icon: Brain      },
  { id: 'products',    label: 'Products',      icon: Package    },
  { id: 'benchmark',   label: 'Benchmark',     icon: BarChart3  },
  { id: 'versions',    label: 'Versioning',    icon: GitBranch  },
  { id: 'rules',       label: 'Rules',         icon: Zap        },
] as const;
type TabId = typeof TABS[number]['id'];

// ─── Status / action styles ────────────────────────────────────────────────────
const statusStyle: Record<string, string> = {
  active:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  expired:  'bg-gray-500/10 text-gray-500 border-gray-500/20',
  cancelled:'bg-red-500/10 text-red-400 border-red-500/20',
  pending:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
};
const actionStyle: Record<string, string> = {
  flag:     'text-amber-400 bg-amber-500/10 border-amber-500/20',
  approve:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  escalate: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  reject:   'text-red-400 bg-red-500/10 border-red-500/20',
};

const TYPE_OPTIONS = [
  { label: 'Auto', value: 'auto' }, { label: 'Home', value: 'home' },
  { label: 'Health', value: 'health' }, { label: 'Life', value: 'life' },
  { label: 'Business', value: 'business' },
];
const ACTION_OPTIONS = [
  { label: 'Flag for Review', value: 'flag' }, { label: 'Auto-Approve', value: 'approve' },
  { label: 'Escalate', value: 'escalate' }, { label: 'Reject', value: 'reject' },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export const AdminPolicies = () => {
  const { success } = useToast();
  const [tab, setTab] = useState<TabId>('policies');
  const [search, setSearch] = useState('');
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen]   = useState(false);
  const [editRule, setEditRule] = useState<PolicyRule | null>(null);
  const [rules, setRules]       = useState<PolicyRule[]>(getPolicyRules());

  const debouncedSearch = useDebounce(search, 200);

  const [policyForm, setPolicyForm] = useState({
    holderName: '', holderEmail: '', type: 'auto',
    coverageAmount: '', premium: '', deductible: '',
  });
  const [ruleForm, setRuleForm] = useState({
    name: '', description: '', threshold: '', action: 'flag', claimType: '',
  });

  const filtered = mockPolicies.filter(p => {
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return p.holderName.toLowerCase().includes(q) || p.policyNumber.toLowerCase().includes(q);
  });

  const columns: Column<Policy>[] = [
    {
      key: 'policyNumber', header: 'Policy #', accessor: 'policyNumber',
      render: p => <span className="font-mono text-xs font-bold text-gray-300">{p.policyNumber}</span>,
    },
    {
      key: 'holderName', header: 'Holder', accessor: 'holderName',
      render: p => (
        <div>
          <p className="text-sm font-semibold text-gray-200">{p.holderName}</p>
          <p className="text-xs text-gray-600">{p.holderEmail}</p>
        </div>
      ),
    },
    {
      key: 'type', header: 'Type', accessor: 'type',
      render: p => <span className="text-xs text-gray-400 capitalize">{p.type}</span>,
    },
    {
      key: 'coverageAmount', header: 'Coverage', accessor: 'coverageAmount', align: 'right',
      render: p => <span className="text-sm font-semibold text-gray-200 tabular-nums">{formatCurrency(p.coverageAmount)}</span>,
    },
    {
      key: 'premium', header: 'Premium/yr', accessor: 'premium', align: 'right',
      render: p => <span className="text-xs text-gray-400 tabular-nums">{formatCurrency(p.premium)}</span>,
    },
    {
      key: 'status', header: 'Status', accessor: 'status',
      render: p => (
        <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border', statusStyle[p.status])}>
          {p.status}
        </span>
      ),
    },
    {
      key: 'endDate', header: 'Expiry', accessor: 'endDate',
      render: p => <span className="text-xs text-gray-500">{formatDate(p.endDate)}</span>,
    },
    {
      key: 'claimsCount', header: 'Claims', accessor: 'claimsCount', align: 'center',
      render: p => <span className="text-sm tabular-nums text-gray-400">{p.claimsCount}</span>,
    },
  ];

  const handleAddPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    success('Policy created', `New ${policyForm.type} policy added for ${policyForm.holderName}.`);
    setIsPolicyModalOpen(false);
    setPolicyForm({ holderName: '', holderEmail: '', type: 'auto', coverageAmount: '', premium: '', deductible: '' });
  };

  const openEditRule = (rule: PolicyRule) => {
    setEditRule(rule);
    setRuleForm({ name: rule.name, description: rule.description, threshold: String(rule.threshold), action: rule.action, claimType: rule.claimType ?? '' });
    setIsRuleModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (editRule) {
      setRules(prev => prev.map(r => r.id === editRule.id ? { ...r, ...ruleForm, threshold: Number(ruleForm.threshold), action: ruleForm.action as PolicyRule['action'], claimType: ruleForm.claimType || undefined } : r));
      success('Rule updated', `"${ruleForm.name}" updated.`);
    } else {
      setRules(prev => [...prev, { id: `rule_${Date.now()}`, name: ruleForm.name, description: ruleForm.description, threshold: Number(ruleForm.threshold), action: ruleForm.action as PolicyRule['action'], claimType: ruleForm.claimType || undefined, isActive: true, createdAt: new Date().toISOString() }]);
      success('Rule created', `"${ruleForm.name}" is now active.`);
    }
    setIsRuleModalOpen(false); setEditRule(null);
    setRuleForm({ name: '', description: '', threshold: '', action: 'flag', claimType: '' });
  };

  const toggleRule = (id: string) => setRules(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileCheck size={22} className="text-[#10B981]" />
          <div>
            <h1 className="text-2xl font-bold text-white">Policy Management</h1>
            <p className="text-sm text-gray-500">Full lifecycle management for all insurance products and policies.</p>
          </div>
        </div>
        {tab === 'policies' && (
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setIsPolicyModalOpen(true)}>Add Policy</Button>
        )}
        {tab === 'rules' && (
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => { setEditRule(null); setIsRuleModalOpen(true); }}>Add Rule</Button>
        )}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 flex-wrap rounded-xl bg-white/[0.03] border border-white/[0.06] p-1">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                tab === t.id ? 'bg-white/[0.08] text-gray-100' : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <Icon size={12} />{t.label}
            </button>
          );
        })}
      </div>

      {/* ── Policies Tab ── */}
      {tab === 'policies' && (
        <>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by holder name or policy number..."
              className="h-10 w-full rounded-lg border border-white/[0.07] bg-white/[0.04] pl-9 pr-4 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 transition-all"
            />
          </div>
          <DataTable data={filtered} columns={columns} emptyMessage="No policies found" emptyIcon={<FileCheck size={36} />} keyExtractor={p => p.id} />
        </>
      )}

      {/* ── Other Tabs ── */}
      {tab === 'import'       && <BulkImport />}
      {tab === 'coverage'     && <CoverageBuilder />}
      {tab === 'pricing'      && <PricingEngine />}
      {tab === 'underwriting' && <UnderwritingEngine />}
      {tab === 'products'     && <ProductCatalog />}
      {tab === 'benchmark'    && <CompetitorBenchmark />}
      {tab === 'versions'     && <PolicyVersioning />}

      {/* ── Rules Tab ── */}
      {tab === 'rules' && (
        <div className="space-y-4">
          {rules.map(rule => (
            <GlassPanel key={rule.id} hoverable>
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                  <Zap size={16} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-bold text-gray-200">{rule.name}</p>
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase border', actionStyle[rule.action])}>{rule.action}</span>
                    {rule.claimType && (
                      <span className="text-[10px] text-gray-600 font-mono bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">{rule.claimType.replace('_', ' ')}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{rule.description}</p>
                  <p className="text-[10px] text-gray-700 mt-1.5">Threshold: {rule.threshold.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={cn('relative h-5 w-9 rounded-full transition-all duration-200', rule.isActive ? 'bg-[#10B981]' : 'bg-white/[0.10]')}
                  >
                    <span className={cn('absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200', rule.isActive ? 'translate-x-4' : 'translate-x-0')} />
                  </button>
                  <button onClick={() => openEditRule(rule)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/[0.06] transition-all">
                    <Edit size={14} />
                  </button>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}

      {/* ── Add Policy Modal ── */}
      <Modal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} title="Add Policy" size="md">
        <form onSubmit={handleAddPolicy} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Holder Name" placeholder="John Smith" value={policyForm.holderName} onChange={e => setPolicyForm({ ...policyForm, holderName: e.target.value })} required />
            <Input label="Holder Email" type="email" placeholder="john@email.com" value={policyForm.holderEmail} onChange={e => setPolicyForm({ ...policyForm, holderEmail: e.target.value })} required />
          </div>
          <Select label="Policy Type" options={TYPE_OPTIONS} value={policyForm.type} onChange={e => setPolicyForm({ ...policyForm, type: e.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Coverage ($)" type="number" placeholder="250000" value={policyForm.coverageAmount} onChange={e => setPolicyForm({ ...policyForm, coverageAmount: e.target.value })} required />
            <Input label="Premium/yr ($)" type="number" placeholder="1200" value={policyForm.premium} onChange={e => setPolicyForm({ ...policyForm, premium: e.target.value })} required />
            <Input label="Deductible ($)" type="number" placeholder="1000" value={policyForm.deductible} onChange={e => setPolicyForm({ ...policyForm, deductible: e.target.value })} required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsPolicyModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Policy</Button>
          </div>
        </form>
      </Modal>

      {/* ── Add/Edit Rule Modal ── */}
      <Modal isOpen={isRuleModalOpen} onClose={() => { setIsRuleModalOpen(false); setEditRule(null); }} title={editRule ? 'Edit Rule' : 'Add Rule'} size="md">
        <form onSubmit={handleSaveRule} className="space-y-4">
          <Input label="Rule Name" placeholder="High Value Auto Flag" value={ruleForm.name} onChange={e => setRuleForm({ ...ruleForm, name: e.target.value })} required />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
            <textarea rows={2} value={ruleForm.description} onChange={e => setRuleForm({ ...ruleForm, description: e.target.value })}
              placeholder="Describe what this rule does..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 resize-none transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Threshold" type="number" placeholder="25000" value={ruleForm.threshold} onChange={e => setRuleForm({ ...ruleForm, threshold: e.target.value })} required />
            <Select label="Action" options={ACTION_OPTIONS} value={ruleForm.action} onChange={e => setRuleForm({ ...ruleForm, action: e.target.value })} />
          </div>
          <Input label="Claim Type (optional)" placeholder="auto_collision" value={ruleForm.claimType} onChange={e => setRuleForm({ ...ruleForm, claimType: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => { setIsRuleModalOpen(false); setEditRule(null); }}>Cancel</Button>
            <Button type="submit">{editRule ? 'Save Changes' : 'Create Rule'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
