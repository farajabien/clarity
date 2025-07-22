"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Clock, Target, Play, Plus } from "lucide-react";
import { useHydratedStore } from "@/hooks/use-hydrated-store";
import { format, isToday, isBefore } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Todo } from "@/lib/types";

interface MultiTaskSelectorProps {
  onTasksSelected?: (todoIds: string[]) => void;
  maxTasks?: number;
  selectedTasks?: string[];
}

export function MultiTaskSelector({
  onTasksSelected,
  maxTasks = 5,
  selectedTasks = [],
}: MultiTaskSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [localSelectedTasks, setLocalSelectedTasks] =
    useState<string[]>(selectedTasks);

  // Get data from store
  const { todos, projects, isHydrated } = useHydratedStore();

  // Get available todos (not completed) - memoize even before hydration
  const availableTodos = useMemo(() => {
    if (!isHydrated) return [];
    return Object.values(todos).filter((todo: Todo) => !todo.completed);
  }, [todos, isHydrated]);

  // Filter todos based on search and filters - memoize even before hydration
  const filteredTodos = useMemo(() => {
    if (!isHydrated) return [];
    return availableTodos.filter((todo: Todo) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        todo.text.toLowerCase().includes(searchTerm.toLowerCase());

      // Project filter
      const matchesProject =
        projectFilter === "all" ||
        (projectFilter === "unassigned" && todo.projectId === "unassigned") ||
        todo.projectId === projectFilter;

      // Priority filter
      const matchesPriority =
        priorityFilter === "all" ||
        (priorityFilter === "high" && todo.priority >= 4) ||
        (priorityFilter === "medium" && todo.priority === 3) ||
        (priorityFilter === "low" && todo.priority <= 2);

      return matchesSearch && matchesProject && matchesPriority;
    });
  }, [availableTodos, searchTerm, projectFilter, priorityFilter, isHydrated]);

  // Get unique projects for filter - memoize even before hydration
  const projectOptions = useMemo(() => {
    if (!isHydrated) return [];
    const projectIds = [
      ...new Set(availableTodos.map((todo: Todo) => todo.projectId)),
    ];
    return projectIds
      .filter((id) => id && id.trim() !== "") // Filter out empty or invalid IDs
      .map((id) => {
        if (id === "unassigned") {
          return { id: "unassigned", title: "Unassigned" };
        }
        return projects[id] || { id, title: "Unknown Project" };
      });
  }, [availableTodos, projects, isHydrated]);

  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Select Tasks to Focus On
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading tasks...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleTaskToggle = (todoId: string) => {
    const newSelection = localSelectedTasks.includes(todoId)
      ? localSelectedTasks.filter((id) => id !== todoId)
      : localSelectedTasks.length < maxTasks
      ? [...localSelectedTasks, todoId]
      : localSelectedTasks;

    setLocalSelectedTasks(newSelection);
    onTasksSelected?.(newSelection);
  };

  const handleSelectAll = () => {
    const selectableTasks = filteredTodos
      .slice(0, maxTasks)
      .map((todo) => todo.id);
    setLocalSelectedTasks(selectableTasks);
    onTasksSelected?.(selectableTasks);
  };

  const handleClearAll = () => {
    setLocalSelectedTasks([]);
    onTasksSelected?.([]);
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 5)
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    if (priority >= 4)
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    if (priority >= 3)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 5) return "Urgent";
    if (priority >= 4) return "High";
    if (priority >= 3) return "Medium";
    return "Low";
  };

  // Helper: check if all dependencies are completed
  const areDependenciesComplete = (todo: Todo) => {
    if (!todo.dependencies || todo.dependencies.length === 0) return true;
    return todo.dependencies.every((depId: string) => {
      const dep = todos[depId];
      return dep && dep.completed;
    });
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Select Tasks to Focus On
            </CardTitle>
            <Badge variant="outline">
              {localSelectedTasks.length}/{maxTasks} selected
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Choose up to {maxTasks} tasks for your focus session
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projectOptions.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
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

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={filteredTodos.length === 0}
            >
              Select Top {Math.min(maxTasks, filteredTodos.length)}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={localSelectedTasks.length === 0}
            >
              Clear All
            </Button>
          </div>

          {/* Task List */}
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => {
                  const project = projects[todo.projectId] || {
                    title: "Unassigned",
                    category: "personal",
                  };
                  const isSelected = localSelectedTasks.includes(todo.id);
                  const isOverdue =
                    todo.dueDate &&
                    isBefore(new Date(todo.dueDate), new Date());
                  const isDueToday =
                    todo.dueDate && isToday(new Date(todo.dueDate));
                  const hasDependencies =
                    todo.dependencies && todo.dependencies.length > 0;
                  const incompleteDeps =
                    hasDependencies && !areDependenciesComplete(todo);
                  const depCount = hasDependencies
                    ? todo.dependencies.length
                    : 0;

                  return (
                    <Tooltip key={todo.id}>
                      <TooltipTrigger asChild>
                        <div
                          className={`p-3 border rounded-lg transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-primary/10 border-primary"
                              : incompleteDeps
                              ? "opacity-60 cursor-not-allowed"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => {
                            if (!incompleteDeps) handleTaskToggle(todo.id);
                          }}
                          tabIndex={incompleteDeps ? -1 : 0}
                          aria-disabled={incompleteDeps}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => {}}
                              disabled={
                                (!isSelected &&
                                  localSelectedTasks.length >= maxTasks) ||
                                incompleteDeps
                              }
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm truncate">
                                  {todo.text}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={getPriorityColor(todo.priority)}
                                >
                                  {getPriorityLabel(todo.priority)}
                                </Badge>
                                {hasDependencies && (
                                  <Badge
                                    variant={
                                      incompleteDeps
                                        ? "destructive"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {depCount} dep{depCount > 1 ? "s" : ""}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="secondary" className="text-xs">
                                  {project.title}
                                </Badge>
                                {todo.dueDate && (
                                  <div
                                    className={`flex items-center gap-1 ${
                                      isOverdue
                                        ? "text-red-600"
                                        : isDueToday
                                        ? "text-orange-600"
                                        : ""
                                    }`}
                                  >
                                    <Clock className="w-3 h-3" />
                                    <span>
                                      Due{" "}
                                      {format(new Date(todo.dueDate), "MMM d")}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      {incompleteDeps && (
                        <TooltipContent side="right" className="max-w-xs">
                          <span className="font-semibold text-destructive">
                            Blocked by dependencies:
                          </span>
                          <ul className="list-disc ml-4 mt-1">
                            {todo.dependencies.map((depId: string) => {
                              const dep = todos[depId];
                              return (
                                <li
                                  key={depId}
                                  className={
                                    dep && !dep.completed
                                      ? "text-destructive"
                                      : ""
                                  }
                                >
                                  {dep ? dep.text : depId}{" "}
                                  {dep && !dep.completed ? "(incomplete)" : ""}
                                </li>
                              );
                            })}
                          </ul>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No tasks found matching your criteria.
                  </p>
                  <Button variant="outline" className="mt-2" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Start Focus Button */}
          {localSelectedTasks.length > 0 && (
            <Button className="w-full" size="lg">
              <Play className="w-4 h-4 mr-2" />
              Start Focus Session with {localSelectedTasks.length} Task
              {localSelectedTasks.length > 1 ? "s" : ""}
            </Button>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
