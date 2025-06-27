// ============================================================================
// CLARITY APP TYPES
// ============================================================================

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Project {
  id: string;
  title: string;
  description?: string;
  category: 'work' | 'client' | 'personal';
  status: 'planning' | 'active' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  
  // Client project specific fields
  clientName?: string;
  budget?: number;
  paymentStatus?: 'pending' | 'partial' | 'paid';
  paymentAmount?: number;
  
  // Progress tracking
  progress: number; // 0-100
  estimatedHours?: number;
  actualHours?: number;
  
  // Project details
  tags: string[];
  resources: string[]; // URLs, file paths, etc.
  notes?: string;
  
  // Analytics
  completionRate?: number;
  revenue?: number;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  projectId?: string; // null for cross-project todos
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  completedAt?: string;
  
  // Todo details
  tags: string[];
  estimatedMinutes?: number;
  actualMinutes?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// USER PREFERENCES
// ============================================================================

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  defaultProjectCategory: 'work' | 'client' | 'personal';
  defaultTodoPriority: 'low' | 'medium' | 'high' | 'urgent';
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  browser: boolean;
}

// ============================================================================
// FILTERS & VIEWS
// ============================================================================

export interface AppFilters {
  projectCategory: 'all' | 'work' | 'client' | 'personal';
  projectStatus: 'all' | 'planning' | 'active' | 'completed' | 'archived';
  todoStatus: 'all' | 'pending' | 'in-progress' | 'completed';
  todoPriority: 'all' | 'low' | 'medium' | 'high' | 'urgent';
  searchQuery: string;
}

export interface AppView {
  activeTab: 'work' | 'clients' | 'personal' | 'todos';
  projectView: 'grid' | 'list';
  todoView: 'list' | 'kanban';
}

// ============================================================================
// ANALYTICS
// ============================================================================

export interface AppAnalytics {
  lastUpdated: string;
  projectsCompletedThisWeek: number;
  projectsCompletedThisMonth: number;
  totalRevenue: number;
  averageCompletionTime: number;
}

export interface ProjectAnalytics {
  total: number;
  completed: number;
  active: number;
  planning: number;
  completionRate: number;
  totalRevenue: number;
  averageCompletionTime: number;
}

// ============================================================================
// APP STATE
// ============================================================================

export interface AppState {
  projects: Project[];
  todos: Todo[];
  user: User;
  filters: AppFilters;
  view: AppView;
  analytics: AppAnalytics;
}

// ============================================================================
// PROJECT TEMPLATES
// ============================================================================

export interface ProjectTemplate {
  title: string;
  category: Project['category'];
  status: Project['status'];
  priority: Project['priority'];
  progress: number;
  tags: string[];
  resources: string[];
  clientName?: string;
  budget?: number;
  paymentStatus?: 'pending' | 'partial' | 'paid';
}

export interface ProjectTemplates {
  work: ProjectTemplate;
  client: ProjectTemplate;
  personal: ProjectTemplate;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type ProjectResponse = ApiResponse<Project>;
export type ProjectsResponse = ApiResponse<Project[]>;
export type TodoResponse = ApiResponse<Todo>;
export type TodosResponse = ApiResponse<Todo[]>;

// ============================================================================
// FORM TYPES
// ============================================================================

export interface CreateProjectForm {
  title: string;
  description?: string;
  category: Project['category'];
  priority: Project['priority'];
  clientName?: string;
  budget?: number;
  tags: string[];
}

export interface UpdateProjectForm {
  title?: string;
  description?: string;
  status?: Project['status'];
  priority?: Project['priority'];
  progress?: number;
  clientName?: string;
  budget?: number;
  paymentStatus?: Project['paymentStatus'];
  tags?: string[];
  notes?: string;
}

export interface CreateTodoForm {
  title: string;
  description?: string;
  projectId?: string;
  priority: Todo['priority'];
  dueDate?: string;
  tags: string[];
}

export interface UpdateTodoForm {
  title?: string;
  description?: string;
  status?: Todo['status'];
  priority?: Todo['priority'];
  dueDate?: string;
  tags?: string[];
}

// ============================================================================
// SLUG STORE TYPES
// ============================================================================

export interface SlugStoreConfig {
  url?: boolean;
  offline?: boolean | {
    storage?: 'indexeddb' | 'localstorage' | 'memory';
    encryption?: boolean;
    password?: string;
    ttl?: number;
  };
  db?: {
    endpoint: string;
    method?: 'POST' | 'PUT';
    headers?: Record<string, string>;
  };
  compress?: boolean;
  encrypt?: boolean;
  password?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ProjectCategory = Project['category'];
export type ProjectStatus = Project['status'];
export type ProjectPriority = Project['priority'];
export type TodoStatus = Todo['status'];
export type TodoPriority = Todo['priority'];
export type Theme = UserPreferences['theme'];

export type ProjectWithProgress = Project & {
  calculatedProgress: number;
};

export type TodoWithProject = Todo & {
  project?: Project;
};

// ============================================================================
// CONSTANTS
// ============================================================================

export const PROJECT_CATEGORIES: ProjectCategory[] = ['work', 'client', 'personal'];
export const PROJECT_STATUSES: ProjectStatus[] = ['planning', 'active', 'completed', 'archived'];
export const PROJECT_PRIORITIES: ProjectPriority[] = ['low', 'medium', 'high', 'urgent'];
export const TODO_STATUSES: TodoStatus[] = ['pending', 'in-progress', 'completed'];
export const TODO_PRIORITIES: TodoPriority[] = ['low', 'medium', 'high', 'urgent'];
export const THEMES: Theme[] = ['light', 'dark', 'auto'];

export const DEFAULT_PROJECT_TEMPLATES: ProjectTemplates = {
  work: {
    title: 'New Work Project',
    category: 'work',
    status: 'planning',
    priority: 'medium',
    progress: 0,
    tags: ['work'],
    resources: [],
  },
  client: {
    title: 'New Client Project',
    category: 'client',
    status: 'planning',
    priority: 'high',
    progress: 0,
    tags: ['client'],
    resources: [],
    paymentStatus: 'pending',
  },
  personal: {
    title: 'New Personal Project',
    category: 'personal',
    status: 'planning',
    priority: 'medium',
    progress: 0,
    tags: ['personal'],
    resources: [],
  },
};

export const DEFAULT_APP_STATE: AppState = {
  projects: [],
  todos: [],
  user: {
    id: 'default-user',
    name: 'Developer',
    email: 'dev@example.com',
    preferences: {
      theme: 'auto',
      defaultProjectCategory: 'work',
      defaultTodoPriority: 'medium',
      notifications: {
        email: true,
        browser: true,
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  filters: {
    projectCategory: 'all',
    projectStatus: 'all',
    todoStatus: 'all',
    todoPriority: 'all',
    searchQuery: '',
  },
  view: {
    activeTab: 'work',
    projectView: 'grid',
    todoView: 'list',
  },
  analytics: {
    lastUpdated: new Date().toISOString(),
    projectsCompletedThisWeek: 0,
    projectsCompletedThisMonth: 0,
    totalRevenue: 0,
    averageCompletionTime: 0,
  },
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isProject(obj: unknown): obj is Project {
  return obj !== null && 
    typeof obj === 'object' &&
    'id' in obj &&
    'title' in obj &&
    'category' in obj &&
    'status' in obj &&
    'priority' in obj &&
    typeof (obj as Record<string, unknown>).id === 'string' &&
    typeof (obj as Record<string, unknown>).title === 'string' &&
    PROJECT_CATEGORIES.includes((obj as Record<string, unknown>).category as ProjectCategory) &&
    PROJECT_STATUSES.includes((obj as Record<string, unknown>).status as ProjectStatus) &&
    PROJECT_PRIORITIES.includes((obj as Record<string, unknown>).priority as ProjectPriority);
}

export function isTodo(obj: unknown): obj is Todo {
  return obj !== null && 
    typeof obj === 'object' &&
    'id' in obj &&
    'title' in obj &&
    'priority' in obj &&
    'status' in obj &&
    typeof (obj as Record<string, unknown>).id === 'string' &&
    typeof (obj as Record<string, unknown>).title === 'string' &&
    TODO_PRIORITIES.includes((obj as Record<string, unknown>).priority as TodoPriority) &&
    TODO_STATUSES.includes((obj as Record<string, unknown>).status as TodoStatus);
}

export function isUser(obj: unknown): obj is User {
  return obj !== null && 
    typeof obj === 'object' &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj &&
    typeof (obj as Record<string, unknown>).id === 'string' &&
    typeof (obj as Record<string, unknown>).name === 'string' &&
    typeof (obj as Record<string, unknown>).email === 'string';
}

export function isAppState(obj: unknown): obj is AppState {
  return obj !== null && 
    typeof obj === 'object' &&
    'projects' in obj &&
    'todos' in obj &&
    'user' in obj &&
    'filters' in obj &&
    'view' in obj &&
    'analytics' in obj &&
    Array.isArray((obj as Record<string, unknown>).projects) &&
    Array.isArray((obj as Record<string, unknown>).todos) &&
    isUser((obj as Record<string, unknown>).user);
}
