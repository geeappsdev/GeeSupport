import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  fallback?: ReactNode;
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  // Explicitly declare props to avoid TS errors in strict setups where Component inference might fail
  declare props: Readonly<Props>;

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught error", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <div className="p-4 text-red-500 bg-red-50 rounded-lg">Something went wrong.</div>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;