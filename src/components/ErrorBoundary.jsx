import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // log to console so it appears in the devtools and terminal
    console.error('Uncaught error in component tree:', error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      const message = this.state.error?.message || String(this.state.error);
      const stack = this.state.info?.componentStack || '';
      return (
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#c00' }}>Something went wrong</h1>
          <p style={{ whiteSpace: 'pre-wrap' }}>{message}</p>
          {stack && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>
              {stack}
            </details>
          )}
          <p style={{ marginTop: 12 }}>
            Open the browser console for the full error. This UI was rendered by ErrorBoundary.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
