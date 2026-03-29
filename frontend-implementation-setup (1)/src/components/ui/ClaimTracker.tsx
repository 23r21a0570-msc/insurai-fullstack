import { CheckCircle2, Clock, FileText, UserCheck, CreditCard, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatters';

export type TrackingStatus = 'submitted' | 'under_review' | 'pending_info' | 'approved' | 'rejected' | 'escalated';

interface TrackingStep {
  id: string;
  label: string;
  description: string;
  icon: typeof Clock;
  status: 'completed' | 'current' | 'upcoming' | 'skipped';
  date?: string;
  eta?: string;
}

interface ClaimTrackerProps {
  claimNumber: string;
  currentStatus: TrackingStatus;
  submittedAt: string;
  updatedAt: string;
  compact?: boolean;
}

const buildSteps = (currentStatus: TrackingStatus, submittedAt: string, updatedAt: string): TrackingStep[] => {
  const isRejected = currentStatus === 'rejected';
  const isEscalated = currentStatus === 'escalated';

  const statusOrder: TrackingStatus[] = ['submitted', 'under_review', 'pending_info', 'approved'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  const steps: TrackingStep[] = [
    {
      id: 'submitted',
      label: 'Claim Filed',
      description: 'Your claim has been received and logged.',
      icon: FileText,
      status: 'completed',
      date: submittedAt,
    },
    {
      id: 'under_review',
      label: 'Under Review',
      description: 'Our team is reviewing your claim and documents.',
      icon: Clock,
      status: currentStatus === 'under_review' ? 'current'
        : currentIndex > 1 && !isRejected ? 'completed'
        : isRejected || isEscalated ? 'skipped' : 'upcoming',
      date: currentStatus === 'under_review' ? updatedAt : undefined,
      eta: currentStatus === 'under_review' ? '2–3 business days' : undefined,
    },
    {
      id: 'pending_info',
      label: 'Information Requested',
      description: 'Additional documents or details may be needed.',
      icon: AlertCircle,
      status: currentStatus === 'pending_info' ? 'current'
        : currentIndex > 2 && !isRejected ? 'completed'
        : isRejected ? 'skipped' : 'upcoming',
      date: currentStatus === 'pending_info' ? updatedAt : undefined,
      eta: currentStatus === 'pending_info' ? 'Awaiting your response' : undefined,
    },
    {
      id: 'adjuster',
      label: 'Adjuster Assigned',
      description: 'A claims adjuster will verify and assess the claim.',
      icon: UserCheck,
      status: isRejected ? 'skipped'
        : currentStatus === 'approved' ? 'completed' : 'upcoming',
      eta: 'Within 1–2 days after review',
    },
    {
      id: 'approved',
      label: isRejected ? 'Claim Rejected' : 'Claim Approved',
      description: isRejected
        ? 'Your claim was not approved. Contact support to understand why.'
        : 'Your claim has been approved and payment is being processed.',
      icon: isRejected ? AlertCircle : CheckCircle2,
      status: isRejected ? 'current'
        : currentStatus === 'approved' ? 'current' : 'upcoming',
      date: (isRejected || currentStatus === 'approved') ? updatedAt : undefined,
    },
    {
      id: 'payment',
      label: 'Payment Processed',
      description: 'Funds will be deposited within 3–5 business days.',
      icon: CreditCard,
      status: currentStatus === 'approved' ? 'upcoming' : isRejected ? 'skipped' : 'upcoming',
      eta: currentStatus === 'approved' ? '3–5 business days' : undefined,
    },
  ];

  return steps;
};

const stepColors = {
  completed: {
    icon: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
    line: 'bg-[#10B981]',
    label: 'text-gray-200',
  },
  current: {
    icon: 'bg-blue-500/20 text-blue-400 border-blue-500/40 animate-pulse',
    line: 'bg-white/10',
    label: 'text-white font-semibold',
  },
  upcoming: {
    icon: 'bg-white/[0.03] text-gray-600 border-white/[0.08]',
    line: 'bg-white/10',
    label: 'text-gray-600',
  },
  skipped: {
    icon: 'bg-red-500/10 text-red-500/50 border-red-500/20',
    line: 'bg-white/5',
    label: 'text-gray-600 line-through',
  },
};

export const ClaimTracker = ({ claimNumber, currentStatus, submittedAt, updatedAt, compact = false }: ClaimTrackerProps) => {
  const steps = buildSteps(currentStatus, submittedAt, updatedAt);
  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const totalVisible = steps.filter((s) => s.status !== 'skipped').length;
  const progressPct = Math.round((completedCount / (totalVisible - 1)) * 100);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Claim Progress</p>
          <p className="text-sm font-mono text-[#10B981] font-bold mt-0.5">{claimNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{completedCount} of {totalVisible} steps</p>
          <div className="mt-1 h-1.5 w-24 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#10B981] transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="relative space-y-0">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const colors = stepColors[step.status];
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.id} className="relative flex gap-3">
              {/* Line connector */}
              {!isLast && (
                <div className={cn('absolute left-[13px] top-7 bottom-0 w-0.5 z-0', colors.line)} style={{ height: compact ? '32px' : '48px' }} />
              )}

              {/* Icon */}
              <div className={cn('relative z-10 w-7 h-7 rounded-full border flex items-center justify-center shrink-0 mt-1', colors.icon)}>
                <Icon size={12} />
              </div>

              {/* Content */}
              <div className={cn('pb-6 flex-1', isLast && 'pb-0')}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={cn('text-xs', colors.label)}>{step.label}</p>
                    {!compact && (
                      <p className="text-[10px] text-gray-600 mt-0.5 leading-relaxed">{step.description}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {step.date && (
                      <p className="text-[10px] text-gray-500 font-mono">{formatDate(step.date, 'MMM d')}</p>
                    )}
                    {step.eta && step.status !== 'completed' && (
                      <p className="text-[10px] text-blue-400/70">Est: {step.eta}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
