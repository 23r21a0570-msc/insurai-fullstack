import { useState } from 'react';
import { Shield, Smartphone, Key, CheckCircle2, Copy, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { cn } from '@/utils/cn';
import { useToast } from '@/context/ToastContext';

type MFAMethod = 'sms' | 'authenticator';
type MFAStep = 'choose' | 'setup' | 'verify' | 'complete';

interface MFASetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

// Fake TOTP secret for demo
const FAKE_SECRET = 'JBSWY3DPEHPK3PXP';
const FAKE_QR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/INSURAI:user@insurai.com?secret=${FAKE_SECRET}&issuer=INSURAI`;

const BACKUP_CODES = [
  '4821-9374', '2938-4721', '8374-1029',
  '5623-8910', '1047-3856', '7392-5041',
];

export const MFASetup = ({ onComplete, onCancel }: MFASetupProps) => {
  const { success, error } = useToast();
  const [method, setMethod]   = useState<MFAMethod>('authenticator');
  const [step, setStep]       = useState<MFAStep>('choose');
  const [phone, setPhone]     = useState('');
  const [code, setCode]       = useState('');
  const [isVerifying, setVerifying] = useState(false);
  const [copied, setCopied]   = useState(false);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(FAKE_SECRET).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleVerify = async () => {
    if (code.length < 6) { error('Invalid code', 'Please enter a 6-digit code.'); return; }
    setVerifying(true);
    await new Promise(r => setTimeout(r, 1200));
    setVerifying(false);
    setStep('complete');
    success('MFA enabled', 'Two-factor authentication is now active.');
  };

  // ── STEP: Choose method ──────────────────────────────────────────────────
  if (step === 'choose') {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#10B981]/15 mb-3">
            <Shield size={28} className="text-[#10B981]" />
          </div>
          <h3 className="text-lg font-bold text-white">Enable Two-Factor Authentication</h3>
          <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account.</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {([
            {
              id: 'authenticator' as MFAMethod,
              icon: Key,
              title: 'Authenticator App',
              desc: 'Use Google Authenticator, Authy, or similar app',
              recommended: true,
            },
            {
              id: 'sms' as MFAMethod,
              icon: Smartphone,
              title: 'SMS / Text Message',
              desc: 'Receive a 6-digit code via SMS each time you sign in',
              recommended: false,
            },
          ] as const).map(opt => {
            const Icon = opt.icon;
            const sel = method === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMethod(opt.id)}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200',
                  sel
                    ? 'border-[#10B981]/40 bg-[#10B981]/[0.06]'
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16]'
                )}
                aria-pressed={sel}
              >
                <div className={cn('p-2.5 rounded-xl', sel ? 'bg-[#10B981]/20' : 'bg-white/[0.04]')}>
                  <Icon size={20} className={sel ? 'text-[#10B981]' : 'text-gray-400'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{opt.title}</span>
                    {opt.recommended && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#10B981]/20 text-[#10B981]">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </div>
                <div className={cn(
                  'w-4 h-4 rounded-full border-2 transition-all',
                  sel ? 'border-[#10B981] bg-[#10B981]' : 'border-white/20'
                )} />
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button className="flex-1" rightIcon={<ArrowRight size={15} />} onClick={() => setStep('setup')}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // ── STEP: Setup ──────────────────────────────────────────────────────────
  if (step === 'setup') {
    return (
      <div className="space-y-5">
        {method === 'authenticator' ? (
          <>
            <div className="text-center">
              <h3 className="text-base font-bold text-white mb-1">Scan QR Code</h3>
              <p className="text-xs text-gray-500">Open your authenticator app and scan this code.</p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="p-3 bg-white rounded-2xl shadow-xl shadow-black/40">
                <img src={FAKE_QR} alt="QR code for authenticator app" width={180} height={180} className="rounded-lg" />
              </div>
            </div>

            {/* Manual entry */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Manual entry key</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-sm text-[#10B981] break-all">{FAKE_SECRET}</code>
                <button
                  type="button"
                  onClick={handleCopySecret}
                  className="p-2 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white transition-colors"
                  aria-label="Copy secret key"
                >
                  {copied ? <CheckCircle2 size={16} className="text-[#10B981]" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Supported apps: Google Authenticator, Authy, 1Password, Bitwarden
            </p>
          </>
        ) : (
          <>
            <div className="text-center">
              <h3 className="text-base font-bold text-white mb-1">Enter Your Phone Number</h3>
              <p className="text-xs text-gray-500">We'll send a verification code via SMS.</p>
            </div>
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              leftIcon={<Smartphone size={14} />}
            />
            <Button
              className="w-full"
              disabled={!phone}
              onClick={() => { success('Code sent', 'Check your phone for the verification code.'); setStep('verify'); }}
            >
              Send Verification Code
            </Button>
          </>
        )}

        {method === 'authenticator' && (
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setStep('choose')}>Back</Button>
            <Button className="flex-1" rightIcon={<ArrowRight size={15} />} onClick={() => setStep('verify')}>
              I've added the account
            </Button>
          </div>
        )}
      </div>
    );
  }

  // ── STEP: Verify ─────────────────────────────────────────────────────────
  if (step === 'verify') {
    return (
      <div className="space-y-5">
        <div className="text-center">
          <h3 className="text-base font-bold text-white mb-1">Enter Verification Code</h3>
          <p className="text-xs text-gray-500">
            {method === 'authenticator'
              ? 'Enter the 6-digit code from your authenticator app.'
              : `Enter the code sent to ${phone}.`}
          </p>
        </div>

        {/* OTP input */}
        <div className="flex justify-center">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-48 text-center text-3xl font-mono font-bold tracking-[0.5em] bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981]/50 transition-all"
            aria-label="Verification code"
          />
        </div>

        {method === 'sms' && (
          <p className="text-center">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs text-[#10B981] hover:underline"
              onClick={() => success('Code resent', 'A new code has been sent to your phone.')}
            >
              <RefreshCw size={11} /> Resend code
            </button>
          </p>
        )}

        {/* Backup codes preview */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
          <p className="text-xs font-bold text-amber-400 mb-2">⚠ Save your backup codes</p>
          <div className="grid grid-cols-3 gap-2">
            {BACKUP_CODES.map(c => (
              <code key={c} className="text-[11px] font-mono text-gray-400 text-center bg-white/[0.03] rounded px-2 py-1">
                {c}
              </code>
            ))}
          </div>
          <p className="text-[10px] text-gray-600 mt-2">Store these somewhere safe — you'll need them if you lose access to your device.</p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setStep('setup')}>Back</Button>
          <Button className="flex-1" isLoading={isVerifying} onClick={handleVerify}>
            Verify & Enable
          </Button>
        </div>
      </div>
    );
  }

  // ── STEP: Complete ───────────────────────────────────────────────────────
  return (
    <div className="text-center space-y-5 py-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#10B981]/20">
        <CheckCircle2 size={40} className="text-[#10B981]" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">MFA Enabled!</h3>
        <p className="text-sm text-gray-500 mt-1">Your account is now protected with two-factor authentication.</p>
      </div>
      <Button className="w-full" onClick={onComplete}>Done</Button>
    </div>
  );
};
