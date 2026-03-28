import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Global error handler for uncaught errors
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error caught:', { message, source, lineno, colno, error });
  return false;
};

// Global handler for unhandled promise rejections
window.onunhandledrejection = (event) => {
  console.error('Unhandled promise rejection:', event.reason);
};

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
)
