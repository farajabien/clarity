import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  CheckSquare, 
  FocusIcon, 
  LayoutGrid, 
  Timer, 
  Users, 
  ArrowRight,
  ExternalLink,
  Play,
  Settings,
  Home
} from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  const routes = [
    { 
      path: "/today", 
      title: "🌅 Today", 
      description: "Daily focus and review system with energy-aware task selection",
      icon: Calendar,
      features: ["Priority-based tasks", "Energy level matching", "Daily review"]
    },
    { 
      path: "/todos", 
      title: "📝 Todos", 
      description: "Complete task management with priority levels and energy tracking",
      icon: CheckSquare,
      features: ["Bulk actions", "Smart filtering", "Due date tracking"]
    },
    { 
      path: "/work", 
      title: "💼 Work Projects", 
      description: "Professional project management and tracking",
      icon: LayoutGrid,
      features: ["Time tracking", "Progress monitoring", "Resource management"]
    },
    { 
      path: "/client", 
      title: "💰 Client Projects", 
      description: "Client work with budget tracking and deliverable management",
      icon: Users,
      features: ["Budget tracking", "Client info panels", "Deliverable tracking"]
    },
    { 
      path: "/personal", 
      title: "🧑‍🎨 Personal Projects", 
      description: "Personal goals and creative projects",
      icon: FocusIcon,
      features: ["Goal setting", "Creative tracking", "Personal metrics"]
    },
    { 
      path: "/focus", 
      title: "🎯 Focus Mode", 
      description: "Pomodoro sessions with multi-task selection and progress tracking",
      icon: Timer,
      features: ["Pomodoro timer", "Session analytics", "Multi-task focus"]
    },
    { 
      path: "/settings", 
      title: "⚙️ Settings", 
      description: "Preferences, sync settings, themes, and accessibility options",
      icon: Settings,
      features: ["Theme customization", "Accessibility options", "Sync preferences"]
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Landing
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          🌸 Clarity Dashboard Demo
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          ADHD-friendly project management designed for neurodivergent minds. 
          Explore each section to see how Clarity can transform your productivity.
        </p>
        <Badge variant="secondary" className="text-sm">
          Interactive Demo • Click any section below
        </Badge>
      </div>

      <Separator />

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => {
          const IconComponent = route.icon;
          return (
            <Card 
              key={route.path} 
              className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/20"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-lg">{route.title}</CardTitle>
                <CardDescription className="text-sm">
                  {route.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Key Features
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {route.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Link href={route.path}>
                      <Play className="w-4 h-4 mr-2" />
                      Try {route.title.split(' ')[1] || 'Demo'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="mt-12">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">How to Use This Demo</CardTitle>
            <CardDescription className="text-base">
              Each section demonstrates different aspects of the Clarity productivity system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">🎯 Start with Today</h4>
                <p className="text-muted-foreground">
                  Begin your daily planning and see how energy-aware task selection works
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⏱️ Try Focus Mode</h4>
                <p className="text-muted-foreground">
                  Experience the Pomodoro timer with multi-task session planning
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📊 Explore Projects</h4>
                <p className="text-muted-foreground">
                  See how work, client, and personal projects are organized separately
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⚙️ Customize Settings</h4>
                <p className="text-muted-foreground">
                  Adjust themes, accessibility options, and sync preferences
                </p>
              </div>
            </div>
            <Separator />
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                This demo uses sample data to showcase functionality. 
                In a real app, your data would be synchronized and persistent.
              </p>
              <Button variant="outline" asChild>
                <Link href="/today">
                  Start Your Productivity Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}