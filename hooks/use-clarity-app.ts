import { useEffect } from 'react';
import { useAppStore } from './use-app-store';
import { useSeedData } from './use-seed-data';
import { useSyncManager } from './use-sync-manager';
import { useAuthContext } from '@/lib/auth-context';

/**
 * Main hook to initialize the Clarity app with data management and sync
 * Call this in your main layout or app component
 */
export const useClarityApp = () => {
  const store = useAppStore();
  const { seedDemoData } = useSeedData();
  const { user } = useAuthContext();
  const { syncToCloud, hasCloudData } = useSyncManager();

  // Initialize demo data if user has no cloud data and local data is empty
  useEffect(() => {
    if (user && !hasCloudData && Object.keys(store.projects).length === 0) {
      seedDemoData();
    }
  }, [user, hasCloudData, store.projects, seedDemoData]);

  const initializeDemoData = () => {
    seedDemoData();
  };

  const manualSync = async () => {
    if (!user) {
      console.warn('Cannot sync without authentication');
      return;
    }

    try {
      await syncToCloud();
      console.log('Manual sync completed');
    } catch (error) {
      console.error('Manual sync failed:', error);
      throw error;
    }
  };

  return {
    isAuthenticated: !!user,
    initializeDemoData,
    manualSync,
  };
};

/**
 * Hook for dashboard data and statistics
 */
export const useDashboardData = () => {
  const store = useAppStore();
  
  const dashboardData = {
    // Today's focus
    todayTodos: (() => {
      const today = new Date().toISOString().split('T')[0];
      const dailyReview = store.dailyReview[today];
      if (!dailyReview) return [];
      return dailyReview.selectedTodoIds
        .map(id => store.todos[id])
        .filter(Boolean);
    })(),
    overdueTodos: (() => {
      const now = new Date();
      return Object.values(store.todos).filter(todo => {
        if (todo.completed || !todo.dueDate) return false;
        return new Date(todo.dueDate) < now;
      });
    })(),
    
    // Projects by category
    workProjects: Object.values(store.projects).filter(
      project => project.category === 'work' && !project.archived
    ),
    clientProjects: Object.values(store.projects).filter(
      project => project.category === 'client' && !project.archived
    ),
    personalProjects: Object.values(store.projects).filter(
      project => project.category === 'personal' && !project.archived
    ),
    
    // Quick stats
    stats: {
      totalProjects: Object.keys(store.projects).length,
      activeTodos: Object.values(store.todos).filter(todo => !todo.completed).length,
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

