import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, ShieldCheck, CreditCard,
  User, X, LogOut, Plus, Trophy, Users, RefreshCw, Calculator, Zap,
  BookOpen, Share2, HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/formatters';

const navGroups = [
  {
    label: 'My Account',
    items: [
      { name: 'Dashboard',   href: '/customer/dashboard',  icon: LayoutDashboard },
      { name: 'My Policies',       href: '/customer/policies',          icon: ShieldCheck },
      { name: 'Policy Management', href: '/customer/policy-management', icon: ShieldCheck },
      { name: 'My Claims',   href: '/customer/claims',     icon: FileText },
      { name: 'New Claim',   href: '/customer/claims/new', icon: Plus },
      { name: 'Payments',    href: '/customer/payments',   icon: CreditCard },
      { name: 'Renewal',     href: '/customer/renewal',    icon: RefreshCw },
    ],
  },
  {
    label: 'Tools',
    items: [
      { name: 'Get a Quote', href: '/customer/quote',      icon: Zap },
      { name: 'Calculator',  href: '/customer/calculator', icon: Calculator },
      { name: 'Rewards',     href: '/customer/rewards',    icon: Trophy },
      { name: 'Refer & Earn',href: '/customer/referral',   icon: Users },
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

interface MobileCustomerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileCustomerSidebar = ({ isOpen, onClose }: MobileCustomerSidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="absolute left-0 top-0 h-full w-72 bg-[#0D1424] border-r border-white/[0.06] flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981]/15 text-[#10B981]">
              <ShieldCheck size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              INSUR<span className="text-[#10B981]">AI</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 hide-scrollbar" aria-label="Customer navigation">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-[#10B981]/12 text-[#10B981]'
                          : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          size={18}
                          className={cn('shrink-0', isActive ? 'text-[#10B981]' : 'text-gray-600')}
                          aria-hidden="true"
                        />
                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User */}
        {user && (
          <div className="border-t border-white/[0.06] p-3">
            <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#10B981]/20 text-[#10B981] text-xs font-bold">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-semibold text-white">{user.name}</p>
                <p className="truncate text-[10px] text-gray-500">Policyholder</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-400 transition-colors p-1 rounded"
                aria-label="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
