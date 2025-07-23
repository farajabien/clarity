"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Project } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Plus } from "lucide-react";
import { ProjectCard } from "./project-card";
import { AddProjectDialog } from "@/components/layout/add-project-dialog";
import { useHydratedStore } from "@/hooks/use-hydrated-store";

interface ProjectGridProps {
  category: "work" | "client" | "personal";
}

export function ProjectGrid({ category }: ProjectGridProps) {
  const { projects, isHydrated } = useHydratedStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  
  const projectsByCategory = useMemo(() => 
    Object.values(projects).filter((project: Project) =>
      project.category === category && !project.archived
    ),
    [projects, category]
  );

  const filteredProjects = useMemo(() => 
    projectsByCategory.filter((project: Project) => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    }),
    [projectsByCategory, searchTerm, statusFilter, priorityFilter]
  );
  
  // Don't render until hydrated
  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const getCategoryIcon = () => {
    switch (category) {
      case "work": return "💼";
      case "client": return "💰";
      case "personal": return "🧑‍🎨";
      default: return "📁";
    }
  };

  const getCategoryTitle = () => {
    switch (category) {
      case "work": return "Work Projects";
      case "client": return "Client Projects";
      case "personal": return "Personal Projects";
      default: return "Projects";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getCategoryIcon()} {getCategoryTitle()}
          </h1>
          <p className="text-muted-foreground">
            Manage your {category} projects and track progress.
          </p>
        </div>
        <AddProjectDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </AddProjectDialog>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
        
        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No projects found matching your criteria.</p>
            <AddProjectDialog>
              <Button 
                variant="outline" 
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Project
              </Button>
            </AddProjectDialog>
          </div>
        )}
      </div>
    </div>
  );
}
