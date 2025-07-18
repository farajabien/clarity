"use client";

import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { CustomPagination } from "./custom-pagination";
import { BulkActionBar } from "./bulk-action-bar";
import { TodoCard } from "./todo-card";
import { useHydratedStore } from "@/hooks/use-hydrated-store";

export function TodoList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get data from store
  const { todos, projects, updateTodo, deleteTodo, isHydrated } = useHydratedStore();

  // Convert store todos to array and add project info
  const todosList = useMemo(() => {
    if (!isHydrated) return [];
    return Object.values(todos).map(todo => ({
      ...todo,
      title: todo.text, // Map text to title for component compatibility
      priority: todo.priority <= 2 ? "low" as const : 
                todo.priority <= 3 ? "medium" as const : 
                "high" as const,
      projectTitle: todo.projectId && projects[todo.projectId] 
        ? projects[todo.projectId].title 
        : undefined,
      tags: [] // Default empty tags since not in store Todo type
    }));
  }, [todos, projects, isHydrated]);

  // Filter todos
  const filteredTodos = useMemo(() => {
    if (!isHydrated) return [];
    return todosList.filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = priorityFilter === "all" || todo.priority === priorityFilter;
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "completed" && todo.completed) ||
                           (statusFilter === "pending" && !todo.completed);
      
      const matchesProject = projectFilter === "all" || 
                            (projectFilter === "unassigned" && !todo.projectId) ||
                            todo.projectId === projectFilter;
      
      return matchesSearch && matchesPriority && matchesStatus && matchesProject;
    });
  }, [todosList, searchTerm, priorityFilter, statusFilter, projectFilter, isHydrated]);

  // Get unique projects for filter
  const projectOptions = useMemo(() => {
    if (!isHydrated) return [];
    return Object.values(projects).map(project => ({
      id: project.id,
      title: project.title
    }));
  }, [projects, isHydrated]);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  // Pagination
  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const paginatedTodos = filteredTodos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTodoToggle = (todoId: string) => {
    const todo = todos[todoId];
    if (todo) {
      updateTodo(todoId, { completed: !todo.completed });
    }
  };

  const handleTodoDelete = (todoId: string) => {
    deleteTodo(todoId);
    setSelectedTodos(prev => prev.filter(id => id !== todoId));
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case "complete":
        selectedTodos.forEach(todoId => {
          updateTodo(todoId, { completed: true });
        });
        break;
      case "delete":
        selectedTodos.forEach(todoId => {
          deleteTodo(todoId);
        });
        break;
      case "incomplete":
        selectedTodos.forEach(todoId => {
          updateTodo(todoId, { completed: false });
        });
        break;
    }
    setSelectedTodos([]);
  };

  const handleSelectTodo = (todoId: string, selected: boolean) => {
    if (selected) {
      setSelectedTodos(prev => [...prev, todoId]);
    } else {
      setSelectedTodos(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedTodos(paginatedTodos.map(todo => todo.id));
    } else {
      setSelectedTodos([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search todos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[120px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {projectOptions.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedTodos.length > 0 && (
        <BulkActionBar
          selectedCount={selectedTodos.length}
          onAction={handleBulkAction}
        />
      )}
      
      {/* Todo List */}
      <Card className="p-4">
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {paginatedTodos.length > 0 ? (
              paginatedTodos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  isSelected={selectedTodos.includes(todo.id)}
                  onToggle={() => handleTodoToggle(todo.id)}
                  onSelect={(selected: boolean) => handleSelectTodo(todo.id, selected)}
                  onDelete={() => handleTodoDelete(todo.id)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No todos found matching your criteria.
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
        
        {/* Select All */}
        {paginatedTodos.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
            <div>
              Showing {paginatedTodos.length} of {filteredTodos.length} todos
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectAll(selectedTodos.length === 0)}
            >
              {selectedTodos.length === 0 ? "Select All" : "Deselect All"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}