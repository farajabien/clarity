"use client";

import { useEffect } from "react";
import { useAppStore } from "@/hooks/use-app-store";

export function StoreHydration() {
  useEffect(() => {
    // Manually trigger hydration on the client side
    useAppStore.persist.rehydrate();
  }, []);

  return null; // This component doesn't render anything
}
