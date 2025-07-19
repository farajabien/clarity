"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useHydratedStore } from "@/hooks/use-hydrated-store";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

interface QuickAddTodoFormProps {
  onSubmit?: (todo: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    dueDate: string;
    tags: string[];
  }) => void;
}

export function QuickAddTodoForm({ onSubmit }: QuickAddTodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [energyLevel, setEnergyLevel] = useState(3);
  const [projectId, setProjectId] = useState<string>("unassigned");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [dependenciesPopoverOpen, setDependenciesPopoverOpen] = useState(false);

  // Get projects from store
  const { projects, addTodo, todos, isHydrated } = useHydratedStore();

  const projectsList = useMemo(() => Object.values(projects), [projects]);
  const todosList = useMemo(() => Object.values(todos || {}), [todos]);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleDependencyToggle = (todoId: string) => {
    setDependencies((prev) =>
      prev.includes(todoId)
        ? prev.filter((id) => id !== todoId)
        : [...prev, todoId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Todo title is required");
      return;
    }
    // Prevent circular dependencies (not possible on creation, but guard for future)
    if (dependencies.includes(`todo-${Date.now()}`)) {
      toast.error("A todo cannot depend on itself.");
      return;
    }

    try {
      // Create todo using store
      const todo = {
        id: `todo-${Date.now()}`,
        text: title.trim(),
        description: description.trim(),
        projectId: projectId === "unassigned" ? "" : projectId,
        priority: priority === "low" ? 2 : priority === "medium" ? 3 : 4,
        energyLevel: energyLevel,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: "current-user",
        tags: tags,
        todayTag: false,
        dependencies: dependencies, // <-- NEW FIELD
      };

      addTodo(todo);

      // Call the optional callback
      if (onSubmit) {
        onSubmit({
          title: title.trim(),
          description: description.trim(),
          priority,
          dueDate,
          tags,
        });
      }

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setEnergyLevel(3);
      setProjectId("unassigned");
      setDueDate("");
      setTags([]);
      setTagInput("");
      setDependencies([]);
      setDependenciesPopoverOpen(false);

      toast.success("Todo created successfully!");
    } catch (error) {
      console.error("Failed to create todo:", error);
      toast.error("Failed to create todo");
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Add Todo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setPriority(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="energy">Energy Level</Label>
              <Select
                value={energyLevel.toString()}
                onValueChange={(value) => setEnergyLevel(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">💤 Very Low</SelectItem>
                  <SelectItem value="2">😴 Low</SelectItem>
                  <SelectItem value="3">⚡ Medium</SelectItem>
                  <SelectItem value="4">🔥 High</SelectItem>
                  <SelectItem value="5">🚀 Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">No Project</SelectItem>
                  {projectsList.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

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
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
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

          <div className="space-y-2">
            <Label>Dependencies</Label>
            <Popover
              open={dependenciesPopoverOpen}
              onOpenChange={setDependenciesPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                >
                  {dependencies.length === 0
                    ? "Select dependencies (optional)"
                    : `${dependencies.length} dependenc${
                        dependencies.length === 1 ? "y" : "ies"
                      } selected`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <Command>
                  <CommandInput placeholder="Search todos..." />
                  <CommandList>
                    {todosList.length === 0 && (
                      <div className="p-2 text-muted-foreground text-sm">
                        No todos available
                      </div>
                    )}
                    {todosList.map((todo) => (
                      <CommandItem
                        key={todo.id}
                        onSelect={() => handleDependencyToggle(todo.id)}
                        className="flex items-center gap-2"
                        disabled={todo.text.trim() === title.trim()}
                      >
                        <Checkbox
                          checked={dependencies.includes(todo.id)}
                          onCheckedChange={() =>
                            handleDependencyToggle(todo.id)
                          }
                          className="mr-2"
                        />
                        <span className="truncate">{todo.text}</span>
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {dependencies.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {dependencies.map((depId) => {
                  const depTodo = todos[depId];
                  return (
                    <Badge key={depId} variant="secondary" className="gap-1">
                      {depTodo?.text || depId}
                      <button
                        type="button"
                        onClick={() => handleDependencyToggle(depId)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={!title.trim()}>
            Add Todo
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
