import { useState } from 'react';
import { PhoneCall, X, AlertTriangle, Car, Home, Heart, Shield, MapPin, Phone } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/context/ToastContext';

const EMERGENCY_OPTIONS = [
  {
    id: 'auto',
    label: 'Roadside Assistance',
    icon: Car,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    phone: '1-800-555-AUTO',
    eta: '20–30 min',
  },
  {
    id: 'medical',
    label: 'Medical Emergency',
    icon: Heart,
    color: 'text-red-400 bg-red-500/10 border-red-500/20',
    phone: '911',
    eta: 'Immediate',
  },
  {
    id: 'home',
    label: 'Home Emergency',
    icon: Home,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    phone: '1-800-555-HOME',
    eta: '45–60 min',
  },
  {
    id: 'claim',
    label: 'File Emergency Claim',
    icon: Shield,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    phone: '1-800-555-CLAIM',
    eta: '24/7 support',
  },
];

export const EmergencySOS = () => {
  const { success } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [calledOption, setCalledOption] = useState<string | null>(null);
  const [locationShared, setLocationShared] = useState(false);

  const handleCall = (option: typeof EMERGENCY_OPTIONS[0]) => {
    setCalledOption(option.id);
    success(
      `Connecting to ${option.label}`,
      `Dialing ${option.phone}… ETA: ${option.eta}`
    );
    setTimeout(() => setCalledOption(null), 3000);
  };

  const handleShareLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationShared(true);
          success('Location shared', 'Emergency responders now have your GPS coordinates.');
        },
        () => {
          success('Location shared (mock)', 'GPS coordinates sent to emergency services.');
          setLocationShared(true);
        }
      );
    } else {
      setLocationShared(true);
      success('Location shared', 'Your location has been sent to emergency services.');
    }
  };

  return (
    <>
      {/* SOS Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 z-50 w-72 sm:w-80 rounded-2xl border border-red-500/30 bg-[#0F1629] shadow-2xl shadow-black/60 overflow-hidden animate-scale-in"
          role="dialog"
          aria-label="Emergency Assistance"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-red-500/10 border-b border-red-500/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-400 animate-pulse" size={18} />
              <div>
                <p className="text-xs font-bold text-red-300">Emergency Assistance</p>
                <p className="text-[10px] text-red-500/70">Select the type of emergency</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close emergency panel"
            >
              <X size={14} />
            </button>
          </div>

          {/* Options */}
          <div className="p-3 space-y-2">
            {EMERGENCY_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isCalling = calledOption === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleCall(opt)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99]',
                    opt.color
                  )}
                >
                  <div className="shrink-0">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold">{opt.label}</p>
                    <p className="text-[10px] opacity-70 flex items-center gap-1 mt-0.5">
                      <Phone size={9} /> {opt.phone}
                      <span className="mx-1">·</span>
                      {opt.eta}
                    </p>
                  </div>
                  {isCalling && (
                    <span className="text-[10px] font-bold animate-pulse">Calling…</span>
                  )}
                </button>
              );
            })}

            {/* Share Location */}
            <button
              onClick={handleShareLocation}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all mt-1',
                locationShared
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-gray-400 bg-white/[0.02] border-white/[0.06] hover:border-white/20'
              )}
            >
              <MapPin size={18} className={locationShared ? 'text-emerald-400' : ''} />
              <div>
                <p className="text-xs font-bold">{locationShared ? 'Location Shared ✓' : 'Share My Location'}</p>
                <p className="text-[10px] opacity-60">GPS coordinates sent to responders</p>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/[0.04] text-center">
            <p className="text-[10px] text-gray-600">
              For life-threatening emergencies, always call <strong className="text-red-400">911</strong> first.
            </p>
          </div>
        </div>
      )}

      {/* SOS Button */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        className={cn(
          'fixed bottom-4 right-20 z-50 flex items-center gap-2 px-3 h-12 rounded-full font-bold text-xs shadow-lg transition-all duration-200 hover:scale-105 active:scale-95',
          isOpen
            ? 'bg-red-600 text-white shadow-red-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
        )}
        aria-label={isOpen ? 'Close emergency panel' : 'Open emergency SOS'}
      >
        <PhoneCall size={16} className={isOpen ? '' : 'animate-pulse'} />
        <span>SOS</span>
      </button>
    </>
  );
};
