import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.removeItem('user_logged_out');
    } catch {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030612] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl text-center backdrop-blur-xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Tricky Toddlers encountered a temporary display issue. Tap below to reload or return to the main dashboard.
            </p>
            {this.state.error && (
              <div className="mb-6 p-3 bg-black/40 rounded-xl text-left border border-white/5 overflow-hidden">
                <p className="text-xs font-mono text-rose-300 break-words line-clamp-3">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 border border-white/10"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
