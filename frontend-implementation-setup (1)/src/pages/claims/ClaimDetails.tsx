import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentViewer } from '@/components/claims/DocumentViewer';
import { ClaimNotes } from '@/components/claims/ClaimNotes';
import { ClaimAttachments } from '@/components/claims/ClaimAttachments';
import { AdjusterChat } from '@/components/claims/AdjusterChat';
import { InspectionScheduler } from '@/components/claims/InspectionScheduler';
import { RepairTracker } from '@/components/claims/RepairTracker';
import { ClaimSurvey } from '@/components/claims/ClaimSurvey';
import { ClaimAppeal } from '@/components/claims/ClaimAppeal';
import type { ClaimDocument as ClaimDocType } from '@/types';
import {
  ChevronLeft, FileText, User, DollarSign, Clock,
  ExternalLink, CheckCircle, XCircle, Phone, Mail,
  ShieldCheck, AlertTriangle, MessageSquare, RotateCcw,
  Paperclip, History, Star, Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { RiskBadge, StatusBadge } from '@/components/ui/Badge';
import { RiskGauge } from '@/components/ai/RiskGauge';
import { RiskFactorsList } from '@/components/ai/RiskFactorsList';
import { AIInsightCard } from '@/components/ai/AIInsightCard';
import { getClaimById, getClaimNotes } from '@/data/mockData';
import {
  formatCurrency, formatDateTime, formatClaimType,
  formatFileSize, formatRelativeTime,
} from '@/utils/formatters';
import { useToast } from '@/context/ToastContext';
import type { ClaimDocument, ClaimTimelineEvent } from '@/types';
import { cn } from '@/utils/cn';

const timelineTypeColors: Record<string, string> = {
  status_change: '#10B981',
  ai_analysis: '#8B5CF6',
  note_added: '#3B82F6',
  document_uploaded: '#F59E0B',
  assigned: '#EC4899',
};

type DetailTab = 'info' | 'notes' | 'attachments' | 'timeline' | 'communication' | 'feedback';

const DETAIL_TABS: { id: DetailTab; label: string; icon: React.ElementType }[] = [
  { id: 'info', label: 'Details', icon: FileText },
  { id: 'notes', label: 'Notes', icon: MessageSquare },
  { id: 'attachments', label: 'Attachments', icon: Paperclip },
  { id: 'timeline', label: 'Timeline', icon: History },
  { id: 'communication', label: 'Adjuster', icon: Calendar },
  { id: 'feedback', label: 'Survey / Appeal', icon: Star },
];

export const ClaimDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideSubmitted, setOverrideSubmitted] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<ClaimDocType | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('info');

  const claim = getClaimById(id ?? '');
  const notes = claim ? getClaimNotes(claim.id) : [];

  if (!claim) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertTriangle size={48} className="text-gray-700" />
        <h2 className="text-xl font-bold text-gray-300">Claim not found</h2>
        <p className="text-gray-500 text-sm">The claim you are looking for does not exist.</p>
        <Button variant="secondary" onClick={() => navigate('/claims')}>Return to Claims</Button>
      </div>
    );
  }

  const handleAction = (type: 'approved' | 'rejected') => {
    if (type === 'approved') {
      success('Claim Approved', `${claim.claimNumber} approved for ${formatCurrency(claim.amount)}.`);
    } else {
      error('Claim Rejected', `${claim.claimNumber} has been rejected.`);
    }
    navigate('/claims');
  };

  const canAction = !['approved', 'rejected'].includes(claim.status);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/claims')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            aria-label="Back to claims"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-white font-mono tracking-tight">{claim.claimNumber}</h1>
              <StatusBadge status={claim.status} />
              <RiskBadge level={claim.riskLevel} />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Submitted {formatDateTime(claim.submittedAt)}
              {claim.assignedToName && ` · Assigned to ${claim.assignedToName}`}
            </p>
          </div>
        </div>
        {canAction && (
          <div className="flex items-center gap-2">
            <Button variant="danger" size="sm" leftIcon={<XCircle size={15} />} onClick={() => handleAction('rejected')}>Reject</Button>
            <Button variant="success" size="sm" leftIcon={<CheckCircle size={15} />} onClick={() => handleAction('approved')}>Approve</Button>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Tabbed Claim Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Quick stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Amount', value: formatCurrency(claim.amount), color: 'text-white' },
              { label: 'Risk Score', value: `${claim.riskScore}/100`, color: claim.riskScore >= 70 ? 'text-red-400' : claim.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400' },
              { label: 'Fraud Prob.', value: `${claim.fraudProbability}%`, color: 'text-red-400' },
              { label: 'Type', value: formatClaimType(claim.type), color: 'text-gray-300' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={cn('text-sm font-bold tabular-nums', s.color)}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 rounded-xl bg-white/[0.03] border border-white/[0.06] p-1 overflow-x-auto hide-scrollbar" role="tablist">
            {DETAIL_TABS.map(({ id: tid, label, icon: Icon }) => (
              <button
                key={tid}
                onClick={() => setActiveTab(tid)}
                className={cn(
                  'flex shrink-0 items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                  activeTab === tid ? 'bg-white/[0.08] text-gray-100' : 'text-gray-500 hover:text-gray-300'
                )}
                role="tab"
                aria-selected={activeTab === tid}
              >
                <Icon size={13} />
                {label}
                {tid === 'notes' && notes.length > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white/[0.10] text-[10px] font-bold px-1">{notes.length}</span>
                )}
                {tid === 'attachments' && claim.documents.length > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white/[0.10] text-[10px] font-bold px-1">{claim.documents.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Details Tab */}
          {activeTab === 'info' && (
            <GlassPanel>
              <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Claimant Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tight mb-0.5">Claimant</p>
                    <p className="text-base font-bold text-gray-100">{claim.claimant.name}</p>
                    <div className="mt-1.5 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500"><Mail size={11} />{claim.claimant.email}</div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500"><Phone size={11} />{claim.claimant.phone}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tight mb-0.5">Claim Amount</p>
                    <p className="text-2xl font-bold text-gray-100 tabular-nums">{formatCurrency(claim.amount)}</p>
                    <div className="mt-1.5 space-y-0.5">
                      <p className="text-xs text-gray-500">Policy: <span className="font-mono text-gray-400">{claim.policyNumber}</span></p>
                      <p className="text-xs text-gray-500">Type: {formatClaimType(claim.type)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/[0.06]">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tight mb-2">Incident Description</p>
                <p className="text-sm text-gray-300 leading-relaxed bg-white/[0.02] rounded-lg border border-white/[0.05] p-4">{claim.description}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/[0.06]">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tight mb-3">Documents ({claim.documents.length})</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {claim.documents.map((doc: ClaimDocument) => (
                    <div
                      key={doc.id}
                      onClick={() => setViewingDoc(doc)}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 hover:border-[#10B981]/20 hover:bg-[#10B981]/[0.03] transition-all group cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setViewingDoc(doc)}
                      aria-label={`Open ${doc.name}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                          <FileText size={16} className="text-gray-500 group-hover:text-[#10B981] transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-200 truncate">{doc.name}</p>
                          <p className="text-xs text-gray-600">{formatFileSize(doc.size)}</p>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-gray-600 group-hover:text-[#10B981] shrink-0 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && <ClaimNotes claimId={claim.id} notes={notes} />}

          {/* Attachments Tab */}
          {activeTab === 'attachments' && <ClaimAttachments documents={claim.documents} claimNumber={claim.claimNumber} />}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <GlassPanel>
              <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Processing Timeline</h3>
              <div className="relative space-y-0">
                {claim.timeline.map((event: ClaimTimelineEvent, idx: number) => {
                  const dotColor = timelineTypeColors[event.type] || '#6B7280';
                  const isLast = idx === claim.timeline.length - 1;
                  return (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="mt-1 h-5 w-5 shrink-0 flex items-center justify-center rounded-full border-2 z-10" style={{ borderColor: dotColor, backgroundColor: `${dotColor}18` }}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
                        </div>
                        {!isLast && <div className="flex-1 w-px bg-white/[0.06] my-1" style={{ minHeight: 20 }} />}
                      </div>
                      <div className="pb-5 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-200">{event.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>
                            {event.userName && <p className="text-[10px] text-gray-600 mt-1">by {event.userName}</p>}
                          </div>
                          <span className="text-[10px] text-gray-600 font-mono shrink-0 tabular-nums">{formatRelativeTime(event.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassPanel>
          )}

          {/* Communication / Adjuster Tab */}
          {activeTab === 'communication' && (
            <div className="space-y-4">
              <AdjusterChat claimNumber={claim.claimNumber} />
              <InspectionScheduler claimNumber={claim.claimNumber} />
              <RepairTracker />
            </div>
          )}

          {/* Feedback / Appeal Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-5">
              {claim.status === 'rejected' ? (
                <ClaimAppeal claimNumber={claim.claimNumber} onClose={() => setActiveTab('info')} />
              ) : claim.status === 'approved' ? (
                <ClaimSurvey claimNumber={claim.claimNumber} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-3 rounded-xl border border-dashed border-white/[0.08]">
                  <Star size={32} className="text-gray-700" />
                  <p className="text-sm text-gray-500 font-medium">Survey available after claim resolution</p>
                  <p className="text-xs text-gray-600">Appeal option appears if your claim is rejected</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: AI Analysis */}
        <div className="space-y-5">
          <GlassPanel className="border-[#10B981]/10 bg-[#10B981]/[0.02]">
            <div className="flex flex-col items-center py-4">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest text-center mb-4">Risk Score</p>
              <RiskGauge score={claim.riskScore} size="lg" />
              <div className="mt-4 w-full grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.06]">
                <div className="text-center">
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">Fraud Prob.</p>
                  <p className="text-lg font-mono font-bold text-red-400">{claim.fraudProbability}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">Risk Level</p>
                  <div className="flex justify-center mt-1"><RiskBadge level={claim.riskLevel} /></div>
                </div>
              </div>
            </div>
          </GlassPanel>

          {claim.aiAnalysis && (
            <>
              <AIInsightCard analysis={claim.aiAnalysis} />
              <GlassPanel>
                <RiskFactorsList factors={claim.aiAnalysis.factors} />
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-[10px] text-gray-600">
                  <Clock size={11} />
                  <span>Processing: {claim.aiAnalysis.processingTimeMs}ms</span>
                  <span className="ml-auto flex items-center gap-1"><ShieldCheck size={11} />{claim.aiAnalysis.modelVersion}</span>
                </div>
              </GlassPanel>

              {/* AI Override */}
              <GlassPanel className="border-amber-500/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <RotateCcw size={14} className="text-amber-400" />
                    <p className="text-xs font-bold text-gray-400">Override AI Decision</p>
                  </div>
                  {!showOverride && !overrideSubmitted && (
                    <button onClick={() => setShowOverride(true)} className="text-[10px] text-amber-400 font-bold hover:underline">Disagree?</button>
                  )}
                </div>
                {overrideSubmitted ? (
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/5 rounded-lg px-3 py-2.5 border border-emerald-500/10">
                    <MessageSquare size={13} />
                    <p className="text-xs font-medium">Override submitted. Team has been notified.</p>
                  </div>
                ) : showOverride ? (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">Explain why you disagree with the AI assessment.</p>
                    <textarea
                      rows={3}
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="e.g. After speaking with the claimant and reviewing receipts, the flag appears to be a formatting issue..."
                      className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-amber-400/40 resize-none transition-all"
                      aria-label="Override reason"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setShowOverride(false); setOverrideReason(''); }} className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5">Cancel</button>
                      <button
                        disabled={!overrideReason.trim()}
                        onClick={() => { setOverrideSubmitted(true); setShowOverride(false); success('Override submitted', 'Your review note has been logged.'); }}
                        className="text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        Submit Override
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">If you believe the AI assessment is incorrect, you can submit an override.</p>
                )}
              </GlassPanel>
            </>
          )}
        </div>
      </div>

      {/* Document Viewer */}
      <DocumentViewer document={viewingDoc} onClose={() => setViewingDoc(null)} />
    </div>
  );
};
