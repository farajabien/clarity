"use client";
import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge } from "../today/priority-badge";
import { TaskActions } from "./task-actions";
import { useHydratedStore } from "@/hooks/use-hydrated-store";
import { 
  Calendar, 
  Search, 
  Edit, 
  Trash2, 
  Link,
  Target,
  FolderOpen
} from "lucide-react";
import { format, isBefore } from "date-fns";
import type { Todo } from "@/lib/types";

const tabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "overdue", label: "Overdue" },
];

const statusFilters = [
  { key: "all", label: "All Status" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
];

const priorityFilters = [
  { key: "all", label: "All Priority" },
  { key: "urgent", label: "Urgent" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

interface TaskDetailsDialogProps {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function TaskDetailsDialog({ taskId, open, onOpenChange }: TaskDetailsDialogProps) {
  const { todos, projects, resources, isHydrated } = useHydratedStore();
  
  if (!isHydrated || !todos[taskId]) return null;
  
  const task = todos[taskId];
  const project = task.projectId !== "unassigned" ? projects[task.projectId] : null;
  
  // Get project resources
  const projectResources = project ? Object.values(resources).filter(r => r.projectId === project.id) : [];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Task Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Task Info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Task Information</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Title:</span>
                  <span className="text-sm">{task.text}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={task.completed ? "default" : "secondary"}>
                    {task.completed ? "Completed" : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Priority:</span>
                  <PriorityBadge 
                    priority={task.priority >= 5 ? "urgent" : task.priority >= 4 ? "high" : task.priority >= 3 ? "medium" : "low"} 
                  />
                </div>
                {task.dueDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Due Date:</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span className="text-sm">
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project Resources */}
          {project && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FolderOpen className="w-4 h-4" />
                  Project: {project.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Category:</span>
                  <Badge variant="outline">{project.category}</Badge>
                </div>
                {project.description && (
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium">Description:</span>
                    <span className="text-sm text-right max-w-md">{project.description}</span>
                  </div>
                )}
                {projectResources.length > 0 && (
                  <div>
                    <span className="text-sm font-medium mb-2 block">Project Resources:</span>
                    <div className="space-y-1">
                      {projectResources.map((resource) => (
                        <div key={resource.id} className="flex items-center gap-2 text-sm">
                          <Link className="w-3 h-3" />
                          <a 
                            href={resource.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {resource.title}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Task Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4" />
                Task Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit Task
                </Button>
                <Button size="sm" variant={task.completed ? "secondary" : "default"}>
                  {task.completed ? "Mark Pending" : "Mark Complete"}
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TodosDataTable() {
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  
  // Get data from store
  const { todos, projects, isHydrated, toggleTodo } = useHydratedStore();
  
  // Get all todos - memoize even before hydration
  const allTodos = useMemo(() => {
    if (!isHydrated) return [];
    return Object.values(todos) as Todo[];
  }, [todos, isHydrated]);

  // Filter todos by tab - memoize even before hydration
  const tabFilteredTodos = useMemo(() => {
    if (!isHydrated) return [];
    const today = new Date();
    
    switch (tab) {
      case "pending":
        return allTodos.filter(todo => !todo.completed);
      case "completed":
        return allTodos.filter(todo => todo.completed);
      case "overdue":
        return allTodos.filter(todo => 
          !todo.completed && 
          todo.dueDate && 
          isBefore(new Date(todo.dueDate), today)
        );
      default:
        return allTodos;
    }
  }, [allTodos, tab, isHydrated]);

  // Apply additional filters - memoize even before hydration
  const filteredTodos = useMemo(() => {
    if (!isHydrated) return [];
    return tabFilteredTodos.filter(todo => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        todo.text.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "completed" && todo.completed) ||
        (statusFilter === "pending" && !todo.completed);

      // Priority filter
      const matchesPriority = priorityFilter === "all" || 
        (priorityFilter === "urgent" && todo.priority >= 5) ||
        (priorityFilter === "high" && todo.priority === 4) ||
        (priorityFilter === "medium" && todo.priority === 3) ||
        (priorityFilter === "low" && todo.priority <= 2);

      // Project filter
      const matchesProject = projectFilter === "all" || 
        (projectFilter === "unassigned" && todo.projectId === "unassigned") ||
        todo.projectId === projectFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesProject;
    });
  }, [tabFilteredTodos, searchTerm, statusFilter, priorityFilter, projectFilter, isHydrated]);

  // Get unique projects for filter - memoize even before hydration
  const projectOptions = useMemo(() => {
    if (!isHydrated) return [];
    const projectIds = [...new Set(allTodos.map(todo => todo.projectId))];
    return projectIds
      .filter(id => id && id.trim() !== "") // Filter out empty or invalid IDs
      .map(id => {
        if (id === "unassigned") {
          return { id: "unassigned", title: "Unassigned" };
        }
        return projects[id] || { id, title: "Unknown Project" };
      });
  }, [allTodos, projects, isHydrated]);
  
  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading todos...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleTodo = (todoId: string) => {
    toggleTodo(todoId);
  };

  const handleRowClick = (todoId: string) => {
    setSelectedTask(todoId);
  };

  const getPriorityLevel = (priority: number): "low" | "medium" | "high" | "urgent" => {
    if (priority >= 5) return "urgent";
    if (priority >= 4) return "high";
    if (priority >= 3) return "medium";
    return "low";
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">All Tasks</h2>
          <p className="text-sm text-muted-foreground">
            {filteredTodos.length} of {allTodos.length} tasks
          </p>
        </div>
      </div>

      {/* Filters */}
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
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusFilters.map((status) => (
              <SelectItem key={status.key} value={status.key}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityFilters.map((priority) => (
              <SelectItem key={priority.key} value={priority.key}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          {tabs.map((t) => {
            let count = 0;
            const today = new Date();
            
            switch (t.key) {
              case "all":
                count = allTodos.length;
                break;
              case "pending":
                count = allTodos.filter(todo => !todo.completed).length;
                break;
              case "completed":
                count = allTodos.filter(todo => todo.completed).length;
                break;
              case "overdue":
                count = allTodos.filter(todo => 
                  !todo.completed && 
                  todo.dueDate && 
                  isBefore(new Date(todo.dueDate), today)
                ).length;
                break;
            }
            
            return (
              <TabsTrigger key={t.key} value={t.key}>
                {t.label} {count > 0 && <Badge variant="secondary" className="ml-1">{count}</Badge>}
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {tabs.map((t) => (
          <TabsContent key={t.key} value={t.key} className="w-full">
            {filteredTodos.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Done</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTodos.map((todo) => {
                    const project = projects[todo.projectId] || { title: "Unassigned", category: "personal" };
                    const isOverdue = todo.dueDate && isBefore(new Date(todo.dueDate), new Date());
                    
                    return (
                      <TableRow 
                        key={todo.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(todo.id)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => handleToggleTodo(todo.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className={todo.completed ? "line-through text-muted-foreground" : ""}>
                            {todo.text}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {project.title}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <PriorityBadge priority={getPriorityLevel(todo.priority)} />
                        </TableCell>
                        <TableCell>
                          {todo.dueDate ? (
                            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : ''}`}>
                              <Calendar className="w-3 h-3" />
                              <span className="text-sm">
                                {format(new Date(todo.dueDate), 'MMM d')}
                              </span>
                              {isOverdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">No due date</span>
                          )}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <TaskActions todo={todo} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No tasks found matching your criteria.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Task Details Dialog */}
      {selectedTask && (
        <TaskDetailsDialog
          taskId={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
        />
      )}
    </div>
  );
}
