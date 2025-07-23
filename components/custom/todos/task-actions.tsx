"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHydratedStore } from "@/hooks/use-hydrated-store";
import { Todo, Project } from "@/lib/types";
import { MoreHorizontal, Edit, Trash, Check, Calendar } from "lucide-react";
import { toast } from "sonner";

interface TaskActionsProps {
  todo: Todo;
  showTodayTag?: boolean;
}

export function TaskActions({ todo, showTodayTag = true }: TaskActionsProps) {
  const { updateTodo, deleteTodo, toggleTodo, toggleTodayTag, projects } = useHydratedStore();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    text: todo.text,
    priority: todo.priority,
    projectId: todo.projectId,
    dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
  });

  const handleEditSubmit = () => {
    updateTodo(todo.id, {
      text: editForm.text,
      priority: editForm.priority,
      projectId: editForm.projectId,
      dueDate: editForm.dueDate ? new Date(editForm.dueDate).toISOString() : undefined,
    });
    setEditDialogOpen(false);
    toast.success("Task updated successfully");
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
    setDeleteDialogOpen(false);
    toast.success("Task deleted");
  };

  const handleToggleComplete = () => {
    toggleTodo(todo.id);
    toast.success(todo.completed ? "Task marked as incomplete" : "Task completed");
  };

  const handleToggleToday = () => {
    toggleTodayTag(todo.id);
    toast.success(todo.todayTag ? "Removed from today's priorities" : "Added to today's priorities");
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Today Tag */}
        {showTodayTag && (
          <Button
            variant={todo.todayTag ? "default" : "outline"}
            size="sm"
            onClick={handleToggleToday}
            className={`text-xs px-2 py-1 h-6 ${
              todo.todayTag 
                ? "bg-orange-500 hover:bg-orange-600 text-white" 
                : "border-orange-200 text-orange-600 hover:bg-orange-50"
            }`}
          >
            <Calendar className="w-3 h-3 mr-1" />
            Today
          </Button>
        )}

        {/* Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleToggleComplete}>
              <Check className="mr-2 h-4 w-4" />
              Mark {todo.completed ? "Incomplete" : "Complete"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="text" className="text-right">
                Task
              </Label>
              <Input
                id="text"
                value={editForm.text}
                onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                value={editForm.priority.toString()}
                onValueChange={(value) => setEditForm({ ...editForm, priority: parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Low (1)</SelectItem>
                  <SelectItem value="2">Low-Medium (2)</SelectItem>
                  <SelectItem value="3">Medium (3)</SelectItem>
                  <SelectItem value="4">High-Medium (4)</SelectItem>
                  <SelectItem value="5">High (5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project" className="text-right">
                Project
              </Label>
              <Select
                value={editForm.projectId}
                onValueChange={(value) => setEditForm({ ...editForm, projectId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {Object.values(projects).map((project: Project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={editForm.dueDate}
                onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditSubmit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
