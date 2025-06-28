'use client';

import { useCallback } from 'react';
import { useSlugStore } from '@farajabien/slug-store';

import {
  getProjectsByCategory,
  getProjectsByStatus,
  getTodosByProject,
  getCrossProjectTodos,
  getTodosByPriority,
  getTodosByStatus,
  calculateProjectProgress,
  getProjectAnalytics,
} from '@/lib/utils/project-utils';

import {
  Project,
  Todo,
  AppState,
  TodoPriority,
  TodoStatus,
  DEFAULT_APP_STATE,
  DEFAULT_PROJECT_TEMPLATES,
} from '@/lib/types/clarity.types';

import {
  sendOnDemandReport
  // sendProjectUpdate, 
  // sendUrgentTaskAlert 
} from '@/app/actions/resend';

import {
  copyStateToClipboard,
  getCurrentDashboardState,
  getCurrentSlug,
  debugCurrentState
} from '@/lib/utils/state-utils';

// ============================================================================
// ENHANCED CLARITY HOOK - FULL SLUG STORE UTILIZATION
// ============================================================================

export function useClarityStore() {
  // 🚀 UPGRADED: Full slug-store v3.1.0 power with enhanced features
  const [state, setState, { isLoading, error }] = useSlugStore<AppState>(
    'clarity-app',
    DEFAULT_APP_STATE,
    {
      url: true,        // ✅ Share project states via URL (for collaboration)
      compress: true,   // ✅ Keep URLs manageable (60-80% reduction)
      offline: {        // ✅ ADHD-friendly offline storage 
        storage: 'indexeddb',
        encryption: false,     // 🔓 Disable encryption for easier testing
        ttl: 86400 * 30       // 30 days cache
      },
      db: {             // ✅ Database sync for cross-device persistence
        endpoint: '/api/clarity/sync',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    }
  );

  // ============================================================================
  // ENHANCED PROJECT ACTIONS WITH EMAIL NOTIFICATIONS
  // ============================================================================

  const addProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setState((prev: AppState) => ({
      ...prev,
      projects: [...prev.projects, newProject],
      analytics: {
        ...prev.analytics,
        lastUpdated: new Date().toISOString(),
      }
    }));

    // 📧 Auto-send project creation notification for client projects (disabled for testing)
    // if (newProject.category === 'client') {
    //   try {
    //     await sendProjectUpdate(newProject, []);
    //   } catch (error) {
    //     console.warn('Failed to send project creation email:', error);
    //   }
    // }
    
    return newProject;
  }, [setState]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>): Promise<Project | null> => {
    const projectIndex = state.projects.findIndex((p: Project) => p.id === id);
    
    if (projectIndex === -1) return null;
    
    const updatedProject = {
      ...state.projects[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    setState((prev: AppState) => {
      const updatedProjects = [...prev.projects];
      updatedProjects[projectIndex] = updatedProject;
      return {
        ...prev,
        projects: updatedProjects,
        analytics: {
          ...prev.analytics,
          lastUpdated: new Date().toISOString(),
        }
      };
    });

    // 📧 Send update notifications on major milestones (disabled for testing)
    // if (updates.status === 'completed' || (updates.progress && updates.progress >= 100)) {
    //   try {
    //     await sendProjectUpdate(updatedProject, state.todos);
    //   } catch (error) {
    //     console.warn('Failed to send project completion email:', error);
    //   }
    // }
    
    return updatedProject;
  }, [state.projects, setState]);

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    const projectExists = state.projects.some((p: Project) => p.id === id);
    
    if (!projectExists) return false;
    
    setState((prev: AppState) => ({
      ...prev,
      projects: prev.projects.filter((p: Project) => p.id !== id),
      todos: prev.todos.filter((t: Todo) => t.projectId !== id),
      analytics: {
        ...prev.analytics,
        lastUpdated: new Date().toISOString(),
      }
    }));
    
    return true;
  }, [state.projects, setState]);

  // ============================================================================
  // ENHANCED TODO ACTIONS WITH SMART NOTIFICATIONS
  // ============================================================================

  const addTodo = useCallback(async (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> => {
    const newTodo: Todo = {
      ...todoData,
      id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setState((prev: AppState) => ({
      ...prev,
      todos: [...prev.todos, newTodo],
    }));

    // 🚨 Auto-alert on urgent todos (disabled for testing)
    // if (newTodo.priority === 'urgent') {
    //   try {
    //     await sendUrgentTaskAlert([newTodo], state.projects);
    //   } catch (error) {
    //     console.warn('Failed to send urgent task alert:', error);
    //   }
    // }
    
    return newTodo;
  }, [setState]);

  const updateTodo = useCallback(async (id: string, updates: Partial<Todo>): Promise<Todo | null> => {
    const todoIndex = state.todos.findIndex((t: Todo) => t.id === id);
    
    if (todoIndex === -1) return null;
    
    const updatedTodo = {
      ...state.todos[todoIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    setState((prev: AppState) => {
      const updatedTodos = [...prev.todos];
      updatedTodos[todoIndex] = updatedTodo;
      return {
        ...prev,
        todos: updatedTodos,
      };
    });
    
    return updatedTodo;
  }, [state.todos, setState]);

  const deleteTodo = useCallback(async (id: string): Promise<boolean> => {
    const todoExists = state.todos.some((t: Todo) => t.id === id);
    
    if (!todoExists) return false;
    
    setState((prev: AppState) => ({
      ...prev,
      todos: prev.todos.filter((t: Todo) => t.id !== id),
    }));
    
    return true;
  }, [state.todos, setState]);

  // ============================================================================
  // ENHANCED FILTER AND VIEW ACTIONS WITH URL PERSISTENCE
  // ============================================================================

  const setFilters = useCallback(async (filters: Partial<AppState['filters']>) => {
    setState((prev: AppState) => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, [setState]);

  const setView = useCallback(async (view: Partial<AppState['view']>) => {
    setState((prev: AppState) => ({
      ...prev,
      view: { ...prev.view, ...view },
    }));
  }, [setState]);

  // ============================================================================
  // NEW: COLLABORATION & SHARING FEATURES
  // ============================================================================

  const shareCurrentState = useCallback(async () => {
    // 🚀 v3.1.0: Enhanced sharing with native support + fallback
    const shareableUrl = window.location.href;
    const projectCount = Object.keys(state.projects).length;
    const title = 'My Clarity Dashboard';
    const text = `Check out my project workspace with ${projectCount} projects!`;

    try {
      // Try native sharing first (mobile/desktop)
      if (navigator.share) {
        await navigator.share({ title, text, url: shareableUrl });
        return { success: true, method: 'native', url: shareableUrl };
      }
      
      // Fallback to clipboard (web browsers)
      await navigator.clipboard.writeText(shareableUrl);
      return { success: true, method: 'clipboard', url: shareableUrl };
      
    } catch (error) {
      console.error('Share failed:', error);
      
      // Final fallback for older browsers
      try {
        await navigator.clipboard.writeText(shareableUrl);
        return { success: true, method: 'clipboard-fallback', url: shareableUrl };
      } catch {
        // Ultimate fallback - prompt user
        prompt('Copy this URL to share your dashboard:', shareableUrl);
        return { success: true, method: 'manual', url: shareableUrl };
      }
    }
  }, [state.projects]);

  const sendManualReport = useCallback(async () => {
    try {
      await sendOnDemandReport(state);
      return true;
    } catch (error) {
      console.error('Failed to send manual report:', error);
      return false;
    }
  }, [state]);

  const exportProjectData = useCallback(() => {
    const exportData = {
      projects: state.projects,
      todos: state.todos,
      analytics: state.analytics,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clarity-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  // ============================================================================
  // ENHANCED COMPUTED VALUES WITH REAL-TIME ANALYTICS
  // ============================================================================

  const workProjects = getProjectsByCategory(state.projects, 'work');
  const clientProjects = getProjectsByCategory(state.projects, 'client');
  const personalProjects = getProjectsByCategory(state.projects, 'personal');

  const activeProjects = getProjectsByStatus(state.projects, 'active');
  const completedProjects = getProjectsByStatus(state.projects, 'completed');
  const planningProjects = getProjectsByStatus(state.projects, 'planning');

  const projectAnalytics = getProjectAnalytics(state.projects);

  // Enhanced todo analytics
  const crossProjectTodos = getCrossProjectTodos(state.todos);
  const urgentTodos = getTodosByPriority(state.todos, 'urgent');
  const pendingTodos = getTodosByStatus(state.todos, 'pending');
  const completedTodos = getTodosByStatus(state.todos, 'completed');

  // Real-time productivity metrics
  const todayCompletedTodos = state.todos.filter(t => 
    t.status === 'completed' && 
    t.completedAt &&
    new Date(t.completedAt).toDateString() === new Date().toDateString()
  );

  const weeklyProductivity = {
    completedProjects: completedProjects.filter(p => 
      p.completedAt && 
      new Date(p.completedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
    completedTodos: state.todos.filter(t => 
      t.status === 'completed' && 
      t.completedAt &&
      new Date(t.completedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
    totalRevenue: clientProjects.reduce((sum, p) => sum + (p.revenue || 0), 0),
  };

  // Project progress calculations with enhanced analytics
  const projectsWithProgress = state.projects.map((project: Project) => ({
    ...project,
    calculatedProgress: calculateProjectProgress(project, state.todos),
    velocity: calculateProjectVelocity(project, state.todos),
    riskLevel: assessProjectRisk(project, state.todos),
  }));

  return {
    // Core State
    state,
    isLoading,
    error,
    
    // Projects (organized by category)
    projects: state.projects,
    workProjects,
    clientProjects,
    personalProjects,
    activeProjects,
    completedProjects,
    planningProjects,
    projectsWithProgress,
    
    // Todos (organized by status/priority)
    todos: state.todos,
    crossProjectTodos,
    urgentTodos,
    pendingTodos,
    completedTodos,
    todayCompletedTodos,
    
    // Analytics & Insights
    analytics: state.analytics,
    projectAnalytics,
    weeklyProductivity,
    
    // CRUD Actions
    addProject,
    updateProject,
    deleteProject,
    addTodo,
    updateTodo,
    deleteTodo,
    setFilters,
    setView,
    
    // 🚀 NEW: Enhanced Features (v3.1.0 style)
    shareCurrentState,      // One-click URL sharing
    sendManualReport,       // On-demand email reports
    exportProjectData,      // Data backup/export
    
    // 🔧 NEW: v3.1.0 Dev Tools
    copyStateToClipboard,   // Copy current state URL
    getCurrentDashboardState, // Get state from anywhere
    getCurrentSlug,         // Get current slug
    debugCurrentState,      // Debug state information
    
    // Templates & Utils
    projectTemplates: DEFAULT_PROJECT_TEMPLATES,
    getTodosForProject: (projectId: string) => getTodosByProject(state.todos, projectId),
    getProjectById: (id: string) => state.projects.find(p => p.id === id),
    getTodoById: (id: string) => state.todos.find(t => t.id === id),
  };
}

// ============================================================================
// NEW: ENHANCED ANALYTICS FUNCTIONS
// ============================================================================

function calculateProjectVelocity(project: Project, todos: Todo[]): number {
  const projectTodos = todos.filter(t => t.projectId === project.id);
  const completedTodos = projectTodos.filter(t => t.status === 'completed');
  
  if (completedTodos.length === 0) return 0;
  
  const projectAge = new Date().getTime() - new Date(project.createdAt).getTime();
  const daysOld = projectAge / (1000 * 60 * 60 * 24);
  
  return completedTodos.length / Math.max(daysOld, 1); // todos per day
}

function assessProjectRisk(project: Project, todos: Todo[]): 'low' | 'medium' | 'high' {
  const projectTodos = todos.filter(t => t.projectId === project.id);
  const overdueTodos = projectTodos.filter(t => 
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
  );
  
  const urgentTodos = projectTodos.filter(t => t.priority === 'urgent' && t.status !== 'completed');
  
  if (overdueTodos.length > 3 || urgentTodos.length > 2) return 'high';
  if (overdueTodos.length > 1 || urgentTodos.length > 0) return 'medium';
  return 'low';
}

// ============================================================================
// SPECIALIZED HOOKS WITH ENHANCED FEATURES
// ============================================================================

export function useWorkProjects() {
  const { workProjects, addProject, updateProject, deleteProject, isLoading, error } = useClarityStore();
  
  const addWorkProject = useCallback(async (title: string, description?: string) => {
    return addProject({
      ...DEFAULT_PROJECT_TEMPLATES.work,
      title,
      description,
    });
  }, [addProject]);

  return {
    projects: workProjects,
    addProject: addWorkProject,
    updateProject,
    deleteProject,
    isLoading,
    error,
  };
}

export function useClientProjects() {
  const { clientProjects, addProject, updateProject, deleteProject, isLoading, error } = useClarityStore();
  
  const addClientProject = useCallback(async (
    title: string, 
    clientName: string, 
    budget?: number,
    description?: string
  ) => {
    return addProject({
      ...DEFAULT_PROJECT_TEMPLATES.client,
      title,
      description,
      clientName,
      budget,
    });
  }, [addProject]);

  return {
    projects: clientProjects,
    addProject: addClientProject,
    updateProject,
    deleteProject,
    isLoading,
    error,
  };
}

export function usePersonalProjects() {
  const { personalProjects, addProject, updateProject, deleteProject, isLoading, error } = useClarityStore();
  
  const addPersonalProject = useCallback(async (title: string, description?: string) => {
    return addProject({
      ...DEFAULT_PROJECT_TEMPLATES.personal,
      title,
      description,
    });
  }, [addProject]);

  return {
    projects: personalProjects,
    addProject: addPersonalProject,
    updateProject,
    deleteProject,
    isLoading,
    error,
  };
}

export function useTodos() {
  const { 
    todos, 
    crossProjectTodos, 
    urgentTodos, 
    pendingTodos, 
    completedTodos,
    todayCompletedTodos,
    addTodo, 
    updateTodo, 
    deleteTodo, 
    isLoading, 
    error 
  } = useClarityStore();

  const addCrossProjectTodo = useCallback(async (title: string, priority: TodoPriority = 'medium') => {
    return addTodo({
      title,
      priority,
      status: 'pending',
      tags: [],
    });
  }, [addTodo]);

  const addProjectTodo = useCallback(async (
    title: string, 
    projectId: string, 
    priority: TodoPriority = 'medium'
  ) => {
    return addTodo({
      title,
      projectId,
      priority,
      status: 'pending',
      tags: [],
    });
  }, [addTodo]);

  const completeTodo = useCallback(async (id: string) => {
    return updateTodo(id, {
      status: 'completed' as TodoStatus,
      completedAt: new Date().toISOString(),
    });
  }, [updateTodo]);

  const startTodo = useCallback(async (id: string) => {
    return updateTodo(id, {
      status: 'in-progress' as TodoStatus,
    });
  }, [updateTodo]);

  return {
    todos,
    crossProjectTodos,
    urgentTodos,
    pendingTodos,
    completedTodos,
    todayCompletedTodos,
    addCrossProjectTodo,
    addProjectTodo,
    updateTodo,
    deleteTodo,
    completeTodo,
    startTodo,
    isLoading,
    error,
  };
}

export function useAnalytics() {
  const { analytics, projectAnalytics, weeklyProductivity, isLoading, error } = useClarityStore();

  return {
    analytics,
    projectAnalytics,
    weeklyProductivity,
    isLoading,
    error,
  };
} 