"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  Plus,
  Timer,
  BarChart3,
  Target,
  Clock
} from "lucide-react";
import { PomodoroTimer } from "./pomodoro-timer";
import { SessionTracker } from "./session-tracker";
import { SessionSummaryDialog } from "./session-summary-dialog";
import { SessionCreationForm } from "./session-creation-form";
import { useHydratedStore } from "@/hooks/use-hydrated-store";
import type { Session, Todo } from "@/lib/types";

interface FocusSession {
  id: string;
  name: string;
  tasks: string[];
  duration: number; // in minutes
  breakDuration: number;
  status: "not-started" | "active" | "break" | "paused" | "completed";
  startTime?: string;
  endTime?: string;
  completedPomodoros: number;
  totalPomodoros: number;
  createdAt: string;
}

export function FocusSessionClient() {
  const store = useHydratedStore();
  const { addSession, isHydrated } = store;

  // Local state for UI
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(false);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<FocusSession | null>(null);
  const [activeFocusSession, setActiveFocusSession] = useState<FocusSession | null>(null);

  // Safely access sessions and todos properties with fallback - memoized
  const storeSessions = useMemo(() => {
    if ('sessions' in store && store.sessions && typeof store.sessions === 'object') {
      return store.sessions as Record<string, Session>;
    }
    return {};
  }, [store]);

  const todos = useMemo(() => {
    if ('todos' in store && store.todos && typeof store.todos === 'object') {
      return store.todos as Record<string, Todo>;
    }
    return {};
  }, [store]);

  // Convert store sessions to focus sessions format - memoize even before hydration
  const completedSessions = useMemo((): FocusSession[] => {
    if (!isHydrated) return [];
    return Object.values(storeSessions).map(session => ({
      id: session.id,
      name: `Focus Session - ${new Date(session.startTime).toLocaleDateString()}`,
      tasks: session.tasks,
      duration: 25, // Default pomodoro duration
      breakDuration: 5, // Default break duration  
      status: "completed" as const,
      startTime: session.startTime,
      endTime: session.endTime,
      completedPomodoros: Math.ceil(session.actualMinutes / 25),
      totalPomodoros: Math.ceil(session.actualMinutes / 25) || 1,
      createdAt: session.createdAt,
    }));
  }, [storeSessions, isHydrated]);

  // Combine completed sessions with active session - memoize even before hydration
  const allSessions = useMemo((): FocusSession[] => {
    if (!isHydrated) return [];
    const sessions = [...completedSessions];
    if (activeFocusSession) {
      sessions.unshift(activeFocusSession);
    }
    return sessions;
  }, [completedSessions, activeFocusSession, isHydrated]);

  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading focus sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to get task names from task IDs
  const getTaskNames = (taskIds: string[]): string[] => {
    return taskIds.map(id => todos[id]?.text || `Task ${id}`);
  };

  const handleStartSession = (session: FocusSession) => {
    const updatedSession = {
      ...session,
      status: "active" as const,
      startTime: new Date().toISOString(),
    };
    setActiveFocusSession(updatedSession);
  };

  const handlePauseSession = () => {
    setActiveFocusSession(null);
  };

  const handleCompleteSession = (session: FocusSession) => {
    const completedSession = {
      ...session,
      status: "completed" as const,
      endTime: new Date().toISOString(),
      completedPomodoros: session.totalPomodoros,
    };
    
    setActiveFocusSession(null);
    setSelectedSession(completedSession);
    setShowSummaryDialog(true);
    
    // Save completed session to store
    addSession({
      tasks: session.tasks,
      startTime: session.startTime || new Date().toISOString(),
      endTime: new Date().toISOString(),
      actualMinutes: session.totalPomodoros * session.duration,
    });
  };

  const handleCreateSession = (sessionData: {
    name: string;
    tasks: string[];
    duration: number;
    breakDuration: number;
    totalPomodoros: number;
  }) => {
    const newSession: FocusSession = {
      id: Date.now().toString(),
      ...sessionData,
      status: "not-started",
      completedPomodoros: 0,
      createdAt: new Date().toISOString(),
    };
    
    setShowNewSessionDialog(false);
    handleStartSession(newSession);
  };

  const getStatusColor = (status: FocusSession["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "paused": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "break": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">⏰ Focus Sessions</h1>
          <p className="text-muted-foreground">
            Manage your deep work sessions with the Pomodoro Technique.
          </p>
        </div>
        <Dialog open={showNewSessionDialog} onOpenChange={setShowNewSessionDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Focus Session</DialogTitle>
            </DialogHeader>
            <SessionCreationForm 
              onSubmit={handleCreateSession}
              onCancel={() => setShowNewSessionDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Session Timer */}
      {activeFocusSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Active Session: {activeFocusSession.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PomodoroTimer
              session={activeFocusSession}
              onPause={() => handlePauseSession()}
              onComplete={() => handleCompleteSession(activeFocusSession)}
              onUpdateSession={(updates) => {
                const updatedSession = { ...activeFocusSession, ...updates };
                setActiveFocusSession(updatedSession);
              }}
            />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Focus Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {allSessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No focus sessions yet.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewSessionDialog(true)}
                    className="mt-2"
                  >
                    Create Your First Session
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session</TableHead>
                      <TableHead>Tasks</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{session.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {session.duration}min work / {session.breakDuration}min break
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {getTaskNames(session.tasks).slice(0, 2).map((taskName, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {taskName.length > 20 ? `${taskName.slice(0, 20)}...` : taskName}
                              </Badge>
                            ))}
                            {session.tasks.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{session.tasks.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {session.completedPomodoros}/{session.totalPomodoros}
                            </span>
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ 
                                  width: `${(session.completedPomodoros / session.totalPomodoros) * 100}%` 
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status.replace("-", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {session.startTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(session.startTime)}
                              {session.endTime && ` - ${formatTime(session.endTime)}`}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {session.status === "not-started" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStartSession(session)}
                                disabled={!!activeFocusSession}
                              >
                                <Play className="w-3 h-3" />
                              </Button>
                            )}
                            {session.status === "active" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePauseSession()}
                              >
                                <Pause className="w-3 h-3" />
                              </Button>
                            )}
                            {session.status === "paused" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStartSession(session)}
                                disabled={!!activeFocusSession && activeFocusSession.id !== session.id}
                              >
                                <Play className="w-3 h-3" />
                              </Button>
                            )}
                            {session.status === "completed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedSession(session);
                                  setShowSummaryDialog(true);
                                }}
                              >
                                <BarChart3 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <SessionTracker sessions={allSessions} />
        </TabsContent>
      </Tabs>

      {/* Session Summary Dialog */}
      <SessionSummaryDialog
        session={selectedSession}
        open={showSummaryDialog}
        onOpenChange={setShowSummaryDialog}
      />
    </div>
  );
}
