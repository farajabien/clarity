"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  X, 
  Clock, 
  Target,
  CheckSquare,
  Coffee
} from "lucide-react";

// Mock tasks from projects and todos
const mockAvailableTasks = [
  { id: "1", title: "Fix authentication bug", type: "todo", project: "E-commerce Platform" },
  { id: "2", title: "Update API documentation", type: "todo", project: "E-commerce Platform" },
  { id: "3", title: "Code review - payment module", type: "todo", project: "E-commerce Platform" },
  { id: "4", title: "Design mobile wireframes", type: "project", project: "Mobile App" },
  { id: "5", title: "Client feedback implementation", type: "project", project: "Dashboard" },
  { id: "6", title: "Database optimization", type: "todo", project: "Backend API" },
  { id: "7", title: "Unit tests for user service", type: "todo", project: "Backend API" },
  { id: "8", title: "UI component documentation", type: "project", project: "Design System" },
];

interface MultiTaskSelectorProps {
  onSubmit: (sessionData: {
    name: string;
    tasks: string[];
    duration: number;
    breakDuration: number;
    totalPomodoros: number;
  }) => void;
}

export function MultiTaskSelector({ onSubmit }: MultiTaskSelectorProps) {
  const [sessionName, setSessionName] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [customTask, setCustomTask] = useState("");
  const [duration, setDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [totalPomodoros, setTotalPomodoros] = useState(4);
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const availableTasks = mockAvailableTasks.filter(task => {
    const matchesProject = filterProject === "all" || task.project === filterProject;
    const matchesType = filterType === "all" || task.type === filterType;
    return matchesProject && matchesType;
  });

  const projects = Array.from(new Set(mockAvailableTasks.map(task => task.project)));

  const handleTaskToggle = (taskTitle: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks([...selectedTasks, taskTitle]);
    } else {
      setSelectedTasks(selectedTasks.filter(t => t !== taskTitle));
    }
  };

  const handleAddCustomTask = () => {
    if (customTask.trim() && !selectedTasks.includes(customTask.trim())) {
      setSelectedTasks([...selectedTasks, customTask.trim()]);
      setCustomTask("");
    }
  };

  const handleRemoveTask = (task: string) => {
    setSelectedTasks(selectedTasks.filter(t => t !== task));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName.trim() || selectedTasks.length === 0) return;

    onSubmit({
      name: sessionName.trim(),
      tasks: selectedTasks,
      duration,
      breakDuration,
      totalPomodoros,
    });

    // Reset form
    setSessionName("");
    setSelectedTasks([]);
    setCustomTask("");
    setDuration(25);
    setBreakDuration(5);
    setTotalPomodoros(4);
  };

  const estimatedTime = totalPomodoros * duration + (totalPomodoros - 1) * breakDuration;

  const presetConfigs = [
    { label: "Quick Sprint", duration: 15, break: 3, pomodoros: 3 },
    { label: "Standard", duration: 25, break: 5, pomodoros: 4 },
    { label: "Deep Work", duration: 45, break: 10, pomodoros: 3 },
    { label: "Marathon", duration: 50, break: 15, pomodoros: 6 },
  ];

  const applyPreset = (preset: typeof presetConfigs[0]) => {
    setDuration(preset.duration);
    setBreakDuration(preset.break);
    setTotalPomodoros(preset.pomodoros);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Session Name */}
      <div className="space-y-2">
        <Label htmlFor="session-name">Session Name *</Label>
        <Input
          id="session-name"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          placeholder="e.g., Morning Development Sprint"
          required
        />
      </div>

      {/* Preset Configurations */}
      <div className="space-y-2">
        <Label>Quick Presets</Label>
        <div className="grid grid-cols-2 gap-2">
          {presetConfigs.map((preset) => (
            <Button
              key={preset.label}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyPreset(preset)}
              className="text-xs"
            >
              {preset.label}
              <span className="ml-1 text-muted-foreground">
                ({preset.duration}m)
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Time Configuration */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">
            <Clock className="w-4 h-4 inline mr-1" />
            Focus (min)
          </Label>
          <Input
            id="duration"
            type="number"
            min="5"
            max="90"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 25)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="break-duration">
            <Coffee className="w-4 h-4 inline mr-1" />
            Break (min)
          </Label>
          <Input
            id="break-duration"
            type="number"
            min="3"
            max="30"
            value={breakDuration}
            onChange={(e) => setBreakDuration(parseInt(e.target.value) || 5)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="total-pomodoros">
            <Target className="w-4 h-4 inline mr-1" />
            Sessions
          </Label>
          <Input
            id="total-pomodoros"
            type="number"
            min="1"
            max="12"
            value={totalPomodoros}
            onChange={(e) => setTotalPomodoros(parseInt(e.target.value) || 4)}
          />
        </div>
      </div>

      {/* Estimated Time */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estimated total time:</span>
            <span className="font-medium">{Math.floor(estimatedTime / 60)}h {estimatedTime % 60}m</span>
          </div>
        </CardContent>
      </Card>

      {/* Task Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Select Tasks</Label>
          <div className="flex gap-2">
            <Select value={filterProject} onValueChange={setFilterProject}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="todo">Todos</SelectItem>
                <SelectItem value="project">Projects</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Available Tasks */}
        <div className="max-h-[200px] overflow-y-auto border rounded p-3 space-y-2">
          {availableTasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3">
              <Checkbox
                id={task.id}
                checked={selectedTasks.includes(task.title)}
                onCheckedChange={(checked) => 
                  handleTaskToggle(task.title, checked as boolean)
                }
              />
              <div className="flex-1 min-w-0">
                <label htmlFor={task.id} className="text-sm cursor-pointer">
                  {task.title}
                </label>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {task.project}
                  </Badge>
                  <Badge 
                    variant={task.type === "todo" ? "default" : "secondary"} 
                    className="text-xs"
                  >
                    {task.type}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Task Input */}
        <div className="space-y-2">
          <Label>Add Custom Task</Label>
          <div className="flex gap-2">
            <Input
              value={customTask}
              onChange={(e) => setCustomTask(e.target.value)}
              placeholder="Enter custom task..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomTask();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCustomTask}
              disabled={!customTask.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Selected Tasks */}
        {selectedTasks.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Tasks ({selectedTasks.length})</Label>
            <div className="flex flex-wrap gap-1">
              {selectedTasks.map((task) => (
                <Badge key={task} variant="secondary" className="gap-1">
                  <CheckSquare className="w-3 h-3" />
                  {task}
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(task)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={!sessionName.trim() || selectedTasks.length === 0}
          className="flex-1"
        >
          Create Focus Session
        </Button>
      </div>
    </form>
  );
}
