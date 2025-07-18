"use client";

import { useQuery, db, tx, id } from "@/lib/instant";
import { useAuthContext } from "@/lib/auth-context";
import { useAppStore } from "@/hooks/use-app-store";
import { useEffect } from "react";

/**
 * Hook to sync app state with InstantDB
 * This replaces the SyncService with a React-based approach
 */
export function useSyncManager() {
  const { user } = useAuthContext();
  const store = useAppStore();

  // Query snapshots for current user
  const { data, isLoading, error } = useQuery({
    snapshots: {
      $: {
        where: {
          userId: user?.id,
        },
        limit: 1,
      },
    },
  });

  // Sync from cloud to local state when data is available
  useEffect(() => {
    if (data?.snapshots && data.snapshots.length > 0 && user) {
      const snapshot = data.snapshots[0];
      if (snapshot.state && typeof snapshot.state === 'object') {
        // Only sync if the cloud state is newer
        const cloudTimestamp = snapshot.lastSync ? new Date(snapshot.lastSync).getTime() : 0;
        const localTimestamp = new Date(store.lastSync || 0).getTime();
        
        if (cloudTimestamp > localTimestamp) {
          // Replace entire state with cloud state
          Object.assign(store, snapshot.state);
        }
      }
    }
  }, [data, user, store]);

  const syncToCloud = async () => {
    if (!user) return;

    const snapshotId = id();

    try {
      await db.transact([
        tx.snapshots[snapshotId].update({
          userId: user.id,
          lastSync: new Date().toISOString(),
          state: store,
        })
      ]);
    } catch (err) {
      console.error('Failed to sync to cloud:', err);
      throw err;
    }
  };

  return {
    isLoading,
    error,
    syncToCloud,
    hasCloudData: Boolean(data?.snapshots?.length),
  };
}

export default useSyncManager;
