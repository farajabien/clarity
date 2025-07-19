// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    projects: i.entity({
      title: i.string(),
      desc: i.string().optional(),
      estimate: i.number().optional(),
      description: i.string().optional(),
      priority: i.string().optional(), // "low" | "medium" | "high"
      progress: i.number().optional(),
      dueDate: i.string().optional(),
      tags: i.json().optional(),
      budget: i.number().optional(),
      timeSpent: i.number().optional(),
      estimatedTime: i.number().optional(),
      category: i.string().optional(), // "work" | "client" | "personal"
      status: i.string().optional(), // "planning" | "in-progress" | "review" | "completed" | "on-hold"
      deployLink: i.string().optional(),
      archived: i.boolean().optional(),
      createdAt: i.string().optional(),
      updatedAt: i.string().optional(),
      userId: i.string().indexed().optional(),
    }),
    todos: i.entity({
      projectId: i.string().indexed().optional(),
      text: i.string().optional(),
      priority: i.string().optional(), // Keep as string to match existing data
      energyLevel: i.number().optional(),
      dueDate: i.string().optional(),
      completed: i.boolean().optional(),
      createdAt: i.string().optional(),
      updatedAt: i.string().optional(),
      userId: i.string().indexed().optional(),
      dependencies: i.json().optional(), // <-- NEW FIELD
    }),
    sessions: i.entity({
      tasks: i.json().optional(), // array of todo IDs
      startTime: i.string().optional(),
      endTime: i.string().optional(),
      actualMinutes: i.number().optional(),
      createdAt: i.string().optional(),
      userId: i.string().indexed().optional(),
    }),
    resources: i.entity({
      projectId: i.string().indexed().optional(),
      title: i.string().optional(),
      link: i.string().optional(),
      type: i.string().optional(),
      createdAt: i.string().optional(),
      updatedAt: i.string().optional(),
      userId: i.string().indexed().optional(),
    }),
    dailyReviews: i.entity({
      date: i.string().unique().indexed().optional(), // YYYY-MM-DD
      selectedTodoIds: i.json().optional(),
      userId: i.string().indexed().optional(),
    }),
    userSettings: i.entity({
      theme: i.string().optional(), // "light" | "dark" | "system"
      darkMode: i.boolean().optional(),
      syncInterval: i.number().optional(),
      remindersEnabled: i.boolean().optional(),
      accessibilityOpts: i.json().optional(),
      userId: i.string().unique().indexed().optional(),
    }),
    snapshots: i.entity({
      lastSync: i.string().optional(),
      state: i.json().optional(),
      userId: i.string().unique().indexed().optional(),
    }),
  },
  links: {
    // Remove existing conflicting links - will add back incrementally
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
