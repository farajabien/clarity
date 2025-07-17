"use client";

import { useState, useEffect, useCallback } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Square, 
  SkipForward,
  Volume2,
  VolumeX,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface FocusSession {
  id: string;
  name: string;
  tasks: string[];
  duration: number; // in minutes
  breakDuration: number;
  status: "not-started" | "active" | "break" | "paused" | "completed";
  completedPomodoros: number;
  totalPomodoros: number;
}

interface PomodoroTimerProps {
  session: FocusSession;
  onPause: () => void;
  onComplete: () => void;
  onUpdateSession: (updates: Partial<FocusSession>) => void;
}

export function PomodoroTimer({ 
  session, 
  onPause, 
  onComplete, 
  onUpdateSession 
}: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(session.duration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(session.status === "active");
  const [isBreak, setIsBreak] = useState(session.status === "break");
  const [volume, setVolume] = useState([50]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const totalTime = isBreak ? session.breakDuration * 60 : session.duration * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    
    if (soundEnabled) {
      // Play notification sound (you can implement this with Web Audio API)
      toast.success(isBreak ? "Break time is over!" : "Focus session completed!");
    }

    if (isBreak) {
      // Break completed, start next pomodoro
      setIsBreak(false);
      setTimeLeft(session.duration * 60);
      toast.info("Ready for your next focus session!");
    } else {
      // Pomodoro completed
      const newCompletedPomodoros = session.completedPomodoros + 1;
      onUpdateSession({ completedPomodoros: newCompletedPomodoros });
      
      if (newCompletedPomodoros >= session.totalPomodoros) {
        // All pomodoros completed
        onComplete();
        toast.success("🎉 All focus sessions completed! Great work!");
      } else {
        // Start break
        setIsBreak(true);
        setTimeLeft(session.breakDuration * 60);
        onUpdateSession({ status: "break" });
        toast.success("🎯 Focus session completed! Time for a break.");
      }
    }
  }, [isBreak, soundEnabled, session, onUpdateSession, onComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleTimerComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handleTimerComplete]);



  const handlePlayPause = () => {
    if (isRunning) {
      setIsRunning(false);
      onPause();
    } else {
      setIsRunning(true);
      onUpdateSession({ status: isBreak ? "break" : "active" });
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(session.duration * 60);
    setIsBreak(false);
    onPause();
  };

  const handleSkip = () => {
    setTimeLeft(0);
    handleTimerComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseLabel = () => {
    if (isBreak) {
      return `Break ${session.completedPomodoros + 1}`;
    }
    return `Focus ${session.completedPomodoros + 1}/${session.totalPomodoros}`;
  };

  const getPhaseColor = () => {
    return isBreak 
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Phase Indicator */}
          <div className="flex items-center justify-between">
            <Badge className={getPhaseColor()}>
              {getPhaseLabel()}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className="text-6xl font-mono font-bold tracking-tight">
              {formatTime(timeLeft)}
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-muted-foreground">
              {isBreak ? "Take a break and recharge" : "Focus on your current task"}
            </p>
          </div>

          {/* Current Tasks */}
          {!isBreak && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Current Tasks:</h4>
              <div className="flex flex-wrap gap-1">
                {session.tasks.map((task, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {task}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={handlePlayPause}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  {timeLeft === totalTime ? "Start" : "Resume"}
                </>
              )}
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={handleStop}
            >
              <Square className="w-5 h-5" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={handleSkip}
              disabled={!isRunning}
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </Button>
                  <span className="text-sm">Sound</span>
                </div>
                
                {soundEnabled && (
                  <div className="flex items-center gap-2 flex-1 max-w-[150px]">
                    <span className="text-xs text-muted-foreground">Volume</span>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={10}
                      className="flex-1"
                    />
                  </div>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Focus session: {session.duration} minutes</p>
                <p>• Break duration: {session.breakDuration} minutes</p>
                <p>• Total sessions: {session.totalPomodoros}</p>
              </div>
            </div>
          )}

          {/* Session Progress */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Session Progress</span>
              <span>{session.completedPomodoros}/{session.totalPomodoros} completed</span>
            </div>
            <Progress 
              value={(session.completedPomodoros / session.totalPomodoros) * 100} 
              className="mt-2 h-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
