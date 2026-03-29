import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Shield, FileCheck,
  ChevronLeft, ChevronRight, LogOut,
  ShieldCheck, Users, History, Settings, Plus,
  Bell, Sliders, UserCog, Inbox, BarChart2, Layers, Lock,
  Database, Cookie, Key, PieChart, Target, TrendingUp, Plug,
  Brain, Link2, Award,
} from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/formatters';

const navSections = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Claims',
    items: [
      { name: 'All Claims', href: '/claims', icon: FileText },
      { name: 'New Claim', href: '/claims/new', icon: Plus },
      { name: 'My Queue', href: '/queue', icon: Inbox },
      { name: 'Operations Hub', href: '/claims/hub', icon: Layers },
      { name: 'Analytics', href: '/claims/analytics', icon: BarChart2 },
    ],
  },
  {
    label: 'Fraud & AI',
    items: [
      { name: 'Fraud Alerts', href: '/fraud', icon: Shield },
      { name: 'AI Hub', href: '/ai-hub', icon: Brain },
      { name: 'Blockchain', href: '/blockchain', icon: Link2 },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { name: 'Advanced Analytics', href: '/analytics/advanced', icon: TrendingUp },
      { name: 'Customer 360', href: '/customers/360/cust_1', icon: Target },
      { name: 'Segmentation', href: '/customers/segments', icon: PieChart },
    ],
  },
  {
    label: 'Management',
    items: [
      { name: 'Policies', href: '/policies', icon: FileCheck },
      { name: 'Team', href: '/users', icon: Users },
      { name: 'Roles', href: '/admin/roles', icon: UserCog },
      { name: 'Rules', href: '/admin/rules', icon: Sliders },
      { name: 'Activity Log', href: '/audit', icon: History },
    ],
  },
  {
    label: 'Security & Compliance',
    items: [
      { name: 'Security Center', href: '/security', icon: Lock },
      { name: 'Data Retention', href: '/data-retention', icon: Database },
      { name: 'Consent Manager', href: '/consent', icon: Cookie },
      { name: 'API Keys', href: '/api-keys', icon: Key },
      { name: 'Integrations', href: '/integrations', icon: Plug },
    ],
  },
  {
    label: 'Account',
    items: [
      { name: 'Notifications', href: '/notifications', icon: Bell },
      { name: 'Profile', href: '/profile', icon: UserCog },
      { name: 'Settings', href: '/settings', icon: Settings },
      { name: 'Platform Overview', href: '/platform-overview', icon: Award },
    ],
  },
];

export const Sidebar = () => {
  const { isCollapsed, toggle } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen flex flex-col z-40 transition-all duration-300',
        'border-r border-white/[0.06]',
        'bg-[#0D1424]',
        isCollapsed ? 'w-[72px]' : 'w-64'
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-white/[0.06]',
          isCollapsed ? 'justify-center px-0' : 'px-5 gap-3'
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#10B981]/15 text-[#10B981]">
          <ShieldCheck size={18} aria-hidden="true" />
        </div>
        {!isCollapsed && (
          <span className="text-lg font-bold tracking-tight text-white">
            INSUR<span className="text-[#10B981]">AI</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 hide-scrollbar" aria-label="Sidebar">
        {navSections.map((section) => (
          <div key={section.label} className="mb-2">
            {!isCollapsed && (
              <p className="mb-1 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5 px-2">
              {section.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isCollapsed && 'justify-center',
                      isActive
                        ? 'bg-[#10B981]/12 text-[#10B981]'
                        : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
                    )
                  }
                  title={isCollapsed ? item.name : undefined}
                  aria-label={item.name}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={18}
                        className={cn(
                          'shrink-0 transition-colors',
                          isActive ? 'text-[#10B981]' : 'text-gray-600 group-hover:text-gray-300'
                        )}
                        aria-hidden="true"
                      />
                      {!isCollapsed && <span>{item.name}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User area */}
      {user && (
        <div
          className={cn(
            'border-t border-white/[0.06] p-3',
            isCollapsed && 'flex flex-col items-center gap-2'
          )}
        >
          {!isCollapsed ? (
            <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5 transition-colors">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10B981]/20 text-[#10B981] text-xs font-bold">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-semibold text-white">{user.name}</p>
                <p className="truncate text-[10px] text-gray-500 capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-400 transition-colors p-1 rounded"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:text-red-400 hover:bg-white/5 transition-colors"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={toggle}
        className="flex h-10 w-full shrink-0 items-center justify-center border-t border-white/[0.06] text-gray-600 hover:bg-white/5 hover:text-gray-300 transition-all"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight size={16} />
        ) : (
          <span className="flex items-center gap-2 text-xs">
            <ChevronLeft size={16} /> Collapse
          </span>
        )}
      </button>
    </aside>
  );
};
