import React from "react";
import { TodoList } from "./todo-list";
import { TodoCard } from "./todo-card";
import { TodosDataTable } from "./todos-data-table";
import { QuickAddTodoForm } from "./quick-add-todo-form";
import { BulkActionBar } from "./bulk-action-bar";
import { CustomPagination } from "./custom-pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { useHydratedStore } from "@/hooks/use-hydrated-store";

export {
  TodoList,
  TodoCard,
  TodosDataTable,
  QuickAddTodoForm,
  BulkActionBar,
  CustomPagination,
};

export function TodoDependenciesDialog({
  dependencies,
  trigger,
}: {
  dependencies: string[];
  trigger: React.ReactNode;
}) {
  const { todos: allTodos } = useHydratedStore();
  if (!dependencies || dependencies.length === 0) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Task Dependencies</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {dependencies.map((depId) => {
            const dep = allTodos[depId];
            if (!dep) {
              return (
                <div
                  key={depId}
                  className="flex items-center gap-2 text-destructive text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Missing or deleted task ({depId})
                </div>
              );
            }
            return (
              <div key={depId} className="flex items-center gap-2 text-sm">
                {dep.completed ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-destructive" />
                )}
                <span
                  className={
                    dep.completed ? "line-through text-muted-foreground" : ""
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
  );
}
