import { useState } from 'react';
import {
  Database, Clock, Trash2, Save, AlertTriangle,
  CheckCircle2, RefreshCw, Download, Filter, Calendar,
  Shield, HardDrive, FileText, Users, CreditCard
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

interface RetentionPolicy {
  id: string;
  dataType: string;
  category: string;
  retentionDays: number;
  archiveDays: number;
  deletionMethod: 'hard' | 'soft' | 'anonymize';
  legalBasis: string;
  icon: React.ElementType;
  color: string;
  recordCount: number;
  sizeGB: number;
  complianceFramework: string[];
  lastRun: string;
  nextRun: string;
  status: 'active' | 'paused' | 'error';
}

interface DeletionJob {
  id: string;
  dataType: string;
  recordsDeleted: number;
  sizeFreed: string;
  ranAt: string;
  duration: string;
  status: 'success' | 'failed' | 'running';
}

const RETENTION_POLICIES: RetentionPolicy[] = [
  {
    id: '1', dataType: 'Customer Personal Data', category: 'PII',
    retentionDays: 2555, archiveDays: 1825, deletionMethod: 'anonymize',
    legalBasis: 'Contractual necessity (GDPR Art. 6.1.b)',
    icon: Users, color: '#3B82F6', recordCount: 12847, sizeGB: 4.2,
    complianceFramework: ['GDPR', 'CCPA'], lastRun: '2025-01-20', nextRun: '2025-02-20',
    status: 'active',
  },
  {
    id: '2', dataType: 'Claims Records', category: 'Financial',
    retentionDays: 2555, archiveDays: 1825, deletionMethod: 'hard',
    legalBasis: 'Legal obligation — Insurance Act retention requirements',
    icon: FileText, color: '#10B981', recordCount: 8234, sizeGB: 12.8,
    complianceFramework: ['SOC 2', 'HIPAA'], lastRun: '2025-01-15', nextRun: '2025-02-15',
    status: 'active',
  },
  {
    id: '3', dataType: 'Payment Transactions', category: 'Financial',
    retentionDays: 2555, archiveDays: 1825, deletionMethod: 'hard',
    legalBasis: 'Legal obligation — PCI-DSS & tax regulations',
    icon: CreditCard, color: '#F59E0B', recordCount: 45623, sizeGB: 8.6,
    complianceFramework: ['PCI-DSS', 'GDPR'], lastRun: '2025-01-22', nextRun: '2025-02-22',
    status: 'active',
  },
  {
    id: '4', dataType: 'Audit Logs', category: 'Security',
    retentionDays: 365, archiveDays: 730, deletionMethod: 'hard',
    legalBasis: 'Security monitoring — SOC 2 Type II requirement',
    icon: Shield, color: '#8B5CF6', recordCount: 284921, sizeGB: 22.4,
    complianceFramework: ['SOC 2'], lastRun: '2025-01-24', nextRun: '2025-01-31',
    status: 'active',
  },
  {
    id: '5', dataType: 'Marketing Data', category: 'Marketing',
    retentionDays: 730, archiveDays: 365, deletionMethod: 'anonymize',
    legalBasis: 'Legitimate interests (GDPR Art. 6.1.f) with consent',
    icon: Users, color: '#EF4444', recordCount: 5621, sizeGB: 1.8,
    complianceFramework: ['GDPR', 'CCPA'], lastRun: '2025-01-10', nextRun: '2025-04-10',
    status: 'active',
  },
  {
    id: '6', dataType: 'Health / PHI Data', category: 'Medical',
    retentionDays: 2555, archiveDays: 3650, deletionMethod: 'hard',
    legalBasis: 'Legal obligation — HIPAA minimum retention periods',
    icon: HardDrive, color: '#EC4899', recordCount: 3218, sizeGB: 6.1,
    complianceFramework: ['HIPAA', 'GDPR'], lastRun: '2025-01-12', nextRun: '2025-04-12',
    status: 'active',
  },
  {
    id: '7', dataType: 'System Backups', category: 'Infrastructure',
    retentionDays: 90, archiveDays: 180, deletionMethod: 'hard',
    legalBasis: 'Operational necessity — business continuity',
    icon: Database, color: '#6B7280', recordCount: 124, sizeGB: 840,
    complianceFramework: ['SOC 2'], lastRun: '2025-01-25', nextRun: '2025-01-26',
    status: 'active',
  },
];

const DELETION_JOBS: DeletionJob[] = [
  { id: '1', dataType: 'Audit Logs', recordsDeleted: 48291, sizeFreed: '4.2 GB', ranAt: '2025-01-24 02:00', duration: '14m 32s', status: 'success' },
  { id: '2', dataType: 'Marketing Data', recordsDeleted: 1240, sizeFreed: '0.3 GB', ranAt: '2025-01-20 03:00', duration: '2m 18s', status: 'success' },
  { id: '3', dataType: 'System Backups', recordsDeleted: 12, sizeFreed: '96.0 GB', ranAt: '2025-01-20 04:00', duration: '8m 45s', status: 'success' },
  { id: '4', dataType: 'Customer Personal Data', recordsDeleted: 0, sizeFreed: '0 GB', ranAt: '2025-01-18 02:00', duration: '45m 12s', status: 'failed' },
  { id: '5', dataType: 'Payment Transactions', recordsDeleted: 8921, sizeFreed: '1.8 GB', ranAt: '2025-01-15 03:00', duration: '22m 8s', status: 'success' },
];

const TABS = ['Policies', 'Schedule', 'History', 'Legal Basis', 'Settings'] as const;
type Tab = typeof TABS[number];

const deletionMethodBadge = (method: string) => {
  const styles: Record<string, string> = {
    hard: 'bg-red-500/10 text-red-400 border-red-500/20',
    soft: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    anonymize: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  const labels: Record<string, string> = { hard: 'Hard Delete', soft: 'Soft Delete', anonymize: 'Anonymize' };
  return { style: styles[method] || '', label: labels[method] || method };
};

export const DataRetention = () => {
  const { success, info, error } = useToast();
  const [tab, setTab] = useState<Tab>('Policies');
  const [policies, setPolicies] = useState<RetentionPolicy[]>(RETENTION_POLICIES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<RetentionPolicy>>({});
  const [running, setRunning] = useState(false);

  const totalRecords = policies.reduce((s, p) => s + p.recordCount, 0);
  const totalSizeGB = policies.reduce((s, p) => s + p.sizeGB, 0);
  const activeCount = policies.filter(p => p.status === 'active').length;

  const handleEdit = (p: RetentionPolicy) => {
    setEditingId(p.id);
    setEditValues({ retentionDays: p.retentionDays, archiveDays: p.archiveDays, deletionMethod: p.deletionMethod });
  };

  const handleSave = (id: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, ...editValues } : p));
    setEditingId(null);
    success('Policy saved', 'Retention policy has been updated.');
  };

  const handleRunAll = async () => {
    setRunning(true);
    await new Promise(r => setTimeout(r, 2500));
    setRunning(false);
    success('Retention jobs complete', 'All retention policies executed successfully.');
  };

  const handleRightToDelete = () => {
    info('Processing deletion', 'Right-to-be-forgotten request queued for processing within 30 days per GDPR Art. 17.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="text-emerald-400" size={22} /> Data Retention
          </h1>
          <p className="text-sm text-gray-500 mt-1">Configure retention periods, deletion schedules, and compliance policies.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => success('Exported', 'Retention schedule exported.')}>
            <Download size={13} className="mr-1.5" /> Export Schedule
          </Button>
          <Button size="sm" onClick={handleRunAll} isLoading={running}>
            <RefreshCw size={13} className="mr-1.5" /> Run All Now
          </Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Policies', value: activeCount, icon: CheckCircle2, color: '#10B981' },
          { label: 'Total Records', value: totalRecords.toLocaleString(), icon: Database, color: '#3B82F6' },
          { label: 'Total Data Size', value: `${totalSizeGB.toFixed(0)} GB`, icon: HardDrive, color: '#8B5CF6' },
          { label: 'Next Deletion', value: 'Tomorrow 2am', icon: Clock, color: '#F59E0B' },
        ].map(kpi => (
          <GlassPanel key={kpi.label}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${kpi.color}20` }}>
                <kpi.icon size={14} style={{ color: kpi.color }} />
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{kpi.label}</p>
            </div>
            <p className="text-xl font-bold text-white">{kpi.value}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] overflow-x-auto hide-scrollbar">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              tab === t ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-300')}>
            {t}
          </button>
        ))}
      </div>

      {/* ── POLICIES TAB ── */}
      {tab === 'Policies' && (
        <div className="space-y-4">
          {policies.map(p => {
            const isEditing = editingId === p.id;
            const { style: methodStyle, label: methodLabel } = deletionMethodBadge(
              isEditing ? (editValues.deletionMethod || p.deletionMethod) : p.deletionMethod
            );
            return (
              <GlassPanel key={p.id} hoverable>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Icon + Info */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: `${p.color}20` }}>
                      <p.icon size={18} style={{ color: p.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-200">{p.dataType}</p>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/5 text-gray-500 border border-white/10">{p.category}</span>
                        <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold border', methodStyle)}>{methodLabel}</span>
                        {p.status === 'error' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">ERROR</span>}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {p.complianceFramework.map(fw => (
                          <span key={fw} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">{fw}</span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{p.legalBasis}</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="text-center">
                      <p className="font-bold text-gray-200">{p.recordCount.toLocaleString()}</p>
                      <p className="text-gray-600">Records</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-200">{p.sizeGB >= 1 ? `${p.sizeGB} GB` : `${(p.sizeGB * 1024).toFixed(0)} MB`}</p>
                      <p className="text-gray-600">Size</p>
                    </div>
                    <div className="text-center">
                      {isEditing ? (
                        <div className="flex flex-col gap-1">
                          <input type="number" value={editValues.retentionDays}
                            onChange={e => setEditValues(v => ({ ...v, retentionDays: +e.target.value }))}
                            className="w-16 h-7 text-center rounded border border-white/10 bg-white/5 text-xs text-gray-200" />
                          <p className="text-gray-600">Retain (days)</p>
                        </div>
                      ) : (
                        <>
                          <p className="font-bold text-gray-200">{p.retentionDays}d</p>
                          <p className="text-gray-600">Retain</p>
                        </>
                      )}
                    </div>
                    <div className="text-center">
                      {isEditing ? (
                        <div className="flex flex-col gap-1">
                          <select value={editValues.deletionMethod}
                            onChange={e => setEditValues(v => ({ ...v, deletionMethod: e.target.value as 'hard' | 'soft' | 'anonymize' }))}
                            className="h-7 rounded border border-white/10 bg-white/5 text-xs text-gray-200 px-1">
                            <option value="hard">Hard Delete</option>
                            <option value="soft">Soft Delete</option>
                            <option value="anonymize">Anonymize</option>
                          </select>
                          <p className="text-gray-600">Method</p>
                        </div>
                      ) : (
                        <>
                          <p className="font-bold text-gray-200">Auto</p>
                          <p className="text-gray-600">Trigger</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button size="sm" onClick={() => handleSave(p.id)}>
                          <Save size={13} className="mr-1" /> Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(p)}>Edit</Button>
                        <Button size="sm" variant="ghost" onClick={() => success('Job queued', `Retention job for ${p.dataType} has been scheduled.`)}>
                          Run
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4 pt-4 border-t border-white/[0.05] flex flex-wrap gap-6 text-xs text-gray-500">
                  <span><Clock size={11} className="inline mr-1 text-gray-600" />Last run: {p.lastRun}</span>
                  <span><Calendar size={11} className="inline mr-1 text-gray-600" />Next run: {p.nextRun}</span>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      )}

      {/* ── SCHEDULE TAB ── */}
      {tab === 'Schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassPanel>
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Retention Schedule Calendar</h3>
            <div className="space-y-3">
              {[
                { time: '02:00', label: 'Audit Logs', type: 'Daily', nextRun: 'Tonight' },
                { time: '03:00', label: 'Marketing Data', type: 'Monthly', nextRun: 'Feb 10' },
                { time: '03:30', label: 'System Backups', type: 'Daily', nextRun: 'Tonight' },
                { time: '04:00', label: 'Payment Transactions', type: 'Monthly', nextRun: 'Feb 22' },
                { time: '04:30', label: 'Customer Personal Data', type: 'Monthly', nextRun: 'Feb 20' },
                { time: '05:00', label: 'Claims Records', type: 'Monthly', nextRun: 'Feb 15' },
                { time: '05:30', label: 'Health / PHI Data', type: 'Quarterly', nextRun: 'Apr 12' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="w-14 text-center">
                    <p className="text-xs font-mono font-bold text-emerald-400">{s.time}</p>
                    <p className="text-[9px] text-gray-600">UTC</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-200">{s.label}</p>
                    <p className="text-xs text-gray-500">{s.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-300">{s.nextRun}</p>
                    <p className="text-[9px] text-gray-600">Next run</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel>
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Schedule Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Execution Window</label>
                <select className="mt-1.5 w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-gray-300 focus:outline-none">
                  <option>Nightly (02:00–06:00 UTC)</option>
                  <option>Weekend only</option>
                  <option>Custom schedule</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Batch Size</label>
                <select className="mt-1.5 w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-gray-300 focus:outline-none">
                  <option>10,000 records/batch</option>
                  <option>25,000 records/batch</option>
                  <option>50,000 records/batch</option>
                  <option>Unlimited</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">On Failure</label>
                <select className="mt-1.5 w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-gray-300 focus:outline-none">
                  <option>Retry 3 times then alert</option>
                  <option>Skip and alert</option>
                  <option>Halt all jobs</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alert Recipients</label>
                <input defaultValue="admin@insurai.com, security@insurai.com" className="mt-1.5 w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-gray-300 focus:outline-none" />
              </div>
              <Button className="w-full" onClick={() => success('Schedule saved', 'Retention schedule settings updated.')}>
                <Save size={14} className="mr-1.5" /> Save Schedule Settings
              </Button>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {tab === 'History' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm"><Filter size={13} className="mr-1.5" />Filter</Button>
            <Button variant="secondary" size="sm" onClick={() => success('Exported', 'Job history exported to CSV.')}>
              <Download size={13} className="mr-1.5" />Export
            </Button>
          </div>
          <GlassPanel>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Data Type', 'Records Deleted', 'Size Freed', 'Duration', 'Ran At', 'Status'].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {DELETION_JOBS.map(job => (
                    <tr key={job.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-medium text-gray-200">{job.dataType}</td>
                      <td className="py-3 px-3 text-gray-300 font-mono">{job.recordsDeleted.toLocaleString()}</td>
                      <td className="py-3 px-3 text-gray-300">{job.sizeFreed}</td>
                      <td className="py-3 px-3 text-gray-400 font-mono text-xs">{job.duration}</td>
                      <td className="py-3 px-3 text-gray-500 font-mono text-xs">{job.ranAt}</td>
                      <td className="py-3 px-3">
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border',
                          job.status === 'success' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                          job.status === 'running' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                          'text-red-400 bg-red-500/10 border-red-500/20')}>
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* ── LEGAL BASIS TAB ── */}
      {tab === 'Legal Basis' && (
        <div className="space-y-4">
          {/* GDPR Right to be Forgotten */}
          <GlassPanel className="border-red-500/20 bg-red-500/[0.02]">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-500/10">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-200">Right to Erasure (GDPR Art. 17)</h3>
                <p className="text-sm text-gray-500 mt-1">Process customer requests to delete all personal data. Must be completed within 30 days of request.</p>
                <div className="flex items-center gap-3 mt-4">
                  <input placeholder="Enter customer email or ID..." className="flex-1 h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-300 focus:outline-none focus:border-red-500/40" />
                  <Button size="sm" variant="danger" onClick={handleRightToDelete}>
                    <Trash2 size={13} className="mr-1.5" /> Process Request
                  </Button>
                </div>
              </div>
            </div>
          </GlassPanel>

          {/* Legal basis per framework */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                framework: 'GDPR', color: '#3B82F6',
                items: [
                  { article: 'Art. 5.1.e', desc: 'Data minimisation — keep no longer than necessary' },
                  { article: 'Art. 13/14', desc: 'Transparency — inform users of retention periods' },
                  { article: 'Art. 17', desc: 'Right to erasure (right to be forgotten)' },
                  { article: 'Art. 30', desc: 'Records of processing activities (RoPA)' },
                ],
              },
              {
                framework: 'PCI-DSS', color: '#F59E0B',
                items: [
                  { article: 'Req 3.1', desc: 'Limit cardholder data storage to minimum necessary' },
                  { article: 'Req 3.2', desc: 'Do not store sensitive authentication data after authorization' },
                  { article: 'Req 9.8', desc: 'Securely destroy cardholder data when no longer needed' },
                ],
              },
              {
                framework: 'HIPAA', color: '#EC4899',
                items: [
                  { article: '45 CFR 164.530', desc: 'Retain PHI for 6 years from creation or last effective date' },
                  { article: '45 CFR 164.524', desc: 'Provide access to PHI within 30 days of request' },
                  { article: '45 CFR 164.528', desc: 'Accounting of disclosures — 6-year retention' },
                ],
              },
              {
                framework: 'CCPA', color: '#10B981',
                items: [
                  { article: 'Sec. 1798.105', desc: 'Consumer right to delete personal information' },
                  { article: 'Sec. 1798.100', desc: 'Business must disclose retention periods' },
                  { article: 'Sec. 1798.120', desc: 'Right to opt-out of sale of personal information' },
                ],
              },
            ].map(fw => (
              <GlassPanel key={fw.framework}>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold border" style={{ color: fw.color, backgroundColor: `${fw.color}15`, borderColor: `${fw.color}30` }}>{fw.framework}</span>
                  Retention Requirements
                </h3>
                <div className="space-y-2">
                  {fw.items.map(item => (
                    <div key={item.article} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <span className="text-[10px] font-mono font-bold shrink-0 mt-0.5" style={{ color: fw.color }}>{item.article}</span>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {tab === 'Settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassPanel>
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Global Retention Settings</h3>
            <div className="space-y-4">
              {[
                { label: 'Default Retention Period', value: '7 years' },
                { label: 'Archive Before Delete', value: 'Enabled — 90 days before deletion' },
                { label: 'Deletion Confirmation', value: 'Required — dual approval for > 10K records' },
                { label: 'Immutable Backups', value: 'Enabled — 30-day retention' },
                { label: 'Deletion Audit Trail', value: 'Always enabled — cannot be disabled' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
                  <p className="text-sm text-gray-300">{label}</p>
                  <p className="text-sm text-gray-500">{value}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="border-amber-500/20 bg-amber-500/[0.02]">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-400">Danger Zone</h3>
                <p className="text-xs text-gray-500 mt-1">These actions are irreversible and require dual authorization.</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Purge All Expired Data', desc: 'Immediately delete all data past retention period', color: '#EF4444' },
                { label: 'Reset All Retention Clocks', desc: 'Recalculate retention dates based on latest policies', color: '#F59E0B' },
                { label: 'Export Full Data Inventory', desc: 'Download complete inventory of all stored data types', color: '#3B82F6' },
              ].map(({ label, desc, color }) => (
                <div key={label} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: `${color}25`, backgroundColor: `${color}08` }}>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (label.includes('Export')) {
                        success('Exporting', 'Data inventory download started.');
                      } else {
                        error('Not authorized', 'This action requires dual approval. Contact your security officer.');
                      }
                    }}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
                    style={{ color, borderColor: `${color}40`, backgroundColor: `${color}15` }}>
                    {label.includes('Export') ? 'Export' : 'Request'}
                  </button>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
