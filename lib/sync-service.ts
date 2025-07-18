import { db, id, tx } from '@/lib/instant';
import type { AppState } from './types';

export interface SyncSnapshot {
  id: string;
  userId: string;
  lastSync: string;
  state: AppState;
}

export class SyncService {
  static async pushSnapshot(userId: string, appState: AppState): Promise<void> {
    if (!db) {
      throw new Error('Sync service not initialized');
    }

    const snapshotId = id();
    const timestamp = new Date().toISOString();

    try {
      await db.transact([
        tx.snapshots[snapshotId].update({
          userId,
          lastSync: timestamp,
          state: appState,
        }),
      ]);
    } catch (error) {
      console.error('Failed to push snapshot:', error);
      throw error;
    }
  }

  static async pullSnapshot(userId: string): Promise<SyncSnapshot | null> {
    // This method is deprecated - use useSyncManager hook instead
    console.warn('pullSnapshot is deprecated. Use useSyncManager hook for querying data.');
    return null;
  }

  static async getLastSyncTime(userId: string): Promise<string | null> {
    // This method is deprecated - use useSyncManager hook instead
    console.warn('getLastSyncTime is deprecated. Use useSyncManager hook for querying data.');
    return null;
  }

  static async deleteSnapshot(userId: string): Promise<void> {
    // This method is deprecated - use useSyncManager hook instead
    console.warn('deleteSnapshot is deprecated. Use useSyncManager hook for data operations.');
  }
}

// Network status utilities
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

export const onNetworkChange = (callback: (online: boolean) => void) => {
  if (typeof window !== 'undefined') {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
  
  return () => {};
};

// Conflict resolution strategies
export enum ConflictResolution {
  LOCAL_WINS = 'local',
  REMOTE_WINS = 'remote',
  NEWEST_WINS = 'newest',
  ASK_USER = 'ask',
}

export interface SyncConflict {
  localState: AppState;
  remoteState: AppState;
  localTimestamp: string;
  remoteTimestamp: string;
}

export const resolveConflict = (
  conflict: SyncConflict,
  strategy: ConflictResolution
): AppState => {
  switch (strategy) {
    case ConflictResolution.LOCAL_WINS:
      return conflict.localState;
    
    case ConflictResolution.REMOTE_WINS:
      return conflict.remoteState;
    
    case ConflictResolution.NEWEST_WINS:
      const localTime = new Date(conflict.localTimestamp);
      const remoteTime = new Date(conflict.remoteTimestamp);
      return localTime > remoteTime ? conflict.localState : conflict.remoteState;
    
    case ConflictResolution.ASK_USER:
    default:
      // This would trigger a UI dialog in practice
      console.warn('Conflict resolution requires user input');
      return conflict.localState;
  }
};
