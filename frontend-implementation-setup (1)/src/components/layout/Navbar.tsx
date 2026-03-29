import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Menu, User, Search } from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import { useState } from 'react';

const roleBadge: Record<string, string> = {
  admin:    'text-purple-400',
  manager:  'text-blue-400',
  analyst:  'text-amber-400',
  agent:    'text-gray-400',
  customer: 'text-blue-400',
};

interface NavbarProps {
  onMobileMenuClick?: () => void;
}

export const Navbar = ({ onMobileMenuClick }: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isCustomer = user?.role === 'customer';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToSettings = () => {
    if (isCustomer) {
      navigate('/customer/profile');
    } else {
      navigate('/settings');
    }
    setMenuOpen(false);
  };

  const goToNotifications = () => {
    if (!isCustomer) navigate('/notifications');
    setMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] bg-[#0A0F1A]/80 px-4 sm:px-6 backdrop-blur-sm"
      role="banner"
    >
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-white/[0.06] hover:text-gray-200 transition-all lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* Search button — admin only */}
      {!isCustomer && (
        <button
          onClick={() => navigate('/search')}
          className="hidden sm:flex items-center gap-2 h-8 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 text-xs text-gray-500 hover:text-gray-300 hover:border-white/10 transition-all w-44"
          aria-label="Search"
        >
          <Search size={13} />
          <span>Search…</span>
          <kbd className="ml-auto text-[10px] font-mono opacity-40">⌘K</kbd>
        </button>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell — admin only */}
        {!isCustomer && <NotificationPanel />}

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/[0.06] transition-all"
            aria-label="User menu"
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10B981]/20 text-[#10B981] text-xs font-bold shrink-0">
              {getInitials(user?.name ?? 'U')}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-gray-200 leading-none">{user?.name}</p>
              <p className={cn('text-[10px] capitalize leading-none mt-0.5', roleBadge[user?.role ?? 'agent'])}>
                {user?.role}
              </p>
            </div>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-white/[0.08] bg-[#0F1629] shadow-2xl shadow-black/50 overflow-hidden animate-fade-in"
                role="menu"
              >
                <button
                  onClick={goToSettings}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-400 hover:bg-white/[0.06] hover:text-gray-200 transition-colors"
                  role="menuitem"
                >
                  {isCustomer ? <User size={14} /> : <Settings size={14} />}
                  {isCustomer ? 'Profile' : 'Settings'}
                </button>

                {!isCustomer && (
                  <button
                    onClick={goToNotifications}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-400 hover:bg-white/[0.06] hover:text-gray-200 transition-colors"
                    role="menuitem"
                  >
                    <span className="text-sm">🔔</span> Notifications
                  </button>
                )}

                <div className="border-t border-white/[0.06]" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-400 hover:bg-red-500/[0.08] transition-colors"
                  role="menuitem"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
