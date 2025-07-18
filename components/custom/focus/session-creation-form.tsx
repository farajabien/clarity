"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiTaskSelector } from "./multi-task-selector";
import { Separator } from "@/components/ui/separator";
import { Clock, Target } from "lucide-react";

interface SessionCreationFormProps {
  onSubmit: (sessionData: {
    name: string;
    tasks: string[];
    duration: number;
    breakDuration: number;
    totalPomodoros: number;
  }) => void;
  onCancel?: () => void;
}

export function SessionCreationForm({ onSubmit, onCancel }: SessionCreationFormProps) {
  const [sessionName, setSessionName] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [duration, setDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [totalPomodoros, setTotalPomodoros] = useState(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionName.trim() || selectedTasks.length === 0) {
      return;
    }

    onSubmit({
      name: sessionName,
      tasks: selectedTasks,
      duration,
      breakDuration,
      totalPomodoros,
    });
  };

  const isValid = sessionName.trim() && selectedTasks.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Session Name */}
      <div className="space-y-2">
        <Label htmlFor="session-name">Session Name</Label>
        <Input
          id="session-name"
          placeholder="e.g., Morning Development Sprint"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
        />
      </div>

      {/* Pomodoro Settings */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">
            <Clock className="w-4 h-4 inline mr-1" />
            Focus Duration
          </Label>
          <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="25">25 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="break-duration">Break Duration</Label>
          <Select value={breakDuration.toString()} onValueChange={(value) => setBreakDuration(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="10">10 minutes</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="20">20 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="total-pomodoros">
            <Target className="w-4 h-4 inline mr-1" />
            Total Rounds
          </Label>
          <Select value={totalPomodoros.toString()} onValueChange={(value) => setTotalPomodoros(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 round</SelectItem>
              <SelectItem value="2">2 rounds</SelectItem>
              <SelectItem value="3">3 rounds</SelectItem>
              <SelectItem value="4">4 rounds</SelectItem>
              <SelectItem value="6">6 rounds</SelectItem>
              <SelectItem value="8">8 rounds</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Task Selection */}
      <div className="space-y-2">
        <Label>Select Tasks for This Session</Label>
        <MultiTaskSelector
          onTasksSelected={setSelectedTasks}
          maxTasks={5}
          selectedTasks={selectedTasks}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!isValid}>
          Create Session ({selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''})
        </Button>
      </div>
    </form>
  );
}
