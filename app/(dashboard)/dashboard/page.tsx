import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddProjectDialog } from "@/components/layout/add-project-dialog";
import { DashboardClient } from "@/components/custom/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programming Projects</h1>
          <p className="text-muted-foreground">
            Manage your work, client, and personal development projects
          </p>
        </div>
        <AddProjectDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </AddProjectDialog>
      </div>

      {/* Client-side dashboard content */}
      <DashboardClient />
    </div>
  );
}