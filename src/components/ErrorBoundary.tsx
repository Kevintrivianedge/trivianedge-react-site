import React, { Component, ReactNode } from 'react';
import { trackError } from '@/services/analytics';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    trackError(
      `React.${error.name || 'Unknown'}`,
      error.message,
      `${error.stack}\n${errorInfo.componentStack}`
    ).catch(() => {});

    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h1 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h1>
              <p className="text-slate-300 mb-4">
                We've logged this error and our team will look into it.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Try again
              </button>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 text-xs text-slate-400">
                  <summary className="cursor-pointer font-mono">Error details</summary>
                  <pre className="mt-2 p-2 bg-slate-900 rounded text-red-400 overflow-auto">
                    {this.state.error?.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
