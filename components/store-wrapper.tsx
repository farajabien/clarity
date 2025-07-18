"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/hooks/use-app-store";

interface StoreWrapperProps {
  children: React.ReactNode;
}

export function StoreWrapper({ children }: StoreWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Trigger hydration and mark as ready
    useAppStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  // Don't render children until store is hydrated
  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
}
