"use client";

import { useAuthContext } from "@/lib/auth-context";
import { AuthGate } from "./auth-gate";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthContext();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, show auth gate or fallback
  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full mx-auto p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Welcome to Clarity</h1>
            <p className="text-muted-foreground">
              ADHD-friendly project management for developers
            </p>
          </div>
          <AuthGate />
        </div>
      </div>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}

export default ProtectedRoute;
