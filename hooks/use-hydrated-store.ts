"use client";

import { useEffect, useState } from "react";
import { useAppStore, type AppStore } from "./use-app-store";

/**
 * Hook that ensures the store is properly hydrated before returning the store state
 * This prevents SSR hydration mismatches and infinite loops
 */
export function useHydratedStore(): AppStore & { isHydrated: boolean } {
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
  };
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
