import { SettingsClient } from "@/components/custom/settings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">⚙️ Settings</h1>
        <p className="text-muted-foreground">
          Customize your experience and manage your preferences.
        </p>
      </div>
      
      <SettingsClient />
    </div>
  );
}
