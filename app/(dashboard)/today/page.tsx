import { TodayList } from "@/components/custom/today/today-list";
import { AddTodoDialog } from "@/components/layout/add-todo-dialog";
import { AddProjectDialog } from "@/components/layout/add-project-dialog";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus } from "lucide-react";

export default function TodayPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">🌅 Today</h1>
          <p className="text-muted-foreground">
            Focus on what matters most today. Review your daily goals and make progress.
          </p>
        </div>
        
        <div className="flex gap-2">
          <AddTodoDialog>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </AddTodoDialog>
          
          <AddProjectDialog>
            <Button variant="outline">
              <FolderPlus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </AddProjectDialog>
        </div>
      </div>
      
      <TodayList />
    </div>
  );
}
