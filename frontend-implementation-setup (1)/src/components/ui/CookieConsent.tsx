import { useState, useEffect } from 'react';
import { Cookie, X, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/cn';

const COOKIE_KEY = 'insurai_cookie_consent';

type ConsentLevel = 'all' | 'essential' | 'custom';

interface CookiePrefs {
  essential: boolean;   // always true, cannot disable
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export const CookieConsent = () => {
  const [visible, setVisible]   = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs]       = useState<CookiePrefs>({
    essential: true,
    analytics: true,
    marketing: false,
    functional: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) {
      // Show banner after short delay
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const save = (level: ConsentLevel) => {
    const result: CookiePrefs =
      level === 'all'
        ? { essential: true, analytics: true, marketing: true, functional: true }
        : level === 'essential'
        ? { essential: true, analytics: false, marketing: false, functional: false }
        : prefs;

    localStorage.setItem(COOKIE_KEY, JSON.stringify(result));
    setVisible(false);
  };

  const toggle = (key: keyof CookiePrefs) => {
    if (key === 'essential') return;
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  };

  if (!visible) return null;

  const categories: { key: keyof CookiePrefs; title: string; desc: string; required?: boolean }[] = [
    { key: 'essential',  title: 'Essential',  desc: 'Required for the site to function. Cannot be disabled.', required: true },
    { key: 'functional', title: 'Functional',  desc: 'Remember your preferences (language, layout, theme).' },
    { key: 'analytics',  title: 'Analytics',   desc: 'Help us understand how you use the platform.' },
    { key: 'marketing',  title: 'Marketing',   desc: 'Allow personalised offers and cross-site tracking.' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[9999] animate-fade-in-up"
    >
      <div className="rounded-2xl border border-white/[0.10] bg-[#0F1629] shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-3 p-5 pb-4">
          <div className="p-2 rounded-xl bg-[#10B981]/15 shrink-0 mt-0.5">
            <Cookie size={18} className="text-[#10B981]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-white">Cookie Preferences</h2>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              We use cookies to improve your experience. Choose what you're comfortable with.
            </p>
          </div>
          <button
            type="button"
            aria-label="Dismiss cookie banner"
            onClick={() => save('essential')}
            className="p-1 rounded-lg hover:bg-white/[0.06] text-gray-600 hover:text-gray-300 transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Expandable categories */}
        <div className="px-5 pb-2">
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 text-xs text-[#10B981] hover:underline"
            aria-expanded={expanded}
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {expanded ? 'Hide details' : 'Customise cookies'}
          </button>

          {expanded && (
            <div className="mt-3 space-y-3 border-t border-white/[0.06] pt-3">
              {categories.map(cat => (
                <div key={cat.key} className="flex items-start gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={prefs[cat.key]}
                    disabled={cat.required}
                    onClick={() => toggle(cat.key)}
                    className={cn(
                      'mt-0.5 relative h-5 w-9 rounded-full transition-colors duration-200 shrink-0',
                      prefs[cat.key] ? 'bg-[#10B981]' : 'bg-white/10',
                      cat.required && 'opacity-60 cursor-not-allowed'
                    )}
                    aria-label={`${cat.title} cookies`}
                  >
                    <span className={cn(
                      'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200',
                      prefs[cat.key] && 'translate-x-4'
                    )} />
                  </button>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-gray-200">{cat.title}</span>
                      {cat.required && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-gray-500 font-bold uppercase">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 pt-3 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" size="sm" onClick={() => save('essential')}>
              Essential only
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { expanded ? save('custom') : save('custom'); }}
            >
              {expanded ? 'Save choices' : 'Customise'}
            </Button>
          </div>
          <Button size="sm" className="w-full" onClick={() => save('all')}>
            Accept all cookies
          </Button>
          <p className="text-[10px] text-gray-600 text-center flex items-center justify-center gap-1 mt-1">
            <Shield size={10} /> GDPR & CCPA compliant · <a href="#" className="hover:underline text-gray-500">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};
