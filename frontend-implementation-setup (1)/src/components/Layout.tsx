import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Shield, FileCheck, Users, History,
  Settings, ChevronLeft, ChevronRight, Bell, LogOut, Menu, X,
  CreditCard, User, AlertTriangle, Search, Home, ClipboardList,
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { useAuth, useSidebar } from '@/lib/contexts';
import { getNotifications } from '@/lib/mockData';
import { ToastContainer } from '@/components/UI';

// ─── Shared nav helpers ───────────────────────────────────────────────────────
const NavItem = ({ to, icon, label, collapsed, badge }: { to: string; icon: ReactNode; label: string; collapsed: boolean; badge?: number }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
  return (
    <Link to={to} className={cn('flex items-center px-3 py-2.5 rounded-lg transition-colors group relative', isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-500 hover:text-gray-200 hover:bg-white/5')} aria-current={isActive ? 'page' : undefined}>
      <span className="shrink-0 w-5 h-5">{icon}</span>
      {!collapsed && <span className="ml-3 text-sm font-medium truncate">{label}</span>}
      {badge !== undefined && badge > 0 && !collapsed && (
        <span className="ml-auto text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">{badge}</span>
      )}
      {isActive && <div className="absolute left-0 w-0.5 h-5 bg-emerald-500 rounded-r-full" />}
    </Link>
  );
};

const SectionLabel = ({ label, collapsed }: { label: string; collapsed: boolean }) =>
  collapsed ? <div className="h-px bg-white/5 mx-3 my-3" /> : <p className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-6 mb-2">{label}</p>;

// ─── Admin Sidebar ────────────────────────────────────────────────────────────
export const Sidebar = () => {
  const { isCollapsed, toggle } = useSidebar();
  return (
    <aside className={cn('fixed left-0 top-0 h-screen bg-[#0F1629] border-r border-white/5 transition-all duration-300 z-50 flex flex-col', isCollapsed ? 'w-[72px]' : 'w-64')} role="navigation" aria-label="Admin navigation">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
          <Shield className="text-emerald-500" size={18} />
        </div>
        {!isCollapsed && <span className="ml-3 font-bold text-lg tracking-tight">INSUR<span className="text-emerald-500">AI</span></span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto space-y-0.5">
        <SectionLabel label="Overview" collapsed={isCollapsed} />
        <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard"    collapsed={isCollapsed} />
        <SectionLabel label="Claims" collapsed={isCollapsed} />
        <NavItem to="/claims"    icon={<FileText size={20} />}       label="All Claims"   collapsed={isCollapsed} />
        <NavItem to="/queue"     icon={<ClipboardList size={20} />}  label="Queue"        collapsed={isCollapsed} />
        <NavItem to="/fraud"     icon={<AlertTriangle size={20} />}  label="Fraud Alerts" collapsed={isCollapsed} />
        <SectionLabel label="Management" collapsed={isCollapsed} />
        <NavItem to="/policies"  icon={<FileCheck size={20} />}      label="Policies"     collapsed={isCollapsed} />
        <NavItem to="/users"     icon={<Users size={20} />}          label="Team"         collapsed={isCollapsed} />
        <NavItem to="/audit"     icon={<History size={20} />}        label="Activity Log" collapsed={isCollapsed} />
        <SectionLabel label="Account" collapsed={isCollapsed} />
        <NavItem to="/settings"  icon={<Settings size={20} />}       label="Settings"     collapsed={isCollapsed} />
        <NavItem to="/profile"   icon={<User size={20} />}           label="Profile"      collapsed={isCollapsed} />
      </nav>

      {/* Collapse toggle */}
      <button onClick={toggle} className="h-12 border-t border-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors" aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
};

// ─── Customer Sidebar ─────────────────────────────────────────────────────────
export const CustomerSidebar = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <aside className={cn('fixed left-0 top-0 h-screen bg-[#0F1629] border-r border-white/5 transition-all duration-300 z-50 flex flex-col', collapsed ? 'w-[72px]' : 'w-64')} role="navigation" aria-label="Customer navigation">
      <div className="h-16 flex items-center px-4 border-b border-white/5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
          <Shield className="text-emerald-500" size={18} />
        </div>
        {!collapsed && <span className="ml-3 font-bold text-lg tracking-tight">INSUR<span className="text-emerald-500">AI</span></span>}
      </div>
      <nav className="flex-1 py-4 px-2 overflow-y-auto space-y-0.5">
        <SectionLabel label="Menu" collapsed={collapsed} />
        <NavItem to="/customer/dashboard" icon={<Home size={20} />}        label="Dashboard" collapsed={collapsed} />
        <NavItem to="/customer/policies"  icon={<FileCheck size={20} />}   label="Policies"  collapsed={collapsed} />
        <NavItem to="/customer/claims"    icon={<FileText size={20} />}    label="Claims"    collapsed={collapsed} />
        <NavItem to="/customer/payments"  icon={<CreditCard size={20} />}  label="Payments"  collapsed={collapsed} />
        <SectionLabel label="Account" collapsed={collapsed} />
        <NavItem to="/customer/profile"   icon={<User size={20} />}        label="Profile"   collapsed={collapsed} />
      </nav>
    </aside>
  );
};

// ─── Mobile Sidebar ───────────────────────────────────────────────────────────
const MobileNav = ({ onClose, isCustomer }: { onClose: () => void; isCustomer: boolean }) => (
  <div className="fixed inset-0 z-[100] flex" role="dialog" aria-modal="true" aria-label="Mobile navigation">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-72 bg-[#0F1629] border-r border-white/10 h-full flex flex-col animate-slide-in-right">
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Shield className="text-emerald-500" size={18} />
          </div>
          <span className="font-bold text-lg">INSUR<span className="text-emerald-500">AI</span></span>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-400" aria-label="Close menu"><X size={20} /></button>
      </div>
      <nav className="flex-1 py-4 px-2 overflow-y-auto space-y-0.5" onClick={onClose}>
        {isCustomer ? (
          <>
            <NavItem to="/customer/dashboard" icon={<Home size={20} />}       label="Dashboard" collapsed={false} />
            <NavItem to="/customer/policies"  icon={<FileCheck size={20} />}  label="Policies"  collapsed={false} />
            <NavItem to="/customer/claims"    icon={<FileText size={20} />}   label="Claims"    collapsed={false} />
            <NavItem to="/customer/payments"  icon={<CreditCard size={20} />} label="Payments"  collapsed={false} />
            <NavItem to="/customer/profile"   icon={<User size={20} />}       label="Profile"   collapsed={false} />
          </>
        ) : (
          <>
            <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard"    collapsed={false} />
            <NavItem to="/claims"    icon={<FileText size={20} />}        label="All Claims"   collapsed={false} />
            <NavItem to="/queue"     icon={<ClipboardList size={20} />}  label="Queue"        collapsed={false} />
            <NavItem to="/fraud"     icon={<AlertTriangle size={20} />}  label="Fraud Alerts" collapsed={false} />
            <NavItem to="/policies"  icon={<FileCheck size={20} />}      label="Policies"     collapsed={false} />
            <NavItem to="/users"     icon={<Users size={20} />}          label="Team"         collapsed={false} />
            <NavItem to="/audit"     icon={<History size={20} />}        label="Activity Log" collapsed={false} />
            <NavItem to="/settings"  icon={<Settings size={20} />}       label="Settings"     collapsed={false} />
          </>
        )}
      </nav>
    </div>
  </div>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
export const Navbar = ({ onMobileMenuOpen }: { onMobileMenuOpen: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser,   setShowUser]   = useState(false);
  const notifications = getNotifications();
  const unread = notifications.filter(n => !n.read).length;
  const isCustomer = user?.role === 'customer';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="h-16 border-b border-white/5 bg-[#0A0F1A]/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between" role="banner">
      <div className="flex items-center gap-3">
        <button onClick={onMobileMenuOpen} className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-gray-400" aria-label="Open menu"><Menu size={20} /></button>
        {!isCustomer && (
          <button onClick={() => navigate('/search')} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-gray-500 hover:text-gray-300 transition-all text-sm w-56" aria-label="Search">
            <Search size={14} /> <span className="text-xs">Search…</span> <kbd className="ml-auto text-[10px] font-mono opacity-40">⌘K</kbd>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        {!isCustomer && (
          <div className="relative">
            <button onClick={() => { setShowNotifs(p => !p); setShowUser(false); }} className="relative p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors" aria-label={`${unread} notifications`}>
              <Bell size={20} />
              {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread}</span>}
            </button>
            {showNotifs && (
              <div className="absolute right-0 top-12 w-80 bg-[#0F1629] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <p className="text-sm font-bold">Notifications</p>
                  <span className="text-xs text-emerald-500">{unread} new</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                  {notifications.slice(0, 5).map(n => (
                    <div key={n.id} className={cn('px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors', !n.read && 'bg-white/[0.02]')}>
                      <p className={cn('text-sm font-medium', !n.read ? 'text-gray-100' : 'text-gray-400')}>{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{n.message}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-white/5">
                  <button onClick={() => { navigate('/notifications'); setShowNotifs(false); }} className="text-xs text-emerald-500 hover:underline">View all notifications</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="w-px h-6 bg-white/10" />

        {/* User menu */}
        <div className="relative">
          <button onClick={() => { setShowUser(p => !p); setShowNotifs(false); }} className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1" aria-label="User menu" aria-expanded={showUser}>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
              {getInitials(user?.name ?? 'U')}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-gray-200 leading-none">{user?.name}</p>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tight mt-0.5">{user?.role}</p>
            </div>
          </button>
          {showUser && (
            <div className="absolute right-0 top-12 w-52 bg-[#0F1629] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-sm font-bold text-gray-200">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <button onClick={() => { navigate(isCustomer ? '/customer/profile' : '/profile'); setShowUser(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors"><User size={16} /> Profile</button>
                {!isCustomer && <button onClick={() => { navigate('/settings'); setShowUser(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors"><Settings size={16} /> Settings</button>}
              </div>
              <div className="border-t border-white/5 py-1">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"><LogOut size={16} /> Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// ─── MainLayout (Admin) ───────────────────────────────────────────────────────
export const MainLayout = ({ children }: { children: ReactNode }) => {
  const { isCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { width } = { width: typeof window !== 'undefined' ? window.innerWidth : 1024 };

  useEffect(() => {
    if (width >= 1024) setMobileOpen(false);
  }, [width]);

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-gray-100">
      <ToastContainer />
      {/* Desktop sidebar */}
      <div className="hidden lg:block"><Sidebar /></div>
      {/* Mobile sidebar */}
      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} isCustomer={false} />}
      {/* Content */}
      <div className={cn('transition-[margin] duration-300 ease-in-out min-h-screen flex flex-col', 'lg:' + (isCollapsed ? 'ml-[72px]' : 'ml-64'))}>
        <Navbar onMobileMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-[1600px] mx-auto animate-fade-in" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

// ─── CustomerLayout ───────────────────────────────────────────────────────────
export const CustomerLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-gray-100">
      <ToastContainer />
      <div className="hidden lg:block"><CustomerSidebar collapsed={collapsed} /></div>
      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} isCustomer={true} />}
      <div className={cn('transition-[margin] duration-300 ease-in-out min-h-screen flex flex-col', collapsed ? 'lg:ml-[72px]' : 'lg:ml-64')}>
        <div className="h-16 border-b border-white/5 bg-[#0A0F1A]/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-gray-400" aria-label="Open menu"><Menu size={20} /></button>
            <button onClick={() => setCollapsed(p => !p)} className="hidden lg:flex p-2 rounded-lg hover:bg-white/5 text-gray-400" aria-label="Toggle sidebar">
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
          <Navbar onMobileMenuOpen={() => setMobileOpen(true)} />
        </div>
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-[1400px] mx-auto animate-fade-in" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};
