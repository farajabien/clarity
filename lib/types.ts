import { z } from "zod";

// --- Project ---
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  desc: z.string().optional(),
  estimate: z.number().optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  progress: z.number().min(0).max(100).default(0),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).default([]),
  budget: z.number().optional(),
  timeSpent: z.number().default(0),
  estimatedTime: z.number().default(0),
  category: z.enum(["work", "client", "personal"]),
  status: z.enum(["planning", "in-progress", "review", "completed", "on-hold"]),
  deployLink: z.string().url().nullable(),
  archived: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Project = z.infer<typeof ProjectSchema>;

// --- Todo ---
export const TodoSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  text: z.string(),
  priority: z.number().min(1).max(5),
  energyLevel: z.number().min(1).max(5).optional(),
  dueDate: z.string().datetime().optional(),
  completed: z.boolean().default(false),
  todayTag: z.boolean().default(false), // Priority tag for today
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  dependencies: z.array(z.string()).default([]), // <-- NEW FIELD
});
export type Todo = z.infer<typeof TodoSchema>;

// --- Session ---
export const SessionSchema = z.object({
  id: z.string(),
  tasks: z.array(z.string()), // array of todo IDs
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  actualMinutes: z.number(),
  createdAt: z.string().datetime(),
});
export type Session = z.infer<typeof SessionSchema>;

// --- Resource ---
export const ResourceSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string(),
  link: z.string().url(),
  type: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Resource = z.infer<typeof ResourceSchema>;

// --- Daily Review ---
export const DailyReviewSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  selectedTodoIds: z.array(z.string()),
});
export type DailyReview = z.infer<typeof DailyReviewSchema>;

// --- Settings ---
export const SettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  darkMode: z.boolean().default(false),
  syncInterval: z.number().default(300000), // in ms
  remindersEnabled: z.boolean().default(true),
  accessibilityOpts: z
    .object({
      highContrast: z.boolean().default(false),
      reducedMotion: z.boolean().default(false),
    })
    .default({ highContrast: false, reducedMotion: false }),
});
export type Settings = z.infer<typeof SettingsSchema>;

// --- App State ---
export const AppStateSchema = z.object({
  projects: z.record(z.string(), ProjectSchema),
  todos: z.record(z.string(), TodoSchema),
  sessions: z.record(z.string(), SessionSchema),
  resources: z.record(z.string(), ResourceSchema),
  dailyReview: z.record(z.string(), DailyReviewSchema),
  settings: SettingsSchema,
});
export type AppState = z.infer<typeof AppStateSchema>;
