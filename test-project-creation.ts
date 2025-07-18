// Simple test file to verify project creation
import { useAppStore } from './hooks/use-app-store';

// This would be called from the browser console to test project creation
export const testProjectCreation = () => {
  const store = useAppStore.getState();
  
  console.log('Current projects before:', Object.keys(store.projects).length);
  
  const projectId = store.addProject({
    title: "Test Project",
    description: "A test project to verify store integration",
    category: "work",
    priority: "medium",
    status: "planning",
  });
  
  console.log('Created project with ID:', projectId);
  console.log('Current projects after:', Object.keys(store.projects).length);
  console.log('Project details:', store.projects[projectId]);
  
  return projectId;
};

// Test function available globally for browser testing
if (typeof window !== 'undefined') {
  (window as any).testProjectCreation = testProjectCreation;
}
