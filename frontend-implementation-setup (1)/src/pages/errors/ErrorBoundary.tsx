import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center px-6">
          <div className="text-center space-y-6 max-w-md animate-fade-in">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle size={36} className="text-red-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-200">Something went wrong</h1>
              <p className="text-sm text-gray-500 mt-2">
                An unexpected error occurred. Please refresh the page to try again.
              </p>
              {this.state.error && (
                <p className="mt-3 text-xs font-mono text-gray-700 bg-white/[0.03] rounded-lg p-3 text-left border border-white/[0.06] break-all">
                  {this.state.error.message}
                </p>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm text-gray-300 hover:bg-white/[0.10] transition-colors"
            >
              <RefreshCw size={14} /> Refresh page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
