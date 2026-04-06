import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * React Error Boundary — catches render-time errors in the component subtree
 * and renders a fallback UI instead of crashing the entire app.
 *
 * Wrap lazy-loaded components (e.g. ChatSidebar) and critical sub-trees with
 * this component so a single failure stays isolated.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          role="alert"
          className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-sm font-mono"
        >
          <p className="font-bold mb-1">Something went wrong.</p>
          <p className="text-xs opacity-70">{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
