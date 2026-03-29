import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ChevronRight, LayoutDashboard, FileText, Shield, Zap, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/cn';

const STEPS = [
  {
    icon: LayoutDashboard,
    color: '#3B82F6',
    title: 'Your Dashboard',
    description:
      'The dashboard gives you a live overview of all claims activity. Monitor risk distribution, fraud alerts, and processing volumes at a glance.',
    tip: 'Use the stat cards at the top to quickly jump to filtered claim views.',
  },
  {
    icon: FileText,
    color: '#10B981',
    title: 'Managing Claims',
    description:
      'Browse all claims, filter by status or risk level, and click any row to open the full detail view with AI analysis.',
    tip: 'Use the "My Queue" view to work through claims assigned to you in priority order.',
  },
  {
    icon: Shield,
    color: '#EF4444',
    title: 'Fraud Detection',
    description:
      'The AI model automatically flags suspicious claims. Review active fraud alerts, investigate patterns, and resolve or dismiss them.',
    tip: 'Click an alert to jump directly to the claim\'s detail page.',
  },
  {
    icon: Zap,
    color: '#F59E0B',
    title: 'AI Insights & Overrides',
    description:
      'Every claim gets an AI risk score. The risk gauge, confidence level, and contributing factors help you make faster, better decisions.',
    tip: 'If you disagree with the AI, use the Override panel to log your reasoning.',
  },
];

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'insurai_onboarding_done';

export const hasCompletedOnboarding = () =>
  localStorage.getItem(STORAGE_KEY) === 'true';

export const markOnboardingDone = () =>
  localStorage.setItem(STORAGE_KEY, 'true');

export const OnboardingWizard = ({ isOpen, onClose }: OnboardingWizardProps) => {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      markOnboardingDone();
      onClose();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleSkip = () => {
    markOnboardingDone();
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[200]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <Dialog.Panel className="w-full max-w-md rounded-2xl border border-white/[0.10] bg-[#0F1629] shadow-2xl overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center justify-between px-6 pt-6 pb-0">
                <div className="flex items-center gap-1.5">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-300',
                        i === step ? 'w-6 bg-[#10B981]' : i < step ? 'w-3 bg-[#10B981]/40' : 'w-3 bg-white/[0.10]'
                      )}
                    />
                  ))}
                </div>
                <button
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/[0.06] transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 pt-8">
                {/* Icon */}
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl mb-5"
                  style={{ backgroundColor: `${current.color}18` }}
                >
                  <Icon size={28} style={{ color: current.color }} />
                </div>

                <Dialog.Title className="text-xl font-bold text-white mb-2">
                  {current.title}
                </Dialog.Title>
                <p className="text-sm text-gray-400 leading-relaxed mb-5">
                  {current.description}
                </p>

                {/* Tip box */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-start gap-3">
                  <CheckCircle size={14} className="text-[#10B981] shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <span className="font-bold text-gray-300">Tip: </span>
                    {current.tip}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 pb-6">
                <button
                  onClick={handleSkip}
                  className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  Skip tour
                </button>
                <Button
                  size="sm"
                  onClick={handleNext}
                  rightIcon={isLast ? <CheckCircle size={14} /> : <ChevronRight size={14} />}
                >
                  {isLast ? 'Get Started' : 'Next'}
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
