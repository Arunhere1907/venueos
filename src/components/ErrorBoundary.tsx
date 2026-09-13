/**
 * VenueOS — React Error Boundary
 * Catches rendering errors and shows a recovery UI instead of a blank screen.
 */
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, Compass } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[VenueOS Error Boundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                Venue<span className="text-indigo-600">OS</span>
              </span>
            </div>

            {/* Error Icon */}
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
              <AlertOctagon className="w-10 h-10 text-rose-500" />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-slate-900">
                Something Went Wrong
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                An unexpected error occurred while rendering the application. This has been logged for review. You can try refreshing to restore normal operation.
              </p>
            </div>

            {/* Error Details (collapsed) */}
            {this.state.error && (
              <details className="text-left bg-slate-100 rounded-xl p-3 text-xs text-slate-600 border border-slate-200">
                <summary className="font-semibold cursor-pointer text-slate-700">
                  Error Details
                </summary>
                <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-rose-700">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all active:scale-[0.98]"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-xl border border-slate-300 transition-all active:scale-[0.98]"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
