"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "./use-app-store";

/**
 * Hook that ensures the store is properly hydrated before returning the store state
 * This prevents SSR hydration mismatches and infinite loops
 */
export function useHydratedStore() {
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
    addProject: useAppStore.getState().addProject,
    addTodo: useAppStore.getState().addTodo,
    updateProject: useAppStore.getState().updateProject,
    updateTodo: useAppStore.getState().updateTodo,
    deleteProject: useAppStore.getState().deleteProject,
    deleteTodo: useAppStore.getState().deleteTodo,
    toggleTodo: useAppStore.getState().toggleTodo,
    toggleTodayTag: useAppStore.getState().toggleTodayTag,
    archiveProject: useAppStore.getState().archiveProject,
  };
}
