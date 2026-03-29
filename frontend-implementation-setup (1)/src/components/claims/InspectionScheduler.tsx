import { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/context/ToastContext';
import { formatDate } from '@/utils/formatters';

interface TimeSlot {
  time: string;
  available: boolean;
}

const TIME_SLOTS: TimeSlot[] = [
  { time: '9:00 AM', available: true },
  { time: '10:00 AM', available: false },
  { time: '11:00 AM', available: true },
  { time: '12:00 PM', available: true },
  { time: '1:00 PM', available: false },
  { time: '2:00 PM', available: true },
  { time: '3:00 PM', available: true },
  { time: '4:00 PM', available: false },
];

const INSPECTION_TYPES = [
  { id: 'in_person', label: 'In-Person', desc: 'Adjuster visits location', icon: '🏠' },
  { id: 'virtual', label: 'Virtual / Video', desc: 'Video call inspection', icon: '📱' },
  { id: 'drop_off', label: 'Drop-Off', desc: 'Bring vehicle to shop', icon: '🚗' },
];

export const InspectionScheduler = ({ claimNumber }: { claimNumber: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'type' | 'date' | 'time' | 'confirm' | 'booked'>('type');
  const [selectedType, setSelectedType] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [location, setLocation] = useState('');
  const { success } = useToast();

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const today = new Date();

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date < today || date.getDay() === 0 || date.getDay() === 6; // No weekends or past
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear();
  };

  const handleConfirm = () => {
    setStep('booked');
    success('Inspection Scheduled', `Confirmed for ${formatDate(selectedDate!)} at ${selectedTime}`);
  };

  return (
    <div className="space-y-0">
      {isOpen && (
        <div className="rounded-xl border border-white/[0.08] bg-[#0F1629] overflow-hidden mb-3">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-[#10B981]" />
              <p className="text-sm font-bold text-gray-200">Schedule Inspection</p>
            </div>
            <p className="text-[10px] text-gray-600 font-mono">{claimNumber}</p>
          </div>

          <div className="p-5">
            {/* Step: Type */}
            {step === 'type' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 mb-4">Select inspection method</p>
                {INSPECTION_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => { setSelectedType(type.id); setStep('date'); }}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all',
                      selectedType === type.id
                        ? 'border-[#10B981]/30 bg-[#10B981]/[0.06]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                    )}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-200">{type.label}</p>
                      <p className="text-xs text-gray-500">{type.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step: Date */}
            {step === 'date' && (
              <div className="space-y-4">
                {/* Month nav */}
                <div className="flex items-center justify-between">
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-gray-400">
                    <ChevronLeft size={16} />
                  </button>
                  <p className="text-sm font-bold text-gray-200">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-gray-400">
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Day labels */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <p key={d} className="text-[10px] font-bold text-gray-600 py-1">{d}</p>
                  ))}
                  {/* Empty cells */}
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                  {/* Days */}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                    const disabled = isDateDisabled(day);
                    const selected = isDateSelected(day);
                    return (
                      <button
                        key={day}
                        disabled={disabled}
                        onClick={() => { setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)); setStep('time'); }}
                        className={cn(
                          'py-2 rounded-lg text-xs font-medium transition-all',
                          disabled && 'text-gray-700 cursor-not-allowed',
                          !disabled && !selected && 'text-gray-300 hover:bg-white/[0.06]',
                          selected && 'bg-[#10B981] text-white font-bold'
                        )}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setStep('type')} className="text-xs text-gray-500 hover:text-gray-300">← Back</button>
              </div>
            )}

            {/* Step: Time */}
            {step === 'time' && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Selected date</p>
                  <p className="text-sm font-bold text-gray-200">{selectedDate ? formatDate(selectedDate) : ''}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => { setSelectedTime(slot.time); setStep('confirm'); }}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-all',
                        !slot.available && 'border-white/[0.04] text-gray-700 cursor-not-allowed line-through',
                        slot.available && selectedTime !== slot.time && 'border-white/[0.08] text-gray-300 hover:border-white/[0.15]',
                        slot.available && selectedTime === slot.time && 'border-[#10B981]/30 bg-[#10B981]/[0.08] text-[#10B981]'
                      )}
                    >
                      <Clock size={12} />
                      {slot.time}
                      {!slot.available && <span className="ml-auto text-[9px] text-gray-700">Taken</span>}
                    </button>
                  ))}
                </div>
                {selectedType === 'in_person' && (
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Inspection Location</label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter address..."
                      className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40"
                    />
                  </div>
                )}
                <button onClick={() => setStep('date')} className="text-xs text-gray-500 hover:text-gray-300">← Back</button>
              </div>
            )}

            {/* Step: Confirm */}
            {step === 'confirm' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Confirm Booking</p>
                <div className="space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
                  {[
                    { label: 'Type', value: INSPECTION_TYPES.find(t => t.id === selectedType)?.label },
                    { label: 'Date', value: selectedDate ? formatDate(selectedDate) : '' },
                    { label: 'Time', value: selectedTime },
                    ...(location ? [{ label: 'Location', value: location }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-3">
                      <span className="text-xs text-gray-600">{label}</span>
                      <span className="text-xs font-bold text-gray-200">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep('time')} className="px-4 py-2.5 rounded-xl text-xs text-gray-500 border border-white/[0.06] hover:border-white/[0.12]">Back</button>
                  <button onClick={handleConfirm} className="flex-1 py-2.5 rounded-xl bg-[#10B981]/15 text-[#10B981] text-xs font-bold border border-[#10B981]/20 hover:bg-[#10B981]/25 transition-all">
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}

            {/* Step: Booked */}
            {step === 'booked' && (
              <div className="flex flex-col items-center py-6 gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-[#10B981]/15 flex items-center justify-center">
                  <CheckCircle size={28} className="text-[#10B981]" />
                </div>
                <div>
                  <p className="text-base font-bold text-white">Inspection Booked!</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {INSPECTION_TYPES.find(t => t.id === selectedType)?.label} · {selectedDate ? formatDate(selectedDate) : ''} at {selectedTime}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/[0.03] px-4 py-2 rounded-lg border border-white/[0.06]">
                  <MapPin size={12} /> Confirmation sent to your email
                </div>
                <button onClick={() => { setIsOpen(false); setStep('type'); setSelectedType(''); setSelectedDate(null); setSelectedTime(''); }} className="text-xs text-gray-500 hover:text-gray-300 mt-2">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all group"
      >
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400 group-hover:text-white transition-colors" />
          <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Schedule Inspection</span>
        </div>
        {step === 'booked' && (
          <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <CheckCircle size={11} /> Booked
          </span>
        )}
      </button>
    </div>
  );
};
