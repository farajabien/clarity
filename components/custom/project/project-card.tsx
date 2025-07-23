"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Calendar, 
  Clock, 
  DollarSign,
  Play,
  Pause,
  CheckCircle,
  ExternalLink,
  Edit,
  Archive,
  Trash2,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Project, Todo } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useHydratedStore } from "@/hooks/use-hydrated-store";
import { toast } from "sonner";

interface ProjectCardProps {
  project: Project;
}

const statusColors: Record<Project['status'], string> = {
  planning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  review: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "on-hold": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

const priorityColors: Record<Project['priority'], string> = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const { todos, updateProject, deleteProject, archiveProject, isHydrated } = useHydratedStore();
  
  // Don't render until hydrated to avoid SSR issues
  if (!isHydrated) {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (hours: number) => {
    return `${hours}h`;
  };

  const getInitials = (title: string) => {
    return title.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const isOverdue = project?.dueDate && new Date(project.dueDate) < new Date();

  // Calculate project progress based on todos
  const projectTodos = Object.values(todos).filter((todo: Todo) => todo.projectId === project.id);
  const completedTodos = projectTodos.filter((todo: Todo) => todo.completed);
  const actualProgress = projectTodos.length > 0 ? Math.round((completedTodos.length / projectTodos.length) * 100) : 0;

  const handleStatusChange = (newStatus: Project["status"]) => {
    let newProgress = actualProgress;
  
    // Auto-adjust progress based on status
    switch (newStatus) {
      case "planning":
        newProgress = Math.min(actualProgress, 25);
        break;
      case "in-progress":
        newProgress = Math.max(actualProgress, 25);
        break;
      case "review":
        newProgress = Math.max(actualProgress, 75);
        break;
      case "completed":
        newProgress = 100;
        break;
    }
    
    updateProject(project.id, { status: newStatus, progress: newProgress });
    toast.success(`Project status updated to ${newStatus.replace('-', ' ')}`);
  };

  const handleViewDetails = () => {
    router.push(`/project/${project.id}`);
  };

  const handleEdit = () => {
    // TODO: Open edit dialog
    toast.info("Edit functionality coming soon");
  };

  const handleArchive = () => {
    archiveProject(project.id);
    toast.success("Project archived");
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      deleteProject(project.id);
      toast.success("Project deleted");
    }
  };

  const handleDeployLinkOpen = () => {
    if (project.deployLink) {
      window.open(project.deployLink, '_blank');
    }
  };

  if (!project) {
    return null; // Handle case where project data is not available
  }

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      project?.status === "completed" && "opacity-80"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(project.title)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{project.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="secondary"
                  className={cn("text-xs", statusColors[project.status])}
                >
                  {project.status.replace("-", " ")}
                </Badge>
                <Badge 
                  variant="outline"
                  className={cn("text-xs", priorityColors[project.priority])}
                >
                  {project.priority}
                </Badge>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewDetails}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleStatusChange("in-progress")}
                disabled={project.status === "completed"}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Working
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusChange("on-hold")}
                disabled={project.status === "completed"}
              >
                <Pause className="w-4 h-4 mr-2" />
                Put On Hold
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusChange("completed")}
                disabled={project.status === "completed"}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              {project.deployLink && (
                <DropdownMenuItem onClick={handleDeployLinkOpen}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Deploy Link
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="w-4 h-4 mr-2" />
                Archive Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress ({projectTodos.length} tasks)</span>
            <span className="font-medium">{actualProgress}%</span>
          </div>
          <Progress value={actualProgress} className="h-2" />
          {projectTodos.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {completedTodos.length} of {projectTodos.length} tasks completed
            </div>
          )}
        </div>
        
        {/* Project Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatTime(project.timeSpent)}/{formatTime(project.estimatedTime)}</span>
          </div>
          
          {project.budget && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>${project.budget.toLocaleString()}</span>
            </div>
          )}
          
          {project.dueDate && (
            <div className={cn(
              "flex items-center gap-2 text-sm",
              isOverdue ? "text-destructive" : "text-muted-foreground"
            )}>
              <Calendar className="w-4 h-4" />
              <span>{formatDate(project.dueDate)}</span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => handleStatusChange("in-progress")}
            disabled={project.status === "completed"}
          >
            {project.status === "in-progress" ? "Continue" : "Start"}
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleViewDetails}
          >
            Details
          </Button>
          {project.deployLink && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleDeployLinkOpen}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
