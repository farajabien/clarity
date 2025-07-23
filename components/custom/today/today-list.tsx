"use client";
import { useState, useMemo } from "react";
import { Todo } from "@/lib/types";
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
import { PriorityBadge } from "./priority-badge";
import { TaskActions } from "../todos/task-actions";
import { useHydratedStore } from "@/hooks/use-hydrated-store";
import { Plus, Calendar } from "lucide-react";
import { format, isToday, isBefore } from "date-fns";
import { QuickAddTodoForm } from "../todos";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const tabs = [
  { key: "all", label: "All" },
  { key: "work", label: "Work" },
  { key: "personal", label: "Personal" },
  { key: "client", label: "Client" },
];

export function TodayList() {
  const [tab, setTab] = useState("all");
  
  // Get data from store
  const { todos, projects, toggleTodo, isHydrated } = useHydratedStore();
  
  // Get today's todos and categorize them - must be called before any conditional returns
  const todayTodos = useMemo(() => {
    if (!isHydrated) return [];
    
    const today = new Date();
    return Object.values(todos).filter((todo: Todo) => {
      // Include todos due today, overdue, or high priority ones without due dates
      if (todo.completed) return false;
      
      if (todo.dueDate) {
        const dueDate = new Date(todo.dueDate);
        return isToday(dueDate) || isBefore(dueDate, today);
      }
      
      // Include high priority todos without due dates
      return todo.priority >= 4;
    });
  }, [todos, isHydrated]);

  // Filter todos by category based on their project's category
  const filteredTodos = useMemo(() => {
    if (!isHydrated) return [];
    if (tab === "all") return todayTodos;
    
    return todayTodos.filter(todo => {
      if (todo.projectId === "unassigned") return tab === "personal";
      const project = projects[todo.projectId];
      return project?.category === tab;
    });
  }, [todayTodos, tab, projects, isHydrated]);

  const handleToggleTodo = (todoId: string) => {
    toggleTodo(todoId);
  };

  const getPriorityLevel = (priority: number): "low" | "medium" | "high" | "urgent" => {
    if (priority >= 5) return "urgent";
    if (priority >= 4) return "high";
    if (priority >= 3) return "medium";
    return "low";
  };
  
  // Now safe to have conditional return after all hooks
  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Today&apos;s Focus</h2>
          <p className="text-sm text-muted-foreground">
            {filteredTodos.length} tasks to focus on today
          </p>
        </div>

      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          {tabs.map((t) => {
            const count = t.key === "all" ? todayTodos.length : 
              todayTodos.filter(todo => {
                if (todo.projectId === "unassigned") return t.key === "personal";
                const project = projects[todo.projectId];
                return project?.category === t.key;
              }).length;
            
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTodos.map((todo) => {
                    const project = projects[todo.projectId] || { title: "Unassigned", category: "personal" };
                    const isOverdue = todo.dueDate && isBefore(new Date(todo.dueDate), new Date());
                    
                    return (
                      <TableRow key={todo.id}>
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
                <p className="text-muted-foreground">No tasks for today in this category.</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="mt-2" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Add a New Task</DialogTitle>
                  <QuickAddTodoForm
                    onSubmit={() => {
                      toast.success("Todo added successfully!");
                    }}
                  />
                </DialogContent>
              </Dialog>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

