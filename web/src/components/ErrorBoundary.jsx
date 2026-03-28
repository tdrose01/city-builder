import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Something went wrong</h1>
          <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '24px' }}>
            The game encountered an error. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'black',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
          >
            Reload Game
          </button>
          {this.state.error && (
            <details style={{ marginTop: '24px', textAlign: 'left', maxWidth: '500px' }}>
              <summary style={{ cursor: 'pointer', opacity: 0.5, fontSize: '12px' }}>
                Error Details
              </summary>
              <pre style={{ 
                fontSize: '11px', 
                opacity: 0.5, 
                marginTop: '8px',
                overflow: 'auto',
                maxWidth: '100%'
              }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
