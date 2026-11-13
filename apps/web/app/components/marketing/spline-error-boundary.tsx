import { Component, type ReactNode } from 'react';

interface SplineErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
  onError?(): void;
}

interface SplineErrorBoundaryState {
  hasError: boolean;
}

export class SplineErrorBoundary extends Component<
  SplineErrorBoundaryProps,
  SplineErrorBoundaryState
> {
  state: SplineErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SplineErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
