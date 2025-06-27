// ============================================================================
// PROJECT UTILITY FUNCTIONS
// ============================================================================

import { 
  Project, 
  Todo, 
  ProjectCategory, 
  ProjectStatus, 
  TodoPriority, 
  TodoStatus,
  ProjectAnalytics 
} from '@/lib/types/clarity.types';

export function getProjectsByCategory(projects: Project[], category: ProjectCategory) {
  return projects.filter(project => project.category === category);
}

export function getProjectsByStatus(projects: Project[], status: ProjectStatus) {
  return projects.filter(project => project.status === status);
}

export function getTodosByProject(todos: Todo[], projectId: string) {
  return todos.filter(todo => todo.projectId === projectId);
}

export function getCrossProjectTodos(todos: Todo[]) {
  return todos.filter(todo => !todo.projectId);
}

export function getTodosByPriority(todos: Todo[], priority: TodoPriority) {
  return todos.filter(todo => todo.priority === priority);
}

export function getTodosByStatus(todos: Todo[], status: TodoStatus) {
  return todos.filter(todo => todo.status === status);
}

export function calculateProjectProgress(project: Project, todos: Todo[]) {
  const projectTodos = getTodosByProject(todos, project.id);
  if (projectTodos.length === 0) return project.progress;
  
  const completedTodos = projectTodos.filter(todo => todo.status === 'completed');
  return Math.round((completedTodos.length / projectTodos.length) * 100);
}

export function getProjectAnalytics(projects: Project[]): ProjectAnalytics {
  const completed = projects.filter(p => p.status === 'completed');
  const active = projects.filter(p => p.status === 'active');
  const planning = projects.filter(p => p.status === 'planning');
  
  const totalRevenue = projects
    .filter(p => p.category === 'client' && p.revenue)
    .reduce((sum, p) => sum + (p.revenue || 0), 0);
  
  const averageCompletionTime = completed.length > 0
    ? completed.reduce((sum, project) => {
        if (project.startedAt && project.completedAt) {
          const start = new Date(project.startedAt);
          const end = new Date(project.completedAt);
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        }
        return sum;
      }, 0) / completed.length
    : 0;
  
  return {
    total: projects.length,
    completed: completed.length,
    active: active.length,
    planning: planning.length,
    completionRate: projects.length > 0 ? (completed.length / projects.length) * 100 : 0,
    totalRevenue,
    averageCompletionTime,
  };
} 