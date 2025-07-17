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
  Zap,
  ArrowRight,
  Target,
  BarChart3,
  Settings
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FocusIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Clarity</span>
          </div>
          <Button asChild>
            <Link href="/today">Get Started</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Productivity & Focus Management
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Achieve Crystal Clear
            <br />
            Productivity
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Organize your projects, track your todos, and maintain laser focus with Pomodoro sessions. 
            Everything you need to stay productive and achieve your goals.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/today">
                Start Today <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">
                View Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Stay Focused</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Clarity combines project management, task tracking, and focus techniques into one seamless experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Today View */}
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Daily Focus</CardTitle>
              <CardDescription>
                Start each day with a clear view of your priorities and tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Priority-based task organization</li>
                <li>• Daily review and planning</li>
                <li>• Progress tracking</li>
              </ul>
            </CardContent>
          </Card>

          {/* Project Management */}
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <LayoutGrid className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Project Organization</CardTitle>
              <CardDescription>
                Manage work, client, and personal projects with ease
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Categorized project views</li>
                <li>• Budget and time tracking</li>
                <li>• Resource management</li>
              </ul>
            </CardContent>
          </Card>

          {/* Todo Management */}
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <CheckSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Smart Task Management</CardTitle>
              <CardDescription>
                Advanced todo system with energy levels and priorities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Energy-based task matching</li>
                <li>• Bulk actions and filtering</li>
                <li>• Due date management</li>
              </ul>
            </CardContent>
          </Card>

          {/* Focus Sessions */}
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <Timer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>Pomodoro Focus</CardTitle>
              <CardDescription>
                Maintain deep focus with structured work sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Customizable timer sessions</li>
                <li>• Multi-task focus blocks</li>
                <li>• Session analytics</li>
              </ul>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <CardTitle>Progress Insights</CardTitle>
              <CardDescription>
                Track your productivity patterns and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Session history tracking</li>
                <li>• Productivity metrics</li>
                <li>• Goal achievement stats</li>
              </ul>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>Personalization</CardTitle>
              <CardDescription>
                Customize your experience with themes and accessibility options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Dark/light theme support</li>
                <li>• Accessibility features</li>
                <li>• Sync preferences</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of professionals who have transformed their productivity with Clarity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/today">
                    Start Your Journey <Target className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/focus">
                    Try Focus Mode <Zap className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No signup required • Start organizing immediately
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-gray-950/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <FocusIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">Clarity</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-muted-foreground">Productivity Redefined</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/today" className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/focus" className="hover:text-foreground transition-colors">
                Focus Mode
              </Link>
              <Link href="/settings" className="hover:text-foreground transition-colors">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}