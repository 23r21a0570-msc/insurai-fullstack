import { useNavigate } from 'react-router-dom';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ServerError = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8 animate-fade-in-up">

        {/* Error graphic */}
        <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-red-500/10" />
          <div className="absolute inset-4 rounded-full border border-red-500/10" />
          <div className="absolute inset-8 rounded-full border border-red-500/15 bg-red-500/5" />
          <AlertTriangle size={40} className="relative text-red-400" />
          <div className="absolute inset-0 rounded-full bg-red-500/5 blur-xl" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/10">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Error 500</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
            An unexpected error occurred on our end. This has been logged automatically. Please try refreshing, or come back later.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="secondary"
            leftIcon={<RefreshCw size={15} />}
            onClick={() => window.location.reload()}
          >
            Refresh page
          </Button>
          <Button leftIcon={<Home size={15} />} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </div>

        {/* Status info */}
        <div className="border-t border-white/[0.06] pt-6">
          <p className="text-xs text-gray-700">
            If this keeps happening, contact support at{' '}
            <span className="text-gray-500 font-mono">support@insurai.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};
