"use server";

import {
  Project,
  Todo,
  AppState,
  DEFAULT_PROJECT_TEMPLATES,
} from '@/lib/types/clarity.types';

// ============================================================================
// PROJECT TEMPLATE EXPORTS
// ============================================================================

export { DEFAULT_PROJECT_TEMPLATES };

// ============================================================================
// UTILITY FUNCTIONS FOR SERVER ACTIONS
// ============================================================================

export async function generateProjectId(): Promise<string> {
  return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function generateTodoId(): Promise<string> {
  return `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function getCurrentTimestamp(): Promise<string> {
  return new Date().toISOString();
}

// ============================================================================
// SERVER-SIDE VALIDATION FUNCTIONS
// ============================================================================

export async function validateProject(project: Partial<Project>): Promise<boolean> {
  return !!(project.title && project.category && project.status && project.priority);
}

export async function validateTodo(todo: Partial<Todo>): Promise<boolean> {
  return !!(todo.title && todo.priority && todo.status);
}

// ============================================================================
// ANALYTICS CALCULATIONS
// ============================================================================

export async function calculateAnalytics(projects: Project[]): Promise<AppState['analytics']> {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const projectsCompletedThisWeek = projects.filter((p: Project) => 
    p.status === 'completed' && 
    p.completedAt && 
    new Date(p.completedAt) >= oneWeekAgo
  ).length;

  const projectsCompletedThisMonth = projects.filter((p: Project) => 
    p.status === 'completed' && 
    p.completedAt && 
    new Date(p.completedAt) >= oneMonthAgo
  ).length;

  const totalRevenue = projects
    .filter((p: Project) => p.category === 'client' && p.revenue)
    .reduce((sum, p) => sum + (p.revenue || 0), 0);

  const completedProjects = projects.filter((p: Project) => p.status === 'completed');
  const averageCompletionTime = completedProjects.length > 0
    ? completedProjects.reduce((sum, project) => {
        if (project.startedAt && project.completedAt) {
          const start = new Date(project.startedAt);
          const end = new Date(project.completedAt);
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        }
        return sum;
      }, 0) / completedProjects.length
    : 0;

  return {
    lastUpdated: new Date().toISOString(),
    projectsCompletedThisWeek,
    projectsCompletedThisMonth,
    totalRevenue,
    averageCompletionTime,
  };
}

