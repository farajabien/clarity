"use client";

import { init, id, tx } from "@instantdb/react";
import type { AppSchema } from "@/instant.schema";

// Initialize InstantDB with your app ID
const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID;

if (!APP_ID) {
  throw new Error("NEXT_PUBLIC_INSTANT_APP_ID is required");
}

// Create and export the InstantDB instance
export const db = init<AppSchema>({ 
  appId: APP_ID,
});

// Export auth utilities
export const { useAuth, useQuery, transact } = db;

// Export id and tx helpers
export { id, tx };

export default db;
