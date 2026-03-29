import { useState } from 'react';
import { Brain, CheckCircle, XCircle, AlertCircle, Plus, Trash2, Save, ChevronRight } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

interface UWRule {
  id: string;
  name: string;
  condition: string;
  outcome: 'auto_approve' | 'manual_review' | 'auto_decline' | 'rate_up';
  priority: number;
  isActive: boolean;
  hitCount: number;
}

interface UWQueue {
  id: string;
  applicant: string;
  policyType: string;
  coverage: number;
  riskScore: number;
  status: 'pending' | 'approved' | 'declined' | 'referred';
  submittedAt: string;
  flags: string[];
}

const RULES: UWRule[] = [
  { id: '1', name: 'Clean Record Auto-Approve',     condition: 'Age >= 25 AND Claims = 0 AND Score >= 700',           outcome: 'auto_approve',   priority: 1, isActive: true,  hitCount: 1243 },
  { id: '2', name: 'High-Risk Decline',             condition: 'Claims >= 3 AND Amount > $100K',                      outcome: 'auto_decline',   priority: 2, isActive: true,  hitCount: 87   },
  { id: '3', name: 'Young Driver Review',            condition: 'Age < 25 AND Coverage > $50K',                        outcome: 'manual_review',  priority: 3, isActive: true,  hitCount: 342  },
  { id: '4', name: 'DUI Surcharge',                  condition: 'HasDUI = true AND PolicyType = auto',                 outcome: 'rate_up',        priority: 4, isActive: true,  hitCount: 56   },
  { id: '5', name: 'Excellent Credit Fast-Track',   condition: 'CreditScore >= 800 AND Claims = 0',                   outcome: 'auto_approve',   priority: 5, isActive: false, hitCount: 891  },
  { id: '6', name: 'Pre-existing Condition Review', condition: 'PolicyType = health AND HasPreExisting = true',        outcome: 'manual_review',  priority: 6, isActive: true,  hitCount: 203  },
];

const QUEUE: UWQueue[] = [
  { id: 'q1', applicant: 'James Rodriguez',  policyType: 'Auto',   coverage: 150000, riskScore: 72, status: 'pending',  submittedAt: '2 min ago',  flags: ['Young driver', 'First policy'] },
  { id: 'q2', applicant: 'Lisa Thompson',    policyType: 'Health', coverage: 100000, riskScore: 45, status: 'pending',  submittedAt: '8 min ago',  flags: ['Pre-existing condition'] },
  { id: 'q3', applicant: 'Mark Chen',        policyType: 'Home',   coverage: 350000, riskScore: 28, status: 'approved', submittedAt: '15 min ago', flags: [] },
  { id: 'q4', applicant: 'Anna Williams',    policyType: 'Auto',   coverage: 75000,  riskScore: 88, status: 'declined', submittedAt: '32 min ago', flags: ['Prior DUI', 'Multiple claims'] },
  { id: 'q5', applicant: 'Robert Taylor',    policyType: 'Life',   coverage: 500000, riskScore: 61, status: 'referred', submittedAt: '1 hr ago',   flags: ['High coverage', 'Medical review'] },
];

const outcomeStyle: Record<string, string> = {
  auto_approve:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  auto_decline:  'text-red-400 bg-red-500/10 border-red-500/20',
  manual_review: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  rate_up:       'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

const statusStyle: Record<string, string> = {
  pending:  'text-amber-400 bg-amber-500/10 border-amber-500/20',
  approved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  declined: 'text-red-400 bg-red-500/10 border-red-500/20',
  referred: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

const outcomeIcon = { auto_approve: CheckCircle, auto_decline: XCircle, manual_review: AlertCircle, rate_up: AlertCircle };

const TABS = ['Rules Engine', 'Manual Queue', 'AI Insights'] as const;
type Tab = typeof TABS[number];

export const UnderwritingEngine = () => {
  const { success } = useToast();
  const [tab, setTab] = useState<Tab>('Rules Engine');
  const [rules, setRules] = useState<UWRule[]>(RULES);
  const [queue, setQueue] = useState<UWQueue[]>(QUEUE);
  const [showAdd, setShowAdd] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', condition: '', outcome: 'manual_review' as UWRule['outcome'] });

  const toggleRule = (id: string) => setRules(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  const removeRule = (id: string) => { setRules(prev => prev.filter(r => r.id !== id)); success('Rule deleted', 'Underwriting rule removed.'); };

  const addRule = (e: React.FormEvent) => {
    e.preventDefault();
    const r: UWRule = { id: `r_${Date.now()}`, name: newRule.name, condition: newRule.condition, outcome: newRule.outcome, priority: rules.length + 1, isActive: true, hitCount: 0 };
    setRules(prev => [...prev, r]);
    setNewRule({ name: '', condition: '', outcome: 'manual_review' });
    setShowAdd(false);
    success('Rule created', `"${r.name}" added to underwriting engine.`);
  };

  const handleQueueAction = (id: string, action: 'approve' | 'decline') => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: action === 'approve' ? 'approved' : 'declined' } : q));
    success(action === 'approve' ? 'Application approved' : 'Application declined', 'Underwriting decision recorded.');
  };

  const pending = queue.filter(q => q.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Underwriting Engine</h2>
          <p className="text-sm text-gray-500 mt-0.5">Automated rules and manual review queue for policy applications.</p>
        </div>
        <Button size="sm" leftIcon={<Save size={14} />} onClick={() => success('Saved', 'Underwriting configuration saved.')}>Save</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-white/[0.03] border border-white/[0.06] p-1 w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all relative', tab === t ? 'bg-white/[0.08] text-gray-100' : 'text-gray-500 hover:text-gray-300')}>
            {t}{t === 'Manual Queue' && pending > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">{pending}</span>}
          </button>
        ))}
      </div>

      {/* Rules Engine */}
      {tab === 'Rules Engine' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button variant="secondary" size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowAdd(true)}>Add Rule</Button>
          </div>
          {rules.map(rule => {
            const Icon = outcomeIcon[rule.outcome];
            return (
              <GlassPanel key={rule.id} className={cn(!rule.isActive && 'opacity-50')}>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg shrink-0 bg-white/[0.06] text-xs font-bold text-gray-500">P{rule.priority}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-200">{rule.name}</span>
                      <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border', outcomeStyle[rule.outcome])}>
                        <Icon size={10} />{rule.outcome.replace('_', ' ')}
                      </span>
                    </div>
                    <code className="text-xs text-gray-500 font-mono bg-white/[0.03] px-2 py-1 rounded block mt-1">{rule.condition}</code>
                    <p className="text-[10px] text-gray-600 mt-1.5">{rule.hitCount.toLocaleString()} hits this month</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => toggleRule(rule.id)}
                      className={cn('relative h-5 w-9 rounded-full transition-all duration-200', rule.isActive ? 'bg-[#10B981]' : 'bg-white/[0.10]')}>
                      <span className={cn('absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200', rule.isActive ? 'translate-x-4' : 'translate-x-0')} />
                    </button>
                    <button onClick={() => removeRule(rule.id)} className="text-gray-700 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </GlassPanel>
            );
          })}
          {showAdd && (
            <GlassPanel className="border-[#10B981]/20">
              <h3 className="text-sm font-bold text-gray-300 mb-4">New Underwriting Rule</h3>
              <form onSubmit={addRule} className="space-y-4">
                <Input label="Rule Name" placeholder="e.g. High-Value Policy Review" value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })} required />
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Condition Expression</label>
                  <textarea rows={2} value={newRule.condition} onChange={e => setNewRule({ ...newRule, condition: e.target.value })}
                    placeholder="e.g. Age < 25 AND Coverage > $100K AND Claims >= 1"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-mono text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 resize-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Outcome</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['auto_approve', 'auto_decline', 'manual_review', 'rate_up'] as const).map(o => (
                      <button key={o} type="button" onClick={() => setNewRule({ ...newRule, outcome: o })}
                        className={cn('px-3 py-2 rounded-lg text-xs font-semibold border transition-all', newRule.outcome === o ? outcomeStyle[o] : 'text-gray-600 border-white/[0.06]')}>
                        {o.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button type="submit">Create Rule</Button>
                </div>
              </form>
            </GlassPanel>
          )}
        </div>
      )}

      {/* Manual Queue */}
      {tab === 'Manual Queue' && (
        <div className="space-y-4">
          {queue.map(app => (
            <GlassPanel key={app.id}>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-white/[0.06] flex items-center justify-center text-sm font-bold text-gray-300 shrink-0">
                  {app.applicant.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-200">{app.applicant}</span>
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase border', statusStyle[app.status])}>{app.status}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500 mb-2">
                    <span>{app.policyType}</span>
                    <span>${app.coverage.toLocaleString()} coverage</span>
                    <span>Risk: {app.riskScore}</span>
                    <span>{app.submittedAt}</span>
                  </div>
                  {app.flags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {app.flags.map(flag => (
                        <span key={flag} className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">{flag}</span>
                      ))}
                    </div>
                  )}
                </div>
                {app.status === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <Button variant="danger" size="sm" onClick={() => handleQueueAction(app.id, 'decline')}><XCircle size={14} /></Button>
                    <Button size="sm" onClick={() => handleQueueAction(app.id, 'approve')}><CheckCircle size={14} /></Button>
                  </div>
                )}
                {app.status !== 'pending' && (
                  <ChevronRight size={16} className="text-gray-700 shrink-0 mt-2" />
                )}
              </div>
            </GlassPanel>
          ))}
        </div>
      )}

      {/* AI Insights */}
      {tab === 'AI Insights' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Auto-Approved',    value: '68%', sub: '1,243 this month', color: 'text-emerald-400' },
              { label: 'Manual Reviews',   value: '24%', sub: '438 this month',   color: 'text-amber-400'   },
              { label: 'Auto-Declined',    value: '8%',  sub: '146 this month',   color: 'text-red-400'     },
            ].map(s => (
              <GlassPanel key={s.label} className="text-center py-6">
                <p className={cn('text-3xl font-bold', s.color)}>{s.value}</p>
                <p className="text-xs font-semibold text-gray-400 mt-1">{s.label}</p>
                <p className="text-[10px] text-gray-600 mt-0.5">{s.sub}</p>
              </GlassPanel>
            ))}
          </div>
          <GlassPanel>
            <div className="flex items-center gap-3 mb-4">
              <Brain size={20} className="text-[#10B981]" />
              <h3 className="text-sm font-bold text-gray-200">AI Recommendations</h3>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Update young driver threshold', desc: 'Consider lowering manual review age from 25 to 23. Data shows 23–24 year olds have similar risk profiles.', impact: 'Medium', savings: '+$45K/yr' },
                { title: 'Enable credit score fast-track', desc: 'Rule #5 is inactive but could auto-approve 891 more applications/month safely.', impact: 'High', savings: '+$120K/yr efficiency' },
                { title: 'Geographic surcharge needed', desc: 'Urban area claims are 23% higher. Enable the Urban Area Surcharge rule.', impact: 'High', savings: '+$85K/yr' },
              ].map(r => (
                <div key={r.title} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <AlertCircle size={14} className="text-blue-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-200">{r.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                    <div className="flex gap-3 mt-1.5">
                      <span className="text-[10px] text-blue-400 font-medium">Impact: {r.impact}</span>
                      <span className="text-[10px] text-emerald-400 font-medium">{r.savings}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
