import { useState } from 'react';
import { Wrench, MapPin, Phone, Clock, CheckCircle, Truck, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RepairStep {
  id: string;
  label: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  completedAt?: string;
  eta?: string;
}

const MOCK_REPAIR_DATA = {
  shopName: 'AutoFix Pro - Downtown',
  address: '1234 Main St, San Francisco, CA 94102',
  phone: '+1 (415) 555-0123',
  technicianName: 'Roberto Martinez',
  estimatedCompletion: '2025-02-15',
  vehicleIn: '2025-02-10',
  progress: 60,
  steps: [
    { id: '1', label: 'Vehicle Received', description: 'Shop received and assessed vehicle', status: 'completed', completedAt: 'Feb 10, 2025' },
    { id: '2', label: 'Parts Ordered', description: 'Replacement parts sourced from supplier', status: 'completed', completedAt: 'Feb 11, 2025' },
    { id: '3', label: 'Disassembly', description: 'Damaged components removed', status: 'completed', completedAt: 'Feb 12, 2025' },
    { id: '4', label: 'Body Work', description: 'Panel repair and painting in progress', status: 'in_progress', eta: 'Est. Feb 14' },
    { id: '5', label: 'Reassembly', description: 'Install repaired and new components', status: 'pending', eta: 'Est. Feb 15' },
    { id: '6', label: 'Quality Check', description: 'Final inspection and test drive', status: 'pending', eta: 'Est. Feb 15' },
    { id: '7', label: 'Ready for Pickup', description: 'Vehicle cleaned and ready', status: 'pending', eta: 'Est. Feb 15' },
  ] as RepairStep[],
};

const stepColors = {
  completed:   { dot: 'bg-emerald-400', line: 'bg-emerald-400/30', label: 'text-gray-200', icon: CheckCircle, iconColor: 'text-emerald-400' },
  in_progress: { dot: 'bg-blue-400 animate-pulse', line: 'bg-white/[0.06]', label: 'text-white', icon: Wrench, iconColor: 'text-blue-400' },
  pending:     { dot: 'bg-gray-700', line: 'bg-white/[0.06]', label: 'text-gray-600', icon: Clock, iconColor: 'text-gray-700' },
};

export const RepairTracker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const data = MOCK_REPAIR_DATA;

  return (
    <div className="space-y-0">
      {isOpen && (
        <div className="rounded-xl border border-white/[0.08] bg-[#0F1629] overflow-hidden mb-3">
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-gray-200">{data.shopName}</p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                  <MapPin size={11} /> {data.address}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                  <Phone size={11} /> {data.phone}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-gray-600 uppercase tracking-wider">Est. Completion</p>
                <p className="text-sm font-bold text-[#10B981]">Feb 15, 2025</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Repair Progress</span>
                <span className="font-bold text-[#10B981]">{data.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-emerald-400 transition-all duration-700"
                  style={{ width: `${data.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Technician */}
          <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.01] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
              RM
            </div>
            <div>
              <p className="text-xs font-bold text-gray-300">{data.technicianName}</p>
              <p className="text-[10px] text-gray-600">Lead Technician</p>
            </div>
            <button className="ml-auto flex items-center gap-1 text-xs text-[#10B981] hover:underline">
              <Phone size={11} /> Contact
            </button>
          </div>

          {/* Steps */}
          <div className="p-5">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Repair Timeline</p>
            <div className="space-y-0">
              {data.steps.map((step, idx) => {
                const cfg = stepColors[step.status];
                const Icon = cfg.icon;
                const isLast = idx === data.steps.length - 1;
                return (
                  <div key={step.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5', step.status === 'completed' ? 'bg-emerald-500/20' : step.status === 'in_progress' ? 'bg-blue-500/20' : 'bg-white/[0.04]')}>
                        <Icon size={11} className={cfg.iconColor} />
                      </div>
                      {!isLast && <div className={cn('w-px flex-1 my-1', cfg.line)} style={{ minHeight: 20 }} />}
                    </div>
                    <div className={cn('pb-4 flex-1', isLast && 'pb-0')}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={cn('text-sm font-semibold', cfg.label)}>{step.label}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{step.description}</p>
                        </div>
                        <span className={cn('text-[10px] shrink-0 font-mono', step.status === 'completed' ? 'text-emerald-400' : 'text-gray-600')}>
                          {step.completedAt || step.eta || ''}
                        </span>
                      </div>
                      {step.status === 'in_progress' && (
                        <div className="mt-2 h-1 w-24 rounded-full bg-white/[0.06] overflow-hidden">
                          <div className="h-full rounded-full bg-blue-400 w-2/3 animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pickup info */}
            <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-[#10B981]/[0.05] border border-[#10B981]/15">
              <Truck size={16} className="text-[#10B981]" />
              <div>
                <p className="text-xs font-bold text-[#10B981]">Pickup Ready Estimate: Feb 15</p>
                <p className="text-[10px] text-gray-500">You'll be notified via SMS & email when ready</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all group"
      >
        <div className="flex items-center gap-2">
          <Wrench size={16} className="text-gray-400 group-hover:text-white transition-colors" />
          <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Track Repair Progress</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/20 font-bold">In Progress</span>
        </div>
        <ChevronDown size={14} className={cn('text-gray-600 transition-transform', isOpen && 'rotate-180')} />
      </button>
    </div>
  );
};
