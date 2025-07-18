import { FocusTaskList } from "@/components/custom/focus/focus-task-list";

export default function FocusPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🎯 Focus</h1>
        <p className="text-muted-foreground">
          View and manage all your tasks in one focused view.
        </p>
      </div>
      
      <FocusTaskList />
    </div>
  );
}
