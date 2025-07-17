import { TodayList } from "@/components/custom/today/today-list";

export default function TodayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🌅 Today</h1>
        <p className="text-muted-foreground">
          Focus on what matters most today. Review your daily goals and make progress.
        </p>
      </div>
      
      <TodayList />
    </div>
  );
}
