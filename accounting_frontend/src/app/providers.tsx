"use client";

import React, { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/client";
import { CompanyProvider } from "@/context/company";

type EBState = { hasError: boolean; error?: Error };

class ErrorBoundary extends React.Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }
  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error) {
    // log error if needed
    void error;
  }
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="p-4 m-4 rounded-md bg-red-50 text-red-800 border border-red-200">
          <p className="font-medium">Something went wrong.</p>
          <p className="text-sm mt-1">{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * PUBLIC_INTERFACE
 * Wraps the app with QueryClient and CompanyProvider plus a global error boundary.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <CompanyProvider>{children}</CompanyProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
