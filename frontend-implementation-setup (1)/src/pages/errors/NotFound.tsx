import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search, FileText, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const QUICK_LINKS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Claims', href: '/claims', icon: FileText },
  { label: 'Fraud Alerts', href: '/fraud', icon: Search },
];

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8 animate-fade-in-up">

        {/* 404 graphic */}
        <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
          {/* Outer rings */}
          <div className="absolute inset-0 rounded-full border border-white/[0.04]" />
          <div className="absolute inset-4 rounded-full border border-white/[0.04]" />
          <div className="absolute inset-8 rounded-full border border-[#10B981]/10" />
          {/* Center number */}
          <span className="relative text-5xl font-black text-transparent bg-gradient-to-br from-white to-gray-600 bg-clip-text select-none">
            404
          </span>
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-[#10B981]/5 blur-xl" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white">Page not found</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
            The page you're looking for doesn't exist or may have been moved. Check the URL or use the links below.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="secondary"
            leftIcon={<ArrowLeft size={15} />}
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
          <Button leftIcon={<Home size={15} />} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </div>

        {/* Quick links */}
        <div className="border-t border-white/[0.06] pt-6">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">
            Or go to
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02] text-sm text-gray-400 hover:text-gray-200 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all"
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
