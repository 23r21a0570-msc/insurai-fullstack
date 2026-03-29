import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, ShieldCheck, CreditCard,
  User, ChevronLeft, ChevronRight, LogOut, Plus,
  Trophy, Users, RefreshCw, Calculator, HelpCircle,
  BookOpen, Share2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/formatters';
import { Zap } from 'lucide-react';

const navGroups = [
  {
    label: 'My Account',
    items: [
      { name: 'Dashboard',        href: '/customer/dashboard', icon: LayoutDashboard },
      { name: 'My Policies',      href: '/customer/policies',  icon: ShieldCheck },
      { name: 'Policy Management',href: '/customer/policy-management', icon: ShieldCheck },
      { name: 'My Claims',        href: '/customer/claims',    icon: FileText },
      { name: 'New Claim',        href: '/customer/claims/new',icon: Plus },
      { name: 'Payments',         href: '/customer/payments',  icon: CreditCard },
      { name: 'Renewal',          href: '/customer/renewal',   icon: RefreshCw },
    ],
  },
  {
    label: 'Tools',
    items: [
      { name: 'Get a Quote',  href: '/customer/quote',       icon: Zap },
      { name: 'Calculator',   href: '/customer/calculator',  icon: Calculator },
      { name: 'Rewards',      href: '/customer/rewards',     icon: Trophy },
      { name: 'Refer & Earn', href: '/customer/referral',    icon: Users },
    ],
  },
  {
    label: 'Learn & Connect',
    items: [
      { name: 'Education Hub',  href: '/customer/learn',   icon: BookOpen },
      { name: 'Community',      href: '/customer/social',  icon: Share2 },
      { name: 'Support Center', href: '/customer/support', icon: HelpCircle },
    ],
  },
  {
    label: 'Account',
    items: [
      { name: 'Profile', href: '/customer/profile', icon: User },
    ],
  },
];

interface CustomerSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const CustomerSidebar = ({ collapsed, onToggle }: CustomerSidebarProps) => {
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
        'border-r border-white/[0.06] bg-[#0D1424]',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
      aria-label="Customer navigation"
    >
      {/* Logo */}
      <div className={cn(
        'flex h-16 shrink-0 items-center border-b border-white/[0.06]',
        collapsed ? 'justify-center px-0' : 'px-5 gap-3'
      )}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#10B981]/15 text-[#10B981]">
          <ShieldCheck size={18} aria-hidden="true" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-white">
            INSUR<span className="text-[#10B981]">AI</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 hide-scrollbar space-y-4" aria-label="Customer sidebar">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      collapsed && 'justify-center',
                      isActive
                        ? 'bg-[#10B981]/12 text-[#10B981]'
                        : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
                    )
                  }
                  title={collapsed ? item.name : undefined}
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
                      {!collapsed && <span>{item.name}</span>}
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
        <div className={cn('border-t border-white/[0.06] p-3', collapsed && 'flex flex-col items-center gap-2')}>
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5 transition-colors">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10B981]/20 text-[#10B981] text-xs font-bold">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-semibold text-white">{user.name}</p>
                <p className="truncate text-[10px] text-gray-500">Policyholder</p>
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
        onClick={onToggle}
        className="flex h-10 w-full shrink-0 items-center justify-center border-t border-white/[0.06] text-gray-600 hover:bg-white/5 hover:text-gray-300 transition-all"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
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
