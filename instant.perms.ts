// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  $users: {
    allow: {
      view: "auth.id != null && data.id == auth.id",
    },
  },
  projects: {
    allow: {
      view: "auth.id != null && data.userId == auth.id",
      create: "auth.id != null",
      delete: "auth.id != null && data.userId == auth.id",
      update: "auth.id != null && data.userId == auth.id",
    },
  },
  todos: {
    allow: {
      view: "auth.id != null && data.userId == auth.id",
      create: "auth.id != null",
      delete: "auth.id != null && data.userId == auth.id",
      update: "auth.id != null && data.userId == auth.id",
    },
  },
  sessions: {
    allow: {
      view: "auth.id != null && data.userId == auth.id",
      create: "auth.id != null",
      delete: "auth.id != null && data.userId == auth.id",
      update: "auth.id != null && data.userId == auth.id",
    },
  },
  resources: {
    allow: {
      view: "auth.id != null && data.userId == auth.id",
      create: "auth.id != null",
      delete: "auth.id != null && data.userId == auth.id",
      update: "auth.id != null && data.userId == auth.id",
    },
  },
  dailyReviews: {
    allow: {
      view: "auth.id != null && data.userId == auth.id",
      create: "auth.id != null",
      delete: "auth.id != null && data.userId == auth.id",
      update: "auth.id != null && data.userId == auth.id",
    },
  },
  userSettings: {
    allow: {
      view: "auth.id != null && data.userId == auth.id",
      create: "auth.id != null",
      delete: "auth.id != null && data.userId == auth.id",
      update: "auth.id != null && data.userId == auth.id",
    },
  },
  snapshots: {
    allow: {
      view: "auth.id != null && data.userId == auth.id",
      create: "auth.id != null",
      delete: "auth.id != null && data.userId == auth.id",
      update: "auth.id != null && data.userId == auth.id",
    },
  },
} satisfies InstantRules;

export default rules;
