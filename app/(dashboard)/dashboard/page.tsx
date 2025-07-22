"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, DollarSign, User, CheckSquare, Plus, BarChart3 } from "lucide-react";
import { ProjectGrid } from "@/components/custom/project";
import { AddProjectDialog } from "@/components/layout/add-project-dialog";
import { useHydratedStore } from "@/hooks/use-hydrated-store";
import { useMemo } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { projects, todos, isHydrated } = useHydratedStore();
  const [showAddProject, setShowAddProject] = useState(false);

  const stats = useMemo(() => {
    if (!isHydrated) {
      return {
        work: { total: 0, active: 0, completed: 0 },
        client: { total: 0, active: 0, completed: 0 },
        personal: { total: 0, active: 0, completed: 0 },
        totalTodos: 0,
        pendingTodos: 0
      };
    }

    const projectList = Object.values(projects);
    const todoList = Object.values(todos);
    
    return {
      work: {
        total: projectList.filter(p => p.category === 'work' && !p.archived).length,
        active: projectList.filter(p => p.category === 'work' && p.status === 'in-progress').length,
        completed: projectList.filter(p => p.category === 'work' && p.status === 'completed').length,
      },
      client: {
        total: projectList.filter(p => p.category === 'client' && !p.archived).length,
        active: projectList.filter(p => p.category === 'client' && p.status === 'in-progress').length,
        completed: projectList.filter(p => p.category === 'client' && p.status === 'completed').length,
      },
      personal: {
        total: projectList.filter(p => p.category === 'personal' && !p.archived).length,
        active: projectList.filter(p => p.category === 'personal' && p.status === 'in-progress').length,
        completed: projectList.filter(p => p.category === 'personal' && p.status === 'completed').length,
      },
      totalTodos: todoList.length,
      pendingTodos: todoList.filter(t => !t.completed).length
    };
  }, [projects, todos, isHydrated]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programming Projects</h1>
          <p className="text-muted-foreground">
            Manage your work, client, and personal development projects
          </p>
        </div>
        <Button onClick={() => setShowAddProject(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.work.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.work.active} active, {stats.work.completed} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Projects</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.client.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.client.active} active, {stats.client.completed} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Projects</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.personal.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.personal.active} active, {stats.personal.completed} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">All Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTodos}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingTodos} pending tasks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="work">
            Work
            {stats.work.total > 0 && (
              <Badge variant="secondary" className="ml-2">
                {stats.work.total}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="client">
            Client
            {stats.client.total > 0 && (
              <Badge variant="secondary" className="ml-2">
                {stats.client.total}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="personal">
            Personal
            {stats.personal.total > 0 && (
              <Badge variant="secondary" className="ml-2">
                {stats.personal.total}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Work Projects
                </CardTitle>
                <CardDescription>Employment and professional work</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/work">
                  <Button variant="outline" className="w-full">
                    View All Work Projects ({stats.work.total})
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Client Projects
                </CardTitle>
                <CardDescription>Freelance and contract work</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/client">
                  <Button variant="outline" className="w-full">
                    View All Client Projects ({stats.client.total})
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Projects
                </CardTitle>
                <CardDescription>Side projects and learning</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/personal">
                  <Button variant="outline" className="w-full">
                    View All Personal Projects ({stats.personal.total})
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                All Tasks & Todos
              </CardTitle>
              <CardDescription>
                Unified view of tasks across all projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/todos">
                <Button variant="outline" className="w-full">
                  View All Tasks ({stats.totalTodos} total, {stats.pendingTodos} pending)
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work">
          <ProjectGrid category="work" />
        </TabsContent>

        <TabsContent value="client">
          <ProjectGrid category="client" />
        </TabsContent>

        <TabsContent value="personal">
          <ProjectGrid category="personal" />
        </TabsContent>
      </Tabs>

      <AddProjectDialog 
        open={showAddProject} 
        onOpenChange={setShowAddProject} 
      />
    </div>
  );
}