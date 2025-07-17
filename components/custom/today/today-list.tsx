"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PriorityBadge } from "./priority-badge";

const dummyTodos = [
  {
    id: "1",
    text: "Design homepage",
    project: "Work",
    priority: "high",
    progress: 80,
  },
  {
    id: "2",
    text: "Client call",
    project: "Client",
    priority: "urgent",
    progress: 20,
  },
  {
    id: "3",
    text: "Read book",
    project: "Personal",
    priority: "low",
    progress: 50,
  },
  {
    id: "4",
    text: "Update docs",
    project: "Work",
    priority: "medium",
    progress: 60,
  },
];

const tabs = [
  { key: "all", label: "All" },
  { key: "work", label: "Work" },
  { key: "personal", label: "Personal" },
  { key: "client", label: "Client" },
];

export function TodayList() {
  const [tab, setTab] = useState("all");

  return (
    <div className="w-full">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent key={t.key} value={t.key} className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(t.key === "all"
                  ? dummyTodos
                  : dummyTodos.filter(
                      (todo) => todo.project.toLowerCase() === t.key
                    )
                ).map((todo) => (
                  <TableRow key={todo.id}>
                    <TableCell>{todo.text}</TableCell>
                    <TableCell>{todo.project}</TableCell>
                    <TableCell>
                      <PriorityBadge priority={todo.priority} />
                    </TableCell>
                    <TableCell className="w-40">
                      <Progress value={todo.progress} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default TodayList;
