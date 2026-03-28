import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Log full error details for debugging
      console.error('ErrorBoundary full error:', {
        error: this.state.error,
        errorMessage: this.state.error?.message,
        errorType: typeof this.state.error,
        errorInfo: this.state.errorInfo
      });
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-8">
          <div className="max-w-lg text-center">
            <h1 className="text-3xl font-bold mb-4 text-red-400">Something went wrong</h1>
            <p className="text-gray-300 mb-4">The game encountered an error. Try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Reload Game
            </button>
            {this.state.error && (
              <div className="mt-6 text-left bg-gray-800 p-4 rounded-lg text-sm font-mono text-red-300 overflow-auto max-h-64">
                <p className="font-bold">Error: {this.state.error.toString()}</p>
                <p className="font-bold mt-2">Message: {this.state.error?.message || 'No message'}</p>
                {this.state.errorInfo && (
                  <pre className="mt-2 text-gray-400">{this.state.errorInfo.componentStack}</pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
