import { useEffect } from 'react';
import { useAppStore, useSyncActions } from './use-app-store';
import { useSeedData } from './use-seed-data';
import { initSyncService } from '@/lib/sync-service';

/**
 * Main hook to initialize the Clarity app with data management and sync
 * Call this in your main layout or app component
 */
export const useClarityApp = (options?: {
  userId?: string;
  instantDb?: any;
  enableAutoSync?: boolean;
  autoSyncInterval?: number;
}) => {
  const store = useAppStore();
  const syncActions = useSyncActions();
  const { seedDemoData } = useSeedData();
  
  const {
    userId,
    instantDb,
    enableAutoSync = false,
    autoSyncInterval = 5 * 60 * 1000, // 5 minutes
  } = options || {};

  // Initialize sync service if InstantDB is provided
  useEffect(() => {
    if (instantDb) {
      initSyncService(instantDb);
    }
  }, [instantDb]);

  // Set up network status monitoring
  useEffect(() => {
    const cleanup = syncActions.initializeNetworkListener();
    return cleanup;
  }, []);

  // Set up auto-sync if enabled and user is authenticated
  useEffect(() => {
    if (!enableAutoSync || !userId) return;

    const interval = setInterval(async () => {
      if (store.isOnline && !store.syncInProgress) {
        try {
          await syncActions.autoSync(userId);
        } catch (error) {
          console.error('Auto-sync failed:', error);
        }
      }
    }, autoSyncInterval);

    return () => clearInterval(interval);
  }, [enableAutoSync, userId, autoSyncInterval, store.isOnline, store.syncInProgress]);

  // Initial sync when user logs in
  useEffect(() => {
    if (userId && store.isOnline) {
      syncActions.syncFromCloud(userId);
    }
  }, [userId]);

  const initializeDemoData = () => {
    seedDemoData();
  };

  const manualSync = async () => {
    if (!userId) {
      console.warn('Cannot sync without authentication');
      return;
    }
    
    try {
      await syncActions.autoSync(userId);
      console.log('Manual sync completed');
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  };

  return {
    // Store state
    store,
    
    // Sync functionality
    ...syncActions,
    manualSync,
    
    // Demo data
    initializeDemoData,
    
    // App status
    isInitialized: true,
    hasData: Object.keys(store.projects).length > 0,
    
    // Quick actions
    quickActions: {
      addProject: store.addProject,
      addTodo: store.addTodo,
      toggleTodo: store.toggleTodo,
      getActiveTodos: store.getActiveTodos,
      getTodayTodos: store.getTodayTodos,
    },
  };
};

/**
 * Hook for dashboard data and statistics
 */
export const useDashboardData = () => {
  const store = useAppStore();
  
  const dashboardData = {
    // Today's focus
    todayTodos: store.getTodayTodos(),
    overdueTodos: store.getOverdueTodos(),
    
    // Projects by category
    workProjects: store.getProjectsByCategory('work'),
    clientProjects: store.getProjectsByCategory('client'),
    personalProjects: store.getProjectsByCategory('personal'),
    
    // Quick stats
    stats: {
      totalProjects: Object.keys(store.projects).length,
      activeTodos: store.getActiveTodos().length,
      completedTodos: Object.values(store.todos).filter(t => t.completed).length,
      totalSessions: Object.keys(store.sessions).length,
    },
    
    // Recent activity
    recentSessions: store.getSessionsByDateRange(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      new Date().toISOString()
    ),
  };
  
  return dashboardData;
};

/**
 * Hook for focus session management
 */
export const useFocusSession = () => {
  const store = useAppStore();
  
  const startSession = (todoIds: string[]) => {
    const sessionId = store.addSession({
      tasks: todoIds,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(), // Will be updated when session ends
      actualMinutes: 0, // Will be calculated when session ends
    });
    
    return sessionId;
  };
  
  const endSession = (sessionId: string, actualMinutes: number) => {
    store.updateSession(sessionId, {
      endTime: new Date().toISOString(),
      actualMinutes,
    });
  };
  
  return {
    startSession,
    endSession,
    recentSessions: store.getSessionsByDateRange(
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      new Date().toISOString()
    ),
  };
};
