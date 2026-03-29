import { useState } from 'react';
import {
  CreditCard, Building2, Check, Lock, Plus, Smartphone,
  Bitcoin, ShoppingCart,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatters';

interface SavedCard {
  id: string; type: 'visa' | 'mastercard' | 'amex'; last4: string; expiry: string; isDefault?: boolean;
}

interface PaymentModalProps {
  amount: number; policyNumber: string; dueDate: string;
  onSuccess?: () => void; onCancel?: () => void;
}

const SAVED_CARDS: SavedCard[] = [
  { id: 'card_1', type: 'visa',       last4: '4242', expiry: '12/26', isDefault: true },
  { id: 'card_2', type: 'mastercard', last4: '5555', expiry: '08/25' },
];

const CARD_COLORS: Record<string, string> = { visa: 'text-blue-400', mastercard: 'text-red-400', amex: 'text-green-400' };
const CARD_LABELS: Record<string, string> = { visa: 'VISA', mastercard: 'MC', amex: 'AMEX' };

type Tab = 'saved' | 'new_card' | 'bank' | 'digital_wallet' | 'bnpl' | 'crypto';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'saved',          label: 'Saved',   icon: CreditCard    },
  { id: 'new_card',       label: 'Card',    icon: Plus          },
  { id: 'bank',           label: 'Bank',    icon: Building2     },
  { id: 'digital_wallet', label: 'Wallet',  icon: Smartphone    },
  { id: 'bnpl',           label: 'BNPL',    icon: ShoppingCart  },
  { id: 'crypto',         label: 'Crypto',  icon: Bitcoin       },
];

export const PaymentModal = ({ amount, policyNumber, dueDate, onSuccess, onCancel }: PaymentModalProps) => {
  const [tab,          setTab]          = useState<Tab>('saved');
  const [selectedCard, setSelectedCard] = useState(SAVED_CARDS[0].id);
  const [autoPay,      setAutoPay]      = useState(false);
  const [processing,   setProcessing]   = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [bnplMonths,   setBnplMonths]   = useState(3);
  const [cryptoCoin,   setCryptoCoin]   = useState('BTC');
  const [wallet,       setWallet]       = useState('');
  const [newCard,      setNewCard]      = useState({ number: '', name: '', expiry: '', cvv: '' });

  const bnplMonthly = (amount / bnplMonths).toFixed(2);
  const bnplFee     = bnplMonths > 3 ? ((amount * 0.015) * (bnplMonths / 3)).toFixed(2) : '0.00';

  const handlePay = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    setProcessing(false);
    setSuccess(true);
    setTimeout(() => onSuccess?.(), 1500);
  };

  if (success) return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
        <Check size={28} className="text-emerald-400" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">Payment Successful!</h3>
        <p className="text-sm text-gray-500 mt-1">{formatCurrency(amount)} paid for {policyNumber}</p>
      </div>
      <p className="text-xs text-gray-600">A receipt has been sent to your email.</p>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Amount summary */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20">
        <div>
          <p className="text-xs text-gray-500">Paying for</p>
          <p className="text-sm font-bold text-gray-200 font-mono">{policyNumber}</p>
          <p className="text-[10px] text-gray-500">Due {dueDate}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Amount</p>
          <p className="text-2xl font-bold text-white tabular-nums">{formatCurrency(amount)}</p>
        </div>
      </div>

      {/* Method tabs */}
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Payment Method</p>
        <div className="grid grid-cols-6 gap-1 mb-4">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                'flex flex-col items-center gap-1 py-2 rounded-lg border text-[10px] font-bold transition-all',
                tab === id
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-white/[0.03] border-white/[0.08] text-gray-500 hover:border-white/20'
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Saved cards ── */}
        {tab === 'saved' && (
          <div className="space-y-2">
            {SAVED_CARDS.map(card => (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all',
                  selectedCard === card.id
                    ? 'border-emerald-500/40 bg-emerald-500/[0.05]'
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
                )}
              >
                <span className={cn('text-xs font-mono font-bold w-8 shrink-0', CARD_COLORS[card.type])}>
                  {CARD_LABELS[card.type]}
                </span>
                <div className="flex-1 text-left">
                  <p className="text-sm text-gray-200">•••• •••• •••• {card.last4}</p>
                  <p className="text-[10px] text-gray-500">Expires {card.expiry}</p>
                </div>
                {card.isDefault && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">DEFAULT</span>
                )}
                <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0', selectedCard === card.id ? 'border-emerald-500 bg-emerald-500' : 'border-gray-600')}>
                  {selectedCard === card.id && <Check size={9} className="text-white" />}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── New card ── */}
        {tab === 'new_card' && (
          <div className="space-y-3">
            {['number', 'name'].map(field => (
              <div key={field}>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  {field === 'number' ? 'Card Number' : 'Name on Card'}
                </label>
                <input
                  type="text"
                  placeholder={field === 'number' ? '1234 5678 9012 3456' : 'John Smith'}
                  value={newCard[field as keyof typeof newCard]}
                  onChange={e => setNewCard(p => ({ ...p, [field]: e.target.value }))}
                  className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/40"
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              {['expiry', 'cvv'].map(field => (
                <div key={field}>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    {field === 'expiry' ? 'Expiry' : 'CVV'}
                  </label>
                  <input
                    type="text"
                    placeholder={field === 'expiry' ? 'MM/YY' : '123'}
                    value={newCard[field as keyof typeof newCard]}
                    onChange={e => setNewCard(p => ({ ...p, [field]: e.target.value }))}
                    className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Bank transfer ── */}
        {tab === 'bank' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">ACH bank transfer — no extra fees. Processes in 1–3 business days.</p>
            <input type="text" placeholder="Routing Number (9 digits)" className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/40" />
            <input type="text" placeholder="Account Number" className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/40" />
            <select className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/40">
              <option className="bg-gray-900">Checking Account</option>
              <option className="bg-gray-900">Savings Account</option>
            </select>
          </div>
        )}

        {/* ── Digital wallets ── */}
        {tab === 'digital_wallet' && (
          <div className="space-y-3">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3">Select Wallet</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'apple',  label: 'Apple Pay',   color: 'border-white/20 text-white' },
                { id: 'google', label: 'Google Pay',  color: 'border-blue-500/30 text-blue-400' },
                { id: 'paypal', label: 'PayPal',      color: 'border-blue-400/30 text-blue-300' },
                { id: 'venmo',  label: 'Venmo',       color: 'border-sky-500/30 text-sky-400' },
              ].map(w => (
                  <button
                    key={w.id}
                    onClick={() => setWallet(w.id)}
                    className={cn(
                      'p-4 rounded-xl border font-bold text-sm transition-all',
                      wallet === w.id
                        ? 'bg-white/10 ' + w.color
                        : 'border-white/[0.08] text-gray-500 hover:border-white/20'
                    )}
                  >
                    {w.label}
                  </button>
              ))}
            </div>
            {wallet && (
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-400">
                ✓ Redirecting to {['Apple Pay', 'Google Pay', 'PayPal', 'Venmo'].find((_, i) => ['apple', 'google', 'paypal', 'venmo'][i] === wallet)} to complete payment…
              </div>
            )}
          </div>
        )}

        {/* ── BNPL ── */}
        {tab === 'bnpl' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <p className="text-sm font-bold text-purple-300 mb-1">Buy Now, Pay Later</p>
              <p className="text-xs text-gray-400">Split your payment into interest-free installments (Klarna / Affirm).</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Number of Installments</p>
              <div className="grid grid-cols-4 gap-2">
                {[3, 6, 9, 12].map(n => (
                  <button
                    key={n}
                    onClick={() => setBnplMonths(n)}
                    className={cn(
                      'py-2 rounded-lg border text-xs font-bold transition-all',
                      bnplMonths === n
                        ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                        : 'border-white/[0.08] text-gray-500 hover:border-white/20'
                    )}
                  >
                    {n}x
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[10px] text-gray-500 mb-1">Monthly Payment</p>
                <p className="text-lg font-bold text-white">${bnplMonthly}</p>
                <p className="text-[10px] text-gray-600">× {bnplMonths} months</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[10px] text-gray-500 mb-1">Service Fee</p>
                <p className="text-lg font-bold text-white">${bnplFee}</p>
                <p className="text-[10px] text-gray-600">{bnplMonths <= 3 ? 'Interest-free' : '1.5% / quarter'}</p>
              </div>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-white/[0.06] pt-3">
              <span className="text-gray-400">Total Due Today</span>
              <span className="text-white">{formatCurrency(Number(bnplMonthly))}</span>
            </div>
          </div>
        )}

        {/* ── Crypto ── */}
        {tab === 'crypto' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-sm font-bold text-amber-300 mb-1">Cryptocurrency Payment</p>
              <p className="text-xs text-gray-400">Pay with Bitcoin, Ethereum, or USDC. Converted at current market rate.</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Select Currency</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'BTC', label: 'Bitcoin',  rate: 65000 },
                  { id: 'ETH', label: 'Ethereum', rate: 3200  },
                  { id: 'USDC', label: 'USDC',    rate: 1     },
                ].map(c => {
                  const cryptoAmount = (amount / c.rate).toFixed(c.id === 'USDC' ? 2 : 6);
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCryptoCoin(c.id)}
                      className={cn(
                        'p-3 rounded-lg border text-center transition-all',
                        cryptoCoin === c.id
                          ? 'border-amber-500/40 bg-amber-500/10'
                          : 'border-white/[0.08] hover:border-white/20'
                      )}
                    >
                      <p className="text-xs font-bold text-gray-200">{c.id}</p>
                      <p className="text-[10px] text-gray-500">{cryptoAmount}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] font-mono text-xs">
              <p className="text-gray-500 mb-1">Send to wallet address:</p>
              <p className="text-gray-200 break-all">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
            </div>
            <p className="text-[10px] text-gray-600">Rate locked for 15 minutes. Confirmation may take up to 30 min.</p>
          </div>
        )}
      </div>

      {/* Auto-pay toggle */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <div>
          <p className="text-xs font-medium text-gray-300">Enable Auto-Pay</p>
          <p className="text-[10px] text-gray-600">Automatically pay on the due date each month</p>
        </div>
        <button
          onClick={() => setAutoPay(p => !p)}
          className={cn('relative w-10 h-5 rounded-full transition-colors', autoPay ? 'bg-emerald-500' : 'bg-white/10')}
          role="switch"
          aria-checked={autoPay}
          aria-label="Enable auto-pay"
        >
          <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform', autoPay ? 'translate-x-5' : 'translate-x-0.5')} />
        </button>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 text-[10px] text-gray-600">
        <Lock size={11} /> End-to-end encrypted · PCI DSS Level 1 compliant
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-xs font-medium text-gray-500 hover:bg-white/[0.04] transition-all">
          Cancel
        </button>
        <button
          onClick={handlePay}
          disabled={processing}
          className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-wait transition-all flex items-center justify-center gap-2"
        >
          {processing ? (
            <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
          ) : (
            <>Pay {formatCurrency(amount)}</>
          )}
        </button>
      </div>
    </div>
  );
};
