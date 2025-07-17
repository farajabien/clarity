"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Trophy, 
  CheckCircle,
  Share,
  Download,
  Calendar,
  Timer,
  Coffee,
} from "lucide-react";

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

interface SessionSummaryDialogProps {
  session: FocusSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionSummaryDialog({ 
  session, 
  open, 
  onOpenChange 
}: SessionSummaryDialogProps) {
  if (!session) return null;

  const totalFocusTime = session.completedPomodoros * session.duration;
  const totalBreakTime = (session.completedPomodoros - 1) * session.breakDuration;
  
  const completionRate = (session.completedPomodoros / session.totalPomodoros) * 100;
  const isFullyCompleted = session.completedPomodoros === session.totalPomodoros;

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

  const getSessionDuration = () => {
    if (session.startTime && session.endTime) {
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.round(diffMs / (1000 * 60));
      return formatTime(diffMins);
    }
    return "N/A";
  };

  const getProductivityScore = () => {
    // Simple productivity calculation based on completion rate and session length
    const baseScore = completionRate;
    const timeBonus = Math.min(totalFocusTime / 60, 3) * 10; // Bonus for longer sessions (max 3 hours)
    const taskBonus = Math.min(session.tasks.length, 5) * 5; // Bonus for handling multiple tasks
    
    return Math.min(Math.round(baseScore + timeBonus + taskBonus), 100);
  };

  const productivityScore = getProductivityScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🔥";
    if (score >= 80) return "⭐";
    if (score >= 70) return "👍";
    if (score >= 60) return "👌";
    return "💪";
  };

  // Mock chart data for the session breakdown
  const focusBlocks = Array.from({ length: session.completedPomodoros }, (_, i) => ({
    pomodoro: i + 1,
    duration: session.duration,
    type: "focus" as const,
  }));
  
  const breakBlocks = Array.from({ length: session.completedPomodoros - 1 }, (_, i) => ({
    pomodoro: i + 1,
    duration: session.breakDuration,
    type: "break" as const,
  }));
  
  const sessionBreakdown = [...focusBlocks, ...breakBlocks].sort((a, b) => a.pomodoro - b.pomodoro);

  const achievements = [];
  if (isFullyCompleted) achievements.push("🎯 Complete Session");
  if (session.completedPomodoros >= 4) achievements.push("🚀 Deep Work");
  if (totalFocusTime >= 120) achievements.push("⏰ Time Master");
  if (session.tasks.length >= 3) achievements.push("🎯 Multi-Tasker");
  if (productivityScore >= 90) achievements.push("⭐ Perfect Score");

  const handleShare = () => {
    const text = `Just completed a ${formatTime(totalFocusTime)} focus session with ${session.completedPomodoros} pomodoros! 🎯 #FocusTime #Productivity`;
    if (navigator.share) {
      navigator.share({
        title: "Focus Session Complete",
        text,
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const handleExport = () => {
    const sessionData = {
      name: session.name,
      completedAt: session.endTime,
      duration: getSessionDuration(),
      focusTime: formatTime(totalFocusTime),
      breakTime: formatTime(totalBreakTime),
      pomodoros: `${session.completedPomodoros}/${session.totalPomodoros}`,
      tasks: session.tasks,
      productivityScore,
    };
    
    const blob = new Blob([JSON.stringify(sessionData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `focus-session-${session.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Session Complete!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Celebration Header */}
          <div className="text-center space-y-2">
            <div className="text-4xl">🎉</div>
            <h3 className="text-xl font-semibold">{session.name}</h3>
            <p className="text-muted-foreground">
              {isFullyCompleted ? "You completed your entire session!" : "Great progress on your focus session!"}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{session.completedPomodoros}</div>
                <div className="text-xs text-muted-foreground">Pomodoros</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{formatTime(totalFocusTime)}</div>
                <div className="text-xs text-muted-foreground">Focus Time</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">{getSessionDuration()}</div>
                <div className="text-xs text-muted-foreground">Total Time</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <div className={`text-2xl font-bold ${getScoreColor(productivityScore)}`}>
                  {productivityScore} {getScoreEmoji(productivityScore)}
                </div>
                <div className="text-xs text-muted-foreground">Score</div>
              </CardContent>
            </Card>
          </div>

          {/* Session Breakdown Chart */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Session Breakdown
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Focus ({session.duration}min each)</span>
                  <div className="w-4 h-4 bg-blue-500 rounded ml-4"></div>
                  <span>Break ({session.breakDuration}min each)</span>
                </div>
                <div className="flex gap-1 h-6">
                  {sessionBreakdown.map((block, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-full rounded-sm ${
                              block.type === "focus" ? "bg-green-500" : "bg-blue-500"
                            }`}
                            style={{
                              width: `${(block.duration / Math.max(session.duration, session.breakDuration)) * 20}px`,
                              minWidth: "8px"
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{block.type === "focus" ? "Focus" : "Break"}: {block.duration}min</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Completed */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Tasks Worked On
              </h4>
              <div className="space-y-2">
                {session.tasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{task}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          {achievements.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Achievements Unlocked
                </h4>
                <div className="flex flex-wrap gap-2">
                  {achievements.map((achievement, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Session Details */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Session Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Started:</span>
                  <div>{session.startTime && formatDateTime(session.startTime)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Completed:</span>
                  <div>{session.endTime && formatDateTime(session.endTime)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Focus Time:</span>
                  <div className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {formatTime(totalFocusTime)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Break Time:</span>
                  <div className="flex items-center gap-1">
                    <Coffee className="w-3 h-3" />
                    {formatTime(totalBreakTime)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleShare} variant="outline" className="flex-1 gap-2">
              <Share className="w-4 h-4" />
              Share
            </Button>
            <Button onClick={handleExport} variant="outline" className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
