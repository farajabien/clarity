"use client";

import { useState } from "react";
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
import { MultiTaskSelector } from "./multi-task-selector";
import { SessionTracker } from "./session-tracker";
import { SessionSummaryDialog } from "./session-summary-dialog";

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

// Mock data
const mockSessions: FocusSession[] = [
  {
    id: "1",
    name: "Morning Development Sprint",
    tasks: ["Fix authentication bug", "Update API documentation", "Code review"],
    duration: 25,
    breakDuration: 5,
    status: "completed",
    startTime: "2025-07-17T09:00:00",
    endTime: "2025-07-17T11:30:00",
    completedPomodoros: 6,
    totalPomodoros: 6,
    createdAt: "2025-07-17T08:45:00",
  },
  {
    id: "2",
    name: "UI Design Review",
    tasks: ["Review mockups", "Client feedback", "Design adjustments"],
    duration: 25,
    breakDuration: 5,
    status: "active",
    startTime: "2025-07-17T14:00:00",
    completedPomodoros: 2,
    totalPomodoros: 4,
    createdAt: "2025-07-17T13:45:00",
  },
  {
    id: "3",
    name: "Project Planning",
    tasks: ["Define requirements", "Create timeline", "Resource allocation"],
    duration: 25,
    breakDuration: 5,
    status: "not-started",
    completedPomodoros: 0,
    totalPomodoros: 3,
    createdAt: "2025-07-17T15:30:00",
  },
];

export function FocusSessionClient() {
  const [sessions, setSessions] = useState<FocusSession[]>(mockSessions);
  const [activeSession, setActiveSession] = useState<FocusSession | null>(
    sessions.find(s => s.status === "active") || null
  );
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(false);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<FocusSession | null>(null);

  const handleStartSession = (session: FocusSession) => {
    // Stop any currently active session
    setSessions(prev => prev.map(s => 
      s.status === "active" ? { ...s, status: "paused" as const } : s
    ));
    
    const updatedSession = {
      ...session,
      status: "active" as const,
      startTime: new Date().toISOString(),
    };
    
    setSessions(prev => prev.map(s => 
      s.id === session.id ? updatedSession : s
    ));
    setActiveSession(updatedSession);
  };

  const handlePauseSession = (session: FocusSession) => {
    const updatedSession = { ...session, status: "paused" as const };
    setSessions(prev => prev.map(s => 
      s.id === session.id ? updatedSession : s
    ));
    setActiveSession(null);
  };

  const handleCompleteSession = (session: FocusSession) => {
    const updatedSession = {
      ...session,
      status: "completed" as const,
      endTime: new Date().toISOString(),
      completedPomodoros: session.totalPomodoros,
    };
    
    setSessions(prev => prev.map(s => 
      s.id === session.id ? updatedSession : s
    ));
    setActiveSession(null);
    setSelectedSession(updatedSession);
    setShowSummaryDialog(true);
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
    
    setSessions(prev => [...prev, newSession]);
    setShowNewSessionDialog(false);
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
            <MultiTaskSelector onSubmit={handleCreateSession} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Session Timer */}
      {activeSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Active Session: {activeSession.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PomodoroTimer
              session={activeSession}
              onPause={() => handlePauseSession(activeSession)}
              onComplete={() => handleCompleteSession(activeSession)}
              onUpdateSession={(updates) => {
                const updatedSession = { ...activeSession, ...updates };
                setSessions(prev => prev.map(s => 
                  s.id === activeSession.id ? updatedSession : s
                ));
                setActiveSession(updatedSession);
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
              {sessions.length === 0 ? (
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
                    {sessions.map((session) => (
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
                            {session.tasks.slice(0, 2).map((task, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {task.length > 20 ? `${task.slice(0, 20)}...` : task}
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
                                disabled={!!activeSession}
                              >
                                <Play className="w-3 h-3" />
                              </Button>
                            )}
                            {session.status === "active" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePauseSession(session)}
                              >
                                <Pause className="w-3 h-3" />
                              </Button>
                            )}
                            {session.status === "paused" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStartSession(session)}
                                disabled={!!activeSession && activeSession.id !== session.id}
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
          <SessionTracker sessions={sessions} />
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
