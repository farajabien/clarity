"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Clock,
  Target,
  PieChart
} from "lucide-react";
import { useAppStore } from "@/hooks/use-app-store";

interface BudgetData {
  projectId: string;
  projectName: string;
  totalBudget: number;
  spentAmount: number;
  estimatedHours: number;
  actualHours: number;
  hourlyRate: number;
  status: "on-track" | "over-budget" | "under-budget" | "completed";
  lastUpdated: string;
}

export function BudgetTracker() {
  const projects = useAppStore((state) => state.projects);

  // Convert projects to budget data format
  const budgetData: BudgetData[] = Object.values(projects)
    .filter(project => project.budget && project.budget > 0)
    .map(project => {
      const spentAmount = project.timeSpent * 125; // $125 hourly rate
      const budgetProgress = project.budget ? (spentAmount / project.budget) * 100 : 0;
      
      let status: BudgetData['status'] = "on-track";
      if (project.status === "completed") status = "completed";
      else if (budgetProgress > 100) status = "over-budget";
      else if (budgetProgress < 50) status = "under-budget";
      
      return {
        projectId: project.id,
        projectName: project.title,
        totalBudget: project.budget || 0,
        spentAmount,
        estimatedHours: project.estimatedTime,
        actualHours: project.timeSpent,
        hourlyRate: 125,
        status,
        lastUpdated: project.updatedAt.split('T')[0],
      };
    });

  const totalBudget = budgetData.reduce((sum, project) => sum + project.totalBudget, 0);
  const totalSpent = budgetData.reduce((sum, project) => sum + project.spentAmount, 0);
  const totalEstimatedHours = budgetData.reduce((sum, project) => sum + project.estimatedHours, 0);
  const totalActualHours = budgetData.reduce((sum, project) => sum + project.actualHours, 0);

  const overallProgress = (totalSpent / totalBudget) * 100;
  const isOverBudget = totalSpent > totalBudget;
  const remainingBudget = totalBudget - totalSpent;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: BudgetData["status"]) => {
    switch (status) {
      case "on-track": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "over-budget": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "under-budget": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: BudgetData["status"]) => {
    switch (status) {
      case "on-track": return <TrendingUp className="w-4 h-4" />;
      case "over-budget": return <AlertTriangle className="w-4 h-4" />;
      case "under-budget": return <TrendingDown className="w-4 h-4" />;
      case "completed": return <Target className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const calculateProjectProgress = (project: BudgetData) => {
    return (project.spentAmount / project.totalBudget) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                isOverBudget 
                  ? "bg-red-100 dark:bg-red-900" 
                  : "bg-blue-100 dark:bg-blue-900"
              }`}>
                {isOverBudget ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                ) : (
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className={`text-2xl font-bold ${
                  isOverBudget ? "text-red-600" : "text-blue-600"
                }`}>
                  {formatCurrency(Math.abs(remainingBudget))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hours</p>
                <p className="text-2xl font-bold">{totalActualHours}h</p>
                <p className="text-xs text-muted-foreground">of {totalEstimatedHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Overall Budget Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {formatCurrency(totalSpent)} of {formatCurrency(totalBudget)}
              </span>
              <span className={`text-sm font-medium ${
                isOverBudget ? "text-red-600" : "text-green-600"
              }`}>
                {overallProgress.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={Math.min(overallProgress, 100)} 
              className={`h-3 ${isOverBudget ? "bg-red-100" : ""}`}
            />
            {isOverBudget && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="w-4 h-4" />
                Over budget by {formatCurrency(totalSpent - totalBudget)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Budget Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetData.map((project) => {
              const progress = calculateProjectProgress(project);
              const isProjectOverBudget = project.spentAmount > project.totalBudget;
              
              return (
                <div key={project.projectId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{project.projectName}</h4>
                      <Badge className={`gap-1 ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        {project.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1 text-sm">
                            <p>Hourly Rate: ${project.hourlyRate}</p>
                            <p>Hours: {project.actualHours}/{project.estimatedHours}</p>
                            <p>Last Updated: {new Date(project.lastUpdated).toLocaleDateString()}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-medium">{formatCurrency(project.totalBudget)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Spent</p>
                      <p className={`font-medium ${
                        isProjectOverBudget ? "text-red-600" : "text-green-600"
                      }`}>
                        {formatCurrency(project.spentAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                      <p className={`font-medium ${
                        isProjectOverBudget ? "text-red-600" : "text-blue-600"
                      }`}>
                        {formatCurrency(project.totalBudget - project.spentAmount)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className={isProjectOverBudget ? "text-red-600" : ""}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(progress, 100)} 
                      className={`h-2 ${isProjectOverBudget ? "bg-red-100" : ""}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
