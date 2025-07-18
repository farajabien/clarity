"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHydratedStore } from "@/hooks/use-hydrated-store";
import { Todo } from "@/lib/types";
import { Play, Pause, Square, Timer, ArrowLeft, Info } from "lucide-react";
import { toast } from "sonner";

export default function FocusSessionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { todos, projects, resources, addSession, isHydrated } = useHydratedStore();
  
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTaskDialog, setSelectedTaskDialog] = useState<Todo | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);

  // Get selected task IDs from URL params
  const selectedTaskIds = useMemo(() => 
    searchParams?.getAll('task') || [],
    [searchParams]
  );
  
  // Get selected tasks
  const selectedTasks = useMemo(() => {
    if (!isHydrated) return [];
    return selectedTaskIds
      .map(id => todos[id])
      .filter(Boolean);
  }, [selectedTaskIds, todos, isHydrated]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  // Format time display
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = () => {
    setIsRunning(true);
    setIsPaused(false);
    setSessionStartTime(new Date().toISOString());
    toast.success("Focus session started!");
  };

  const handlePauseSession = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? "Session resumed" : "Session paused");
  };

  const handleEndSession = () => {
    if (sessionStartTime) {
      const endTime = new Date().toISOString();
      const actualMinutes = Math.floor(seconds / 60);
      
      // Save session to store
      addSession({
        tasks: selectedTaskIds,
        startTime: sessionStartTime,
        endTime,
        actualMinutes,
      });
    }
    
    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
    setSessionStartTime(null);
    toast.success("Focus session completed!");
    router.push('/focus');
  };

  const handleTaskClick = (todo: Todo) => {
    setSelectedTaskDialog(todo);
  };

  const getTaskResources = (projectId: string) => {
    return Object.values(resources).filter(resource => resource.projectId === projectId);
  };

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

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
            <Button onClick={() => router.push('/focus')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Focus
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
        <Button variant="outline" onClick={() => router.push('/focus')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Focus
        </Button>
      </div>

      {/* Timer Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Session Timer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-6xl font-mono font-bold">
              {formatTime(seconds)}
            </div>
            <div className="flex items-center justify-center gap-2">
              {!isRunning ? (
                <Button onClick={handleStartSession} size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Start Session
                </Button>
              ) : (
                <>
                  <Button onClick={handlePauseSession} variant="outline" size="lg">
                    <Pause className="w-4 h-4 mr-2" />
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button onClick={handleEndSession} variant="destructive" size="lg">
                    <Square className="w-4 h-4 mr-2" />
                    End Session
                  </Button>
                </>
              )}
            </div>
            {isPaused && (
              <Badge variant="outline" className="text-lg px-4 py-2">
                Session Paused
              </Badge>
            )}
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
                <TableHead>Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedTasks.map((todo) => {
                const project = projects[todo.projectId] || { title: "Unassigned", category: "personal" };
                return (
                  <TableRow key={todo.id} className="cursor-pointer hover:bg-muted/50">
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
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTaskClick(todo)}
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Task Details Dialog */}
      <Dialog open={!!selectedTaskDialog} onOpenChange={() => setSelectedTaskDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>
              Complete context and resources for this task
            </DialogDescription>
          </DialogHeader>
          {selectedTaskDialog && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Task</h3>
                <p>{selectedTaskDialog.text}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Priority</h3>
                <Badge 
                  variant={selectedTaskDialog.priority >= 4 ? "destructive" : selectedTaskDialog.priority >= 3 ? "default" : "secondary"}
                >
                  Priority {selectedTaskDialog.priority}
                </Badge>
              </div>

              {selectedTaskDialog.dueDate && (
                <div>
                  <h3 className="font-semibold mb-2">Due Date</h3>
                  <p>{new Date(selectedTaskDialog.dueDate).toLocaleDateString()}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Project</h3>
                <p>{projects[selectedTaskDialog.projectId]?.title || "Unassigned"}</p>
                {projects[selectedTaskDialog.projectId]?.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {projects[selectedTaskDialog.projectId].description}
                  </p>
                )}
              </div>

              {/* Project Resources */}
              {selectedTaskDialog.projectId !== "unassigned" && (
                <div>
                  <h3 className="font-semibold mb-2">Project Resources</h3>
                  {getTaskResources(selectedTaskDialog.projectId).length > 0 ? (
                    <div className="space-y-2">
                      {getTaskResources(selectedTaskDialog.projectId).map((resource) => (
                        <div key={resource.id} className="border rounded p-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{resource.title}</span>
                            <Badge variant="outline">{resource.type}</Badge>
                          </div>
                          {resource.link && (
                            <a
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              {resource.link}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No resources available</p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
