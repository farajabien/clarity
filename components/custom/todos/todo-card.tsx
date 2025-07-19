"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Calendar, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { useHydratedStore } from "@/hooks/use-hydrated-store";

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  tags: string[];
  dependencies: string[];
}

interface TodoCardProps {
  todo: Todo;
  isSelected: boolean;
  onToggle: () => void;
  onSelect: (selected: boolean) => void;
  onDelete?: () => void;
}

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export function TodoCard({
  todo,
  isSelected,
  onToggle,
  onSelect,
  onDelete,
}: TodoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  // Get all todos for dependency lookup
  const { todos: allTodos } = useHydratedStore();
  const hasDependencies =
    Array.isArray(todo.dependencies) && todo.dependencies.length > 0;
  const dependencies = hasDependencies ? todo.dependencies : [];

  return (
    <Card
      className={cn(
        "transition-colors",
        isSelected && "ring-2 ring-primary",
        todo.completed && "opacity-60"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="mt-1"
          />

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Checkbox checked={todo.completed} onCheckedChange={onToggle} />
                <h3
                  className={cn(
                    "font-medium",
                    todo.completed && "line-through text-muted-foreground"
                  )}
                >
                  {todo.title}
                </h3>
                <Badge
                  variant="secondary"
                  className={cn("text-xs", priorityColors[todo.priority])}
                >
                  <Flag className="w-3 h-3 mr-1" />
                  {todo.priority}
                </Badge>
                {hasDependencies && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-2 py-0 h-6 text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        {dependencies.length} dep
                        {dependencies.length > 1 ? "s" : ""}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Task Dependencies</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        {dependencies.map((depId: string) => {
                          const dep = allTodos[depId];
                          if (!dep)
                            return (
                              <div
                                key={depId}
                                className="flex items-center gap-2 text-destructive text-sm"
                              >
                                <XCircle className="w-4 h-4" />
                                Missing or deleted task ({depId})
                              </div>
                            );
                          return (
                            <div
                              key={depId}
                              className="flex items-center gap-2 text-sm"
                            >
                              {dep.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-destructive" />
                              )}
                              <span
                                className={
                                  dep.completed
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }
                              >
                                {dep.text}
                              </span>
                              {!dep.completed && (
                                <span className="ml-2 text-xs text-destructive">
                                  (incomplete)
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={onDelete}
                    disabled={!onDelete}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {todo.description && (
              <p className="text-sm text-muted-foreground">
                {todo.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {todo.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {todo.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {formatDate(todo.dueDate)}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
