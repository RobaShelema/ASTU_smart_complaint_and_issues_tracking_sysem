import React from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Update state with error info
    this.setState({ errorInfo });
    
    // Increment error count
    this.setState(prevState => ({ 
      errorCount: prevState.errorCount + 1 
    }));

    // Send to error tracking service (if configured)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to analytics
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true
      });
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // Call optional reset handler
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-[rgb(var(--bg-primary))] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-[rgb(var(--color-danger))] bg-opacity-10">
                <AlertTriangle className="h-12 w-12 text-[rgb(var(--color-danger))]" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))] mb-2">
              {this.props.title || 'Something went wrong'}
            </h1>

            {/* Error Message */}
            <p className="text-[rgb(var(--text-secondary))] mb-6">
              {this.props.message || 'An unexpected error occurred. Please try again.'}
            </p>

            {/* Error Details (in development) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-[rgb(var(--bg-secondary))] rounded-lg text-left overflow-auto max-h-40">
                <p className="text-sm font-mono text-[rgb(var(--color-danger))]">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-xs mt-2 text-[rgb(var(--text-secondary))]">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={this.handleReset}
                className="btn-primary w-full sm:w-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoBack}
                className="btn-outline w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </button>
              
              <Link
                to="/"
                onClick={this.handleReset}
                className="btn-outline w-full sm:w-auto"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </div>

            {/* Error Code */}
            <p className="mt-6 text-xs text-[rgb(var(--text-secondary))]">
              Error ID: {Date.now().toString(36)}-{Math.random().toString(36).substr(2, 5)}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;