"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useHydratedStore } from "@/hooks/use-hydrated-store";

interface AddTodoDialogProps {
  children: React.ReactNode;
  projectId?: string;
}

export function AddTodoDialog({ children, projectId }: AddTodoDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    description: "",
    projectId: projectId || "unassigned",
    priority: 3,
    energyLevel: 3,
    dueDate: undefined as Date | undefined,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { projects: projectsData, addTodo, isHydrated } = useHydratedStore();

  const projects = useMemo(() => Object.values(projectsData), [projectsData]);

  if (!isHydrated) {
    return null; // or a loading spinner
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.text.trim()) {
      toast.error("Todo text is required");
      return;
    }

    setIsLoading(true);

    try {
      const todo = {
        id: `todo-${Date.now()}`,
        text: formData.text,
        description: formData.description,
        projectId:
          formData.projectId === "unassigned" ? "" : formData.projectId,
        priority: formData.priority,
        energyLevel: formData.energyLevel,
        dueDate: formData.dueDate?.toISOString(),
        completed: false,
        todayTag: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dependencies: [],
      };

      addTodo(todo);

      // Reset form
      setFormData({
        text: "",
        description: "",
        projectId: projectId || "unassigned",
        priority: 3,
        energyLevel: 3,
        dueDate: undefined,
      });

      setOpen(false);
      toast.success("Todo created successfully!");
    } catch (error) {
      toast.error("Failed to create todo");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityLabel = (priority: number) => {
    if (priority <= 2) return "🟢 Low";
    if (priority <= 4) return "🟡 Medium";
    return "🔴 High";
  };

  const getEnergyLabel = (energy: number) => {
    if (energy <= 2) return "💤 Low Energy";
    if (energy <= 4) return "⚡ Medium Energy";
    return "🔥 High Energy";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Todo</DialogTitle>
          <DialogDescription>
            Add a new task with priority and energy level matching.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Text */}
          <div className="space-y-2">
            <Label htmlFor="text">Task Description *</Label>
            <Input
              id="text"
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              placeholder="What needs to be done?"
              required
            />
          </div>

          {/* Additional Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Additional Details</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Any additional context or notes"
              rows={2}
            />
          </div>

          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="projectId">Project (Optional)</Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) =>
                setFormData({ ...formData, projectId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project or leave unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">📝 Unassigned</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.category === "work" && "💼"}
                    {project.category === "client" && "💰"}
                    {project.category === "personal" && "🧑‍🎨"} {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="priority">Priority</Label>
              <span className="text-sm font-medium">
                {getPriorityLabel(formData.priority)}
              </span>
            </div>
            <Slider
              id="priority"
              min={1}
              max={5}
              step={1}
              value={[formData.priority]}
              onValueChange={(value) =>
                setFormData({ ...formData, priority: value[0] })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>

          {/* Energy Level Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="energyLevel">Energy Level Required</Label>
              <span className="text-sm font-medium">
                {getEnergyLabel(formData.energyLevel)}
              </span>
            </div>
            <Slider
              id="energyLevel"
              min={1}
              max={5}
              step={1}
              value={[formData.energyLevel]}
              onValueChange={(value) =>
                setFormData({ ...formData, energyLevel: value[0] })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low Energy</span>
              <span>Medium</span>
              <span>High Energy</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Set the energy level to help match tasks with your current state
            </p>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate
                    ? format(formData.dueDate, "PPP")
                    : "Pick a due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) =>
                    setFormData({ ...formData, dueDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Creating..." : "Create Todo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
