
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    const self = this as any;
    if (self.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 text-center space-y-8 shadow-4xl">
            <div className="w-24 h-24 bg-rose-100 text-rose-500 rounded-3xl flex items-center justify-center mx-auto">
              <AlertCircle size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-black tracking-tighter italic uppercase text-slate-950">Neural Crash</h3>
              <p className="text-slate-500 font-medium">The interface encountered an unexpected resonance failure. Your progress is safe in the archives.</p>
              {self.state.error && (
                <p className="text-[10px] font-mono text-rose-500 bg-rose-50 p-4 rounded-xl break-all">
                  {self.state.error.message}
                </p>
              )}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-5 bg-indigo-600 text-white rounded-full font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              <RefreshCw size={20} />
              Re-Initialize System
            </button>
          </div>
        </div>
      );
    }

    return self.props.children;
  }
}
