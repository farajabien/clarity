# Clarity Implementation Guide

> **Building an ADHD-friendly project management dashboard with Next.js + Slug Store v3.1.0**

## 🎯 **Project Overview**

Clarity is a centralized project management dashboard designed specifically for developers with ADHD. It eliminates decision paralysis and cognitive overhead in daily project management.

### **Key Goals**
- **Lightning-fast project creation** - Reduce friction to zero
- **Visual progress tracking** - Immediate completion feedback  
- **Context separation** - Work/Client/Personal project types
- **Universal access** - Share project state via URLs
- **Offline capability** - Work without internet

---

## 🏗️ **Technical Architecture**

### **Core Stack**
- **Next.js 15** - App Router with server components [[memory:5541165131269748764]]
- **TypeScript** - Full type safety throughout
- **@farajabien/slug-store v3.1.0** - Revolutionary state management [[memory:2386936706244903957]]
- **shadcn/ui** - Consistent component system
- **Tailwind CSS** - Utility-first styling
- **pnpm** - Package manager [[memory:1797456451972467943]]

### **Data Flow**
```
User Input → Slug Store → URL + Offline + Database
    ↓           ↓           ↓
  Real-time   Shareable   Persistent
  Updates     URLs        Storage
```

---

## 📊 **Data Types**

### **Core Types**
```typescript
// lib/types/clarity.types.ts
export type ProjectType = 'work' | 'client' | 'personal'
export type ProjectStatus = 'planning' | 'active' | 'completed' | 'paused'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Project {
  id: string
  title: string
  description?: string
  type: ProjectType
  status: ProjectStatus
  priority: Priority
  progress: number // 0-100
  
  // Timeline
  createdAt: string
  updatedAt: string
  dueDate?: string
  completedAt?: string
  
  // Resources
  resources: ProjectResource[]
  tags: string[]
  
  // Client-specific
  clientName?: string
  budget?: number
  totalPaid?: number
}

export interface Todo {
  id: string
  projectId: string
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: Priority
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectResource {
  id: string
  type: 'github' | 'live-site' | 'docs' | 'design'
  label: string
  url: string
}

export interface AppState {
  projects: Record<string, Project>
  todos: Record<string, Todo>
  filters: {
    projectType: ProjectType | 'all'
    status: ProjectStatus | 'all'
    search: string
  }
  ui: {
    activeTab: 'work' | 'clients' | 'personal' | 'todos'
    selectedProjectId?: string
  }
}
```

---

## 🚀 **Slug Store v3.1.0 Implementation**

### **Core Hook**
```typescript
// lib/hooks/useClarityStore.ts
import { useSlugStore } from '@farajabien/slug-store'

const DEFAULT_STATE: AppState = {
  projects: {},
  todos: {},
  filters: { projectType: 'all', status: 'all', search: '' },
  ui: { activeTab: 'work' }
}

export function useClarityStore() {
  const [state, setState, { isLoading, error, slug }] = useSlugStore<AppState>(
    'clarity-app',
    DEFAULT_STATE,
    {
      url: true,        // ✅ Share project states via URL
      compress: true,   // ✅ 60-80% URL size reduction
      offline: {        // ✅ ADHD-friendly offline storage
        storage: 'indexeddb',
        encryption: true,
        ttl: 86400 * 30
      },
      db: {             // ✅ Cross-device persistence
        endpoint: '/api/clarity/sync',
        method: 'POST'
      }
    }
  )

  // v3.1.0 New Features
  const shareCurrentState = useCallback(() => {
    const shareData = {
      title: 'My Clarity Dashboard',
      text: 'Check out my project dashboard!',
      url: window.location.href
    }
    
    if (navigator.share) {
      return navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(window.location.href)
      return Promise.resolve()
    }
  }, [])

  // Project operations
  const addProject = useCallback((project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0,
      resources: [],
      tags: []
    }

    setState({
      ...state,
      projects: { ...state.projects, [newProject.id]: newProject }
    })

    return newProject.id
  }, [state, setState])

  // Computed values
  const workProjects = Object.values(state.projects).filter(p => p.type === 'work')
  const clientProjects = Object.values(state.projects).filter(p => p.type === 'client')
  const personalProjects = Object.values(state.projects).filter(p => p.type === 'personal')

  return {
    // State
    state,
    setState,
    isLoading,
    error,
    
    // v3.1.0 Features
    slug,
    shareCurrentState,
    
    // Data
    workProjects,
    clientProjects,
    personalProjects,
    
    // Actions
    addProject
  }
}
```

---

## 🎨 **UI Implementation**

### **App Structure**
```
app/
├── page.tsx              # Landing page with quick add
├── layout.tsx            # Root layout
└── dashboard/
    └── page.tsx          # Main 3-tab dashboard
    
components/
├── ClarityDashboard.tsx  # Main dashboard component
├── ProjectCard.tsx       # Individual project cards
├── QuickAdd.tsx          # Fast project creation
└── ui/                   # shadcn/ui components
```

### **Landing Page (Quick Add)**
```typescript
// app/page.tsx - Server Component
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Clarity</h1>
          <p className="text-slate-600 mb-8">
            Project management for developers with ADHD
          </p>
          
          <QuickAddForm />
          
          <div className="mt-8">
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              View Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### **Dashboard (3-Tab Layout)**
```typescript
// components/ClarityDashboard.tsx
export function ClarityDashboard() {
  const { 
    workProjects, 
    clientProjects, 
    personalProjects,
    shareCurrentState,
    isLoading 
  } = useClarityStore()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="work" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="work">
              Work ({workProjects.length})
            </TabsTrigger>
            <TabsTrigger value="clients">
              Clients ({clientProjects.length})
            </TabsTrigger>
            <TabsTrigger value="personal">
              Personal ({personalProjects.length})
            </TabsTrigger>
            <TabsTrigger value="todos">
              Todos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="work">
            <ProjectGrid projects={workProjects} />
          </TabsContent>
          
          <TabsContent value="clients">
            <ProjectGrid projects={clientProjects} />
          </TabsContent>
          
          <TabsContent value="personal">
            <ProjectGrid projects={personalProjects} />
          </TabsContent>
          
          <TabsContent value="todos">
            <TodoBoard />
          </TabsContent>
        </Tabs>
        
        <div className="fixed bottom-4 right-4">
          <Button onClick={shareCurrentState}>
            Share Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

## 🔄 **Implementation Roadmap**

### **Phase 1: Core Foundation** ✅ COMPLETED
- [x] Project types and interfaces
- [x] Basic CRUD operations  
- [x] Slug store integration
- [x] UI components setup

### **Phase 2: Dashboard Implementation** 🔄 IN PROGRESS
- [ ] Upgrade to slug-store v3.1.0
- [ ] Implement shareCurrentState with native sharing
- [ ] Add copySlug() and getSlugData() dev tools
- [ ] Enhanced project cards with progress
- [ ] Todo management system

### **Phase 3: Advanced Features**
- [ ] Email notifications (Resend integration)
- [ ] Project templates
- [ ] Analytics dashboard
- [ ] Offline-first enhancements

### **Phase 4: Polish & Deploy**
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] PWA capabilities
- [ ] Production deployment

---

## 🎯 **Real-World Usage Scenario**

### **Daily Workflow**
1. **Morning Check-in**
   - Open Clarity dashboard
   - Review overnight progress
   - Prioritize today's tasks

2. **Project Creation**
   - Quick add from landing page
   - Auto-categorize (work/client/personal)
   - Add resources (GitHub, live site)

3. **Progress Tracking**
   - Visual progress bars
   - Checkbox completion
   - Status updates

4. **Collaboration**
   - Share project state via URL
   - Collaborate with team members
   - Client progress updates

### **ADHD-Friendly Features**
- **One-click project creation** - Reduce decision paralysis
- **Visual progress indicators** - Immediate feedback
- **Context separation** - Clear boundaries between work types
- **Persistent state** - Never lose progress
- **Offline capability** - Work anywhere

---

## 🚀 **Next Steps**

### **Immediate Actions**
1. **Upgrade slug-store** to v3.1.0
2. **Implement shareCurrentState** with native sharing
3. **Add dev tools integration** (copySlug, getSlugData)
4. **Test URL sharing** with compressed state

### **Development Focus**
- Clean, minimal UI with shadcn/ui
- Fast project creation workflows
- Reliable state persistence
- Cross-device synchronization

This implementation guide provides a focused roadmap for building Clarity with slug-store v3.1.0, emphasizing practical development over extensive documentation. 