import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useEffect } from "react";
import {
  SyncService,
  ConflictResolution,
  isOnline,
  onNetworkChange,
} from "@/lib/sync-service";
import type {
  AppState,
  Project,
  Todo,
  Session,
  Resource,
  DailyReview,
  Settings,
} from "@/lib/types";

// Helper function to generate IDs
const generateId = () =>
  `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper function to get current ISO string
const now = () => new Date().toISOString();

interface AppStore extends AppState {
  // Sync status
  isOnline: boolean;
  lastSync: string | null;
  syncInProgress: boolean;

  // Actions for Projects
  addProject: (
    project: Omit<
      Project,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "progress"
      | "tags"
      | "timeSpent"
      | "estimatedTime"
      | "archived"
      | "deployLink"
    > & {
      progress?: number;
      tags?: string[];
      timeSpent?: number;
      estimatedTime?: number;
      archived?: boolean;
      deployLink?: string | null;
    }
  ) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  archiveProject: (id: string) => void;

  // Actions for Todos
  addTodo: (todo: Omit<Todo, "id" | "createdAt" | "updatedAt">) => string;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  toggleTodayTag: (id: string) => void;
  bulkUpdateTodos: (ids: string[], updates: Partial<Todo>) => void;

  // Actions for Sessions
  addSession: (session: Omit<Session, "id" | "createdAt">) => string;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;

  // Actions for Resources
  addResource: (
    resource: Omit<Resource, "id" | "createdAt" | "updatedAt">
  ) => string;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;

  // Actions for Daily Review
  setDailyReview: (date: string, selectedTodoIds: string[]) => void;
  getDailyReview: (date: string) => DailyReview | null;

  // Actions for Settings
  updateSettings: (updates: Partial<Settings>) => void;

  // Sync Actions
  setOnlineStatus: (isOnline: boolean) => void;
  markSyncInProgress: (inProgress: boolean) => void;
  updateLastSync: (timestamp: string) => void;
  loadFromSnapshot: (snapshot: AppState) => void;

  // Computed getters - Only keep non-problematic ones
  getSessionsByDateRange: (startDate: string, endDate: string) => Session[];
  getResourcesByProject: (projectId: string) => Resource[];
}

const initialState: AppState = {
  projects: {},
  todos: {},
  sessions: {},
  resources: {},
  dailyReview: {},
  settings: {
    theme: "system",
    darkMode: false,
    syncInterval: 300000,
    remindersEnabled: true,
    accessibilityOpts: {
      highContrast: false,
      reducedMotion: false,
    },
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    immer((set, get) => ({
      // Initial state
      ...initialState,
      isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      lastSync: null,
      syncInProgress: false,

      // Project actions
      addProject: (projectData) => {
        const id = generateId();
        const project: Project = {
          id,
          title: projectData.title,
          desc: projectData.desc,
          estimate: projectData.estimate,
          description: projectData.description,
          priority: projectData.priority,
          progress: projectData.progress || 0,
          dueDate: projectData.dueDate,
          tags: projectData.tags || [],
          budget: projectData.budget,
          timeSpent: projectData.timeSpent || 0,
          estimatedTime: projectData.estimatedTime || 0,
          category: projectData.category,
          status: projectData.status,
          deployLink: projectData.deployLink || null,
          archived: projectData.archived || false,
          createdAt: now(),
          updatedAt: now(),
        };

        set((state) => {
          state.projects[id] = project;
        });

        return id;
      },

      updateProject: (id, updates) => {
        set((state) => {
          if (state.projects[id]) {
            Object.assign(state.projects[id], { ...updates, updatedAt: now() });
          }
        });
      },

      deleteProject: (id) => {
        set((state) => {
          delete state.projects[id];
          // Also delete related todos and resources
          Object.keys(state.todos).forEach((todoId) => {
            if (state.todos[todoId].projectId === id) {
              delete state.todos[todoId];
            }
          });
          Object.keys(state.resources).forEach((resourceId) => {
            if (state.resources[resourceId].projectId === id) {
              delete state.resources[resourceId];
            }
          });
        });
      },

      archiveProject: (id) => {
        set((state) => {
          if (state.projects[id]) {
            state.projects[id].archived = true;
            state.projects[id].updatedAt = now();
          }
        });
      },

      // Todo actions
      addTodo: (todoData) => {
        const id = generateId();
        const todo: Todo = {
          ...todoData,
          id,
          completed: todoData.completed || false,
          todayTag: todoData.todayTag || false,
          dependencies: todoData.dependencies || [], // <-- Ensure dependencies is always present
          createdAt: now(),
          updatedAt: now(),
        };

        set((state) => {
          state.todos[id] = todo;
        });

        return id;
      },

      updateTodo: (id, updates) => {
        set((state) => {
          if (state.todos[id]) {
            Object.assign(state.todos[id], { ...updates, updatedAt: now() });
            if (updates.dependencies === undefined) {
              // Ensure dependencies is always present
              state.todos[id].dependencies = state.todos[id].dependencies || [];
            }
          }
        });
      },

      deleteTodo: (id) => {
        set((state) => {
          delete state.todos[id];
        });
      },

      toggleTodo: (id) => {
        set((state) => {
          if (state.todos[id]) {
            state.todos[id].completed = !state.todos[id].completed;
            state.todos[id].updatedAt = now();
          }
        });
      },

      toggleTodayTag: (id: string) => {
        set((state) => {
          if (state.todos[id]) {
            state.todos[id].todayTag = !state.todos[id].todayTag;
            state.todos[id].updatedAt = now();
          }
        });
      },

      bulkUpdateTodos: (ids, updates) => {
        set((state) => {
          ids.forEach((id) => {
            if (state.todos[id]) {
              Object.assign(state.todos[id], { ...updates, updatedAt: now() });
            }
          });
        });
      },

      // Session actions
      addSession: (sessionData) => {
        const id = generateId();
        const session: Session = {
          ...sessionData,
          id,
          createdAt: now(),
        };

        set((state) => {
          state.sessions[id] = session;
        });

        return id;
      },

      updateSession: (id, updates) => {
        set((state) => {
          if (state.sessions[id]) {
            Object.assign(state.sessions[id], updates);
          }
        });
      },

      deleteSession: (id) => {
        set((state) => {
          delete state.sessions[id];
        });
      },

      // Resource actions
      addResource: (resourceData) => {
        const id = generateId();
        const resource: Resource = {
          ...resourceData,
          id,
          createdAt: now(),
          updatedAt: now(),
        };

        set((state) => {
          state.resources[id] = resource;
        });

        return id;
      },

      updateResource: (id, updates) => {
        set((state) => {
          if (state.resources[id]) {
            Object.assign(state.resources[id], {
              ...updates,
              updatedAt: now(),
            });
          }
        });
      },

      deleteResource: (id) => {
        set((state) => {
          delete state.resources[id];
        });
      },

      // Daily Review actions
      setDailyReview: (date, selectedTodoIds) => {
        set((state) => {
          state.dailyReview[date] = { date, selectedTodoIds };
        });
      },

      getDailyReview: (date) => {
        return get().dailyReview[date] || null;
      },

      // Settings actions
      updateSettings: (updates) => {
        set((state) => {
          Object.assign(state.settings, updates);
        });
      },

      // Sync actions
      setOnlineStatus: (isOnline) => {
        set((state) => {
          state.isOnline = isOnline;
        });
      },

      markSyncInProgress: (inProgress) => {
        set((state) => {
          state.syncInProgress = inProgress;
        });
      },

      updateLastSync: (timestamp) => {
        set((state) => {
          state.lastSync = timestamp;
        });
      },

      loadFromSnapshot: (snapshot) => {
        set((state) => {
          state.projects = snapshot.projects;
          state.todos = snapshot.todos;
          state.sessions = snapshot.sessions;
          state.resources = snapshot.resources;
          state.dailyReview = snapshot.dailyReview;
          state.settings = snapshot.settings;
          state.lastSync = now();
        });
      },

      // Computed getters - Only keep non-problematic ones
      getSessionsByDateRange: (startDate, endDate) => {
        const sessions = get().sessions;
        const start = new Date(startDate);
        const end = new Date(endDate);

        return Object.values(sessions).filter((session) => {
          const sessionDate = new Date(session.startTime);
          return sessionDate >= start && sessionDate <= end;
        });
      },

      getResourcesByProject: (projectId) => {
        const resources = get().resources;
        return Object.values(resources).filter(
          (resource) => resource.projectId === projectId
        );
      },
    })),
    {
      name: "clarity-app-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // Prevent SSR hydration issues
      partialize: (state) => ({
        projects: state.projects,
        todos: state.todos,
        sessions: state.sessions,
        resources: state.resources,
        dailyReview: state.dailyReview,
        settings: state.settings,
      }),
    }
  )
);

// Hook for sync functionality with InstantDB integration
export const useSyncActions = () => {
  const store = useAppStore();

  const syncToCloud = async (userId?: string) => {
    if (!userId) {
      console.warn("Cannot sync without user ID");
      return;
    }

    try {
      store.markSyncInProgress(true);

      const appState: AppState = {
        projects: store.projects,
        todos: store.todos,
        sessions: store.sessions,
        resources: store.resources,
        dailyReview: store.dailyReview,
        settings: store.settings,
      };

      await SyncService.pushSnapshot(userId, appState);
      store.updateLastSync(now());

      console.log("Successfully synced to cloud");
    } catch (error) {
      console.error("Sync to cloud failed:", error);
      throw error;
    } finally {
      store.markSyncInProgress(false);
    }
  };

  const initializeNetworkListener = () => {
    return onNetworkChange((online) => {
      store.setOnlineStatus(online);

      if (online) {
        console.log("Back online, attempting auto-sync...");
        // Could trigger auto-sync here if user is logged in
      }
    });
  };

  return {
    syncToCloud,
    initializeNetworkListener,
    isOnline: store.isOnline,
    lastSync: store.lastSync,
    syncInProgress: store.syncInProgress,
  };
};

export default useAppStore;
