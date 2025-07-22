"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "./use-app-store";
import type { AppState } from "@/lib/types";

// Explicitly type the return to ensure projects and todos are always present
type HydratedStore = AppState & {
  isHydrated: boolean;
  isOnline: boolean;
  lastSync: string | null;
  syncInProgress: boolean;
  // Include all the store actions
  [key: string]: any;
};

/**
 * Hook that ensures the store is properly hydrated before returning the store state
 * This prevents SSR hydration mismatches and infinite loops
 */
export function useHydratedStore(): HydratedStore {
  const [isHydrated, setIsHydrated] = useState(false);
  const store = useAppStore();

  useEffect(() => {
    // Use the correct persist API
    const unsubHydrate = useAppStore.persist.onFinishHydration(() => {
      console.log('Store hydration finished');
      setIsHydrated(true);
    });

    // Force rehydration if not already done
    if (!useAppStore.persist.hasHydrated()) {
      useAppStore.persist.rehydrate();
    } else {
      setIsHydrated(true);
    }

    return unsubHydrate;
  }, []);

  return {
    ...store,
    isHydrated,
  } as HydratedStore;
}

/**
 * Hook for accessing individual store actions safely after hydration
 */
export function useStoreActions() {
  const [isHydrated, setIsHydrated] = useState(false);
  const store = useAppStore();
  
  useEffect(() => {
    const unsubHydrate = useAppStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    if (!useAppStore.persist.hasHydrated()) {
      useAppStore.persist.rehydrate();
    } else {
      setIsHydrated(true);
    }

    return unsubHydrate;
  }, []);

  return {
    isHydrated,
    ...store,
  };
}
