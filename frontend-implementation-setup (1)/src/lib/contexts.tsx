import { createContext, useState, useCallback, useEffect, useContext, ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { getCurrentUser, mockCustomerUser } from '@/lib/mockData';
import { TOKEN_KEY, USER_KEY } from '@/lib/utils';

// ─── Auth Context ─────────────────────────────────────────────────────────────
interface AuthCtx {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole | 'customer' | 'admin') => Promise<void>;
  logout: () => void;
}
export const AuthContext = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]     = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) { try { setUser(JSON.parse(saved)); } catch { localStorage.removeItem(USER_KEY); } }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string, role?: UserRole | 'customer' | 'admin') => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    if (!email || !password) { setLoading(false); throw new Error('Invalid credentials'); }
    const resolvedRole = role ?? (email.includes('customer') ? 'customer' : 'admin');
    const u: User = resolvedRole === 'customer' ? mockCustomerUser : getCurrentUser();
    setUser(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    localStorage.setItem(TOKEN_KEY, 'mock-jwt-token');
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// ─── Toast Context ────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'warning' | 'info';
interface Toast  { id: string; type: ToastType; title: string; message?: string; }
interface ToastCtx {
  toasts: Toast[];
  success: (title: string, message?: string) => void;
  error:   (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info:    (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}
export const ToastContext = createContext<ToastCtx | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(p => [...p, { id, type, title, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 5000);
  }, []);
  const dismiss = useCallback((id: string) => setToasts(p => p.filter(t => t.id !== id)), []);
  return (
    <ToastContext.Provider value={{ toasts, success: (t,m)=>add('success',t,m), error: (t,m)=>add('error',t,m), warning: (t,m)=>add('warning',t,m), info: (t,m)=>add('info',t,m), dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

// ─── Sidebar Context ──────────────────────────────────────────────────────────
interface SidebarCtx { isCollapsed: boolean; toggle: () => void; setCollapsed: (v: boolean) => void; }
export const SidebarContext = createContext<SidebarCtx | null>(null);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setCollapsed] = useState(false);
  const toggle = useCallback(() => setCollapsed(p => !p), []);
  return (
    <SidebarContext.Provider value={{ isCollapsed, toggle, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
};
