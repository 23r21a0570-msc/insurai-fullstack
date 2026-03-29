import { useState } from 'react';
import {
  LayoutDashboard, Clock, Users, FileText, MessageSquare,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { SLATracker } from '@/components/claims/SLATracker';
import { AdjusterWorkload } from '@/components/claims/AdjusterWorkload';
import { ClaimTemplates } from '@/components/claims/ClaimTemplates';
import { InternalMessaging } from '@/components/claims/InternalMessaging';

type TabId = 'sla' | 'workload' | 'templates' | 'messaging';

const TABS: { id: TabId; label: string; icon: React.ElementType; badge?: number }[] = [
  { id: 'sla', label: 'SLA Tracker', icon: Clock },
  { id: 'workload', label: 'Adjuster Workload', icon: Users },
  { id: 'templates', label: 'Claim Templates', icon: FileText },
  { id: 'messaging', label: 'Internal Messages', icon: MessageSquare, badge: 2 },
];

export const AdminClaimsHub = () => {
  const [tab, setTab] = useState<TabId>('sla');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <LayoutDashboard size={22} className="text-[#10B981]" /> Claims Operations Hub
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          SLA monitoring, adjuster workload balancing, claim templates, and internal team messaging.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/[0.06] pb-0 flex-wrap">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all -mb-px relative',
                tab === t.id
                  ? 'border-[#10B981] text-[#10B981]'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              )}
            >
              <Icon size={14} />
              {t.label}
              {t.badge && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#10B981] text-[8px] font-bold text-white">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {tab === 'sla' && <SLATracker />}
        {tab === 'workload' && <AdjusterWorkload />}
        {tab === 'templates' && <ClaimTemplates />}
        {tab === 'messaging' && <InternalMessaging />}
      </div>
    </div>
  );
};
