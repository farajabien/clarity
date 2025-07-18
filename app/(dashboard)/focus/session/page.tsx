import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Timer, ArrowLeft } from "lucide-react";
import Link from "next/link";

// This is now a server component that displays static focus session info
export default async function FocusSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ task?: string | string[] }>;
}) {
  // Await search params in Next.js 15
  const params = await searchParams;
  
  // Get selected task IDs from URL params (server-side)
  const selectedTaskIds = Array.isArray(params.task) 
    ? params.task 
    : params.task 
    ? [params.task] 
    : [];

  // Mock data for demonstration - in a real app, you'd fetch this server-side
  const mockTodos = {
    "1": { id: "1", text: "Complete project documentation", priority: 4, completed: false, projectId: "proj1" },
    "2": { id: "2", text: "Review code changes", priority: 3, completed: false, projectId: "proj2" },
  };

  const mockProjects = {
    "proj1": { title: "Web Application", category: "work" },
    "proj2": { title: "Code Review", category: "work" },
  };

  const selectedTasks = selectedTaskIds
    .map(id => mockTodos[id as keyof typeof mockTodos])
    .filter(Boolean);

  if (selectedTasks.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>No Tasks Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              No tasks were selected for this focus session.
            </p>
            <Button asChild>
              <Link href="/focus">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Focus
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Focus Session</h1>
          <p className="text-muted-foreground">
            {selectedTasks.length} task{selectedTasks.length === 1 ? '' : 's'} selected
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/focus">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Focus
          </Link>
        </Button>
      </div>

      {/* Static Timer Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Focus Session Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Timer functionality requires client-side interaction.
            </p>
            <p className="text-sm text-muted-foreground">
              Add a client component for interactive timer features.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Session Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedTasks.map((todo) => {
                const project = mockProjects[todo.projectId as keyof typeof mockProjects] || { title: "Unassigned" };
                return (
                  <TableRow key={todo.id}>
                    <TableCell className="font-medium">{todo.text}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.title}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={todo.priority >= 4 ? "destructive" : todo.priority >= 3 ? "default" : "secondary"}
                      >
                        Priority {todo.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={todo.completed ? "default" : "outline"}>
                        {todo.completed ? "Completed" : "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
