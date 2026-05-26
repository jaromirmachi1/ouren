import { Component, type ErrorInfo, type ReactNode } from 'react';
import styled from 'styled-components';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

const Wrap = styled.div`
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 24px;
  background: ${({ theme }) => theme.colors.deepBlack};
  color: ${({ theme }) => theme.colors.white};
`;

const Message = styled.pre`
  max-width: 720px;
  overflow: auto;
  font-family: ui-monospace, monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <Wrap>
          <Message>{this.state.error.message}</Message>
        </Wrap>
      );
    }

    return this.props.children;
  }
}
