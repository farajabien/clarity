"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useAppStore } from "@/hooks/use-app-store";
import { toast } from "sonner";
import type { Project } from "@/lib/types";

// Form data interface - only the fields we need to collect
interface ProjectFormData {
  title: string;
  description: string;
  status: Project["status"];
  priority: Project["priority"];
  progress: number;
  dueDate: string;
  tags: string[];
  budget?: number;
  timeSpent: number;
  estimatedTime: number;
}

interface QuickAddProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: "work" | "client" | "personal";
}

export function QuickAddProjectForm({
  open,
  onOpenChange,
  category,
}: QuickAddProjectFormProps) {
  const router = useRouter();
  const { addProject, addTodo } = useAppStore((state) => ({
    addProject: state.addProject,
    addTodo: state.addTodo,
  }));

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    status: "planning",
    priority: "medium",
    progress: 0,
    dueDate: "",
    tags: [],
    budget: category === "client" ? 0 : undefined,
    timeSpent: 0,
    estimatedTime: 40,
  });

  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      // Convert form data to the format expected by addProject
      const projectData = {
        title: formData.title.trim(),
        desc: formData.description.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        category: category,
        progress: formData.progress,
        dueDate: formData.dueDate
          ? new Date(formData.dueDate).toISOString()
          : undefined,
        tags: formData.tags,
        budget: formData.budget,
        timeSpent: formData.timeSpent,
        estimatedTime: formData.estimatedTime,
      };

      const projectId = addProject(projectData);

      // Add default "Components List" todo
      addTodo({
        projectId: projectId,
        text: "Components List - Create a comprehensive list of all components needed for this project",
        priority: 3, // Medium priority
        energyLevel: 2, // Low energy required for planning
        completed: false,
        todayTag: false,
        dependencies: [],
      });

      toast.success(`${getCategoryTitle()} created successfully!`);

      // Reset form
      setFormData({
        title: "",
        description: "",
        status: "planning",
        priority: "medium",
        progress: 0,
        dueDate: "",
        tags: [],
        budget: category === "client" ? 0 : undefined,
        timeSpent: 0,
        estimatedTime: 40,
      });
      setTagInput("");
      onOpenChange(false);

      // Redirect to project details page
      router.push(`/project/${projectId}`);
    } catch (error) {
      toast.error("Failed to create project");
      console.error("Error creating project:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const getCategoryTitle = () => {
    switch (category) {
      case "work":
        return "Work Project";
      case "client":
        return "Client Project";
      case "personal":
        return "Personal Project";
      default:
        return "Project";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New {getCategoryTitle()}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter project title..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your project..."
                rows={3}
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Project["status"]) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Project["priority"]) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time (hours)</Label>
              <Input
                id="estimatedTime"
                type="number"
                min="1"
                value={formData.estimatedTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedTime: parseInt(e.target.value) || 40,
                  })
                }
              />
            </div>
          </div>

          {/* Budget (Client projects only) */}
          {category === "client" && (
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="100"
                value={formData.budget || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Enter project budget..."
              />
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add tags..."
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim()}
              className="flex-1"
            >
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
