"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Calendar,
  BarChart3,
  Timer,
  Trophy,
  Flame
} from "lucide-react";
import { useHydratedStore } from "@/hooks/use-hydrated-store";
import type { Session } from "@/lib/types";

interface FocusSession {
  id: string;
  name: string;
  tasks: string[];
  duration: number;
  breakDuration: number;
  status: "not-started" | "active" | "break" | "paused" | "completed";
  startTime?: string;
  endTime?: string;
  completedPomodoros: number;
  totalPomodoros: number;
  createdAt: string;
}

interface SessionTrackerProps {
  sessions?: FocusSession[];
}

export function SessionTracker({ sessions: propSessions }: SessionTrackerProps) {
  const { sessions: storeSessions, isHydrated } = useHydratedStore();
  
  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Session Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading session data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Use prop sessions if provided, otherwise use store sessions
  const sessions = propSessions || [];
  const completedSessions = sessions.filter(s => s.status === "completed");
  const totalFocusTime = completedSessions.reduce((total, session) => {
    return total + (session.completedPomodoros * session.duration);
  }, 0);
  
  const totalPomodoros = completedSessions.reduce((total, session) => {
    return total + session.completedPomodoros;
  }, 0);

  // Calculate productivity metrics
  const today = new Date().toDateString();
  const todaySessions = completedSessions.filter(
    session => session.endTime && new Date(session.endTime).toDateString() === today
  );
  
  const thisWeekSessions = completedSessions.filter(session => {
    if (!session.endTime) return false;
    const sessionDate = new Date(session.endTime);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  });

  // Calculate streak (consecutive days with completed sessions)
  const calculateStreak = () => {
    const sessionsByDate = completedSessions.reduce((acc, session) => {
      if (session.endTime) {
        const date = new Date(session.endTime).toDateString();
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    let streak = 0;
    const currentDate = new Date();
    
    while (true) {
      const dateString = currentDate.toDateString();
      if (sessionsByDate[dateString]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: FocusSession["status"]) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "active": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "paused": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Generate weekly data from real sessions
  const generateWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const storeSessionsArray = Object.values(storeSessions) as Session[];
    
    return days.map(day => {
      const sessionsForDay = storeSessionsArray.filter(session => {
        const sessionDate = new Date(session.startTime);
        const dayName = sessionDate.toLocaleDateString('en-US', { weekday: 'short' });
        return dayName === day;
      }).length;
      
      const totalTime = storeSessionsArray
        .filter(session => {
          const sessionDate = new Date(session.startTime);
          const dayName = sessionDate.toLocaleDateString('en-US', { weekday: 'short' });
          return dayName === day;
        })
        .reduce((sum, session) => sum + session.actualMinutes, 0);
      
      return {
        day,
        sessions: sessionsForDay,
        time: totalTime,
      };
    });
  };

  const weeklyData = generateWeeklyData();
  const maxSessions = Math.max(...weeklyData.map(d => d.sessions));

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <Timer className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Focus Time</p>
                <p className="text-2xl font-bold">{formatTime(totalFocusTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Pomodoros</p>
                <p className="text-2xl font-bold">{totalPomodoros}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
                <p className="text-2xl font-bold">{completedSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{currentStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Weekly Focus Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {weeklyData.map((day) => (
                <div key={day.day} className="text-center space-y-2">
                  <div className="text-xs text-muted-foreground font-medium">
                    {day.day}
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div 
                      className="w-8 bg-primary rounded"
                      style={{ 
                        height: `${Math.max((day.sessions / maxSessions) * 60, 4)}px`
                      }}
                    />
                    <div className="text-xs font-medium">{day.sessions}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(day.time)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today&apos;s Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sessions completed</span>
                <span className="font-medium">{todaySessions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Focus time</span>
                <span className="font-medium">
                  {formatTime(todaySessions.reduce((total, s) => total + (s.completedPomodoros * s.duration), 0))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average session</span>
                <span className="font-medium">
                  {todaySessions.length > 0 
                    ? formatTime(Math.round(
                        todaySessions.reduce((total, s) => total + (s.completedPomodoros * s.duration), 0) / todaySessions.length
                      ))
                    : "0m"
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Week Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sessions completed</span>
                <span className="font-medium">{thisWeekSessions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total focus time</span>
                <span className="font-medium">
                  {formatTime(thisWeekSessions.reduce((total, s) => total + (s.completedPomodoros * s.duration), 0))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Daily average</span>
                <span className="font-medium">
                  {formatTime(Math.round(
                    thisWeekSessions.reduce((total, s) => total + (s.completedPomodoros * s.duration), 0) / 7
                  ))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {completedSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No completed sessions yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Pomodoros</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedSessions.slice(0, 10).map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{session.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.tasks.length} task{session.tasks.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(session.completedPomodoros * session.duration)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {session.completedPomodoros}/{session.totalPomodoros}
                        </span>
                        <Progress 
                          value={(session.completedPomodoros / session.totalPomodoros) * 100} 
                          className="w-12 h-1"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {session.endTime && formatDateTime(session.endTime)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
