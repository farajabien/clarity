
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  Target,
  Users,
  CheckSquare,
  Square
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

const priorityColors = {
  low: "priority-low",
  medium: "priority-medium", 
  high: "priority-high",
};

const statusColors = {
  planning: "status-planning",
  "in-progress": "status-in-progress",
  review: "status-review", 
  completed: "status-completed",
  "on-hold": "status-on-hold",
};

// Mock data for server component - in real app, fetch from database
const mockProjects = {
  "1": {
    id: "1",
    title: "Website Redesign",
    description: "Complete redesign of the company website with modern UI/UX principles. This project involves creating a responsive, accessible, and user-friendly interface that aligns with our brand guidelines and improves conversion rates.",
    category: "work",
    status: "in-progress" as const,
    priority: "high" as const,
    dueDate: "2025-08-15T00:00:00.000Z",
    budget: 15000,
    estimatedTime: 120,
    timeSpent: 45,
    tags: ["design", "development", "frontend", "responsive", "accessibility"],
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
    deployLink: "https://staging.company.com",
    archived: false,
    progress: 35
  },
  "2": {
    id: "2",
    title: "Mobile App Development",
    description: "Native iOS and Android app for customer engagement and service delivery. Features include user authentication, real-time notifications, and offline functionality.",
    category: "client",
    status: "planning" as const,
    priority: "medium" as const,
    dueDate: "2025-12-01T00:00:00.000Z",
    budget: 50000,
    estimatedTime: 300,
    timeSpent: 15,
    tags: ["mobile", "iOS", "Android", "React Native", "API"],
    createdAt: "2025-01-10T00:00:00.000Z",
    updatedAt: "2025-01-18T00:00:00.000Z",
    deployLink: null,
    archived: false,
    progress: 5
  },
  "3": {
    id: "3",
    title: "Personal Blog",
    description: "A personal blog built with Next.js and MDX for writing about technology, productivity, and life experiences.",
    category: "personal",
    status: "completed" as const,
    priority: "low" as const,
    dueDate: "2024-12-31T00:00:00.000Z",
    budget: 0,
    estimatedTime: 40,
    timeSpent: 42,
    tags: ["blog", "Next.js", "MDX", "personal", "writing"],
    createdAt: "2024-11-01T00:00:00.000Z",
    updatedAt: "2024-12-30T00:00:00.000Z",
    deployLink: "https://myblog.dev",
    archived: false,
    progress: 100
  }
};

const mockTodos = {
  // Website Redesign tasks
  "1": { id: "1", text: "Create wireframes for all main pages", priority: 4, completed: true, projectId: "1", dueDate: "2025-01-20T00:00:00.000Z", energyLevel: 3, createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-15T00:00:00.000Z", todayTag: false },
  "2": { id: "2", text: "Design high-fidelity mockups", priority: 4, completed: true, projectId: "1", dueDate: "2025-02-01T00:00:00.000Z", energyLevel: 4, createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-18T00:00:00.000Z", todayTag: false },
  "3": { id: "3", text: "Implement responsive navigation", priority: 3, completed: false, projectId: "1", dueDate: "2025-02-15T00:00:00.000Z", energyLevel: 3, createdAt: "2025-01-05T00:00:00.000Z", updatedAt: "2025-01-18T00:00:00.000Z", todayTag: true },
  "4": { id: "4", text: "Add accessibility features (ARIA labels, keyboard navigation)", priority: 3, completed: false, projectId: "1", dueDate: "2025-03-01T00:00:00.000Z", energyLevel: 4, createdAt: "2025-01-05T00:00:00.000Z", updatedAt: "2025-01-18T00:00:00.000Z", todayTag: false },
  "5": { id: "5", text: "Optimize images and performance", priority: 2, completed: false, projectId: "1", dueDate: "2025-03-15T00:00:00.000Z", energyLevel: 2, createdAt: "2025-01-05T00:00:00.000Z", updatedAt: "2025-01-18T00:00:00.000Z", todayTag: false },
  "6": { id: "6", text: "Set up staging environment", priority: 3, completed: false, projectId: "1", dueDate: "2025-02-28T00:00:00.000Z", energyLevel: 2, createdAt: "2025-01-08T00:00:00.000Z", updatedAt: "2025-01-18T00:00:00.000Z", todayTag: false },
  
  // Mobile App tasks
  "7": { id: "7", text: "Research mobile development frameworks", priority: 4, completed: true, projectId: "2", dueDate: "2025-01-25T00:00:00.000Z", energyLevel: 3, createdAt: "2025-01-10T00:00:00.000Z", updatedAt: "2025-01-18T00:00:00.000Z", todayTag: false },
  "8": { id: "8", text: "Create app architecture documentation", priority: 4, completed: false, projectId: "2", dueDate: "2025-02-10T00:00:00.000Z", energyLevel: 4, createdAt: "2025-01-10T00:00:00.000Z", updatedAt: "2025-01-18T00:00:00.000Z", todayTag: true },
  "9": { id: "9", text: "Design user interface mockups", priority: 3, completed: false, projectId: "2", dueDate: "2025-02-20T00:00:00.000Z", energyLevel: 4, createdAt: "2025-01-12T00:00:00.000Z", updatedAt: "2025-01-18T00:00:00.000Z", todayTag: false },
  
  // Personal Blog tasks (completed project)
  "10": { id: "10", text: "Set up Next.js project structure", priority: 3, completed: true, projectId: "3", dueDate: "2024-11-15T00:00:00.000Z", energyLevel: 2, createdAt: "2024-11-01T00:00:00.000Z", updatedAt: "2024-11-10T00:00:00.000Z", todayTag: false },
  "11": { id: "11", text: "Configure MDX for blog posts", priority: 3, completed: true, projectId: "3", dueDate: "2024-11-30T00:00:00.000Z", energyLevel: 3, createdAt: "2024-11-01T00:00:00.000Z", updatedAt: "2024-11-25T00:00:00.000Z", todayTag: false },
  "12": { id: "12", text: "Deploy to production", priority: 2, completed: true, projectId: "3", dueDate: "2024-12-30T00:00:00.000Z", energyLevel: 2, createdAt: "2024-11-01T00:00:00.000Z", updatedAt: "2024-12-30T00:00:00.000Z", todayTag: false },
};

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = await params;
  
  // In a real app, you'd fetch from database here
  const project = mockProjects[projectId as keyof typeof mockProjects];
  
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
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Link>
        </Button>
      </div>
    );
  }

  // Get project todos (mock data)
  const projectTodos = Object.values(mockTodos).filter(todo => todo.projectId === projectId);
  const completedTodos = projectTodos.filter(todo => todo.completed);
  const progressPercentage = projectTodos.length > 0 ? (completedTodos.length / projectTodos.length) * 100 : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <Badge className={statusColors[project.status] || statusColors.planning}>
                {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {project.category} • Created {format(new Date(project.createdAt), 'MMM d, yyyy')}
              {project.description && <span> • {project.description}</span>}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {project.deployLink && (
            <Button asChild variant="outline" size="sm">
              <Link href={project.deployLink} target="_blank" rel="noopener noreferrer">
                View Live Site
              </Link>
            </Button>
          )}
          <Button size="sm" disabled>
            Add Task (Requires Client)
          </Button>
          <Button variant="outline" size="sm" disabled>
            Edit Project (Requires Client)
          </Button>
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
                {project.description || 'No description provided.'}
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
                  <Button size="sm" disabled>
                    Add Task (Requires Client)
                  </Button>
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
                      const isToday = todo.todayTag;
                      
                      return (
                        <div 
                          key={todo.id} 
                          className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                            todo.completed ? 'bg-muted/50' : ''
                          } ${isOverdue ? 'border-destructive/50 bg-destructive/5' : ''} ${
                            isToday ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20' : ''
                          }`}
                        >
                          <div className="w-4 h-4 mt-0.5 border rounded-sm flex items-center justify-center">
                            {todo.completed && <CheckSquare className="h-3 w-3 text-green-600" />}
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {todo.text}
                            </p>
                            
                            {todo.dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span className={`text-xs ${
                                  isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'
                                }`}>
                                  Due: {format(new Date(todo.dueDate), 'MMM d, yyyy')}
                                  {isOverdue && ' (Overdue)'}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              {isToday && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  Today
                                </Badge>
                              )}
                              {todo.energyLevel && (
                                <span className="text-xs text-muted-foreground">
                                  Energy: {todo.energyLevel}/5
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={todo.priority >= 4 ? "destructive" : todo.priority >= 3 ? "default" : "secondary"}
                              className="text-xs"
                            >
                              P{todo.priority}
                            </Badge>
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
                  <Button variant="outline" disabled>
                    Add First Task (Requires Client Component)
                  </Button>
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

              {project.timeSpent && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    Time Spent
                  </span>
                  <span className="font-medium text-blue-600">{project.timeSpent}h</span>
                </div>
              )}

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">Category</p>
                <Badge variant="outline" className="capitalize">
                  {project.category}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(project.updatedAt), 'MMM d, yyyy')}
                </p>
              </div>

              {project.deployLink && (
                <div>
                  <p className="text-sm font-medium mb-2">Deployment</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={project.deployLink} target="_blank" rel="noopener noreferrer">
                      View Live Site
                    </Link>
                  </Button>
                </div>
              )}

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

          {/* Project Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tasks Completed</span>
                  <span className="font-medium">{completedTodos.length}/{projectTodos.length}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {project.timeSpent && project.estimatedTime && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Time Progress</span>
                    <span className="font-medium">
                      {Math.round((project.timeSpent / project.estimatedTime) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(project.timeSpent / project.estimatedTime) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {project.timeSpent}h of {project.estimatedTime}h estimated
                  </p>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>High Priority Tasks</span>
                  <span className="font-medium text-red-600">
                    {projectTodos.filter(t => t.priority >= 4 && !t.completed).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Overdue Tasks</span>
                  <span className="font-medium text-orange-600">
                    {projectTodos.filter(t => 
                      t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Today&apos;s Tasks</span>
                  <span className="font-medium text-blue-600">
                    {projectTodos.filter(t => t.todayTag && !t.completed).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
