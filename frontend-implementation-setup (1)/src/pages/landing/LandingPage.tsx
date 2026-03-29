// ============================================================================
// NEXURE - Landing Page (FIXED VERSION)
// File: src/pages/landing/LandingPage.tsx
// ============================================================================

import React, { useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/context/ToastContext';
import { landingAPI } from '@/api/apiService';
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue } from 'framer-motion';
import {
  Shield, Brain, LineChart, Users, Lock, Zap, ArrowRight, Check, Star,
  ChevronRight, Play, Building2, Car, Heart, Plane, Home,
  TrendingUp, Clock, Globe, Menu, X, Sparkles, Eye, Mail, Github,
  Linkedin, Twitter, FileCheck, ChevronDown, MessageCircle, Send, Award,
  ArrowUp, Cookie, HelpCircle, Headphones, DollarSign, RefreshCw,
  ExternalLink, Quote, Target, Activity, Moon, Sun,
  IndianRupee, Calculator, BarChart3, PlayCircle, MapPin, Phone,
  Minus, Youtube, Instagram, AlertCircle, Minimize2, Server, CheckCircle2
} from 'lucide-react';

// ============================================================================
// CONSTANTS & UTILS
// ============================================================================
const CURRENT_YEAR = 2026;
const CURRENCIES: Record<string, { symbol: string; code: string; rate: number; locale: string }> = {
  INR: { symbol: '₹', code: 'INR', rate: 1, locale: 'en-IN' },
  USD: { symbol: '$', code: 'USD', rate: 0.012, locale: 'en-US' },
  EUR: { symbol: '€', code: 'EUR', rate: 0.011, locale: 'de-DE' }
};
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');
const formatINR = (num: number) => new Intl.NumberFormat('en-IN').format(num);
const formatIndianNumber = (num: number) => {
  if (num >= 10000000) return (num / 10000000).toFixed(1) + ' Cr';
  if (num >= 100000) return (num / 100000).toFixed(1) + ' L';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
};

// ============================================================================
// CONTEXTS
// ============================================================================
const ThemeCtx = createContext({ isDark: true, toggleTheme: () => {} });
const useT = () => useContext(ThemeCtx);
const ThemeWrap = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => { const s = localStorage.getItem('nexure_theme'); if (s) setIsDark(s === 'dark'); }, []);
  const toggleTheme = () => setIsDark(p => { localStorage.setItem('nexure_theme', !p ? 'dark' : 'light'); return !p; });
  return <ThemeCtx.Provider value={{ isDark, toggleTheme }}>{children}</ThemeCtx.Provider>;
};

const CurrCtx = createContext({ currency: 'INR', setCurrency: (_: string) => {}, formatPrice: (_: number) => '' });
const useC = () => useContext(CurrCtx);
const CurrWrap = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState('INR');
  const formatPrice = (v: number) => {
    const c = CURRENCIES[currency] || CURRENCIES.INR;
    return new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.code, maximumFractionDigits: 0 }).format(v * c.rate);
  };
  return <CurrCtx.Provider value={{ currency, setCurrency, formatPrice }}>{children}</CurrCtx.Provider>;
};

// ============================================================================
// HOOKS
// ============================================================================
const useCounter = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    let st: number, frame: number;
    const go = (ts: number) => {
      if (!st) st = ts;
      const p = Math.min((ts - st) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) frame = requestAnimationFrame(go);
    };
    frame = requestAnimationFrame(go);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, inView]);
  return { count, ref };
};

const useScrollProg = () => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const h = () => { const t = document.documentElement.scrollHeight - window.innerHeight; setP(t > 0 ? (window.scrollY / t) * 100 : 0); };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return p;
};

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================
const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } };
const slideL = { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };
const slideR = { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };

// ============================================================================
// COLOR HELPER (Fixes dynamic Tailwind class issue)
// ============================================================================
const colorMap: Record<string, { bg: string; bgLight: string; text: string; ping: string; dot: string }> = {
  emerald: { bg: 'bg-emerald-500/10', bgLight: 'bg-emerald-500/20', text: 'text-emerald-400', ping: 'bg-emerald-400', dot: 'bg-emerald-500' },
  red: { bg: 'bg-red-500/10', bgLight: 'bg-red-500/20', text: 'text-red-400', ping: 'bg-red-400', dot: 'bg-red-500' },
  cyan: { bg: 'bg-cyan-500/10', bgLight: 'bg-cyan-500/20', text: 'text-cyan-400', ping: 'bg-cyan-400', dot: 'bg-cyan-500' },
  purple: { bg: 'bg-purple-500/10', bgLight: 'bg-purple-500/20', text: 'text-purple-400', ping: 'bg-purple-400', dot: 'bg-purple-500' },
  blue: { bg: 'bg-blue-500/10', bgLight: 'bg-blue-500/20', text: 'text-blue-400', ping: 'bg-blue-400', dot: 'bg-blue-500' },
  yellow: { bg: 'bg-yellow-500/10', bgLight: 'bg-yellow-500/20', text: 'text-yellow-400', ping: 'bg-yellow-400', dot: 'bg-yellow-500' },
  orange: { bg: 'bg-orange-500/10', bgLight: 'bg-orange-500/20', text: 'text-orange-400', ping: 'bg-orange-400', dot: 'bg-orange-500' },
  pink: { bg: 'bg-pink-500/10', bgLight: 'bg-pink-500/20', text: 'text-pink-400', ping: 'bg-pink-400', dot: 'bg-pink-500' },
  gray: { bg: 'bg-gray-500/10', bgLight: 'bg-gray-500/20', text: 'text-gray-400', ping: 'bg-gray-400', dot: 'bg-gray-500' },
};

const getColor = (color: string) => colorMap[color] || colorMap.emerald;

// ============================================================================
// BASE COMPONENTS
// ============================================================================
const Orb = ({ className = '', delay = 0, color = 'emerald' }: { className?: string; delay?: number; color?: string }) => {
  const colors: Record<string, string> = { emerald: 'bg-emerald-500/20', cyan: 'bg-cyan-500/15', purple: 'bg-purple-500/15' };
  return <motion.div className={cn("absolute rounded-full pointer-events-none blur-[120px]", colors[color] || colors.emerald, className)} animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, delay, ease: "easeInOut" }} />;
};

const Glass = ({ children, className = '', hover = true, gradient = false, onClick }: { children: ReactNode; className?: string; hover?: boolean; gradient?: boolean; onClick?: () => void }) => {
  const { isDark } = useT();
  return (
    <motion.div onClick={onClick} className={cn("relative backdrop-blur-xl rounded-2xl overflow-hidden", isDark ? "bg-white/[0.03] border border-white/[0.08]" : "bg-black/[0.02] border border-black/[0.08]", gradient && "bg-gradient-to-br from-emerald-500/5 to-cyan-500/5", onClick && "cursor-pointer", className)} whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : undefined} whileTap={onClick ? { scale: 0.98 } : undefined}>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const GBorder = ({ children, className = '', gradient = 'from-emerald-500/50 via-transparent to-cyan-500/50', animate = false }: { children: ReactNode; className?: string; gradient?: string; animate?: boolean }) => {
  const { isDark } = useT();
  return <div className={cn("relative p-[1px] rounded-2xl bg-gradient-to-br", gradient, animate && "animate-gradient-rotate", className)}><div className={cn("rounded-2xl h-full", isDark ? "bg-gray-900/95" : "bg-white/95")}>{children}</div></div>;
};

const Btn = ({ children, variant = 'primary', size = 'md', onClick, className = '', icon: Icon, iconPosition = 'right', disabled = false, loading = false, type = 'button', fullWidth = false, glow = false }: {
  children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' | 'lg' | 'xl'; onClick?: () => void; className?: string; icon?: React.ElementType; iconPosition?: 'left' | 'right'; disabled?: boolean; loading?: boolean; type?: 'button' | 'submit'; fullWidth?: boolean; glow?: boolean;
}) => {
  const base = "font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-emerald-500",
    secondary: "bg-white/[0.05] text-white border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2]",
    ghost: "text-gray-300 hover:text-white hover:bg-white/[0.05]",
  };
  const sizes: Record<string, string> = { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-base", lg: "px-8 py-4 text-lg", xl: "px-10 py-5 text-xl" };
  return (
    <motion.button type={type} onClick={onClick} disabled={disabled || loading} className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", glow && "animate-glow", className)} whileHover={!disabled ? { scale: 1.02 } : undefined} whileTap={!disabled ? { scale: 0.98 } : undefined}>
      {loading && <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />}
      {Icon && iconPosition === 'left' && !loading && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === 'right' && !loading && <Icon className="w-5 h-5" />}
    </motion.button>
  );
};

const Tag = ({ children, variant = 'default', icon: Icon, pulse = false, className = '' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'error'; icon?: React.ElementType; pulse?: boolean; className?: string }) => {
  const v: Record<string, string> = { default: 'bg-white/[0.05] text-gray-300 border-white/[0.1]', success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', error: 'bg-red-500/10 text-red-400 border-red-500/20' };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border", v[variant], className)}>
      {pulse && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>}
      {Icon && <Icon className="w-3.5 h-3.5" />}{children}
    </span>
  );
};

const SHead = ({ badge, badgeIcon: BI, title, highlight, description }: { badge: string; badgeIcon: React.ElementType; title: string; highlight: string; description?: string }) => {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-100px" }); const { isDark } = useT();
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
      <motion.div variants={fadeInUp} className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6", isDark ? "bg-white/[0.03] border border-white/[0.08]" : "bg-black/[0.03] border border-black/[0.08]")}><BI className="w-4 h-4 text-emerald-400" /><span className={isDark ? "text-gray-400" : "text-gray-600"}>{badge}</span></motion.div>
      <motion.h2 variants={fadeInUp} className={cn("text-3xl sm:text-4xl md:text-5xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>{title}<br /><span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{highlight}</span></motion.h2>
      {description && <motion.p variants={fadeInUp} className={cn("text-lg md:text-xl", isDark ? "text-gray-400" : "text-gray-600")}>{description}</motion.p>}
    </motion.div>
  );
};

const Counter = ({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) => { const { count, ref } = useCounter(value); return <span ref={ref}>{prefix}{formatIndianNumber(count)}{suffix}</span>; };

const Float = ({ children, delay = 0, duration = 3, y = 20 }: { children: ReactNode; delay?: number; duration?: number; y?: number }) => (
  <motion.div animate={{ y: [-y / 2, y / 2, -y / 2] }} transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}>{children}</motion.div>
);

const Mag = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null); const x = useMotionValue(0); const y = useMotionValue(0);
  return <motion.div ref={ref} style={{ x, y }} onMouseMove={e => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.1); y.set((e.clientY - r.top - r.height / 2) * 0.1); }} onMouseLeave={() => { x.set(0); y.set(0); }}>{children}</motion.div>;
};

const Reveal = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>{children}</motion.div>;
};

// ============================================================================
// LOADING & PROGRESS
// ============================================================================
const ProgressBar = () => { const p = useScrollProg(); return <motion.div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}><motion.div className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400" style={{ width: `${p}%` }} /></motion.div>; };

const Loader = ({ onDone }: { onDone: () => void }) => {
  const [p, setP] = useState(0);
  useEffect(() => { const t = setInterval(() => setP(v => { if (v >= 100) { clearInterval(t); setTimeout(onDone, 500); return 100; } return v + Math.random() * 15; }), 100); return () => clearInterval(t); }, [onDone]);
  return (
    <motion.div className="fixed inset-0 z-[100] bg-gray-950 flex flex-col items-center justify-center" exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
        <div className="relative w-20 h-20 mb-8"><motion.div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} /><div className="absolute inset-1 rounded-xl bg-gray-950 flex items-center justify-center"><Shield className="w-8 h-8 text-emerald-400" /></div></div>
        <div className="text-3xl font-bold mb-8"><span className="text-white">NEX</span><span className="text-emerald-400">URE</span></div>
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(p, 100)}%` }} /></div>
        <p className="text-gray-400 text-sm mt-4">Loading...</p>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// NAVIGATION
// ============================================================================
const ThemeBtn = () => { const { isDark, toggleTheme } = useT(); return <motion.button onClick={toggleTheme} className={cn("relative w-14 h-8 rounded-full p-1 transition-colors", isDark ? "bg-gray-700" : "bg-gray-300")} whileTap={{ scale: 0.95 }}><motion.div className={cn("w-6 h-6 rounded-full flex items-center justify-center", isDark ? "bg-gray-900" : "bg-white")} animate={{ x: isDark ? 24 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>{isDark ? <Moon className="w-3.5 h-3.5 text-emerald-400" /> : <Sun className="w-3.5 h-3.5 text-yellow-500" />}</motion.div></motion.button>; };

const CurrPicker = () => {
  const [open, setOpen] = useState(false); const { currency, setCurrency } = useC(); const { isDark } = useT();
  const list = [{ code: 'INR', label: 'Indian Rupee', flag: '🇮🇳' }, { code: 'USD', label: 'US Dollar', flag: '🇺🇸' }, { code: 'EUR', label: 'Euro', flag: '🇪🇺' }];
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg transition-colors", isDark ? "hover:bg-white/[0.05] text-gray-300" : "hover:bg-black/[0.05] text-gray-600")}><IndianRupee className="w-4 h-4" /><span className="text-sm">{currency}</span><ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} /></button>
      <AnimatePresence>{open && (<><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40" />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={cn("absolute top-full right-0 mt-2 w-48 p-2 rounded-xl shadow-xl z-50", isDark ? "bg-gray-900 border border-white/[0.1]" : "bg-white border border-black/[0.1]")}>
          {list.map(c => <button key={c.code} onClick={() => { setCurrency(c.code); setOpen(false); }} className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors", currency === c.code ? "bg-emerald-500/10 text-emerald-400" : isDark ? "hover:bg-white/[0.05] text-gray-300" : "hover:bg-black/[0.05] text-gray-600")}><span className="text-lg">{c.flag}</span><span className="text-sm">{c.label}</span>{currency === c.code && <Check className="w-4 h-4 ml-auto" />}</button>)}
        </motion.div></>)}</AnimatePresence>
    </div>
  );
};

const Nav = () => {
  const navigate = useNavigate(); const [scrolled, setScrolled] = useState(false); const [mob, setMob] = useState(false); const [drop, setDrop] = useState<string | null>(null); const { isDark } = useT();
  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h); }, []);
  const items = [
    { label: 'Features', href: '#features' },
    { label: 'Solutions', href: '#solutions', dd: [{ label: 'Motor Insurance', href: '#solutions', icon: Car }, { label: 'Health Insurance', href: '#solutions', icon: Heart }, { label: 'Property Insurance', href: '#solutions', icon: Home }] },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];
  return (
    <>
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }} className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled && (isDark ? "bg-gray-950/90 backdrop-blur-xl border-b border-white/[0.05]" : "bg-white/90 backdrop-blur-xl border-b border-black/[0.05]"))}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.a href="/" className="flex items-center gap-2" whileHover={{ scale: 1.02 }}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25"><Shield className="w-5 h-5 text-white" /></div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight"><span className={isDark ? "text-white" : "text-gray-900"}>NEX</span><span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">URE</span></span>
            </motion.a>
            <div className="hidden lg:flex items-center gap-1">
              {items.map(item => (
                <div key={item.label} className="relative" onMouseEnter={() => item.dd && setDrop(item.label)} onMouseLeave={() => setDrop(null)}>
                  <a href={item.href} className={cn("flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors", isDark ? "text-gray-400 hover:text-white hover:bg-white/[0.03]" : "text-gray-600 hover:text-gray-900 hover:bg-black/[0.03]")}>{item.label}{item.dd && <ChevronDown className={cn("w-4 h-4 transition-transform", drop === item.label && "rotate-180")} />}</a>
                  <AnimatePresence>{item.dd && drop === item.label && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={cn("absolute top-full left-0 mt-2 w-64 p-3 rounded-2xl shadow-2xl", isDark ? "bg-gray-900/95 backdrop-blur-xl border border-white/[0.08]" : "bg-white/95 backdrop-blur-xl border border-black/[0.08]")}>
                      {item.dd.map(sub => <a key={sub.label} href={sub.href} className={cn("flex items-center gap-3 p-3 rounded-xl transition-colors", isDark ? "hover:bg-white/[0.05]" : "hover:bg-black/[0.03]")}><div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><sub.icon className="w-5 h-5 text-emerald-400" /></div><span className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{sub.label}</span></a>)}
                    </motion.div>
                  )}</AnimatePresence>
                </div>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <CurrPicker /><ThemeBtn /><div className="w-px h-6 bg-white/[0.1] mx-1" />
              <Btn variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</Btn>
              <Btn variant="primary" size="sm" onClick={() => navigate('/register')} icon={ArrowRight}>Get Started</Btn>
            </div>
            <button className={cn("lg:hidden p-2 rounded-lg", isDark ? "text-white" : "text-gray-900")} onClick={() => setMob(true)}><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </motion.nav>
      <AnimatePresence>{mob && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cn("fixed inset-0 z-[90] lg:hidden", isDark ? "bg-gray-950" : "bg-white")}>
          <div className="flex items-center justify-between p-4 border-b border-white/[0.05]"><span className="text-xl font-bold"><span className={isDark ? "text-white" : "text-gray-900"}>NEX</span><span className="text-emerald-400">URE</span></span><button onClick={() => setMob(false)} className="p-2"><X className={cn("w-6 h-6", isDark ? "text-white" : "text-gray-900")} /></button></div>
          <nav className="p-4 space-y-2">{items.map(i => <a key={i.label} href={i.href} onClick={() => setMob(false)} className={cn("block py-3 px-4 rounded-xl text-lg font-medium", isDark ? "text-white hover:bg-white/[0.05]" : "text-gray-900 hover:bg-black/[0.03]")}>{i.label}</a>)}</nav>
          <div className="p-4 space-y-3"><Btn variant="secondary" fullWidth size="lg" onClick={() => { navigate('/login'); setMob(false); }}>Sign In</Btn><Btn variant="primary" fullWidth size="lg" icon={ArrowRight} onClick={() => { navigate('/register'); setMob(false); }}>Get Started Free</Btn></div>
        </motion.div>
      )}</AnimatePresence>
    </>
  );
};

// ============================================================================
// HERO
// ============================================================================
const Hero = () => {
  const navigate = useNavigate(); const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]); const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]); const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const { isDark } = useT();
  const stats = [{ value: 850000, suffix: '+', label: 'Claims Processed', icon: FileCheck, prefix: '' }, { value: 99.7, suffix: '%', label: 'Accuracy Rate', icon: Target, prefix: '' }, { value: 125, suffix: ' Cr+', label: 'Saved for Clients', icon: DollarSign, prefix: '₹' }, { value: 180, suffix: '+', label: 'Insurance Partners', icon: Building2, prefix: '' }];
  const cards = [
    { icon: Shield, label: 'Fraud Blocked', value: '₹2.4L', color: 'red', pos: 'top-32 left-8' },
    { icon: Zap, label: 'Claim Processed', value: '2.3s', color: 'emerald', pos: 'top-48 right-12' },
    { icon: TrendingUp, label: 'Efficiency', value: '+67%', color: 'cyan', pos: 'bottom-32 left-16' },
  ];
  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y }}>
        <Orb className="w-[600px] h-[600px] -top-40 -left-40" color="emerald" /><Orb className="w-[500px] h-[500px] top-1/3 -right-20" color="cyan" delay={2} /><Orb className="w-[400px] h-[400px] bottom-20 left-1/4" color="purple" delay={4} />
        <div className={cn("absolute inset-0 bg-[size:60px_60px]", isDark ? "bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" : "bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]")} />
        <div className={cn("absolute inset-0", isDark ? "bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950" : "bg-gradient-to-b from-transparent via-white/50 to-white")} />
      </motion.div>
      {/* Floating Cards - FIXED with colorMap */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {cards.map((c, i) => {
          const clr = getColor(c.color);
          return (
            <Float key={i} delay={i * 0.5} duration={4 + i}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 + i * 0.2 }} className={cn("absolute p-4 rounded-2xl backdrop-blur-xl border shadow-2xl", isDark ? "bg-gray-900/80 border-white/[0.1]" : "bg-white/80 border-black/[0.1]", c.pos)}>
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", clr.bg)}><c.icon className={cn("w-5 h-5", clr.text)} /></div>
                  <div><p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>{c.label}</p><p className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>{c.value}</p></div>
                </div>
              </motion.div>
            </Float>
          );
        })}
      </div>
      <motion.div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center" style={{ opacity, scale }}>
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"><Tag variant="success" pulse>Live</Tag><span className="text-emerald-400 text-sm font-medium">AI-Powered Insurance Platform</span><ChevronRight className="w-4 h-4 text-emerald-400" /></motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] mb-8"><span className={isDark ? "text-white" : "text-gray-900"}>Insurance</span><br /><span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Reimagined with AI</span></motion.h1>
          <motion.p variants={fadeInUp} className={cn("text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed", isDark ? "text-gray-400" : "text-gray-600")}>Process claims in under <span className="text-emerald-400 font-semibold">3 seconds</span>. Detect fraud with <span className="text-emerald-400 font-semibold">99.7% accuracy</span>. Save crores with next-generation AI.</motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Mag><Btn variant="primary" size="lg" onClick={() => navigate('/register')} icon={ArrowRight} glow className="w-full sm:w-auto">Start Free Trial</Btn></Mag>
            <Mag><Btn variant="secondary" size="lg" className="w-full sm:w-auto" icon={PlayCircle} iconPosition="left">Watch Demo</Btn></Mag>
          </motion.div>
          <motion.div variants={fadeInUp} className={cn("flex flex-wrap justify-center items-center gap-6 text-sm mb-12", isDark ? "text-gray-500" : "text-gray-400")}>{[{ icon: Shield, text: 'IRDAI Compliant' }, { icon: Lock, text: 'ISO 27001' }, { icon: Award, text: 'SOC 2 Type II' }].map((b, i) => <div key={i} className="flex items-center gap-2"><b.icon className="w-4 h-4 text-emerald-400" /><span>{b.text}</span></div>)}</motion.div>
          <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {stats.map((s, i) => <Reveal key={i} delay={i * 0.1}><Glass className="p-4 sm:p-6" gradient><s.icon className="w-5 h-5 text-emerald-400 mb-2 mx-auto hidden sm:block" /><div className={cn("text-2xl sm:text-3xl md:text-4xl font-bold mb-1", isDark ? "text-white" : "text-gray-900")}><Counter value={s.value} prefix={s.prefix} suffix={s.suffix} /></div><div className={cn("text-xs sm:text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{s.label}</div></Glass></Reveal>)}
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <a href="#features" className={cn("flex flex-col items-center gap-2", isDark ? "text-gray-500" : "text-gray-400")}><span className="text-xs uppercase tracking-widest">Scroll to explore</span><div className={cn("w-6 h-10 rounded-full border-2 flex items-start justify-center p-2", isDark ? "border-white/20" : "border-black/20")}><motion.div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" animate={{ y: [0, 16, 0] }} transition={{ duration: 2, repeat: Infinity }} /></div></a>
      </motion.div>
    </section>
  );
};

// ============================================================================
// LOGOS & FEATURES & LIVE STATS
// ============================================================================
const Logos = () => {
  const { isDark } = useT(); const ref = useRef(null); const inView = useInView(ref, { once: true });
  const clients = [{ n: 'HDFC Ergo', l: '🏦' }, { n: 'ICICI Lombard', l: '🏛️' }, { n: 'Bajaj Allianz', l: '🔷' }, { n: 'Tata AIG', l: '🔶' }, { n: 'Max Life', l: '💚' }, { n: 'Star Health', l: '⭐' }, { n: 'SBI General', l: '🏦' }, { n: 'Reliance', l: '🔴' }, { n: 'New India', l: '🇮🇳' }, { n: 'United India', l: '🤝' }];
  return (
    <section ref={ref} className={cn("py-16 border-y overflow-hidden", isDark ? "border-white/[0.05] bg-white/[0.01]" : "border-black/[0.05] bg-black/[0.01]")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8"><motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className={cn("text-center text-sm", isDark ? "text-gray-500" : "text-gray-400")}>Trusted by <span className="text-emerald-400 font-semibold">180+</span> leading insurance companies</motion.p></div>
      <div className="relative">
        <div className={cn("absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none", isDark ? "bg-gradient-to-r from-gray-950 to-transparent" : "bg-gradient-to-r from-white to-transparent")} />
        <div className={cn("absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none", isDark ? "bg-gradient-to-l from-gray-950 to-transparent" : "bg-gradient-to-l from-white to-transparent")} />
        <motion.div className="flex gap-12 items-center" animate={{ x: [0, -50 * clients.length] }} transition={{ x: { duration: 30, repeat: Infinity, ease: "linear" } }}>
          {[...clients, ...clients].map((c, i) => <div key={i} className={cn("flex items-center gap-3 px-6 py-4 rounded-xl shrink-0", isDark ? "bg-white/[0.03]" : "bg-black/[0.02]")}><span className="text-3xl">{c.l}</span><span className={cn("text-lg font-semibold whitespace-nowrap", isDark ? "text-gray-400" : "text-gray-500")}>{c.n}</span></div>)}
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const { isDark } = useT(); const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-100px" });
  const list = [
    { icon: Brain, title: 'AI-Powered Claims', desc: 'Process claims in under 3 seconds using advanced ML models.', stat: '<3s Processing', gradient: 'from-purple-500 to-pink-500' },
    { icon: Shield, title: 'Fraud Detection', desc: 'Catch fraud with 99.7% accuracy using real-time pattern recognition.', stat: '99.7% Accuracy', gradient: 'from-red-500 to-orange-500' },
    { icon: LineChart, title: 'Real-Time Analytics', desc: 'Live dashboards with predictive insights and intelligence.', stat: '25+ Sources', gradient: 'from-cyan-500 to-blue-500' },
    { icon: Users, title: 'Role-Based Access', desc: 'Tailored dashboards for agents, underwriters, and executives.', stat: '8+ Roles', gradient: 'from-emerald-500 to-teal-500' },
    { icon: Lock, title: 'Enterprise Security', desc: 'Bank-grade AES-256 encryption, IRDAI compliant.', stat: 'IRDAI Compliant', gradient: 'from-gray-500 to-gray-600' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Process thousands of claims simultaneously.', stat: '99.95% Uptime', gradient: 'from-yellow-500 to-orange-500' },
  ];
  return (
    <section ref={ref} id="features" className="py-20 md:py-32 relative overflow-hidden">
      <Orb className="w-[500px] h-[500px] -right-40 top-20" color="emerald" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SHead badge="Powerful Features" badgeIcon={Sparkles} title="Everything You Need to" highlight="Transform Insurance" description="A comprehensive suite of AI-powered tools." />
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((f, i) => <motion.div key={i} variants={fadeInUp}><Glass className="p-6 h-full group" gradient><motion.div className={cn("w-14 h-14 rounded-2xl p-[1px] mb-5 bg-gradient-to-br", f.gradient)} whileHover={{ scale: 1.1, rotate: 5 }}><div className={cn("w-full h-full rounded-2xl flex items-center justify-center", isDark ? "bg-gray-900" : "bg-white")}><f.icon className="w-7 h-7 text-white" /></div></motion.div><h3 className={cn("text-lg md:text-xl font-bold mb-3", isDark ? "text-white" : "text-gray-900")}>{f.title}</h3><p className={cn("mb-5 text-sm leading-relaxed", isDark ? "text-gray-400" : "text-gray-500")}>{f.desc}</p><div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mt-auto"><TrendingUp className="w-4 h-4" />{f.stat}</div></Glass></motion.div>)}
        </motion.div>
      </div>
    </section>
  );
};

const LiveStats = () => {
  const { isDark } = useT(); const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-100px" });
  const [live, setLive] = useState({ claims: 12847, fraud: 234, saved: 4.7, users: 1892 });
  useEffect(() => { const t = setInterval(() => setLive(p => ({ claims: p.claims + Math.floor(Math.random() * 5), fraud: p.fraud + (Math.random() > 0.7 ? 1 : 0), saved: +(p.saved + Math.random() * 0.1).toFixed(1), users: p.users + Math.floor(Math.random() * 10) - 5 })), 3000); return () => clearInterval(t); }, []);
  const stats = [
    { label: 'Claims Today', value: live.claims, icon: FileCheck, color: 'emerald', prefix: '', suffix: '' },
    { label: 'Fraud Blocked', value: live.fraud, icon: Shield, color: 'red', prefix: '', suffix: '' },
    { label: 'Crores Saved', value: live.saved, icon: TrendingUp, color: 'cyan', prefix: '₹', suffix: ' Cr' },
    { label: 'Active Users', value: live.users, icon: Users, color: 'purple', prefix: '', suffix: '' },
  ];
  return (
    <section ref={ref} className="py-20 md:py-32 relative overflow-hidden">
      <Orb className="w-[500px] h-[500px] -left-40 top-0" color="emerald" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SHead badge="Live Statistics" badgeIcon={Activity} title="Real-Time Platform" highlight="Activity" description="Watch our AI process claims in real-time." />
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => {
            const clr = getColor(s.color);
            return (
              <motion.div key={i} variants={fadeInUp}>
                <Glass className="p-6 text-center relative">
                  <div className="absolute top-4 right-4"><span className="relative flex h-3 w-3"><span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", clr.ping)} /><span className={cn("relative inline-flex rounded-full h-3 w-3", clr.dot)} /></span></div>
                  <div className={cn("w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center", clr.bg)}><s.icon className={cn("w-7 h-7", clr.text)} /></div>
                  <motion.div key={s.value} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className={cn("text-3xl md:text-4xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>{s.prefix}{typeof s.value === 'number' ? s.value.toLocaleString('en-IN') : s.value}{s.suffix}</motion.div>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{s.label}</p>
                </Glass>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// END OF PART A - CONTINUE TO PART B
// ============================================================================
// ============================================================================
// PART B: ALL REMAINING SECTIONS + ASSEMBLY
// ============================================================================

const Solutions = () => {
  const { isDark } = useT(); const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-100px" }); const [active, setActive] = useState(0);
  const list = [
    { icon: Car, name: 'Motor Insurance', stat: '60% faster', desc: 'Instant damage assessment with AI image analysis.', features: ['Photo-based assessment', 'Automated estimates', 'Garage integration'], gradient: 'from-blue-500 to-cyan-500' },
    { icon: Heart, name: 'Health Insurance', stat: '35% cost cut', desc: 'Automated medical claims with TPA integration.', features: ['Pre-auth automation', 'Hospital network', 'Fraud detection'], gradient: 'from-red-500 to-pink-500' },
    { icon: Home, name: 'Property Insurance', stat: '2.5x throughput', desc: 'AI-powered property damage evaluation.', features: ['Satellite analysis', 'Disaster assessment', 'Auto valuation'], gradient: 'from-orange-500 to-yellow-500' },
    { icon: Plane, name: 'Travel Insurance', stat: '<5s processing', desc: 'Real-time travel disruption claims.', features: ['Flight data integration', 'Instant triggers', 'Multi-currency'], gradient: 'from-purple-500 to-indigo-500' },
    { icon: Building2, name: 'Commercial Lines', stat: '85% automation', desc: 'Complex commercial risk management.', features: ['Custom risk models', 'Portfolio analytics', 'Compliance'], gradient: 'from-emerald-500 to-teal-500' },
  ];
  return (
    <section ref={ref} id="solutions" className="py-20 md:py-32 relative overflow-hidden">
      <Orb className="w-[500px] h-[500px] -right-40 top-20" color="cyan" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SHead badge="Industry Solutions" badgeIcon={Globe} title="Built for Every" highlight="Insurance Vertical" description="Tailored AI solutions for every line of business." />
        <div className="grid lg:grid-cols-5 gap-8">
          <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="lg:col-span-2 space-y-3">
            {list.map((s, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Glass className={cn("p-4 cursor-pointer transition-all", active === i && "ring-2 ring-emerald-500")} hover={false} onClick={() => setActive(i)}>
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br", s.gradient)}><s.icon className="w-6 h-6 text-white" /></div>
                    <div className="flex-1"><h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{s.name}</h3><p className="text-emerald-400 text-sm font-medium">{s.stat}</p></div>
                    <ChevronRight className={cn("w-5 h-5 transition-transform", active === i && "rotate-90", isDark ? "text-gray-400" : "text-gray-500")} />
                  </div>
                </Glass>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={slideR} className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <GBorder>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br", list[active].gradient)}>{React.createElement(list[active].icon, { className: "w-8 h-8 text-white" })}</div>
                      <div><h3 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>{list[active].name}</h3><Tag variant="success">{list[active].stat}</Tag></div>
                    </div>
                    <p className={cn("text-lg mb-6", isDark ? "text-gray-300" : "text-gray-600")}>{list[active].desc}</p>
                    <h4 className={cn("font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>Key Capabilities</h4>
                    <ul className="space-y-3 mb-8">
                      {list[active].features.map((f, i) => <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center"><Check className="w-4 h-4 text-emerald-400" /></div><span className={isDark ? "text-gray-300" : "text-gray-600"}>{f}</span></motion.li>)}
                    </ul>
                    <div className="flex gap-4"><Btn variant="primary" icon={ArrowRight}>Learn More</Btn><Btn variant="secondary" icon={FileCheck} iconPosition="left">Case Study</Btn></div>
                  </div>
                </GBorder>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ROICalc = () => {
  const { isDark } = useT(); const toast = useToast(); const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-100px" });
  const [inp, setInp] = useState({ claims: 5000, claimVal: 50000, days: 7, fraud: 3, team: 20 });
  const [res, setRes] = useState({ time: 0, fraud: 0, ops: 0, total: 0, roi: 0, payback: 0 });

  useEffect(() => {
    const t = setTimeout(() => {
      const pSaved = (inp.days - 0.5) / inp.days;
      const annual = inp.claims * 12;
      const timeSaved = annual * inp.claimVal * 0.02 * pSaved;
      const fraudSaved = annual * inp.claimVal * (inp.fraud / 100) * 0.95;
      const opsSaved = Math.floor(inp.team * 0.4) * 600000;
      const total = timeSaved + fraudSaved + opsSaved;
      const cost = 49999 * 12;
      const roi = ((total - cost) / cost) * 100;
      setRes({
        time: Math.round(timeSaved), fraud: Math.round(fraudSaved), ops: Math.round(opsSaved),
        total: Math.round(total), roi: Math.round(roi),
        payback: Math.min(Math.ceil(cost / (total / 12)), 12)
      });
    }, 300);
    return () => clearTimeout(t);
  }, [inp]);

  const sliders = [
    { key: 'claims', label: 'Monthly Claims', min: 100, max: 50000, step: 100, fmt: (v: number) => v.toLocaleString('en-IN'), icon: FileCheck },
    { key: 'claimVal', label: 'Avg Claim Value', min: 5000, max: 500000, step: 5000, fmt: (v: number) => '₹' + v.toLocaleString('en-IN'), icon: IndianRupee },
    { key: 'days', label: 'Processing Days', min: 1, max: 30, step: 1, fmt: (v: number) => v + ' days', icon: Clock },
    { key: 'fraud', label: 'Fraud Rate %', min: 0.5, max: 10, step: 0.5, fmt: (v: number) => v + '%', icon: Shield },
    { key: 'team', label: 'Team Size', min: 5, max: 200, step: 5, fmt: (v: number) => v + ' people', icon: Users },
  ];

  const savingsItems = [
    { label: 'Time Efficiency', value: res.time, icon: Clock, color: 'cyan' },
    { label: 'Fraud Prevention', value: res.fraud, icon: Shield, color: 'red' },
    { label: 'Operational', value: res.ops, icon: Users, color: 'purple' },
  ];

  return (
    <section ref={ref} id="roi-calculator" className="py-20 md:py-32 relative overflow-hidden">
      <Orb className="w-[600px] h-[600px] -right-40 top-20" color="emerald" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SHead badge="ROI Calculator" badgeIcon={Calculator} title="Calculate Your" highlight="Potential Savings" description="See how much you could save with Nexure." />
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Sliders */}
          <motion.div variants={slideL}>
            <Glass className="p-6 md:p-8">
              <h3 className={cn("text-xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>Enter Your Numbers</h3>
              <div className="space-y-8">
                {sliders.map(s => (
                  <div key={s.key}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2"><s.icon className={cn("w-4 h-4", isDark ? "text-gray-400" : "text-gray-500")} /><label className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-700")}>{s.label}</label></div>
                      <span className="text-lg font-bold text-emerald-400">{s.fmt(inp[s.key as keyof typeof inp])}</span>
                    </div>
                    <input type="range" min={s.min} max={s.max} step={s.step} value={inp[s.key as keyof typeof inp]}
                      onChange={e => setInp(p => ({ ...p, [s.key]: parseFloat(e.target.value) }))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, #10B981 0%, #10B981 ${((inp[s.key as keyof typeof inp] - s.min) / (s.max - s.min)) * 100}%, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} ${((inp[s.key as keyof typeof inp] - s.min) / (s.max - s.min)) * 100}%, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 100%)` }} />
                    <div className="flex justify-between mt-1"><span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>{s.fmt(s.min)}</span><span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>{s.fmt(s.max)}</span></div>
                  </div>
                ))}
              </div>
            </Glass>
          </motion.div>
          {/* Results */}
          <motion.div variants={slideR}>
            <GBorder gradient="from-emerald-500/50 via-cyan-500/30 to-emerald-500/50" animate>
              <div className="p-6 md:p-8">
                <h3 className={cn("text-xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>Estimated Savings</h3>
                <div className="space-y-4 mb-8">
                  {savingsItems.map((item, i) => {
                    const clr = getColor(item.color);
                    return (
                      <div key={i} className={cn("flex items-center justify-between p-4 rounded-xl", isDark ? "bg-white/[0.03]" : "bg-black/[0.02]")}>
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", clr.bg)}><item.icon className={cn("w-5 h-5", clr.text)} /></div>
                          <span className={isDark ? "text-gray-300" : "text-gray-600"}>{item.label}</span>
                        </div>
                        <span className={cn("font-bold text-lg", isDark ? "text-white" : "text-gray-900")}>₹{(item.value / 100000).toFixed(1)}L</span>
                      </div>
                    );
                  })}
                </div>
                <div className="p-6 rounded-2xl text-center mb-6 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20">
                  <p className={cn("text-sm mb-2", isDark ? "text-gray-400" : "text-gray-500")}>Total Annual Savings</p>
                  <motion.p key={res.total} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-4xl md:text-5xl font-bold text-emerald-400">₹{(res.total / 10000000).toFixed(2)} Cr</motion.p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className={cn("p-4 rounded-xl text-center", isDark ? "bg-white/[0.03]" : "bg-black/[0.02]")}><p className={cn("text-xs mb-1", isDark ? "text-gray-500" : "text-gray-400")}>ROI</p><p className="text-2xl font-bold text-emerald-400">{res.roi > 0 ? '+' : ''}{res.roi}%</p></div>
                  <div className={cn("p-4 rounded-xl text-center", isDark ? "bg-white/[0.03]" : "bg-black/[0.02]")}><p className={cn("text-xs mb-1", isDark ? "text-gray-500" : "text-gray-400")}>Payback</p><p className="text-2xl font-bold text-cyan-400">{res.payback} mo</p></div>
                </div>
                <Btn variant="primary" fullWidth size="lg" icon={ArrowRight} onClick={() => toast.success('Quote Requested', 'Our team will contact you within 24 hours.')}>Get Custom Quote</Btn>
              </div>
            </GBorder>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Comparison = () => {
  const { isDark } = useT(); const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-100px" });
  const rows = [
    { name: 'AI Claims Processing', n: true, a: 'partial' as const, b: false },
    { name: 'Fraud Detection', n: true, a: true, b: false },
    { name: 'Processing Speed', n: '<3 seconds', a: '~30 seconds', b: '~2 minutes' },
    { name: 'Accuracy', n: '99.7%', a: '94%', b: '89%' },
    { name: 'IRDAI Compliance', n: true, a: true, b: true },
    { name: 'Data in India', n: true, a: false, b: true },
    { name: 'Custom AI Models', n: true, a: false, b: false },
    { name: 'TPA Integration', n: '50+', a: '20+', b: '10+' },
    { name: '24/7 Support', n: true, a: false, b: false },
    { name: 'Starting Price', n: '₹14,999/mo', a: '₹25,000/mo', b: '₹40,000/mo' },
  ];
  const rv = (v: boolean | string, isN = false) => {
    if (v === true) return <div className={cn("w-7 h-7 rounded-full flex items-center justify-center mx-auto", isN ? "bg-emerald-500/20" : "bg-emerald-500/10")}><Check className={cn("w-4 h-4", isN ? "text-emerald-400" : "text-emerald-500")} /></div>;
    if (v === false) return <div className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center mx-auto"><X className="w-4 h-4 text-red-400" /></div>;
    if (v === 'partial') return <div className="w-7 h-7 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto"><Minus className="w-4 h-4 text-yellow-400" /></div>;
    return <span className={cn("font-medium text-sm", isN ? "text-emerald-400" : isDark ? "text-gray-300" : "text-gray-700")}>{v}</span>;
  };
  return (
    <section ref={ref} id="comparison" className="py-20 md:py-32 relative overflow-hidden">
      <Orb className="w-[500px] h-[500px] -left-40 top-0" color="purple" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SHead badge="Comparison" badgeIcon={BarChart3} title="See How We" highlight="Stack Up" description="Nexure vs traditional insurance software." />
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeInUp} className="overflow-x-auto pb-4">
          <div className="min-w-[700px]"><Glass className="overflow-hidden" hover={false}><table className="w-full">
            <thead><tr className={cn("border-b", isDark ? "border-white/[0.1]" : "border-black/[0.1]")}><th className="p-5 text-left"><span className={isDark ? "text-gray-400" : "text-gray-500"}>Feature</span></th><th className="p-5 text-center"><div className="flex items-center justify-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div><span className="text-emerald-400 font-bold">Nexure</span></div></th><th className="p-5 text-center"><span className={isDark ? "text-gray-400" : "text-gray-500"}>Competitor A</span></th><th className="p-5 text-center"><span className={isDark ? "text-gray-400" : "text-gray-500"}>Competitor B</span></th></tr></thead>
            <tbody>{rows.map((r, i) => <motion.tr key={i} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: i * 0.03 }} className={cn("border-b transition-colors", isDark ? "border-white/[0.05] hover:bg-white/[0.02]" : "border-black/[0.05] hover:bg-black/[0.01]")}><td className={cn("p-5 font-medium", isDark ? "text-gray-300" : "text-gray-700")}>{r.name}</td><td className="p-5 text-center bg-emerald-500/[0.03]">{rv(r.n, true)}</td><td className="p-5 text-center">{rv(r.a)}</td><td className="p-5 text-center">{rv(r.b)}</td></motion.tr>)}</tbody>
          </table></Glass></div>
        </motion.div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const { isDark } = useT(); const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-100px" }); const [idx, setIdx] = useState(0);
  const list = [
    { quote: "Nexure transformed our claims operation. What took 2 weeks now happens in under 3 days. Fraud detection saved us ₹8 crore.", author: "Rajesh Sharma", role: "COO", company: "Leading General Insurer", avatar: "RS", metrics: { timeSaved: '85%', fraudBlocked: '₹8Cr', satisfaction: '94%' } },
    { quote: "AI-powered insights completely changed how we assess risk. Loss ratios improved by 18% since implementing Nexure.", author: "Ananya Mehta", role: "VP Underwriting", company: "Top 5 Health Insurer", avatar: "AM", metrics: { lossRatio: '-18%', efficiency: '+45%', accuracy: '99.2%' } },
    { quote: "Finally, a platform that understands Indian regulations. IRDAI compliance features are game-changers for our agents.", author: "Vikram Patel", role: "Director Digital", company: "Major Life Insurance Co.", avatar: "VP", metrics: { compliance: '100%', productivity: '+60%', nps: '+25' } },
  ];
  useEffect(() => { const t = setInterval(() => setIdx(p => (p + 1) % list.length), 8000); return () => clearInterval(t); }, []);
  return (
    <section ref={ref} className="py-20 md:py-32 relative overflow-hidden">
      <Orb className="w-[500px] h-[500px] right-0 top-0" color="emerald" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SHead badge="Customer Stories" badgeIcon={Star} title="Trusted by Industry" highlight="Leaders Across India" />
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeInUp} className="max-w-4xl mx-auto">
          <GBorder animate><div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
                <div className="flex justify-center gap-1 mb-6">{[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />)}</div>
                <Quote className={cn("w-12 h-12 mx-auto mb-6", isDark ? "text-emerald-400/20" : "text-emerald-500/20")} />
                <blockquote className={cn("text-xl md:text-2xl lg:text-3xl font-medium mb-8 leading-relaxed", isDark ? "text-white" : "text-gray-900")}>"{list[idx].quote}"</blockquote>
                <div className="flex justify-center gap-8 mb-8">{Object.entries(list[idx].metrics).map(([k, v], i) => <div key={i} className="text-center"><p className="text-2xl font-bold text-emerald-400">{v}</p><p className={cn("text-xs uppercase tracking-wider", isDark ? "text-gray-500" : "text-gray-400")}>{k.replace(/([A-Z])/g, ' $1').trim()}</p></div>)}</div>
                <div className="flex items-center justify-center gap-4"><div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">{list[idx].avatar}</div><div className="text-left"><div className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{list[idx].author}</div><div className={isDark ? "text-gray-400" : "text-gray-500"}>{list[idx].role}</div><div className="text-emerald-400 text-sm">{list[idx].company}</div></div></div>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center gap-2 mt-8">{list.map((_, i) => <button key={i} onClick={() => setIdx(i)} className={cn("h-2 rounded-full transition-all", i === idx ? "w-8 bg-emerald-400" : "w-2 bg-gray-600")} />)}</div>
          </div></GBorder>
        </motion.div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const { isDark } = useT(); const { formatPrice } = useC(); const navigate = useNavigate(); const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-100px" }); const [annual, setAnnual] = useState(true);
  const plans = [
    { name: "Starter", desc: "For small agencies", pM: 17999, pA: 14999, features: [{ t: "500 claims/month", ok: true }, { t: "Basic fraud detection", ok: true }, { t: "3 users", ok: true }, { t: "Email support", ok: true }, { t: "Standard analytics", ok: true }, { t: "API access", ok: false }, { t: "Custom integrations", ok: false }], popular: false, cta: "Start Free Trial", g: 'from-gray-500 to-gray-600' },
    { name: "Professional", desc: "For growing insurers", pM: 59999, pA: 49999, features: [{ t: "5,000 claims/month", ok: true }, { t: "Advanced AI fraud", ok: true }, { t: "15 users", ok: true }, { t: "Priority support (4hr)", ok: true }, { t: "Custom dashboards", ok: true }, { t: "Full API access", ok: true }, { t: "TPA integrations", ok: true }], popular: true, cta: "Start Free Trial", g: 'from-emerald-500 to-cyan-500' },
    { name: "Enterprise", desc: "For large insurers", pM: null, pA: null, features: [{ t: "Unlimited claims", ok: true }, { t: "Custom AI models", ok: true }, { t: "Unlimited users", ok: true }, { t: "24/7 support", ok: true }, { t: "On-premise deploy", ok: true }, { t: "IRDAI audit support", ok: true }, { t: "SLA 99.99%", ok: true }], popular: false, cta: "Contact Sales", g: 'from-purple-500 to-pink-500' },
  ];
  return (
    <section ref={ref} id="pricing" className="py-20 md:py-32 relative overflow-hidden">
      <Orb className="w-[600px] h-[600px] left-1/2 -translate-x-1/2 top-0" color="cyan" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SHead badge="Simple Pricing" badgeIcon={DollarSign} title="Plans That Scale" highlight="With Your Business" description="Start free, upgrade when ready. No hidden fees." />
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeInUp} className="flex justify-center mb-12">
          <div className={cn("flex items-center gap-4 p-1.5 rounded-full", isDark ? "bg-white/[0.03] border border-white/[0.08]" : "bg-black/[0.03] border border-black/[0.08]")}>
            <button onClick={() => setAnnual(true)} className={cn("relative px-6 py-2.5 rounded-full text-sm font-medium transition-all", annual ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25" : isDark ? "text-gray-400" : "text-gray-500")}>Annual{annual && <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold bg-yellow-500 text-yellow-900 rounded-full">-17%</span>}</button>
            <button onClick={() => setAnnual(false)} className={cn("px-6 py-2.5 rounded-full text-sm font-medium transition-all", !annual ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25" : isDark ? "text-gray-400" : "text-gray-500")}>Monthly</button>
          </div>
        </motion.div>
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="grid md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((p, i) => (
            <motion.div key={i} variants={fadeInUp} className={cn("relative", p.popular && "md:-mt-4 md:mb-4")}>
              {p.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold z-10 shadow-lg">MOST POPULAR</div>}
              <GBorder className="h-full" gradient={p.popular ? 'from-emerald-500/60 via-cyan-500/50 to-emerald-500/60' : 'from-white/10 via-transparent to-white/10'}>
                <div className={cn("p-6 md:p-8 h-full flex flex-col", p.popular && "bg-emerald-500/[0.03]")}>
                  <div className="mb-6"><div className={cn("w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br", p.g)}><Shield className="w-6 h-6 text-white" /></div><h3 className={cn("text-xl md:text-2xl font-bold mb-1", isDark ? "text-white" : "text-gray-900")}>{p.name}</h3><p className={isDark ? "text-gray-400" : "text-gray-500"}>{p.desc}</p></div>
                  <div className="mb-6">{p.pA !== null ? <div className="flex items-baseline gap-1"><span className={cn("text-4xl md:text-5xl font-bold", isDark ? "text-white" : "text-gray-900")}>{formatPrice(annual ? p.pA : p.pM!)}</span><span className={isDark ? "text-gray-400" : "text-gray-500"}>/mo</span></div> : <span className={cn("text-4xl font-bold", isDark ? "text-white" : "text-gray-900")}>Custom</span>}</div>
                  <ul className="space-y-3 mb-8 flex-1">{p.features.map((f, j) => <li key={j} className="flex items-start gap-3"><div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", f.ok ? "bg-emerald-500/20" : "bg-gray-500/20")}>{f.ok ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-gray-500" />}</div><span className={cn("text-sm", f.ok ? (isDark ? "text-gray-300" : "text-gray-600") : "text-gray-500")}>{f.t}</span></li>)}</ul>
                  <Btn variant={p.popular ? 'primary' : 'secondary'} onClick={() => navigate('/register')} fullWidth size="lg" icon={ArrowRight}>{p.cta}</Btn>
                </div>
              </GBorder>
            </motion.div>
          ))}
        </motion.div>
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeInUp} className={cn("mt-12 flex flex-wrap justify-center gap-6 text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{[{ icon: RefreshCw, text: '30-day money-back' }, { icon: Shield, text: 'No credit card' }, { icon: Clock, text: 'Cancel anytime' }].map((x, i) => <div key={i} className="flex items-center gap-2"><x.icon className="w-4 h-4 text-emerald-400" /><span>{x.text}</span></div>)}</motion.div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const { isDark } = useT(); const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-100px" }); const [open, setOpen] = useState<number | null>(0);
  const list = [
    { q: "How does Nexure's fraud detection work?", a: "Our AI analyzes 150+ data points per claim using ML models trained on lakhs of Indian claims, identifying patterns with 99.7% accuracy." },
    { q: "Is Nexure IRDAI compliant?", a: "Yes, fully compliant with all IRDAI guidelines including data localization. All data stored in India." },
    { q: "What's the implementation timeline?", a: "2-3 weeks for most customers. Enterprise deployments take 4-6 weeks." },
    { q: "Can I integrate with existing TPAs?", a: "Yes! Pre-built integrations with Medi Assist, Vidal Health, FHPL, and 50+ hospital networks." },
    { q: "Do you offer a free trial?", a: "Yes! 14-day free trial with full features. No credit card required." },
    { q: "How secure is my data?", a: "Bank-grade AES-256 encryption, ISO 27001, SOC 2 Type II. All data stored in India." },
  ];
  return (
    <section ref={ref} id="faq" className="py-20 md:py-32 relative overflow-hidden">
      <Orb className="w-[400px] h-[400px] -right-20 top-20" color="purple" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SHead badge="FAQ" badgeIcon={HelpCircle} title="Frequently Asked" highlight="Questions" description="Everything you need to know about Nexure." />
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="space-y-4">
          {list.map((f, i) => (
            <motion.div key={i} variants={fadeInUp}><Glass hover={false} className="overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full p-6 text-left flex items-start justify-between gap-4 group"><span className={cn("font-semibold transition-colors pr-4", open === i ? "text-emerald-400" : isDark ? "text-white group-hover:text-emerald-400" : "text-gray-900")}>{f.q}</span><motion.div animate={{ rotate: open === i ? 180 : 0 }} className="flex-shrink-0 mt-1"><ChevronDown className={cn("w-5 h-5", isDark ? "text-gray-400" : "text-gray-500")} /></motion.div></button>
              <AnimatePresence>{open === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><div className={cn("px-6 pb-6 leading-relaxed", isDark ? "text-gray-400" : "text-gray-600")}>{f.a}</div></motion.div>}</AnimatePresence>
            </Glass></motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Security = () => {
  const { isDark } = useT(); const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-100px" });
  const certs = [{ name: 'IRDAI Compliant', icon: Shield, desc: 'Full regulatory compliance' }, { name: 'ISO 27001', icon: Award, desc: 'International standard' }, { name: 'SOC 2 Type II', icon: FileCheck, desc: 'Annual audits' }, { name: 'Data Localization', icon: Globe, desc: 'Data in India' }];
  const feats = [{ icon: Lock, title: 'Encryption', desc: 'AES-256 at rest and transit' }, { icon: Shield, title: 'Access Controls', desc: 'Role-based with audit logs' }, { icon: Eye, title: '24/7 Monitoring', desc: 'Continuous monitoring' }, { icon: Server, title: 'India DCs', desc: 'Indian data centers' }, { icon: RefreshCw, title: 'Backup', desc: 'Auto backups' }, { icon: Lock, title: 'MFA', desc: 'Multi-factor auth' }];
  return (
    <section ref={ref} id="security" className="py-20 md:py-32 relative overflow-hidden">
      <Orb className="w-[400px] h-[400px] -right-20 top-20" color="emerald" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div variants={slideL}>
            <Tag variant="success" icon={Shield} className="mb-6">Enterprise Security</Tag>
            <h2 className={cn("text-3xl sm:text-4xl md:text-5xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>Bank-Grade Security<br /><span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">You Can Trust</span></h2>
            <p className={cn("text-lg md:text-xl mb-8", isDark ? "text-gray-400" : "text-gray-600")}>Multiple layers of protection with full IRDAI compliance.</p>
            <div className="grid grid-cols-2 gap-4 mb-8">{certs.map((c, i) => <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.3 + i * 0.1 }} className={cn("p-4 rounded-xl border", isDark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-500/5 border-emerald-500/20")}><div className="flex items-center gap-3 mb-2"><c.icon className="w-5 h-5 text-emerald-400" /><span className={cn("font-semibold text-sm", isDark ? "text-white" : "text-gray-900")}>{c.name}</span></div><p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>{c.desc}</p></motion.div>)}</div>
          </motion.div>
          <motion.div variants={slideR} className="grid grid-cols-2 gap-4">{feats.map((f, i) => <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 + i * 0.1 }}><Glass className="p-5 h-full"><div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3"><f.icon className="w-5 h-5 text-emerald-400" /></div><h3 className={cn("font-semibold mb-1", isDark ? "text-white" : "text-gray-900")}>{f.title}</h3><p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{f.desc}</p></Glass></motion.div>)}</motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Contact = () => {
  const { isDark } = useT(); const toast = useToast(); const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [type, setType] = useState('demo'); const [submitting, setSubmitting] = useState(false); const [submitted, setSubmitted] = useState(false);

  const validate = () => { const e: Record<string, string> = {}; if (!form.name.trim()) e.name = 'Required'; if (!form.email.trim()) e.email = 'Required'; else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'; setErrors(e); return !Object.keys(e).length; };
  const onChange = (f: string, v: string) => { setForm(p => ({ ...p, [f]: v })); if (errors[f]) setErrors(p => { const n = { ...p }; delete n[f]; return n; }); };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { toast.error('Validation Error', 'Please fix the form errors.'); return; }
    setSubmitting(true);
    try { await landingAPI.submitContact({ ...form, type }); setSubmitted(true); toast.success('Message Sent!', 'We\'ll get back to you within 24 hours.'); }
    catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Please try again.'); }
    finally { setSubmitting(false); }
  };

  const inp = (field: string, label: string, tp = 'text', ph = '', Ic?: React.ElementType, req = false) => (
    <div>
      <label className={cn("block text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-700")}>{label}{req && <span className="text-red-400 ml-1">*</span>}</label>
      <div className="relative">
        {Ic && <Ic className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5", errors[field] ? "text-red-400" : isDark ? "text-gray-400" : "text-gray-500")} />}
        <input type={tp} value={form[field as keyof typeof form]} onChange={e => onChange(field, e.target.value)} placeholder={ph}
          className={cn("w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2", Ic && "pl-12", errors[field] ? "border-red-500 focus:ring-red-500/50" : isDark ? "bg-white/[0.05] border-white/[0.1] text-white placeholder-gray-500 focus:ring-emerald-500/50" : "bg-black/[0.02] border-black/[0.1] text-gray-900 placeholder-gray-400 focus:ring-emerald-500/50")} />
        {errors[field] && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[field]}</motion.p>}
      </div>
    </div>
  );

  const contacts = [{ icon: Mail, label: 'Email', value: 'hello@nexure.in', href: 'mailto:hello@nexure.in' }, { icon: Phone, label: 'Phone', value: '+91 80 4567 8900', href: 'tel:+918045678900' }, { icon: MapPin, label: 'Address', value: 'Bangalore, India', href: '#' }, { icon: Clock, label: 'Hours', value: 'Mon-Fri, 9AM-6PM IST', href: '#' }];
  const types = [{ v: 'demo', l: 'Schedule Demo', i: PlayCircle }, { v: 'pricing', l: 'Get Pricing', i: IndianRupee }, { v: 'support', l: 'Support', i: Headphones }, { v: 'other', l: 'Other', i: MessageCircle }];

  return (
    <section ref={ref} id="contact" className="py-20 md:py-32 relative overflow-hidden">
      <Orb className="w-[600px] h-[600px] left-1/2 -translate-x-1/2 top-0" color="cyan" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SHead badge="Contact Us" badgeIcon={MessageCircle} title="Get in Touch" highlight="With Our Team" description="Have questions? We'd love to hear from you." />
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div variants={slideL} className="lg:col-span-2">
            <div className="space-y-4 mb-8">{contacts.map((c, i) => (
              <motion.a key={i} href={c.href} whileHover={{ x: 5 }} className={cn("flex items-center gap-4 p-4 rounded-xl transition-colors group", isDark ? "hover:bg-white/[0.05]" : "hover:bg-black/[0.03]")}><div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center"><c.icon className="w-5 h-5 text-emerald-400" /></div><div><p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{c.label}</p><p className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{c.value}</p></div></motion.a>
            ))}</div>
            <div><p className={cn("text-sm font-medium mb-4", isDark ? "text-gray-400" : "text-gray-500")}>Follow Us</p><div className="flex gap-3">{[Twitter, Linkedin, Youtube, Instagram].map((Ic, i) => <motion.a key={i} href="#" whileHover={{ scale: 1.1 }} className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-colors", isDark ? "bg-white/[0.05] text-gray-400 hover:bg-emerald-500/20 hover:text-emerald-400" : "bg-black/[0.03] text-gray-500 hover:bg-emerald-500/10 hover:text-emerald-500")}><Ic className="w-5 h-5" /></motion.a>)}</div></div>
          </motion.div>
          <motion.div variants={slideR} className="lg:col-span-3">
            <GBorder animate><div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="w-20 h-20 rounded-full bg-emerald-500/20 mx-auto mb-6 flex items-center justify-center"><CheckCircle2 className="w-10 h-10 text-emerald-400" /></motion.div>
                    <h3 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Message Sent!</h3>
                    <p className={cn("mb-6", isDark ? "text-gray-400" : "text-gray-500")}>We'll get back to you within 24 hours.</p>
                    <Btn variant="secondary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', company: '', phone: '', message: '' }); setType('demo'); }} icon={RefreshCw} iconPosition="left">Send Another</Btn>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={onSubmit} className="space-y-6">
                    <div><label className={cn("block text-sm font-medium mb-3", isDark ? "text-gray-300" : "text-gray-700")}>I want to...</label><div className="flex flex-wrap gap-2">{types.map(t => <button key={t.v} type="button" onClick={() => setType(t.v)} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all", type === t.v ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25" : isDark ? "bg-white/[0.05] text-gray-300 hover:bg-white/[0.1]" : "bg-black/[0.03] text-gray-600 hover:bg-black/[0.05]")}><t.i className="w-4 h-4" />{t.l}</button>)}</div></div>
                    <div className="grid sm:grid-cols-2 gap-4">{inp('name', 'Full Name', 'text', 'John Doe', Users, true)}{inp('email', 'Work Email', 'email', 'john@company.com', Mail, true)}</div>
                    <div className="grid sm:grid-cols-2 gap-4">{inp('company', 'Company', 'text', 'Acme Insurance', Building2)}{inp('phone', 'Phone', 'tel', '+91 98765 43210', Phone)}</div>
                    <div><label className={cn("block text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-700")}>Message</label><textarea value={form.message} onChange={e => onChange('message', e.target.value)} placeholder="Tell us about your requirements..." rows={4} className={cn("w-full px-4 py-3 rounded-xl border transition-all resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50", isDark ? "bg-white/[0.05] border-white/[0.1] text-white placeholder-gray-500" : "bg-black/[0.02] border-black/[0.1] text-gray-900 placeholder-gray-400")} /></div>
                    <Btn type="submit" variant="primary" fullWidth size="lg" loading={submitting} icon={Send} disabled={submitting}>{submitting ? 'Sending...' : 'Send Message'}</Btn>
                    <p className={cn("text-xs text-center", isDark ? "text-gray-500" : "text-gray-400")}>By submitting, you agree to our Privacy Policy and Terms.</p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div></GBorder>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const CtaSection = () => {
  const { isDark } = useT(); const navigate = useNavigate(); const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section ref={ref} id="cta" className="py-20 md:py-32 relative overflow-hidden">
      <Orb className="w-[600px] h-[600px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" color="emerald" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={scaleIn}>
          <GBorder gradient="from-emerald-500/60 via-cyan-500/40 to-emerald-500/60" animate>
            <div className="p-8 sm:p-12 md:p-16 lg:p-20 text-center">
              <Tag variant="success" pulse icon={Zap} className="mb-8">Ready to Transform?</Tag>
              <h2 className={cn("text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>Start Your Journey to<br /><span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Smarter Insurance</span></h2>
              <p className={cn("text-lg md:text-xl max-w-2xl mx-auto mb-10", isDark ? "text-gray-400" : "text-gray-600")}>Join 180+ insurance companies already using Nexure to process claims faster and detect fraud earlier.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8"><Mag><Btn variant="primary" size="xl" onClick={() => navigate('/register')} icon={ArrowRight} glow>Start Free 14-Day Trial</Btn></Mag><Mag><Btn variant="secondary" size="xl" onClick={() => navigate('/login')}>Sign In</Btn></Mag></div>
              <div className={cn("flex flex-wrap justify-center gap-6 text-sm", isDark ? "text-gray-500" : "text-gray-400")}>{[{ icon: Check, text: 'No credit card' }, { icon: Check, text: '14-day trial' }, { icon: Check, text: 'Cancel anytime' }].map((x, i) => <span key={i} className="flex items-center gap-2"><x.icon className="w-4 h-4 text-emerald-400" />{x.text}</span>)}</div>
            </div>
          </GBorder>
        </motion.div>
      </div>
    </section>
  );
};

const Foot = () => {
  const { isDark } = useT(); const toast = useToast(); const [email, setEmail] = useState(''); const [sub, setSub] = useState(false);
  const onSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error('Invalid Email', 'Enter a valid email.'); return; }
    setSub(true);
    try { await landingAPI.subscribeNewsletter(email); toast.success('Subscribed!', 'Thanks for subscribing.'); setEmail(''); }
    catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Try again.'); }
    finally { setSub(false); }
  };
  const links: Record<string, { label: string; href: string; badge?: string }[]> = {
    Product: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'Security', href: '#security' }],
    Solutions: [{ label: 'Motor', href: '#solutions' }, { label: 'Health', href: '#solutions' }, { label: 'Property', href: '#solutions' }],
    Company: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#', badge: 'Hiring!' }, { label: 'Contact', href: '#contact' }],
    Resources: [{ label: 'FAQ', href: '#faq' }, { label: 'ROI Calculator', href: '#roi-calculator' }, { label: 'Help', href: '#' }],
  };
  return (
    <footer className={cn("pt-20 pb-8 border-t", isDark ? "border-white/[0.05] bg-gray-950" : "border-black/[0.05] bg-gray-50")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25"><Shield className="w-5 h-5 text-white" /></div><span className="text-xl font-bold"><span className={isDark ? "text-white" : "text-gray-900"}>NEX</span><span className="text-emerald-400">URE</span></span></a>
            <p className={cn("text-sm mb-6", isDark ? "text-gray-400" : "text-gray-500")}>AI-powered insurance platform for Indian insurers.</p>
            <div className="flex gap-2">{[Twitter, Linkedin, Youtube, Instagram, Github].map((Ic, i) => <motion.a key={i} href="#" whileHover={{ scale: 1.1 }} className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-all", isDark ? "bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-emerald-500/10" : "bg-black/[0.02] border border-black/[0.08] text-gray-500 hover:text-gray-900 hover:bg-emerald-500/10")}><Ic className="w-5 h-5" /></motion.a>)}</div>
          </div>
          {Object.entries(links).map(([cat, items]) => <nav key={cat}><h3 className={cn("font-semibold mb-4 text-sm", isDark ? "text-white" : "text-gray-900")}>{cat}</h3><ul className="space-y-3">{items.map(l => <li key={l.label}><a href={l.href} className={cn("text-sm transition-colors hover:text-emerald-400 inline-flex items-center gap-2", isDark ? "text-gray-400" : "text-gray-500")}>{l.label}{l.badge && <Tag variant="success">{l.badge}</Tag>}</a></li>)}</ul></nav>)}
        </div>
        <div className={cn("py-8 border-y mb-8", isDark ? "border-white/[0.05]" : "border-black/[0.05]")}>
          <div className="max-w-xl mx-auto text-center">
            <h3 className={cn("font-semibold mb-2", isDark ? "text-white" : "text-gray-900")}>Stay Updated</h3>
            <p className={cn("text-sm mb-4", isDark ? "text-gray-400" : "text-gray-500")}>Get the latest insights delivered to your inbox.</p>
            <form onSubmit={onSub} className="flex gap-3 max-w-md mx-auto"><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className={cn("flex-1 px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50", isDark ? "bg-white/[0.05] border-white/[0.1] text-white placeholder-gray-500" : "bg-black/[0.02] border-black/[0.1] text-gray-900 placeholder-gray-400")} /><Btn type="submit" variant="primary" loading={sub}>Subscribe</Btn></form>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-400")}>© {CURRENT_YEAR} Nexure Technologies Pvt. Ltd. All rights reserved.</p>
          <a href="mailto:hello@nexure.in" className={cn("flex items-center gap-2 text-sm transition-colors hover:text-emerald-400", isDark ? "text-gray-400" : "text-gray-500")}><Mail className="w-4 h-4" />hello@nexure.in</a>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// WIDGETS
// ============================================================================
const ChatWidget = () => {
  const { isDark } = useT(); const [isOpen, setIsOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ type: 'bot', text: "Hi! 👋 I'm Nexure assistant. How can I help?", time: new Date() }]);
  const [input, setInput] = useState(''); const [typing, setTyping] = useState(false); const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = (t?: string) => {
    const m = t || input; if (!m.trim()) return;
    setMsgs(p => [...p, { type: 'user', text: m, time: new Date() }]); setInput(''); setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const r: Record<string, string> = { "schedule a demo": "Pick a time at calendly.com/nexure or we'll reach out!", "pricing info": "Starter: ₹14,999/mo, Professional: ₹49,999/mo.", "talk to sales": "Reach sales@nexure.in or +91 80 4567 8900.", "technical support": "Email support@nexure.in or visit help.nexure.in." };
      setMsgs(p => [...p, { type: 'bot', text: r[m.toLowerCase()] || "Thanks! Email hello@nexure.in for quick help.", time: new Date() }]);
    }, 1500);
  };

  const fmt = (d: Date) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <motion.button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <AnimatePresence mode="wait">{isOpen ? <motion.div key="c" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="w-6 h-6" /></motion.div> : <motion.div key="o" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle className="w-6 h-6" /></motion.div>}</AnimatePresence>
      </motion.button>
      <AnimatePresence>{isOpen && (
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className={cn("fixed bottom-24 right-6 z-50 w-[calc(100%-3rem)] sm:w-96 rounded-2xl shadow-2xl overflow-hidden", isDark ? "bg-gray-900 border border-white/[0.08]" : "bg-white border border-black/[0.08]")}>
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div><div className="flex-1"><h3 className="text-white font-semibold">Nexure Assistant</h3><p className="text-emerald-100 text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />Online</p></div><button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20"><Minimize2 className="w-4 h-4" /></button></div></div>
          <div className={cn("h-80 overflow-y-auto p-4 space-y-4", isDark ? "bg-gray-900" : "bg-gray-50")}>
            {msgs.map((m, i) => <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", m.type === 'user' ? "justify-end" : "justify-start")}><div className={cn("max-w-[85%] p-3 rounded-2xl text-sm", m.type === 'user' ? "bg-emerald-500 text-white rounded-br-sm" : isDark ? "bg-white/[0.05] text-gray-300 rounded-bl-sm border border-white/[0.05]" : "bg-white text-gray-700 rounded-bl-sm border border-black/[0.05]")}><p>{m.text}</p><p className={cn("text-[10px] mt-1", m.type === 'user' ? "text-emerald-200" : isDark ? "text-gray-500" : "text-gray-400")}>{fmt(m.time)}</p></div></motion.div>)}
            {typing && <div className="flex justify-start"><div className={cn("px-4 py-3 rounded-2xl rounded-bl-sm", isDark ? "bg-white/[0.05]" : "bg-white border border-black/[0.05]")}><div className="flex gap-1">{[0, 1, 2].map(i => <motion.div key={i} className="w-2 h-2 rounded-full bg-emerald-400" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} />)}</div></div></div>}
            <div ref={endRef} />
          </div>
          {msgs.length <= 2 && <div className={cn("px-4 py-2 border-t flex flex-wrap gap-2", isDark ? "border-white/[0.05]" : "border-black/[0.05]")}>{["Schedule a demo", "Pricing info", "Talk to sales", "Technical support"].map((r, i) => <button key={i} onClick={() => send(r)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors", isDark ? "bg-white/[0.05] text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400" : "bg-black/[0.03] text-gray-600 hover:bg-emerald-500/10 hover:text-emerald-600")}>{r}</button>)}</div>}
          <div className={cn("p-4 border-t", isDark ? "border-white/[0.05]" : "border-black/[0.05]")}><form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2"><input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." className={cn("flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50", isDark ? "bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500" : "bg-black/[0.02] border border-black/[0.1] text-gray-900 placeholder-gray-400")} /><button type="submit" disabled={!input.trim()} className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", input.trim() ? "bg-emerald-500 text-white hover:bg-emerald-600" : isDark ? "bg-white/[0.05] text-gray-500" : "bg-black/[0.03] text-gray-400")}><Send className="w-5 h-5" /></button></form></div>
        </motion.div>
      )}</AnimatePresence>
    </>
  );
};

const CookieBanner = () => {
  const { isDark } = useT(); const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem('nexure_cookie_consent')) { const t = setTimeout(() => setShow(true), 2000); return () => clearTimeout(t); } }, []);
  return (
    <AnimatePresence>{show && (
      <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed bottom-6 left-6 right-6 md:left-6 md:right-auto md:max-w-md z-40">
        <Glass className="p-6" hover={false}><div className="flex items-start gap-4"><div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0"><Cookie className="w-6 h-6 text-emerald-400" /></div><div className="flex-1"><h3 className={cn("font-semibold mb-2", isDark ? "text-white" : "text-gray-900")}>Cookie Preferences 🍪</h3><p className={cn("text-sm mb-4", isDark ? "text-gray-400" : "text-gray-600")}>We use cookies to enhance your experience.</p><div className="flex flex-wrap gap-2"><Btn size="sm" onClick={() => { localStorage.setItem('nexure_cookie_consent', 'accepted'); setShow(false); }}>Accept All</Btn><Btn variant="ghost" size="sm" onClick={() => { localStorage.setItem('nexure_cookie_consent', 'declined'); setShow(false); }}>Decline</Btn></div></div></div></Glass>
      </motion.div>
    )}</AnimatePresence>
  );
};

const ScrollTop = () => {
  const { isDark } = useT(); const [show, setShow] = useState(false); const p = useScrollProg();
  useEffect(() => { const h = () => setShow(window.scrollY > 500); window.addEventListener('scroll', h, { passive: true }); h(); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <AnimatePresence>{show && (
      <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn("fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full flex items-center justify-center transition-all group", isDark ? "bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:text-white" : "bg-black/[0.05] border border-black/[0.1] text-gray-500 hover:text-gray-900")}>
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="none" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="2" /><circle cx="24" cy="24" r="20" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeDasharray={125.6} strokeDashoffset={125.6 - (p / 100) * 125.6} /></svg>
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    )}</AnimatePresence>
  );
};

// ============================================================================
// STYLES & ASSEMBLY
// ============================================================================
const Styles = () => <style>{`
  @keyframes gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
  @keyframes gradient-rotate { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); } 50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); } }
  .animate-gradient { animation: gradient 6s ease infinite; }
  .animate-gradient-rotate { animation: gradient-rotate 3s ease infinite; }
  .animate-glow { animation: glow 2s ease-in-out infinite; }
  html { scroll-behavior: smooth; }
  ::selection { background: rgba(16, 185, 129, 0.3); color: white; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
  ::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.3); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.5); }
  input[type="range"] { -webkit-appearance: none; }
  input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; background: linear-gradient(135deg, #10B981, #06B6D4); border-radius: 50%; cursor: pointer; box-shadow: 0 2px 10px rgba(16, 185, 129, 0.4); }
  input[type="range"]::-moz-range-thumb { width: 20px; height: 20px; background: linear-gradient(135deg, #10B981, #06B6D4); border-radius: 50%; cursor: pointer; border: none; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
`}</style>;

const Content = () => {
  const { isDark } = useT(); const [loading, setLoading] = useState(true);
  return (
    <div className={cn("min-h-screen overflow-x-hidden transition-colors duration-300", isDark ? "bg-gray-950 text-white" : "bg-white text-gray-900")}>
      <Styles />
      <AnimatePresence>{loading && <Loader onDone={() => setLoading(false)} />}</AnimatePresence>
      <ProgressBar />
      <Nav />
      <main>
        <Hero />
        <Logos />
        <LiveStats />
        <Features />
        <Solutions />
        <ROICalc />
        <Comparison />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Security />
        <Contact />
        <CtaSection />
      </main>
      <Foot />
      <ChatWidget />
      <ScrollTop />
      <CookieBanner />
    </div>
  );
};

// ============================================================================
// EXPORT
// ============================================================================
export function LandingPage() {
  return (
    <ThemeWrap>
      <CurrWrap>
        <Content />
      </CurrWrap>
    </ThemeWrap>
  );
}

export default LandingPage;