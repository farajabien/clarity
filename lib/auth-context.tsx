"use client";

import React, { createContext, useContext } from "react";
import { useAuth } from "@/lib/instant";
import { db } from "@/lib/instant";

interface User {
  id: string;
  email: string;
  createdAt?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAuth();
  
  const signInWithOTP = async (email: string) => {
    await db.auth.sendMagicCode({ email });
  };

  const verifyOTP = async (email: string, code: string) => {
    await db.auth.signInWithMagicCode({ email, code });
  };

  const signOut = async () => {
    await db.auth.signOut();
  };
  
  const value = {
    user: user || null,
    isLoading,
    signInWithOTP,
    verifyOTP,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
