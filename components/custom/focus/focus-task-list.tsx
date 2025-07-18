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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PriorityBadge } from "../today/priority-badge";
import { TaskActions } from "../todos/task-actions";
import { useHydratedStore } from "@/hooks/use-hydrated-store";
import { 
  Calendar, 
  Search,
  Target,
  Play
} from "lucide-react";
import { format, isToday, isBefore } from "date-fns";

const tabs = [
  { key: "all", label: "All Tasks" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "high-priority", label: "High Priority" },
];

export function FocusTaskList() {
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  
  // Get data from store
  const { todos, projects, isHydrated, toggleTodo } = useHydratedStore();
  
  // Get all todos - memoize even before hydration
  const allTodos = useMemo(() => {
    if (!isHydrated) return [];
    return Object.values(todos);
  }, [todos, isHydrated]);

  // Filter todos by tab and search - memoize even before hydration
  const filteredTodos = useMemo(() => {
    if (!isHydrated) return [];
    
    let filtered = allTodos;
    
    // Filter by tab
    switch (tab) {
      case "pending":
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case "completed":
        filtered = filtered.filter(todo => todo.completed);
        break;
      case "high-priority":
        filtered = filtered.filter(todo => !todo.completed && todo.priority >= 4);
        break;
      default:
        // "all" shows everything
        break;
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(todo => 
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [allTodos, tab, searchTerm, isHydrated]);
  
  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleTodo = (todoId: string) => {
    toggleTodo(todoId);
  };

  const handleSelectTask = (todoId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks(prev => [...prev, todoId]);
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pendingTasks = filteredTodos.filter(todo => !todo.completed).map(todo => todo.id);
      setSelectedTasks(pendingTasks);
    } else {
      setSelectedTasks([]);
    }
  };

  const handleStartSession = () => {
    if (selectedTasks.length === 0) return;
    // This will be handled by parent or redirect to session page
    const searchParams = new URLSearchParams();
    selectedTasks.forEach(taskId => searchParams.append('task', taskId));
    window.location.href = `/focus/session?${searchParams.toString()}`;
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
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-5 h-5" />
            Focus Tasks
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredTodos.length} of {allTodos.length} tasks
          </p>
        </div>
        {selectedTasks.length > 0 && (
          <Button onClick={handleStartSession} className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Start Session ({selectedTasks.length} task{selectedTasks.length === 1 ? '' : 's'})
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          {tabs.map((t) => {
            let count = 0;
            
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
              case "high-priority":
                count = allTodos.filter(todo => !todo.completed && todo.priority >= 4).length;
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
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedTasks.length === filteredTodos.filter(todo => !todo.completed).length && filteredTodos.filter(todo => !todo.completed).length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-12">Done</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTodos.map((todo) => {
                    const project = projects[todo.projectId] || { title: "Unassigned", category: "personal" };
                    const isOverdue = todo.dueDate && isBefore(new Date(todo.dueDate), new Date());
                    const isDueToday = todo.dueDate && isToday(new Date(todo.dueDate));
                    
                    return (
                      <TableRow key={todo.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedTasks.includes(todo.id)}
                            onCheckedChange={(checked) => handleSelectTask(todo.id, checked as boolean)}
                            disabled={todo.completed}
                          />
                        </TableCell>
                        <TableCell>
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
                            <div className={`flex items-center gap-1 ${
                              isOverdue ? 'text-red-600' : isDueToday ? 'text-orange-600' : ''
                            }`}>
                              <Calendar className="w-3 h-3" />
                              <span className="text-sm">
                                {format(new Date(todo.dueDate), 'MMM d')}
                              </span>
                              {isOverdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
                              {isDueToday && !isOverdue && <Badge variant="outline" className="text-xs">Today</Badge>}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">No due date</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <TaskActions todo={todo} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm ? `No tasks found matching "${searchTerm}"` : "No tasks in this category."}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
