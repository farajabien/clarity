# Clarity – Full Project Overview

**Clarity** is an ADHD‑friendly, developer‑focused project management dashboard designed to eliminate decision fatigue, minimize context switching, and enable deep‑work sessions. Built with Next.js, TypeScript, Tailwind CSS, Shadcn UI, Zustand, and InstantDB, Clarity provides a seamless offline‑first experience with simple real‑time sync.

---

## ✨ Key Features

* **Zero‑Friction Project Creation**: QuickAddProjectForm with smart defaults and automatic categorization (Work, Client, Personal).
* **Energy‑Aware Task Management**: Priority badges, energy level tagging, and visual progress bars for dopamine hits.
* **ADHD‑Specific Design**: Daily review modal, minimal Focus mode with Pomodoro timer, multi‑task selection, and session tracking.
* **Unified Dashboard**: Tabs for Today, Todos, Work, Client, Personal, Focus, Settings.
* **Offline‑First & Real‑Time Sync**: Zustand‑persist for local state with InstantDB push/pull syncing (manual override strategy).
* **Accessible UI**: WCAG 2.1 AA standards, soft nude palette, rounded corners, emoji‑rich feedback.

---

## 🏗️ Architecture

1. **Presentation Layer (Client)**

   * Next.js App Router & RSC for SSR/SSG.
   * Shadcn UI & Tailwind CSS for modular, accessible components.
   * Zustand (with IndexedDB persistence) for local-first CRUD and state management.
   * React Hook Form for accessible, ergonomic forms.

2. **API & Sync Layer**

   * InstantDB used as a user-specific JSON snapshot store.
   * Sync logic pulls latest snapshot on login or demand, then overrides local state.
   * Manual `syncNow()` function to push local app state to InstantDB.
   * No complex merge—last-writer-wins override.

3. **Persistence Layer**

   * Local IndexedDB store via Zustand‑persist slices.
   * InstantDB snapshot contains the entire `AppState` per user.

4. **Authentication & CI/CD**

   * Magic‑Code login with JWT in HttpOnly cookies.
   * GitHub Actions for linting, testing, and deployments.
   * Vercel for hosting previews and production.

---

## 🗂️ UI Component Overview

### Global/Layout

* `AppSidebar`, `HeaderBar`, `AuthGate`, `ThemeToggle`, `ToastNotification`

### Today

* `DailyReviewModal`, `TodayList`, `PriorityBadge`, `CelebrateConfetti`

### Todos

* `TodoList`, `TodoCard`, `QuickAddTodoForm`, `BulkActionBar`

### Work / Client / Personal

* `ProjectGrid`, `ProjectCard`, `QuickAddProjectForm`, `ResourceList`, `ClientInfoPanel`, `BudgetTracker`

### Focus

* `FocusSessionClient`, `MultiTaskSelector`, `PomodoroTimer`, `SessionTracker`, `SessionSummaryDialog`

### Settings

* `ProfileForm`, `SyncSettings`, `ThemeSettings`, `AccessibilityOptions`

*(All custom components are built from [Shadcn UI primitives](https://ui.shadcn.com/docs/components))*

---

## 💾 Data Model & Types

### InstantDB Snapshot Format

```jsonc
{
  "userId": "...",
  "lastSync": "2025-07-17T13:00:00.000Z",
  "state": { /* AppState */ }
}
```

### Local IndexedDB Schema (via Zustand)

| Slice         | Key        | Type          |
| ------------- | ---------- | ------------- |
| `projects`    | projectId  | `Project`     |
| `todos`       | todoId     | `Todo`        |
| `sessions`    | sessionId  | `Session`     |
| `resources`   | resourceId | `Resource`    |
| `dailyReview` | date       | `DailyReview` |
| `settings`    | -          | `Settings`    |

### Zod & TypeScript Types (`types.ts`)

* ✅ `ProjectSchema`, `TodoSchema`, `SessionSchema`, `ResourceSchema`, `DailyReviewSchema`, `SettingsSchema`, `AppStateSchema`
* ✅ Inferred types: `Project`, `Todo`, `Session`, `Resource`, `DailyReview`, `Settings`, `AppState`

---

## 🔄 Sequence & Lifecycle

* **Project Lifecycle**:
  `Create → Plan Todos → In Progress (Focus) → Deploy (CI/CD) → Done → Archive`

* **Sync Lifecycle**:

  * On login or manual trigger: fetch latest snapshot → override local Zustand state
  * On save or exit: serialize local Zustand state → push to InstantDB

---

## 🚀 Getting Started

1. **Clone**:
   `git clone https://github.com/farajabien/clarity.git`

2. **Install**:
   `pnpm install`

3. **Dev**:
   `pnpm dev` → [http://localhost:3000](http://localhost:3000)

4. **Test**:
   `pnpm test` (Jest + React Testing Library)

5. **Deploy**:
   Push to `main` → GitHub Actions → Vercel

---

**Built for focus. Designed for ADHD. 🌸✨**