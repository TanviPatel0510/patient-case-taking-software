import { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f9f7] px-6 text-center text-[#143337] antialiased">
          <div className="max-w-md rounded-3xl border border-red-100 bg-white p-8 shadow-xl">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4">
              <AlertTriangle className="size-8" />
            </div>

            <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 uppercase tracking-wider">
              Application Error
            </span>

            <h1 className="mt-3 text-xl font-bold text-gray-900">
              Something went wrong
            </h1>

            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              An unexpected render error occurred in this view. Please try reloading or returning to the home screen.
            </p>

            {this.state.error && (
              <div className="mt-4 rounded-xl bg-gray-50 p-3 text-left font-mono text-[0.7rem] text-red-600 overflow-x-auto max-h-24">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-2xs"
              >
                <RefreshCw className="size-3.5" />
                Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0c5e5b] px-4 py-2 text-xs font-semibold text-white hover:bg-[#084341] cursor-pointer shadow-xs"
              >
                <Home className="size-3.5" />
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
