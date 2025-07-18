"use client";

import { useParams, useRouter } from "next/navigation";
import { useHydratedStore } from "@/hooks/use-hydrated-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  Edit, 
  MoreHorizontal,
  Plus,
  Target,
  Users,
  CheckSquare,
  Square,
  Trash2
} from "lucide-react";
import { AddTodoDialog } from "@/components/layout/add-todo-dialog";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusColors = {
  planning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "in-progress": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  review: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "on-hold": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const { projects, todos, toggleTodo, deleteTodo, isHydrated } = useHydratedStore();

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  const project = projects[projectId];
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Project Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            The project you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  // Get project todos
  const projectTodos = Object.values(todos).filter(todo => todo.projectId === projectId);
  const completedTodos = projectTodos.filter(todo => todo.completed);
  const progressPercentage = projectTodos.length > 0 ? (completedTodos.length / projectTodos.length) * 100 : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {project.category} • Created {format(new Date(project.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <AddTodoDialog projectId={projectId}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </AddTodoDialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Project Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={statusColors[project.status] || statusColors.planning}>
              {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={priorityColors[project.priority] || priorityColors.medium}>
              {project.priority?.replace(/\b\w/g, l => l.toUpperCase()) || 'Medium'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{completedTodos.length} of {projectTodos.length} tasks</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Due Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {project.dueDate 
                ? format(new Date(project.dueDate), 'MMM d, yyyy')
                : 'No due date set'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {project.description || project.desc || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Project Tasks
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-normal text-muted-foreground">
                    {completedTodos.length}/{projectTodos.length} completed
                  </span>
                  <AddTodoDialog projectId={projectId}>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </AddTodoDialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projectTodos.length > 0 ? (
                <div className="space-y-3">
                  {projectTodos
                    .sort((a, b) => {
                      // Sort by completion status, then by priority
                      if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                      }
                      return b.priority - a.priority;
                    })
                    .map((todo) => {
                      const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;
                      
                      return (
                        <div key={todo.id} className={cn(
                          "flex items-start space-x-3 p-3 rounded-lg border transition-colors",
                          todo.completed && "bg-muted/50",
                          isOverdue && "border-destructive/50 bg-destructive/5"
                        )}>
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => {
                              toggleTodo(todo.id);
                              toast.success(todo.completed ? "Task marked as incomplete" : "Task completed!");
                            }}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "font-medium",
                              todo.completed && "line-through text-muted-foreground"
                            )}>
                              {todo.text}
                            </p>
                  
                            {todo.dueDate && (
                              <div className="flex items-center gap-1 mt-2">
                                <Calendar className="h-3 w-3" />
                                <span className={cn(
                                  "text-xs",
                                  isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
                                )}>
                                  Due: {format(new Date(todo.dueDate), 'MMM d, yyyy')}
                                  {isOverdue && " (Overdue)"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={todo.priority >= 4 ? "destructive" : todo.priority >= 3 ? "default" : "secondary"}
                              className="text-xs"
                            >
                              P{todo.priority}
                            </Badge>
                            {todo.energyLevel && (
                              <Badge variant="outline" className="text-xs">
                                E{todo.energyLevel}
                              </Badge>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this task?")) {
                                      deleteTodo(todo.id);
                                      toast.success("Task deleted");
                                    }
                                  }}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Task
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Square className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">No tasks yet</p>
                  <AddTodoDialog projectId={projectId}>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Task
                    </Button>
                  </AddTodoDialog>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.budget && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Budget
                  </span>
                  <span className="font-medium">${project.budget.toLocaleString()}</span>
                </div>
              )}
              
              {project.estimatedTime && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    Estimated Time
                  </span>
                  <span className="font-medium">{project.estimatedTime}h</span>
                </div>
              )}

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">Category</p>
                <Badge variant="outline" className="capitalize">
                  {project.category}
                </Badge>
              </div>

              {project.tags && project.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
