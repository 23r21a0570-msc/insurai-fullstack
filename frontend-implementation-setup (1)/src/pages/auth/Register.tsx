import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, UserPlus, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

type RegisterRole = 'customer' | 'admin';

const ROLE_OPTIONS: { value: RegisterRole; label: string; desc: string; icon: typeof User }[] = [
  { value: 'customer', label: 'Customer', desc: 'Policyholder account', icon: User },
  { value: 'admin',    label: 'Admin',    desc: 'Staff / team member', icon: Shield },
];

const DEPT_OPTIONS = [
  { label: 'Claims',          value: 'claims' },
  { label: 'Risk Analysis',   value: 'risk' },
  { label: 'Fraud Detection', value: 'fraud' },
  { label: 'Operations',      value: 'operations' },
];

const STAFF_ROLE_OPTIONS = [
  { label: 'Claims Agent',   value: 'agent' },
  { label: 'Risk Analyst',   value: 'analyst' },
  { label: 'Claims Manager', value: 'manager' },
];

export const Register = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<RegisterRole>('customer');

  const [form, setForm] = useState({
    name: '',
    email: '',
    department: 'claims',
    staffRole: 'agent',
    password: '',
    confirm: '',
    // Customer-specific
    policyNumber: '',
    phone: '',
  });

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const passwordMismatch = form.confirm.length > 0 && form.password !== form.confirm;
  const canSubmit =
    form.name && form.email && form.password && form.confirm && !passwordMismatch &&
    (accountType === 'admin' ? true : true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    if (accountType === 'customer') {
      success('Account created', 'Welcome to INSURAI! You can now sign in.');
    } else {
      success('Request submitted', 'Your staff account request has been sent for approval.');
    }
    navigate('/login');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/15">
            <ShieldCheck size={22} className="text-[#10B981]" />
          </div>
          <span className="text-xl font-bold text-white">
            INSUR<span className="text-[#10B981]">AI</span>
          </span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0F1629] p-8 shadow-2xl shadow-black/40">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-sm text-gray-500 mt-1">Join the INSURAI platform.</p>
          </div>

          {/* Account type selector */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {ROLE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = accountType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAccountType(opt.value)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-xl border p-3 transition-all duration-200',
                    isSelected
                      ? 'border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981]'
                      : 'border-white/[0.06] bg-white/[0.02] text-gray-500 hover:border-white/[0.12] hover:text-gray-300'
                  )}
                  aria-pressed={isSelected}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span className="text-xs font-bold">{opt.label}</span>
                  <span className={cn('text-[10px]', isSelected ? 'text-[#10B981]/70' : 'text-gray-600')}>
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Jane Smith"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              required
            />

            {/* Customer-specific fields */}
            {accountType === 'customer' && (
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            )}

            {/* Admin-specific fields */}
            {accountType === 'admin' && (
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Role"
                  options={STAFF_ROLE_OPTIONS}
                  value={form.staffRole}
                  onChange={(e) => set('staffRole', e.target.value)}
                />
                <Select
                  label="Department"
                  options={DEPT_OPTIONS}
                  value={form.department}
                  onChange={(e) => set('department', e.target.value)}
                />
              </div>
            )}

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              required
              autoComplete="new-password"
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={(e) => set('confirm', e.target.value)}
              error={passwordMismatch ? 'Passwords do not match' : undefined}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={!canSubmit}
              leftIcon={<UserPlus size={15} />}
            >
              {accountType === 'customer' ? 'Create Account' : 'Request Access'}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
            <ArrowLeft size={14} />
            <Link to="/login" className="text-[#10B981] hover:underline font-medium">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
