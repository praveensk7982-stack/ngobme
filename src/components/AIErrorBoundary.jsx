import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class AIErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AI Assistant Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold m-4 space-y-2 shadow-sm">
          <p className="font-bold flex items-center gap-1.5 text-rose-700">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>AI Assistant encountered a temporary error.</span>
          </p>
          <p className="text-[11px] text-slate-600 font-medium">
            The core TN NGO Connect application remains fully active. You can retry launching the AI Assistant below.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset AI Panel</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AIErrorBoundary;
