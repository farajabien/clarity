// ============================================================================
// SAMPLE DATA FOR CLARITY APP
// ============================================================================

import { Project, Todo, AppState } from '@/lib/types/clarity.types';

// Sample projects
export const sampleProjects: Project[] = [
  {
    id: 'project-1',
    title: 'E-commerce Website Redesign',
    description: 'Complete redesign of client\'s online store with modern UI/UX',
    category: 'client',
    status: 'active',
    priority: 'high',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    startedAt: '2024-01-16T09:00:00Z',
    clientName: 'TechCorp Inc.',
    budget: 15000,
    paymentStatus: 'partial',
    paymentAmount: 7500,
    progress: 65,
    estimatedHours: 80,
    actualHours: 52,
    tags: ['client', 'web-design', 'e-commerce'],
    resources: ['https://figma.com/design', 'https://github.com/repo'],
    notes: 'Client is very happy with the progress so far',
    revenue: 15000,
  },
  {
    id: 'project-2',
    title: 'Internal Dashboard Development',
    description: 'Building analytics dashboard for internal team use',
    category: 'work',
    status: 'completed',
    priority: 'medium',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T16:00:00Z',
    startedAt: '2024-01-11T09:00:00Z',
    completedAt: '2024-01-18T16:00:00Z',
    progress: 100,
    estimatedHours: 40,
    actualHours: 38,
    tags: ['work', 'dashboard', 'analytics'],
    resources: ['https://github.com/internal-dashboard'],
    notes: 'Successfully deployed and team is using it daily',
  },
  {
    id: 'project-3',
    title: 'Personal Finance Tracker',
    description: 'Building a personal finance tracking app as a side project',
    category: 'personal',
    status: 'planning',
    priority: 'low',
    createdAt: '2024-01-22T12:00:00Z',
    updatedAt: '2024-01-22T12:00:00Z',
    progress: 0,
    estimatedHours: 120,
    tags: ['personal', 'finance', 'react-native'],
    resources: [],
    notes: 'Planning to use React Native for cross-platform support',
  },
  {
    id: 'project-4',
    title: 'Landing Page for Startup',
    description: 'Creating a landing page for a new SaaS startup',
    category: 'client',
    status: 'active',
    priority: 'urgent',
    createdAt: '2024-01-19T11:00:00Z',
    updatedAt: '2024-01-21T15:45:00Z',
    startedAt: '2024-01-20T09:00:00Z',
    clientName: 'StartupXYZ',
    budget: 5000,
    paymentStatus: 'pending',
    progress: 35,
    estimatedHours: 30,
    actualHours: 10.5,
    tags: ['client', 'landing-page', 'saas'],
    resources: ['https://figma.com/startup-design'],
    notes: 'Client wants it ready for their product launch next week',
    revenue: 5000,
  },
  {
    id: 'project-5',
    title: 'API Documentation Update',
    description: 'Updating API documentation for the main product',
    category: 'work',
    status: 'completed',
    priority: 'medium',
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-17T11:30:00Z',
    startedAt: '2024-01-13T09:00:00Z',
    completedAt: '2024-01-17T11:30:00Z',
    progress: 100,
    estimatedHours: 16,
    actualHours: 14,
    tags: ['work', 'documentation', 'api'],
    resources: ['https://docs.example.com'],
    notes: 'Documentation is now up to date with latest API changes',
  },
];

// Sample todos
export const sampleTodos: Todo[] = [
  {
    id: 'todo-1',
    title: 'Review client feedback on e-commerce design',
    description: 'Go through client feedback and make necessary adjustments',
    projectId: 'project-1',
    priority: 'high',
    status: 'pending',
    createdAt: '2024-01-20T16:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
    dueDate: '2024-01-23T17:00:00Z',
    tags: ['client', 'feedback'],
    estimatedMinutes: 120,
  },
  {
    id: 'todo-2',
    title: 'Set up database for finance tracker',
    description: 'Design and implement the database schema for the finance app',
    projectId: 'project-3',
    priority: 'medium',
    status: 'pending',
    createdAt: '2024-01-22T13:00:00Z',
    updatedAt: '2024-01-22T13:00:00Z',
    tags: ['database', 'planning'],
    estimatedMinutes: 180,
  },
  {
    id: 'todo-3',
    title: 'Complete landing page hero section',
    description: 'Finish the hero section with call-to-action buttons',
    projectId: 'project-4',
    priority: 'urgent',
    status: 'in-progress',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T15:00:00Z',
    dueDate: '2024-01-22T17:00:00Z',
    tags: ['frontend', 'hero'],
    estimatedMinutes: 90,
    actualMinutes: 45,
  },
  {
    id: 'todo-4',
    title: 'Schedule team meeting for dashboard feedback',
    description: 'Organize a meeting to get feedback on the new dashboard',
    priority: 'medium',
    status: 'completed',
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z',
    completedAt: '2024-01-19T10:00:00Z',
    tags: ['meeting', 'feedback'],
    estimatedMinutes: 30,
    actualMinutes: 25,
  },
  {
    id: 'todo-5',
    title: 'Research React Native best practices',
    description: 'Look into best practices for React Native development',
    projectId: 'project-3',
    priority: 'low',
    status: 'pending',
    createdAt: '2024-01-22T14:00:00Z',
    updatedAt: '2024-01-22T14:00:00Z',
    tags: ['research', 'react-native'],
    estimatedMinutes: 60,
  },
  {
    id: 'todo-6',
    title: 'Update resume with recent projects',
    description: 'Add the completed projects to personal resume',
    priority: 'medium',
    status: 'pending',
    createdAt: '2024-01-21T16:00:00Z',
    updatedAt: '2024-01-21T16:00:00Z',
    tags: ['personal', 'resume'],
    estimatedMinutes: 45,
  },
];

// Function to load sample data into the app state
export function loadSampleData(): AppState {
  return {
    projects: sampleProjects,
    todos: sampleTodos,
    user: {
      id: 'sample-user',
      name: 'Alex Developer',
      email: 'alex@example.com',
      preferences: {
        theme: 'auto',
        defaultProjectCategory: 'work',
        defaultTodoPriority: 'medium',
        notifications: {
          email: true,
          browser: true,
        },
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-22T00:00:00Z',
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
      projectsCompletedThisWeek: 2,
      projectsCompletedThisMonth: 2,
      totalRevenue: 20000,
      averageCompletionTime: 7.5,
    },
  };
}

// Function to get sample data by category
export function getSampleProjectsByCategory(category: 'work' | 'client' | 'personal'): Project[] {
  return sampleProjects.filter(project => project.category === category);
}

export function getSampleTodosByProject(projectId: string): Todo[] {
  return sampleTodos.filter(todo => todo.projectId === projectId);
}

export function getSampleCrossProjectTodos(): Todo[] {
  return sampleTodos.filter(todo => !todo.projectId);
} 