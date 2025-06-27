'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  Briefcase, 
  Users, 
  Rocket, 
  CheckCircle,
  Database,
  Clock,
  AlertTriangle,
  Calendar,
  Trash2
} from "lucide-react";
import { useClarityStore } from "@/lib/hooks/useProjects";
import { loadSampleData } from "@/lib/data/sample-data";
import { DebugPanel } from "@/components/DebugPanel";

export function ClarityDashboard() {
  const {
    workProjects,
    clientProjects,
    personalProjects,
    todos,
    urgentTodos,
    pendingTodos,
    completedTodos,
    todayCompletedTodos,
    weeklyProductivity,
    isLoading,
    error,
    addProject,
    addTodo,
    updateTodo,
    deleteTodo,
    shareCurrentState,
    sendManualReport,
    exportProjectData,
    copyStateToClipboard,
    getProjectById,
  } = useClarityStore();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'work' | 'client' | 'personal'>('work');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    budget: '',
  });

  const handleQuickProject = (category: 'work' | 'client' | 'personal') => {
    setSelectedCategory(category);
    setFormData({ title: '', description: '', clientName: '', budget: '' });
    setIsSheetOpen(true);
  };

  const handleCreateProject = async () => {
    if (!formData.title.trim()) return;

    const baseProjectData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      category: selectedCategory,
      status: 'planning' as const,
      priority: 'medium' as const,
      progress: 0,
      tags: [selectedCategory],
      resources: [],
    };

    const projectData = selectedCategory === 'client' 
      ? {
          ...baseProjectData,
          clientName: formData.clientName.trim() || undefined,
          budget: formData.budget && !isNaN(Number(formData.budget)) ? Number(formData.budget) : undefined,
        }
      : baseProjectData;

    await addProject(projectData);
    setIsSheetOpen(false);
    setFormData({ title: '', description: '', clientName: '', budget: '' });
  };

  const handleLoadSampleData = async () => {
    try {
      const sampleData = loadSampleData();
      
      // Add each sample project
      for (const project of sampleData.projects) {
        await addProject(project);
      }
      
      // Add sample todos 
      if (sampleData.todos) {
        for (const todo of sampleData.todos) {
          await addTodo(todo);
        }
      }
      
      alert('✅ Sample data loaded! Check all tabs to see projects and todos.');
    } catch (error) {
      console.error('Failed to load sample data:', error);
      alert('❌ Failed to load sample data');
    }
  };

  // 🚀 v3.1.0 Enhanced sharing with feedback
  const handleAdvancedSharing = async () => {
    try {
      const result = await shareCurrentState();
      
      // Show user feedback based on sharing method
      if (result.success) {
        const message = result.method === 'native' 
          ? '✅ Shared successfully!' 
          : '✅ URL copied to clipboard!';
        
        // Simple alert for now (could be replaced with toast)
        alert(message);
      }
         } catch (error) {
       console.error('Sharing failed:', error);
       // Fallback to manual copy
       try {
         const copyResult = await copyStateToClipboard();
         if (copyResult.success) {
           alert('✅ Dashboard URL copied to clipboard!');
         } else {
           alert('❌ Failed to copy URL');
         }
       } catch (fallbackError) {
         console.error('Fallback sharing failed:', fallbackError);
         alert('❌ Sharing failed. Please copy the URL manually.');
       }
     }
  };

  const handleExportData = () => {
    try {
      exportProjectData();
      alert('✅ Project data exported successfully!');
         } catch (error) {
       console.error('Export failed:', error);
       alert('❌ Failed to export data');
     }
  };

    const handleEmailReport = async () => {
    try {
      const success = await sendManualReport();
      if (success) {
        alert('✅ Email report sent successfully!');
      } else {
        alert('❌ Failed to send email report');
      }
    } catch (error) {
      console.error('Email report failed:', error);
      alert('❌ Failed to send email report');
    }
  };

  // 📋 Todo Management Functions
  const handleToggleTodo = async (todoId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const updates = {
      status: newStatus as 'pending' | 'in-progress' | 'completed',
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
    };
    
    try {
      await updateTodo(todoId, updates);
    } catch (error) {
      console.error('Failed to update todo:', error);
      alert('❌ Failed to update todo');
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(todoId);
        alert('✅ Todo deleted successfully!');
      } catch (error) {
        console.error('Failed to delete todo:', error);
        alert('❌ Failed to delete todo');
      }
    }
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return 'No due date';
    
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  const getDueDateColor = (dueDate?: string, status?: string) => {
    if (status === 'completed') return 'text-green-600';
    if (!dueDate) return 'text-gray-400';
    
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600'; // Overdue
    if (diffDays <= 1) return 'text-orange-600'; // Due soon
    if (diffDays <= 3) return 'text-yellow-600'; // Due this week
    return 'text-gray-600'; // Future
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">Error Loading Projects</h3>
          <p className="text-gray-600 mt-2">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* v3.1.0 Debug Panel (development only) */}
      <DebugPanel />
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Clarity
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Project management for developers with ADHD
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  This Week
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {todayCompletedTodos.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  tasks completed today
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Revenue
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${weeklyProductivity.totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  weekly revenue
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Quick Actions
            </h2>
            <div className="flex gap-2">
              <Button
                onClick={handleAdvancedSharing}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                📤 Share Dashboard
              </Button>
              <Button
                onClick={handleEmailReport}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                📧 Email Report
              </Button>
              <Button
                onClick={handleExportData}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                💾 Export Data
              </Button>
              {workProjects.length === 0 && (
                <Button
                  onClick={handleLoadSampleData}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Database className="h-4 w-4" />
                  Load Sample Data
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleQuickProject('work')}
              disabled={isLoading}
              className="h-24 flex flex-col items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
            >
              <Briefcase className="h-6 w-6" />
              <span className="font-medium">New Work Project</span>
            </Button>
            <Button
              onClick={() => handleQuickProject('client')}
              disabled={isLoading}
              className="h-24 flex flex-col items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-300 dark:border-green-800"
            >
              <Users className="h-6 w-6" />
              <span className="font-medium">New Client Project</span>
            </Button>
            <Button
              onClick={() => handleQuickProject('personal')}
              disabled={isLoading}
              className="h-24 flex flex-col items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
            >
              <Rocket className="h-6 w-6" />
              <span className="font-medium">New Personal Project</span>
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Analytics Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {workProjects.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  {workProjects.length} completed
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {workProjects.length > 0 ? ((workProjects.length / clientProjects.length) * 100).toFixed(1) : 'N/A'}%
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  {workProjects.length} of {clientProjects.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {workProjects.filter(p => p.status === 'active').length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  in progress
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Avg. Completion Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {workProjects.length > 0 ? (workProjects.reduce((total, project) => total + project.progress, 0) / workProjects.length).toFixed(1) : 'N/A'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  days per project
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Recent Projects
          </h2>
          {workProjects.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="text-slate-500 dark:text-slate-400 mb-2">
                  No projects yet
                </div>
                <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
                  Create your first project to get started, or load sample data to see Clarity in action
                </p>
                <Button
                  onClick={handleLoadSampleData}
                  variant="outline"
                  className="flex items-center gap-2 mx-auto"
                >
                  <Database className="h-4 w-4" />
                  Load Sample Data
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                          {project.description || 'No description'}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {project.progress}%
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      <div className="flex items-center justify-between">
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                        <div className="text-xs text-slate-500 dark:text-slate-500">
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Project Categories */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Project Categories
          </h2>
          <Tabs defaultValue="work" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="work" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Work ({workProjects.length})
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Clients ({clientProjects.length})
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Personal ({personalProjects.length})
              </TabsTrigger>
              <TabsTrigger value="todos" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Todos ({todos.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="work" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workProjects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={project.progress} className="mb-2" />
                      <div className="flex justify-between text-sm">
                        <span>{project.progress}% complete</span>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="clients" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientProjects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>
                        {project.clientName && `Client: ${project.clientName}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={project.progress} className="mb-2" />
                      <div className="flex justify-between text-sm mb-2">
                        <span>{project.progress}% complete</span>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      {project.budget && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Budget: ${project.budget.toLocaleString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="personal" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personalProjects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={project.progress} className="mb-2" />
                      <div className="flex justify-between text-sm">
                        <span>{project.progress}% complete</span>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="todos" className="mt-6">
              <div className="space-y-4">
                {/* Todo Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{todos.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{pendingTodos.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Urgent</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{urgentTodos.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{completedTodos.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Unified Todos Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      All Todos
                    </CardTitle>
                    <CardDescription>
                      Unified view of all todos across your projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {todos.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <div className="text-slate-500 dark:text-slate-400 mb-2">
                          No todos yet
                        </div>
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                          Create projects and add todos to see them here
                        </p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">Done</TableHead>
                            <TableHead>Task</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {todos
                            .sort((a, b) => {
                              // Sort by priority (urgent first), then by due date
                              const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
                              const aPriority = priorityOrder[a.priority] || 4;
                              const bPriority = priorityOrder[b.priority] || 4;
                              
                              if (aPriority !== bPriority) return aPriority - bPriority;
                              
                              // Then by due date (earliest first)
                              if (a.dueDate && b.dueDate) {
                                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                              }
                              
                              return a.dueDate ? -1 : 1; // Todos with due dates first
                            })
                            .map((todo) => {
                              const project = todo.projectId ? getProjectById(todo.projectId) : null;
                              return (
                                <TableRow key={todo.id}>
                                  <TableCell>
                                    <Checkbox
                                      checked={todo.status === 'completed'}
                                      onCheckedChange={() => handleToggleTodo(todo.id, todo.status)}
                                      className="h-4 w-4"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div className={todo.status === 'completed' ? 'line-through text-slate-500' : ''}>
                                      <div className="font-medium">{todo.title}</div>
                                      {todo.description && (
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                          {todo.description}
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {project ? (
                                      <Badge variant="outline" className="text-xs">
                                        {project.title}
                                      </Badge>
                                    ) : (
                                      <span className="text-slate-400 text-sm">Cross-project</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={getPriorityColor(todo.priority)}>
                                      {todo.priority}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className={`text-sm flex items-center gap-1 ${getDueDateColor(todo.dueDate, todo.status)}`}>
                                      <Calendar className="h-3 w-3" />
                                      {formatDueDate(todo.dueDate)}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(todo.status)}>
                                      {todo.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteTodo(todo.id)}
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Project Creation Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[80vh] px-2 md:px-5 mx-auto">
          <SheetHeader>
            <SheetTitle>
              Create New {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Project
            </SheetTitle>
            <SheetDescription>
              Add a new project to your {selectedCategory} workspace
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="Enter project title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                autoFocus
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Brief project description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            
            {selectedCategory === 'client' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    placeholder="Client or company name..."
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="budget">Budget (Optional)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Project budget in USD..."
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleCreateProject}
                disabled={!formData.title.trim() || isLoading}
                className="flex-1"
              >
                Create Project
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsSheetOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 