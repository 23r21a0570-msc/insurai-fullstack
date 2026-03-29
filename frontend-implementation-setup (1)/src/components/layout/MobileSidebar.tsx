import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  X, ShieldCheck, LayoutDashboard, FileText, Shield,
  FileCheck, Users, History, Settings, Plus,
  Bell, Sliders, UserCog, Inbox, LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/utils/formatters';
import { cn } from '@/utils/cn';

const navSections = [
  {
    label: 'Overview',
    items: [{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Claims',
    items: [
      { name: 'All Claims', href: '/claims', icon: FileText },
      { name: 'New Claim', href: '/claims/new', icon: Plus },
      { name: 'My Queue', href: '/queue', icon: Inbox },
    ],
  },
  {
    label: 'Fraud',
    items: [{ name: 'Fraud Alerts', href: '/fraud', icon: Shield }],
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
    label: 'Account',
    items: [
      { name: 'Notifications', href: '/notifications', icon: Bell },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Sidebar panel */}
        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-64 flex-col bg-[#0D1424] border-r border-white/[0.06]">
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
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/[0.06] transition-all"
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto py-4 hide-scrollbar">
                {navSections.map((section) => (
                  <div key={section.label} className="mb-2">
                    <p className="mb-1 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                      {section.label}
                    </p>
                    <div className="space-y-0.5 px-2">
                      {section.items.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          onClick={onClose}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
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
                                className={cn(
                                  'shrink-0',
                                  isActive ? 'text-[#10B981]' : 'text-gray-600'
                                )}
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

              {/* User area */}
              {user && (
                <div className="border-t border-white/[0.06] p-3">
                  <div className="flex items-center gap-3 rounded-lg p-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10B981]/20 text-[#10B981] text-xs font-bold">
                      {getInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-semibold text-white">{user.name}</p>
                      <p className="truncate text-[10px] text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                      aria-label="Sign out"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
