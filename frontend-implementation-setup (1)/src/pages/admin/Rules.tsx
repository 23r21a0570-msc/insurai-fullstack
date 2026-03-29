import { useState } from 'react';
import { Sliders, Plus, Pencil, Trash2, Save, X, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Tooltip } from '@/components/ui/Tooltip';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';
import type { PolicyRule } from '@/types';

const INITIAL_RULES: PolicyRule[] = [
  {
    id: 'rule_1',
    name: 'High-Value Auto Flag',
    description: 'Flag auto claims exceeding $25,000 for manual review',
    threshold: 25000,
    action: 'flag',
    isActive: true,
    claimType: 'auto_collision',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'rule_2',
    name: 'Critical Risk Auto-Reject',
    description: 'Automatically reject claims with a risk score above 90',
    threshold: 90,
    action: 'reject',
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'rule_3',
    name: 'Fraud Score Escalation',
    description: 'Escalate to senior analyst when fraud probability exceeds 75%',
    threshold: 75,
    action: 'escalate',
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'rule_4',
    name: 'Low-Risk Fast Track',
    description: 'Auto-approve medical claims with risk score below 20',
    threshold: 20,
    action: 'approve',
    isActive: false,
    claimType: 'medical',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const ACTION_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  flag: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'Flag' },
  reject: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: 'Auto-Reject' },
  escalate: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', label: 'Escalate' },
  approve: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', label: 'Auto-Approve' },
};

const ACTION_OPTIONS = [
  { label: 'Flag for review', value: 'flag' },
  { label: 'Auto-reject', value: 'reject' },
  { label: 'Escalate to senior', value: 'escalate' },
  { label: 'Auto-approve', value: 'approve' },
];

const CLAIM_TYPE_OPTIONS = [
  { label: 'All types', value: '' },
  { label: 'Auto Collision', value: 'auto_collision' },
  { label: 'Auto Theft', value: 'auto_theft' },
  { label: 'Property Damage', value: 'property_damage' },
  { label: 'Medical', value: 'medical' },
  { label: 'Liability', value: 'liability' },
  { label: 'Natural Disaster', value: 'natural_disaster' },
];

const emptyForm = {
  name: '',
  description: '',
  threshold: '',
  action: 'flag' as PolicyRule['action'],
  claimType: '',
};

export const Rules = () => {
  const { success } = useToast();
  const [rules, setRules] = useState<PolicyRule[]>(INITIAL_RULES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PolicyRule | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingRule(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (rule: PolicyRule) => {
    setEditingRule(rule);
    setForm({
      name: rule.name,
      description: rule.description,
      threshold: String(rule.threshold),
      action: rule.action,
      claimType: rule.claimType ?? '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRule) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === editingRule.id
            ? { ...r, ...form, threshold: Number(form.threshold), claimType: form.claimType || undefined }
            : r
        )
      );
      success('Rule updated', `"${form.name}" has been updated.`);
    } else {
      const newRule: PolicyRule = {
        id: `rule_${Date.now()}`,
        name: form.name,
        description: form.description,
        threshold: Number(form.threshold),
        action: form.action,
        isActive: true,
        claimType: form.claimType || undefined,
        createdAt: new Date().toISOString(),
      };
      setRules((prev) => [...prev, newRule]);
      success('Rule created', `"${form.name}" is now active.`);
    }
    setIsModalOpen(false);
  };

  const toggleActive = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const deleteRule = (id: string, name: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    success('Rule deleted', `"${name}" has been removed.`);
  };

  const active = rules.filter((r) => r.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders size={20} className="text-[#10B981]" />
            <h1 className="text-2xl font-bold text-white">Rules & Thresholds</h1>
          </div>
          <p className="text-sm text-gray-500">
            Configure automated decision rules based on claim values and risk scores.
          </p>
        </div>
        <Button leftIcon={<Plus size={14} />} onClick={openCreate}>
          New Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassPanel>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Total Rules</p>
          <p className="text-2xl font-bold text-white">{rules.length}</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Active</p>
          <p className="text-2xl font-bold text-[#10B981]">{active}</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Inactive</p>
          <p className="text-2xl font-bold text-gray-500">{rules.length - active}</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Auto-Actions</p>
          <p className="text-2xl font-bold text-purple-400">
            {rules.filter((r) => ['approve', 'reject'].includes(r.action) && r.isActive).length}
          </p>
        </GlassPanel>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => {
          const cfg = ACTION_CONFIG[rule.action];
          return (
            <GlassPanel key={rule.id} hoverable className={cn(!rule.isActive && 'opacity-60')}>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Action badge + info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl mt-0.5"
                    style={{ backgroundColor: cfg.bg }}
                  >
                    <Sliders size={18} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-gray-200">{rule.name}</h3>
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                        style={{
                          color: cfg.color,
                          backgroundColor: cfg.bg,
                          borderColor: `${cfg.color}33`,
                        }}
                      >
                        {cfg.label}
                      </span>
                      {!rule.isActive && (
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/[0.08] text-gray-600">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{rule.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <Tooltip content="The value at which this rule triggers" side="top">
                        <span className="flex items-center gap-1 text-[10px] text-gray-600 cursor-help">
                          <Info size={10} />
                          Threshold: <span className="font-mono font-bold text-gray-400">{rule.threshold}</span>
                        </span>
                      </Tooltip>
                      {rule.claimType && (
                        <span className="text-[10px] text-gray-600 font-mono">
                          Type: {rule.claimType.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Tooltip content={rule.isActive ? 'Deactivate rule' : 'Activate rule'} side="top">
                    <button
                      onClick={() => toggleActive(rule.id)}
                      className="text-gray-500 hover:text-[#10B981] transition-colors"
                      aria-label={rule.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {rule.isActive ? (
                        <ToggleRight size={22} className="text-[#10B981]" />
                      ) : (
                        <ToggleLeft size={22} />
                      )}
                    </button>
                  </Tooltip>
                  <Tooltip content="Edit rule" side="top">
                    <button
                      onClick={() => openEdit(rule)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-gray-500 hover:text-gray-200 hover:bg-white/[0.08] transition-all"
                      aria-label="Edit rule"
                    >
                      <Pencil size={13} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Delete rule" side="top">
                    <button
                      onClick={() => deleteRule(rule.id, rule.name)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-red-500/60 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
                      aria-label="Delete rule"
                    >
                      <Trash2 size={13} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </GlassPanel>
          );
        })}

        {rules.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-white/[0.08]">
            <Sliders size={36} className="text-gray-700 mb-3" />
            <p className="text-gray-500 font-medium">No rules configured</p>
            <p className="text-xs text-gray-700 mt-1">Create a rule to automate claim decisions</p>
            <Button className="mt-4" size="sm" leftIcon={<Plus size={14} />} onClick={openCreate}>
              Create First Rule
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRule ? 'Edit Rule' : 'Create New Rule'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Rule Name"
            placeholder="e.g. High-Value Auto Flag"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Describe what this rule does..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 resize-none transition-all"
            />
          </div>
          <Input
            label="Threshold Value"
            type="number"
            placeholder="e.g. 25000 or 75 (for score %)"
            value={form.threshold}
            onChange={(e) => setForm({ ...form, threshold: e.target.value })}
            required
          />
          <Select
            label="Action"
            options={ACTION_OPTIONS}
            value={form.action}
            onChange={(e) => setForm({ ...form, action: e.target.value as PolicyRule['action'] })}
          />
          <Select
            label="Claim Type (optional)"
            options={CLAIM_TYPE_OPTIONS}
            value={form.claimType}
            onChange={(e) => setForm({ ...form, claimType: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              leftIcon={<X size={14} />}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" leftIcon={<Save size={14} />}>
              {editingRule ? 'Save Changes' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
