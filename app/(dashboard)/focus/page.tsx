import { FocusSessionClient } from "@/components/custom/focus";

export default function FocusPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🎯 Focus</h1>
        <p className="text-muted-foreground">
          Enter deep work mode with Pomodoro sessions and task tracking.
        </p>
      </div>
      
      <FocusSessionClient />
    </div>
  );
}
