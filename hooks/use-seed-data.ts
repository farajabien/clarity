import { useAppStore } from "@/hooks/use-app-store";
import type { Project, Todo, Session, Resource } from "@/lib/types";

export const useSeedData = () => {
  const store = useAppStore();

  const seedDemoData = () => {
    // Clear existing data
    Object.keys(store.projects).forEach((id) => store.deleteProject(id));

    // Create sample projects
    const workProjectId = store.addProject({
      title: "Clarity Dashboard",
      description: "ADHD-friendly project management app",
      category: "work",
      priority: "high",
      status: "in-progress",
      progress: 65,
      estimatedTime: 160,
      timeSpent: 104,
      budget: 5000,
      tags: ["react", "typescript", "nextjs"],
      deployLink: null,
    });

    const clientProjectId = store.addProject({
      title: "E-commerce Website",
      description: "Modern e-commerce platform for boutique store",
      category: "client",
      priority: "high",
      status: "review",
      progress: 85,
      estimatedTime: 120,
      timeSpent: 102,
      budget: 8500,
      tags: ["shopify", "custom-theme", "responsive"],
      deployLink: "https://boutique-demo.vercel.app",
    });

    const personalProjectId = store.addProject({
      title: "Personal Portfolio",
      description: "Update personal portfolio with latest work",
      category: "personal",
      priority: "medium",
      status: "planning",
      progress: 20,
      estimatedTime: 40,
      timeSpent: 8,
      tags: ["portfolio", "design", "photography"],
      deployLink: null,
    });

    // Create sample todos
    const todos = [
      // Clarity Dashboard todos
      {
        projectId: workProjectId,
        text: "Implement dark mode toggle",
        priority: 4,
        energyLevel: 3,
        completed: true,
        todayTag: false,
      },
      {
        projectId: workProjectId,
        text: "Set up InstantDB sync service",
        priority: 5,
        energyLevel: 4,
        completed: false,
        todayTag: true, // Priority for today
      },
      {
        projectId: workProjectId,
        text: "Create onboarding flow",
        priority: 3,
        energyLevel: 3,
        completed: false,
        todayTag: true, // Priority for today
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        projectId: workProjectId,
        text: "Add accessibility testing",
        priority: 4,
        energyLevel: 4,
        completed: false,
        todayTag: false,
      },

      // E-commerce todos
      {
        projectId: clientProjectId,
        text: "Fix mobile checkout flow",
        priority: 5,
        energyLevel: 4,
        completed: true,
        todayTag: false,
      },
      {
        projectId: clientProjectId,
        text: "Optimize product page loading",
        priority: 4,
        energyLevel: 3,
        completed: false,
        todayTag: true, // Priority for today
      },
      {
        projectId: clientProjectId,
        text: "Client feedback review",
        priority: 3,
        energyLevel: 2,
        completed: false,
        todayTag: false,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },

      // Portfolio todos
      {
        projectId: personalProjectId,
        text: "Redesign landing page",
        priority: 3,
        energyLevel: 4,
        completed: false,
        todayTag: false,
      },
      {
        projectId: personalProjectId,
        text: "Add new project case studies",
        priority: 2,
        energyLevel: 3,
        completed: false,
        todayTag: false,
      },
    ];

    todos.forEach((todo) => store.addTodo({ ...todo, dependencies: [] }));

    // Create sample resources
    const resources = [
      // Clarity resources
      {
        projectId: workProjectId,
        title: "ADHD Design Guidelines",
        link: "https://adhddesign.com/guidelines",
        type: "documentation",
      },
      {
        projectId: workProjectId,
        title: "Accessibility Checklist",
        link: "https://webaim.org/checklist/",
        type: "reference",
      },
      {
        projectId: workProjectId,
        title: "InstantDB Documentation",
        link: "https://instantdb.com/docs",
        type: "documentation",
      },

      // E-commerce resources
      {
        projectId: clientProjectId,
        title: "Brand Assets",
        link: "https://drive.google.com/folder/brand-assets",
        type: "assets",
      },
      {
        projectId: clientProjectId,
        title: "Product Images",
        link: "https://dropbox.com/products",
        type: "assets",
      },

      // Portfolio resources
      {
        projectId: personalProjectId,
        title: "Design Inspiration",
        link: "https://dribbble.com/collections/portfolio",
        type: "inspiration",
      },
    ];

    resources.forEach((resource) => store.addResource(resource));

    // Create sample sessions
    const sessions = [
      {
        tasks: [Object.keys(store.todos)[0], Object.keys(store.todos)[1]],
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        actualMinutes: 30,
      },
      {
        tasks: [Object.keys(store.todos)[2]],
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 23.25 * 60 * 60 * 1000).toISOString(),
        actualMinutes: 45,
      },
    ];

    sessions.forEach((session) => store.addSession(session));

    // Set today's review
    const today = new Date().toISOString().split("T")[0];
    const activeTodos = Object.values(store.todos).filter(
      (todo) => !todo.completed
    );
    const todayTodoIds = activeTodos.slice(0, 3).map((todo) => todo.id);
    store.setDailyReview(today, todayTodoIds);

    console.log("Demo data seeded successfully!");
  };

  const clearAllData = () => {
    Object.keys(store.projects).forEach((id) => store.deleteProject(id));
    Object.keys(store.sessions).forEach((id) => store.deleteSession(id));
    store.dailyReview = {};
    console.log("All data cleared!");
  };

  return {
    seedDemoData,
    clearAllData,
  };
};

// Hook to get quick stats about the current data
export const useAppStats = () => {
  const store = useAppStore();

  const stats = {
    totalProjects: Object.keys(store.projects).length,
    activeProjects: Object.values(store.projects).filter((p) => !p.archived)
      .length,
    totalTodos: Object.keys(store.todos).length,
    completedTodos: Object.values(store.todos).filter((t) => t.completed)
      .length,
    totalSessions: Object.keys(store.sessions).length,
    totalResources: Object.keys(store.resources).length,

    // Computed stats
    completionRate:
      Object.keys(store.todos).length > 0
        ? Math.round(
            (Object.values(store.todos).filter((t) => t.completed).length /
              Object.keys(store.todos).length) *
              100
          )
        : 0,

    overdueTodos: (() => {
      const now = new Date();
      return Object.values(store.todos).filter((todo) => {
        if (todo.completed || !todo.dueDate) return false;
        return new Date(todo.dueDate) < now;
      }).length;
    })(),
    todayTodos: (() => {
      const today = new Date().toISOString().split("T")[0];
      const dailyReview = store.dailyReview[today];
      if (!dailyReview) return 0;
      return dailyReview.selectedTodoIds
        .map((id) => store.todos[id])
        .filter(Boolean).length;
    })(),

    // Time tracking
    totalTimeSpent: Object.values(store.projects).reduce(
      (acc, project) => acc + project.timeSpent,
      0
    ),
    totalEstimatedTime: Object.values(store.projects).reduce(
      (acc, project) => acc + project.estimatedTime,
      0
    ),

    // Budget tracking
    totalBudget: Object.values(store.projects).reduce(
      (acc, project) => acc + (project.budget || 0),
      0
    ),
  };

  return stats;
};
