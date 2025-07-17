"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { CustomPagination } from "./custom-pagination";
import { BulkActionBar } from "./bulk-action-bar";
import { TodoCard } from "./todo-card";

// Mock data type
interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  tags: string[];
}

// Mock data
const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Review pull requests",
    description: "Check and approve pending PRs in the main repository",
    completed: false,
    priority: "high",
    dueDate: "2025-07-18",
    tags: ["work", "development"],
  },
  {
    id: "2",
    title: "Update documentation",
    description: "Add new API endpoints to the documentation",
    completed: false,
    priority: "medium",
    dueDate: "2025-07-20",
    tags: ["documentation"],
  },
  {
    id: "3",
    title: "Setup CI/CD pipeline",
    description: "Configure GitHub Actions for automatic deployment",
    completed: true,
    priority: "high",
    dueDate: "2025-07-15",
    tags: ["devops", "automation"],
  },
];

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(todos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTodos = todos.slice(startIndex, startIndex + itemsPerPage);

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleSelectTodo = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedTodos([...selectedTodos, id]);
    } else {
      setSelectedTodos(selectedTodos.filter(todoId => todoId !== id));
    }
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case "complete":
        setTodos(todos.map(todo => 
          selectedTodos.includes(todo.id) ? { ...todo, completed: true } : todo
        ));
        break;
      case "delete":
        setTodos(todos.filter(todo => !selectedTodos.includes(todo.id)));
        break;
    }
    setSelectedTodos([]);
  };

  return (
    <div className="space-y-4">
      {selectedTodos.length > 0 && (
        <BulkActionBar
          selectedCount={selectedTodos.length}
          onAction={handleBulkAction}
        />
      )}
      
      <Card className="p-4">
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {paginatedTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                isSelected={selectedTodos.includes(todo.id)}
                onToggle={() => handleToggleTodo(todo.id)}
                onSelect={(selected: boolean) => handleSelectTodo(todo.id, selected)}
              />
            ))}
          </div>
        </ScrollArea>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
      