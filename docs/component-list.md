🚀 Project Overview
Clarity is an ADHD‑friendly, developer‑focused project management dashboard built with Next.js, TypeScript, Tailwind CSS, Shadcn UI, and InstantDB. It centralizes your work, client, personal projects, and todos into a three‑tab dashboard (plus Today and Focus modes) designed to eliminate decision fatigue, minimize context switching, and power deep‑work sessions with a Pomodoro‑style timer. All data is managed locally via Zustand for instant, offline‑first CRUD and synced in the background to InstantDB through React Query. Features include automatic project categorization, energy‑aware task sorting, smart defaults, daily “Today” review, minimal Focus mode, and real‑time progress tracking — all wrapped in a soft, rounded, emoji‑rich UI that meets WCAG 2.1 AA standards.
📐 Global/Layout
AppSidebar
Uses: Sidebar, NavigationMenu, Avatar, Badge, Toggle (dark mode)
HeaderBar
Uses: Breadcrumb, Button, Popover, Toast
AuthGate
Uses: Dialog, InputOTP, Button, Alert
ThemeToggle
Uses: ToggleGroup, Tooltip
🗓️ Today
DailyReviewModal
Uses: Sheet, Checkbox, Button, Calendar
TodayList
Uses: Tabs, List (built with Table/DataTable), Progress
PriorityBadge
Uses: Badge
✅ Todos
TodoList
Uses: DataTable, Pagination, ScrollArea
TodoCard
Uses: Card, Checkbox, DropdownMenu, Badge, Button
QuickAddTodoForm
Uses: Input, Textarea, Select, Button, ReactHookForm
BulkActionBar
Uses: AlertDialog, Button, MenuBar
💼 Work / 💰 Client / 🧑‍🎨 Personal
(structure is identical across these three tabs)
ProjectGrid
Uses: Grid (via Card), Tabs, Filter (custom Combobox + Input)
ProjectCard
Uses: Card, Progress, Avatar, Badge, Button
QuickAddProjectForm
Uses: Dialog, Input, Textarea, Select, Button, ReactHookForm
ResourceList
Uses: List (DataTable), Popover, Button
ClientInfoPanel (Client tab only)
Uses: Accordion, Alert, Badge, Button
BudgetTracker (Client tab only)
Uses: Chart (e.g. pie/bar), Progress, Tooltip
⏰ Focus
FocusSessionClient
Uses: Tabs, List (DataTable), Button, Dialog
MultiTaskSelector
Uses: Checkbox, Select, Popover, Input
PomodoroTimer
Uses: Progress, Button, Slider, Toast
SessionTracker
Uses: Chart, Table, Badge
SessionSummaryDialog
Uses: Dialog, Chart, Button, Tooltip
⚙️ Settings
ProfileForm
Uses: Form (ReactHookForm + Input/Textarea/Checkbox), Button
SyncSettings
Uses: Switch, Select, Tooltip
ThemeSettings
Uses: RadioGroup, ColorPicker (custom Select + Swatch), Button
AccessibilityOptions
Uses: Slider, Switch, Checkbox, Label🔧 Utility & Primitives
Button — wraps Button with your default styling (primary/secondary)
InputField — wraps Input + Label + error Alert
TextAreaField — wraps Textarea + Label + error Alert
SelectField — wraps Select + Label
DialogWrapper — generic Dialog with header/footer slots
SheetWrapper — generic Sheet for side‑panels
BadgeStatus — standardized Badge variants
CardBase — base styling for all Card uses
