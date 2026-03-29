import { ReactNode, useState, useEffect } from 'react';
import { CustomerSidebar } from './CustomerSidebar';
import { MobileCustomerSidebar } from './MobileCustomerSidebar';
import { Navbar } from './Navbar';
import { Toast } from '@/components/ui/Toast';
import { ChatBot } from '@/components/ui/ChatBot';
import { EmergencySOS } from '@/components/ui/EmergencySOS';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { VoiceInterface } from '@/components/ui/VoiceInterface';
import { cn } from '@/utils/cn';

export const CustomerLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-gray-100">
      {/* Skip link */}
      <a
        href="#customer-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-[#10B981] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <CustomerSidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />
      </div>

      {/* Mobile Sidebar */}
      <MobileCustomerSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content — offset by sidebar on desktop */}
      <div
        className={cn(
          'flex min-h-screen flex-col transition-[margin] duration-300 ease-in-out',
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        )}
      >
        <Navbar onMobileMenuClick={() => setMobileOpen(true)} />

        <main
          id="customer-main"
          role="main"
          className="flex-1 w-full px-4 py-6 sm:px-6 lg:px-8 max-w-[1400px] mx-auto animate-fade-in"
        >
          {children}
        </main>

        <footer
          className="border-t border-white/[0.04] px-4 sm:px-6 py-3 flex items-center justify-between"
          role="contentinfo"
        >
          <p className="text-[10px] text-gray-700">INSURAI · Customer Portal</p>
          <p className="text-[10px] text-gray-700 tabular-nums">{new Date().getFullYear()}</p>
        </footer>
      </div>

      <Toast />
      <ChatBot />
      <EmergencySOS />
      <VoiceInterface />
      <CookieConsent />
    </div>
  );
};
