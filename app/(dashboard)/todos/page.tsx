import { TodosDataTable } from "@/components/custom/todos/todos-data-table";
import { QuickAddTodoForm } from "@/components/custom/todos";

export default function TodosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">📝 Todos</h1>
        <p className="text-muted-foreground">
          Manage all your tasks and track your progress across projects.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <TodosDataTable />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Add</h2>
          <QuickAddTodoForm />
        </div>
      </div>
    </div>
  );
}
