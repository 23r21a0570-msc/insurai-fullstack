import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowRight, UserCircle, Briefcase, Mail, Lock, RefreshCw } from 'lucide-react';
import { Button, Input } from '@/components/UI';
import { useAuth, useToast } from '@/lib/contexts';

type View = 'login' | 'register' | 'forgot';

export const Auth = ({ defaultView = 'login' }: { defaultView?: View }) => {
  const [view, setView] = useState<View>(defaultView);
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [showPass, setShowPass]       = useState(false);
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [name, setName]               = useState('');
  const [phone, setPhone]             = useState('');
  const [department, setDepartment]   = useState('');
  const [adminRole, setAdminRole]     = useState('manager');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent]   = useState(false);

  const { login, isLoading } = useAuth();
  const { success, error }   = useToast();
  const navigate = useNavigate();

  const fillDemo = () => {
    if (role === 'admin') { setEmail('admin@insurai.com'); setPassword('password'); }
    else                  { setEmail('customer@insurai.com'); setPassword('password'); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, role);
      success('Welcome back!', 'You are now signed in.');
      navigate(role === 'customer' ? '/customer/dashboard' : '/dashboard');
    } catch { error('Sign in failed', 'Please check your credentials.'); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email || 'new@insurai.com', password || 'password', role);
      success('Account created!', 'Welcome to INSURAI.');
      navigate(role === 'customer' ? '/customer/dashboard' : '/dashboard');
    } catch { error('Registration failed', 'Please try again.'); }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 1000));
    setForgotSent(true);
    success('Email sent', 'Check your inbox for reset instructions.');
  };

  return (
    <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Shield className="text-emerald-500" size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tight">INSUR<span className="text-emerald-500">AI</span></span>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">

          {/* ── LOGIN ── */}
          {view === 'login' && (
            <>
              <h2 className="text-2xl font-bold text-center mb-1">Sign In</h2>
              <p className="text-gray-500 text-sm text-center mb-6">Access your dashboard</p>

              {/* Role selector */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {(['customer', 'admin'] as const).map(r => (
                  <button key={r} onClick={() => setRole(r)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === r ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/20'}`}>
                    {r === 'customer' ? <UserCircle size={24} className={role === r ? 'text-emerald-400' : 'text-gray-500'} /> : <Briefcase size={24} className={role === r ? 'text-emerald-400' : 'text-gray-500'} />}
                    <span className={`text-sm font-semibold capitalize ${role === r ? 'text-emerald-400' : 'text-gray-400'}`}>{r === 'admin' ? 'Admin / Staff' : 'Customer'}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required leftIcon={<Mail size={14} />} />
                <div className="relative">
                  <Input label="Password" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required leftIcon={<Lock size={14} />} />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-300">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <button type="button" onClick={fillDemo} className="text-emerald-500 hover:underline flex items-center gap-1"><RefreshCw size={11} /> Fill demo credentials</button>
                  <button type="button" onClick={() => setView('forgot')} className="text-gray-500 hover:text-gray-300">Forgot password?</button>
                </div>
                <Button type="submit" className="w-full" isLoading={isLoading} rightIcon={<ArrowRight size={16} />}>
                  Sign In as {role === 'admin' ? 'Admin' : 'Customer'}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                No account?{' '}
                <button onClick={() => setView('register')} className="text-emerald-500 hover:underline font-medium">Create one</button>
              </p>
            </>
          )}

          {/* ── REGISTER ── */}
          {view === 'register' && (
            <>
              <h2 className="text-2xl font-bold text-center mb-1">Create Account</h2>
              <p className="text-gray-500 text-sm text-center mb-6">Join the INSURAI platform</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {(['customer', 'admin'] as const).map(r => (
                  <button key={r} onClick={() => setRole(r)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === r ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/20'}`}>
                    {r === 'customer' ? <UserCircle size={24} className={role === r ? 'text-emerald-400' : 'text-gray-500'} /> : <Briefcase size={24} className={role === r ? 'text-emerald-400' : 'text-gray-500'} />}
                    <span className={`text-sm font-semibold capitalize ${role === r ? 'text-emerald-400' : 'text-gray-400'}`}>{r === 'admin' ? 'Admin / Staff' : 'Customer'}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <Input label="Full Name" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
                <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required leftIcon={<Mail size={14} />} />
                {role === 'customer' ? (
                  <Input label="Phone" placeholder="+1 (555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Department" placeholder="e.g. Claims" value={department} onChange={e => setDepartment(e.target.value)} />
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</label>
                      <select value={adminRole} onChange={e => setAdminRole(e.target.value)} className="appearance-none flex h-10 w-full rounded-lg border border-white/10 bg-[#0F1629] px-3 text-sm text-gray-200 focus-visible:outline-none">
                        <option value="manager">Manager</option>
                        <option value="analyst">Analyst</option>
                        <option value="agent">Agent</option>
                      </select>
                    </div>
                  </div>
                )}
                <div className="relative">
                  <Input label="Password" type={showPass ? 'text' : 'password'} placeholder="8+ characters" value={password} onChange={e => setPassword(e.target.value)} required leftIcon={<Lock size={14} />} />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-9 text-gray-500">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
                <Button type="submit" className="w-full" isLoading={isLoading} rightIcon={<ArrowRight size={16} />}>
                  {role === 'admin' ? 'Request Access' : 'Create Account'}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{' '}
                <button onClick={() => setView('login')} className="text-emerald-500 hover:underline font-medium">Sign in</button>
              </p>
            </>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {view === 'forgot' && (
            <>
              <h2 className="text-2xl font-bold text-center mb-1">Reset Password</h2>
              <p className="text-gray-500 text-sm text-center mb-6">We'll send you a reset link</p>

              {forgotSent ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Mail className="text-emerald-400" size={24} />
                  </div>
                  <p className="text-gray-200 font-semibold mb-2">Check your inbox</p>
                  <p className="text-sm text-gray-500 mb-6">We sent instructions to <span className="text-emerald-400">{forgotEmail}</span></p>
                  <button onClick={() => { setView('login'); setForgotSent(false); }} className="text-emerald-500 hover:underline text-sm font-medium">Back to sign in</button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  <Input label="Email" type="email" placeholder="you@example.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required leftIcon={<Mail size={14} />} />
                  <Button type="submit" className="w-full" isLoading={isLoading}>Send Reset Link</Button>
                  <button type="button" onClick={() => setView('login')} className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors">← Back to sign in</button>
                </form>
              )}
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          By continuing you agree to our{' '}
          <Link to="#" className="text-gray-500 hover:underline">Terms</Link> and{' '}
          <Link to="#" className="text-gray-500 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};
