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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Calendar, 
  Clock, 
  DollarSign,
  Play,
  Pause,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

const statusColors = {
  planning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  review: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "on-hold": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export function ProjectCard({ project, onUpdate }: ProjectCardProps) {
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

  const handleStatusChange = (newStatus: Project["status"]) => {
    let newProgress = project?.progress;
  
    // Auto-adjust progress based on status
    switch (newStatus) {
      case "planning":
        newProgress = Math.min(project.progress, 25);
        break;
      case "in-progress":
        newProgress = Math.max(project.progress, 25);
        break;
      case "review":
        newProgress = Math.max(project.progress, 75);
        break;
      case "completed":
        newProgress = 100;
        break;
    }
    
    onUpdate({ status: newStatus, progress: newProgress });
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
              <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                <Play className="w-4 h-4 mr-2" />
                Start Working
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("on-hold")}>
                <Pause className="w-4 h-4 mr-2" />
                Put On Hold
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </DropdownMenuItem>
              <DropdownMenuItem>Edit Project</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
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
            <span>Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
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
            onClick={() => console.log("View details:", project.id)}
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
