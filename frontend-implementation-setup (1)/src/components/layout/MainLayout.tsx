import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileSidebar } from './MobileSidebar';
import { Toast } from '@/components/ui/Toast';
import { useSidebar } from '@/context/SidebarContext';
import { cn } from '@/utils/cn';

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const { isCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on resize to lg
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-gray-100">
      {/* Skip to main content — keyboard / screen reader */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-[#10B981] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar — hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar — slide-over */}
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main wrapper — offset by sidebar width on desktop */}
      <div
        className={cn(
          'flex min-h-screen flex-col transition-[margin] duration-300 ease-in-out',
          // On desktop, shift right to clear the fixed sidebar
          isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        )}
      >
        <Navbar onMobileMenuClick={() => setMobileOpen(true)} />

        <main
          id="main-content"
          role="main"
          className="flex-1 w-full px-4 py-6 sm:px-6 lg:px-8 mx-auto max-w-[1600px] animate-fade-in"
        >
          {children}
        </main>

        {/* Footer */}
        <footer
          className="border-t border-white/[0.04] px-4 sm:px-6 py-3 flex items-center justify-between"
          role="contentinfo"
        >
          <p className="text-[10px] text-gray-700">
            INSURAI · Claims Intelligence Platform
          </p>
          <p className="text-[10px] text-gray-700 tabular-nums">
            {new Date().getFullYear()}
          </p>
        </footer>
      </div>

      {/* Global Toast Notifications */}
      <Toast />
    </div>
  );
};
