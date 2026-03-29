import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
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
          {sent ? (
            /* Success state */
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981]/15">
                  <CheckCircle size={28} className="text-[#10B981]" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Check your inbox</h2>
                <p className="text-sm text-gray-500 mt-2">
                  If an account exists for <span className="text-gray-300 font-medium">{email}</span>,
                  you'll receive a password reset link shortly.
                </p>
              </div>
              <div className="pt-2">
                <Link to="/login">
                  <Button variant="secondary" className="w-full" leftIcon={<ArrowLeft size={14} />}>
                    Back to Sign In
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-gray-700">
                Didn't receive it?{' '}
                <button
                  onClick={() => setSent(false)}
                  className="text-[#10B981] hover:underline font-medium"
                >
                  Try again
                </button>
              </p>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="mb-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] mb-4">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold text-white">Reset Password</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={!email}
                  leftIcon={<Mail size={14} />}
                >
                  Send Reset Link
                </Button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
                <ArrowLeft size={14} />
                <Link to="/login" className="text-[#10B981] hover:underline font-medium">
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
