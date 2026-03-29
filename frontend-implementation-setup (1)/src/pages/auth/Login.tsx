import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, User, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SocialLogin } from '@/components/ui/SocialLogin';
import { cn } from '@/utils/cn';

type LoginRole = 'customer' | 'admin';

const ROLE_OPTIONS: { value: LoginRole; label: string; desc: string; icon: typeof User; color: string }[] = [
  {
    value: 'customer',
    label: 'Customer',
    desc: 'View policies, claims & payments',
    icon: User,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  },
  {
    value: 'admin',
    label: 'Admin',
    desc: 'Manage claims, fraud & team',
    icon: Shield,
    color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30',
  },
];

const DEMO: Record<LoginRole, { email: string; password: string }> = {
  customer: { email: 'customer@insurai.com', password: 'password' },
  admin:    { email: 'admin@insurai.com',    password: 'password' },
};

export const Login = () => {
  const [role, setRole]         = useState<LoginRole>('customer');
  const [email, setEmail]       = useState(DEMO.customer.email);
  const [password, setPassword] = useState(DEMO.customer.password);
  const [error, setError]       = useState('');
  const { login, isLoading }    = useAuth();
  const navigate                = useNavigate();

  // When role changes, auto-fill demo credentials
  const handleRoleChange = (r: LoginRole) => {
    setRole(r);
    setEmail(DEMO[r].email);
    setPassword(DEMO[r].password);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password, role);
      if (role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/customer/dashboard', { replace: true });
      }
    } catch {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center p-6">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#10B981]/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/15">
            <ShieldCheck size={22} className="text-[#10B981]" />
          </div>
          <span className="text-2xl font-bold text-white">
            INSUR<span className="text-[#10B981]">AI</span>
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0F1629] p-8">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-white">Welcome back</h2>
            <p className="mt-1 text-sm text-gray-500">Choose your role to sign in</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {ROLE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = role === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleRoleChange(opt.value)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-xl border p-3 text-left transition-all duration-200',
                    isSelected
                      ? opt.color
                      : 'border-white/[0.06] bg-white/[0.02] text-gray-500 hover:border-white/[0.12] hover:text-gray-300'
                  )}
                  aria-pressed={isSelected}
                  aria-label={`Sign in as ${opt.label}`}
                >
                  <Icon
                    size={18}
                    className={isSelected ? '' : 'text-gray-600'}
                    aria-hidden="true"
                  />
                  <span className="text-xs font-bold">{opt.label}</span>
                  <span className={cn('text-[10px] text-center leading-tight', isSelected ? 'opacity-80' : 'text-gray-600')}>
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>

          <SocialLogin mode="signin" className="mb-6" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@insurai.com"
              leftIcon={<Mail size={14} />}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock size={14} />}
              required
              autoComplete="current-password"
            />

            {error && (
              <div
                className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5"
                role="alert"
              >
                <AlertCircle size={14} className="text-red-400 shrink-0" aria-hidden="true" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-[#10B981] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
              rightIcon={<ArrowRight size={16} />}
            >
              {isLoading ? 'Signing in…' : `Sign in as ${role === 'admin' ? 'Admin' : 'Customer'}`}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 rounded-xl border border-[#10B981]/15 bg-[#10B981]/[0.04] p-3.5">
            <p className="text-[11px] font-semibold text-[#10B981] mb-1.5">Demo — {role === 'admin' ? 'Admin' : 'Customer'}</p>
            <p className="text-[11px] text-gray-500">
              <span className="text-gray-400">Email:</span>{' '}
              {DEMO[role].email}
            </p>
            <p className="text-[11px] text-gray-500">
              <span className="text-gray-400">Password:</span>{' '}
              {DEMO[role].password}
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-gray-600">
            No account?{' '}
            <Link to="/register" className="text-[#10B981] hover:underline font-medium">
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
