# Project Requirements & Current State

## 🎯 Current Project Portfolio

### Project Types
1. **Work Projects** (regular job projects/landing pages)
2. **Client Projects** (client work with budget tracking)
3. **My Projects** (bootstrapped startup ventures)

### Resources Per Project
- GitHub repository
- Live site link
- Documentation links
- Other relevant resources (design files, specs, etc.)

---

## 🏗️ App Structure & Navigation

### Landing Page
- **Quick Add Interface**: Single input field for project title
- **Instant Save**: Creates project and redirects to main dashboard
- **Minimal UI**: Clean entry point focused on speed

### Main Dashboard (3-Tab Layout)
Using shadcn/ui Tabs component:

#### Tab 1: Work
- Regular job projects
- Landing pages (3 current)
- Internal company projects

#### Tab 2: Clients  
- Client projects with budget tracking
- Payment status indicators
- Deposit/milestone tracking
- Revenue overview

#### Tab 3: My Projects
- Personal startup ventures
- Bootstrapped projects
- Side projects and experiments

### Unified Todos Board (4th View)
- **Global Todo View**: All todos from all projects
- **Sortable Columns**: 
  - Project name
  - Todo item
  - Due date/time
  - Priority (user-set order)
  - Status
- **Easy Adjustment**: Click to edit, drag to reorder
- **Filter Options**: By project, by status, by due date
- **Quick Actions**: Mark complete, reschedule, reassign

---

## 🎨 UI/UX Requirements (shadcn/ui Themed)

### Design System
- **shadcn/ui Components**: Consistent theming with New York style
- **Base Color**: Neutral (already configured)
- **Custom Variables**: CSS variables for easy theme switching
- **Minimal Aesthetic**: Clean, handwritten feel with shadcn polish

### Project Cards (using shadcn Card component)
- **Left**: Checkbox for completion toggle
- **Top**: Progress bar (shadcn Progress component)
- **Right**: Time indicator ("14h to go")
- **Content**: Project name, type badge, key metrics
- **Hover State**: Subtle elevation and shadow

### Form Elements
- **Quick Add**: shadcn Input with Button
- **Project Details**: shadcn Form components
- **Todo Management**: shadcn Select, Input, Button combinations

---

## 📋 Project Type Templates

### Work Projects
**Standard Checklist:**
- [ ] Requirements gathering
- [ ] Content and copy review  
- [ ] Design approval
- [ ] Development setup
- [ ] Build and test
- [ ] Deploy and handoff

### Client Projects
**Pre-Development Checklist:**
- [ ] PRD (Product Requirements Document)
- [ ] System architecture design
- [ ] Client requirement calls
- [ ] Research and content assembly
- [ ] Budget confirmation and deposit received

**Development Phase:**
- [ ] Build
- [ ] Client review cycles
- [ ] Test and QA
- [ ] Deploy
- [ ] Final payment collection

**Financial Tracking:**
- Total budget amount
- Deposit received
- Milestone payments
- Outstanding balance
- Expected completion payment

### My Projects (Bootstrapped)
**Planning Phase:**
- [ ] Market research
- [ ] MVP feature definition
- [ ] Technical architecture
- [ ] User personas and journey mapping

**Development Phase:**
- [ ] Core feature development
- [ ] User testing and feedback
- [ ] Iterative improvements
- [ ] Launch preparation and marketing

---

## 🚀 Core Workflows

### Daily Workflow
1. **Landing Page Entry**: Quick add new projects or navigate to dashboard
2. **Tab Navigation**: Switch between Work/Clients/My Projects
3. **Todo Review**: Check unified todos board for all pending items
4. **Progress Updates**: Check off completed items, adjust timelines
5. **Resource Access**: One-click access to GitHub, live sites, docs

### Project Creation Workflow
1. **Quick Add**: Type title on landing page, auto-redirect
2. **Project Classification**: Assign to Work/Clients/My Projects tab
3. **Template Selection**: Auto-apply relevant checklist template
4. **Resource Addition**: Add GitHub, live link, docs gradually
5. **Todo Customization**: Modify template todos as needed

### Todo Management Workflow
1. **Unified View**: See all todos across projects in one place
2. **Priority Setting**: Drag to reorder by importance/urgency
3. **Time Adjustment**: Click to edit deadlines and time estimates
4. **Status Tracking**: Easy checkbox toggling and progress updates
5. **Project Context**: Click todo to jump to parent project

---

## 🎛️ Technical Stack

### Frontend Framework
- **Next.js (App Router)**: Server-side rendering [memory:5541165131269748764]
- **shadcn/ui**: Complete component library with theming
- **Tailwind CSS**: Utility-first styling (configured with shadcn)
- **Framer Motion**: Subtle animations and transitions

### State Management
- **@farajabien/slug-store**: URL state persistence [memory:2386936706244903957]
- **React Hook Form**: Form validation and management
- **Zustand**: Client-side state for UI interactions

### Development Tools
- **TypeScript**: Type safety throughout
- **ESLint + Prettier**: Code formatting and linting
- **pnpm**: Package management [memory:1797456451972467943]

---

## 🎯 Implementation Roadmap

### Phase 1: Core Structure (Week 1)
- [ ] Landing page with quick add
- [ ] Main dashboard with 3-tab layout
- [ ] Basic project cards with shadcn components
- [ ] Project CRUD operations

### Phase 2: Todo System (Week 2)
- [ ] Unified todos board
- [ ] Sortable/filterable todo table
- [ ] Todo assignment to projects
- [ ] Progress tracking and completion

### Phase 3: Project Templates (Week 3)
- [ ] Work/Client/Bootstrapped project templates
- [ ] Budget tracking for client projects
- [ ] Resource link management
- [ ] Project detail expandable views

### Phase 4: Polish & UX (Week 4)
- [ ] Time indicators and deadline tracking
- [ ] Drag-and-drop todo reordering
- [ ] Keyboard shortcuts
- [ ] Mobile responsiveness
- [ ] Smooth animations and transitions

---

## 🎨 shadcn/ui Components Used

### Already Available
- ✅ **Tabs**: Main navigation (Work/Clients/My Projects)
- ✅ **Card**: Project containers
- ✅ **Button**: Actions and CTAs
- ✅ **Input**: Quick add and forms
- ✅ **Progress**: Project completion bars
- ✅ **Badge**: Project type indicators
- ✅ **Form**: Project detail forms
- ✅ **Select**: Dropdowns and filters
- ✅ **Label**: Form labels

### Need to Add
- [ ] **Table**: Unified todos board
- [ ] **Dialog**: Project detail modals
- [ ] **Checkbox**: Todo completion
- [ ] **Calendar**: Date pickers
- [ ] **Command**: Search and quick actions

---

**Goal**: A lightning-fast, beautifully designed project dashboard that eliminates decision paralysis and keeps you focused on shipping features, not managing tools. 