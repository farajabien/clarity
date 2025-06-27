import { AppState } from '@/lib/types/clarity.types';

// ============================================================================
// v3.1.0 STATE UTILITIES - Enhanced debugging and state access
// ============================================================================

/**
 * Get current dashboard state from anywhere in the application
 * Simulates getSlugData() functionality from v3.1.0
 */
export function getCurrentDashboardState(): AppState | null {
  try {
    // Try to get from URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const slugData = urlParams.get('clarity-app');
    
    if (slugData) {
      // Decode compressed state from URL
      const decodedData = atob(slugData);
      return JSON.parse(decodedData);
    }
    
    // Fallback to localStorage if available
    const localData = localStorage.getItem('slug-store-clarity-app');
    if (localData) {
      return JSON.parse(localData);
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to get dashboard state:', error);
    return null;
  }
}

/**
 * Get current URL slug (simulates v3.1.0 slug() function)
 */
export function getCurrentSlug(): string {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('clarity-app') || '';
  } catch (error) {
    console.warn('Failed to get current slug:', error);
    return '';
  }
}

/**
 * Copy current state slug to clipboard (simulates v3.1.0 copySlug())
 */
export async function copyStateToClipboard(): Promise<{ success: boolean; url: string }> {
  try {
    const currentUrl = window.location.href;
    await navigator.clipboard.writeText(currentUrl);
    
    return { success: true, url: currentUrl };
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = window.location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      return { success: true, url: window.location.href };
    } catch (fallbackError) {
      console.error('Clipboard fallback failed:', fallbackError);
      return { success: false, url: window.location.href };
    }
  }
}

/**
 * Advanced sharing function (simulates v3.1.0 shareSlug())
 */
export async function shareCurrentState(options: {
  title?: string;
  text?: string;
  url?: string;
} = {}): Promise<{ success: boolean; method: string; url: string }> {
  const shareableUrl = options.url || window.location.href;
  const title = options.title || 'My Clarity Dashboard';
  const text = options.text || 'Check out my project workspace!';

  try {
    // Try native sharing first (mobile/desktop)
    if (navigator.share) {
      await navigator.share({ title, text, url: shareableUrl });
      return { success: true, method: 'native', url: shareableUrl };
    }
    
    // Fallback to clipboard (web browsers)
    const clipboardResult = await copyStateToClipboard();
    return { success: clipboardResult.success, method: 'clipboard', url: shareableUrl };
    
  } catch (error) {
    console.error('Share failed:', error);
    
    // Final fallback - manual copy
    prompt('Copy this URL to share your dashboard:', shareableUrl);
    return { success: true, method: 'manual', url: shareableUrl };
  }
}

/**
 * Validate dashboard state structure
 */
export function validateDashboardState(state: unknown): state is AppState {
  if (!state || typeof state !== 'object') return false;
  
  const stateObj = state as Record<string, unknown>;
  return (
    Array.isArray(stateObj.projects) &&
    Array.isArray(stateObj.todos) &&
    typeof stateObj.analytics === 'object'
  );
}

/**
 * Debug current state - comprehensive debugging information
 */
export function debugCurrentState(): {
  state: AppState | null;
  slug: string;
  urlLength: number;
  stateSize: number;
  isValid: boolean;
  performance: {
    projectCount: number;
    todoCount: number;
    memoryUsage: string;
  };
} {
  const state = getCurrentDashboardState();
  const slug = getCurrentSlug();
  const urlLength = window.location.href.length;
  const stateSize = state ? JSON.stringify(state).length : 0;
  const isValid = validateDashboardState(state);
  
  const performanceData = {
    projectCount: state?.projects?.length || 0,
    todoCount: state?.todos?.length || 0,
    memoryUsage: typeof (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory !== 'undefined' 
      ? `${Math.round(((performance as unknown as { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize) / 1024 / 1024)}MB`
      : 'Unknown'
  };

  // Console output for debugging
  console.group('🐛 Clarity Debug Info');
  console.log('📊 State:', state);
  console.log('🔗 Slug:', slug.substring(0, 50) + (slug.length > 50 ? '...' : ''));
  console.log('📏 URL Length:', urlLength, 'characters');
  console.log('💾 State Size:', stateSize, 'bytes');
  console.log('✅ Valid State:', isValid);
  console.log('⚡ Performance:', performanceData);
  console.groupEnd();
  
  return {
    state,
    slug,
    urlLength,
    stateSize,
    isValid,
    performance: performanceData
  };
}

/**
 * Get state analytics for monitoring
 */
export function getStateAnalytics() {
  const state = getCurrentDashboardState();
  
  if (!state || !validateDashboardState(state)) {
    return null;
  }

  const projectsByCategory = {
    work: state.projects.filter(p => p.category === 'work').length,
    client: state.projects.filter(p => p.category === 'client').length,
    personal: state.projects.filter(p => p.category === 'personal').length,
  };

  const todosByStatus = {
    pending: state.todos.filter(t => t.status === 'pending').length,
    'in-progress': state.todos.filter(t => t.status === 'in-progress').length,
    completed: state.todos.filter(t => t.status === 'completed').length,
  };

  const urgentItems = state.todos.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;

  return {
    totalProjects: state.projects.length,
    totalTodos: state.todos.length,
    projectsByCategory,
    todosByStatus,
    urgentItems,
    lastUpdated: state.analytics?.lastUpdated || 'Unknown',
  };
}

/**
 * Performance monitoring for slug-store operations
 */
export function monitorPerformance<T>(operation: string, fn: () => T): T {
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(`⚡ ${operation} took ${duration.toFixed(2)}ms`);
  
  return result;
}

/**
 * Export enhanced debug data
 */
export function exportDebugData(): string {
  const debugInfo = debugCurrentState();
  const analytics = getStateAnalytics();
  
  const debugExport = {
    timestamp: new Date().toISOString(),
    debug: debugInfo,
    analytics,
    browser: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
    },
    url: window.location.href,
  };

  return JSON.stringify(debugExport, null, 2);
} 