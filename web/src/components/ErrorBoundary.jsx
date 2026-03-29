import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const errorString = this.state.error?.toString() || 'Unknown error';
      const componentStack = this.state.errorInfo?.componentStack || 'No stack available';
      
      // Try to extract the problematic object from the error message
      const objectMatch = errorString.match(/object\s+(?:with\s+keys\s+)?(?:{[^}]*}|keys\s+[^)]+)/i);
      const objectInfo = objectMatch ? objectMatch[0] : '';

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
          <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#f87171' }}>
            Something went wrong
          </h1>
          
          {objectInfo && (
            <div style={{
              background: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid #f87171',
              borderRadius: '8px',
              padding: '12px 20px',
              marginBottom: '16px',
              maxWidth: '600px'
            }}>
              <p style={{ fontSize: '14px', margin: 0 }}>
                <strong>Problem:</strong> Tried to render an {objectInfo}
              </p>
            </div>
          )}
          
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
          
          <details style={{ marginTop: '24px', textAlign: 'left', maxWidth: '700px', width: '100%' }}>
            <summary style={{ cursor: 'pointer', opacity: 0.5, fontSize: '12px' }}>
              Error Details
            </summary>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              padding: '16px',
              marginTop: '8px',
              maxHeight: '300px',
              overflow: 'auto'
            }}>
              <p style={{ fontSize: '12px', color: '#f87171', marginBottom: '8px', fontWeight: 'bold' }}>
                Error:
              </p>
              <pre style={{ 
                fontSize: '11px', 
                opacity: 0.8,
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {errorString}
              </pre>
              
              <p style={{ fontSize: '12px', color: '#fbbf24', marginTop: '16px', marginBottom: '8px', fontWeight: 'bold' }}>
                Component Stack:
              </p>
              <pre style={{ 
                fontSize: '10px', 
                opacity: 0.6,
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {componentStack}
              </pre>
            </div>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
