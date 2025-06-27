'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  debugCurrentState, 
  getStateAnalytics, 
  copyStateToClipboard,
  exportDebugData 
} from '@/lib/utils/state-utils';

export function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState<ReturnType<typeof debugCurrentState> | null>(null);
  const [analytics, setAnalytics] = useState<ReturnType<typeof getStateAnalytics> | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleDebugState = () => {
    const info = debugCurrentState();
    const analyticsData = getStateAnalytics();
    setDebugInfo(info);
    setAnalytics(analyticsData);
    setIsExpanded(true);
  };

  const handleCopySlug = async () => {
    const result = await copyStateToClipboard();
    if (result.success) {
      alert('✅ URL copied to clipboard!');
    } else {
      alert('❌ Failed to copy URL');
    }
  };

  const handleExportDebug = () => {
    const debugData = exportDebugData();
    const blob = new Blob([debugData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clarity-debug-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (isValid: boolean) => {
    return isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getPerformanceColor = (value: number, threshold: number) => {
    return value > threshold ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <Card className="bg-gray-900 text-white border-gray-700 shadow-xl max-w-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono">
            🔧 Debug Panel v3.1.0
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Control Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleDebugState} 
              size="sm" 
              variant="secondary"
              className="text-xs"
            >
              Debug State
            </Button>
            <Button 
              onClick={handleCopySlug} 
              size="sm" 
              variant="outline"
              className="text-xs"
            >
              Copy URL
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleExportDebug} 
              size="sm" 
              variant="outline"
              className="text-xs"
            >
              Export Debug
            </Button>
            <Button 
              onClick={() => setIsExpanded(!isExpanded)} 
              size="sm" 
              variant="ghost"
              className="text-xs"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>

          {/* Debug Information */}
          {debugInfo && isExpanded && (
            <div className="space-y-3 border-t border-gray-700 pt-3">
              {/* State Status */}
              <div>
                <div className="text-xs font-semibold mb-1">State Status</div>
                <Badge className={getStatusColor(debugInfo.isValid)}>
                  {debugInfo.isValid ? 'Valid' : 'Invalid'}
                </Badge>
              </div>

              {/* Performance Metrics */}
              <div>
                <div className="text-xs font-semibold mb-1">Performance</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Projects:</span>
                    <Badge className={getPerformanceColor(debugInfo.performance.projectCount, 50)}>
                      {debugInfo.performance.projectCount}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Todos:</span>
                    <Badge className={getPerformanceColor(debugInfo.performance.todoCount, 100)}>
                      {debugInfo.performance.todoCount}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory:</span>
                    <span className="text-gray-300">{debugInfo.performance.memoryUsage}</span>
                  </div>
                </div>
              </div>

              {/* URL & State Size */}
              <div>
                <div className="text-xs font-semibold mb-1">Size Metrics</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>URL Length:</span>
                    <Badge className={getPerformanceColor(debugInfo.urlLength, 2000)}>
                      {debugInfo.urlLength}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>State Size:</span>
                    <Badge className={getPerformanceColor(debugInfo.stateSize, 10000)}>
                      {(debugInfo.stateSize / 1024).toFixed(1)}KB
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Analytics Summary */}
              {analytics && (
                <div>
                  <div className="text-xs font-semibold mb-1">Analytics</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Work Projects:</span>
                      <span className="text-blue-400">{analytics.projectsByCategory.work}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Client Projects:</span>
                      <span className="text-green-400">{analytics.projectsByCategory.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Personal Projects:</span>
                      <span className="text-purple-400">{analytics.projectsByCategory.personal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Urgent Items:</span>
                      <Badge className={analytics.urgentItems > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                        {analytics.urgentItems}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Slug Preview */}
              {debugInfo.slug && (
                <div>
                  <div className="text-xs font-semibold mb-1">Slug Preview</div>
                  <div className="text-xs font-mono bg-gray-800 p-2 rounded border break-all">
                    {debugInfo.slug.substring(0, 100)}
                    {debugInfo.slug.length > 100 && '...'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Stats (Always Visible) */}
          {debugInfo && !isExpanded && (
            <div className="text-xs text-gray-400 border-t border-gray-700 pt-2">
              {debugInfo.performance.projectCount} projects • {debugInfo.performance.todoCount} todos
              {debugInfo.isValid ? ' • ✅' : ' • ❌'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 