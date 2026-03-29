import { useState } from 'react';
import { User, Plus, Trash2, Edit3, Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/context/ToastContext';
import { getInitials } from '@/utils/formatters';

interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  percentage: number;
  email: string;
  phone: string;
  isPrimary: boolean;
}

const relationships = ['Spouse', 'Child', 'Parent', 'Sibling', 'Domestic Partner', 'Other'];

const defaultBeneficiaries: Beneficiary[] = [
  { id: 'b1', name: 'Jane Maruthi', relationship: 'Spouse', percentage: 60, email: 'jane@email.com', phone: '+1 (555) 234-5678', isPrimary: true },
  { id: 'b2', name: 'Alex Maruthi', relationship: 'Child', percentage: 40, email: 'alex@email.com', phone: '+1 (555) 234-5679', isPrimary: false },
];

export const BeneficiaryManager = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(defaultBeneficiaries);
  const [editing, setEditing] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState<Partial<Beneficiary>>({
    name: '', relationship: 'Spouse', percentage: 0, email: '', phone: '', isPrimary: false,
  });
  const { success, error } = useToast();

  const totalPercentage = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);

  const removeBeneficiary = (id: string) => {
    setBeneficiaries(prev => prev.filter(b => b.id !== id));
    success('Removed', 'Beneficiary has been removed');
  };

  const updatePercentage = (id: string, val: number) => {
    setBeneficiaries(prev => prev.map(b => b.id === id ? { ...b, percentage: val } : b));
  };

  const addBeneficiary = () => {
    if (!newBeneficiary.name || !newBeneficiary.email) {
      error('Required fields', 'Please fill in name and email');
      return;
    }
    const remaining = 100 - totalPercentage;
    if (remaining <= 0) {
      error('100% allocated', 'Reduce existing allocations first');
      return;
    }
    setBeneficiaries(prev => [...prev, {
      id: `b_${Date.now()}`,
      name: newBeneficiary.name!,
      relationship: newBeneficiary.relationship || 'Other',
      percentage: Math.min(newBeneficiary.percentage || remaining, remaining),
      email: newBeneficiary.email!,
      phone: newBeneficiary.phone || '',
      isPrimary: beneficiaries.length === 0,
    }]);
    setNewBeneficiary({ name: '', relationship: 'Spouse', percentage: 0, email: '', phone: '', isPrimary: false });
    setShowAdd(false);
    success('Added', 'New beneficiary has been added');
  };

  const relationshipColors: Record<string, string> = {
    'Spouse': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'Child': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Parent': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Sibling': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Domestic Partner': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="text-emerald-400" size={20} />
            Beneficiary Management
          </h3>
          <p className="text-xs text-gray-500 mt-1">Who receives benefits in the event of a claim</p>
        </div>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all"
        >
          <Plus size={14} /> Add Beneficiary
        </button>
      </div>

      {/* Allocation bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Total Allocated</span>
          <span className={cn('font-bold', totalPercentage === 100 ? 'text-emerald-400' : totalPercentage > 100 ? 'text-red-400' : 'text-amber-400')}>
            {totalPercentage}% / 100%
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden flex">
          {beneficiaries.map((b, i) => (
            <div
              key={b.id}
              className={cn('h-full transition-all', i % 2 === 0 ? 'bg-emerald-500' : 'bg-blue-500')}
              style={{ width: `${b.percentage}%` }}
            />
          ))}
        </div>
        {totalPercentage !== 100 && (
          <p className="flex items-center gap-1.5 text-xs text-amber-400">
            <AlertCircle size={12} />
            {totalPercentage < 100 ? `${100 - totalPercentage}% unallocated` : 'Over-allocated — reduce percentages'}
          </p>
        )}
      </div>

      {/* Beneficiary list */}
      <div className="space-y-3">
        {beneficiaries.map(b => (
          <div key={b.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                  {getInitials(b.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">{b.name}</p>
                    {b.isPrimary && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase">
                        Primary
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded border text-[10px] font-semibold',
                    relationshipColors[b.relationship] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  )}>
                    {b.relationship}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing(editing === b.id ? null : b.id)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-gray-200 transition-colors"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => removeBeneficiary(b.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Percentage slider */}
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={b.percentage}
                onChange={e => updatePercentage(b.id, Number(e.target.value))}
                className="flex-1 accent-emerald-500 h-1 cursor-pointer"
              />
              <span className="text-sm font-bold text-white w-10 text-right">{b.percentage}%</span>
            </div>

            {editing === b.id && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.06] animate-fade-in">
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">Email</p>
                  <p className="text-xs text-gray-300">{b.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">Phone</p>
                  <p className="text-xs text-gray-300">{b.phone || '—'}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-3 animate-fade-in">
          <p className="text-sm font-bold text-white">Add New Beneficiary</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Jane Doe' },
              { label: 'Email *', key: 'email', type: 'email', placeholder: 'jane@email.com' },
              { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
              { label: 'Allocation %', key: 'percentage', type: 'number', placeholder: '50' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={(newBeneficiary as Record<string, string | number>)[field.key] || ''}
                  onChange={e => setNewBeneficiary(prev => ({ ...prev, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="mt-1 w-full h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            ))}
            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Relationship</label>
              <select
                value={newBeneficiary.relationship || 'Spouse'}
                onChange={e => setNewBeneficiary(prev => ({ ...prev, relationship: e.target.value }))}
                className="mt-1 w-full h-9 rounded-lg border border-white/10 bg-[#0F1629] px-3 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {relationships.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addBeneficiary} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors">
              <Check size={13} /> Add
            </button>
            <button onClick={() => setShowAdd(false)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold hover:bg-white/10 transition-colors">
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Save */}
      <button
        onClick={() => success('Saved', 'Beneficiary allocations have been updated')}
        disabled={totalPercentage !== 100}
        className="w-full h-10 rounded-lg bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {totalPercentage === 100 ? 'Save Beneficiaries' : `${totalPercentage}% allocated — must reach 100%`}
      </button>
    </div>
  );
};
