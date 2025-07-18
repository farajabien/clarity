"use client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ThemeToggle } from "@/components/theme-toggle";
import { AddProjectDialog } from "@/components/layout/add-project-dialog";
import { AddTodoDialog } from "@/components/layout/add-todo-dialog";
import { AuthGate } from "@/components/layout/auth-gate";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Plus, FolderPlus } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

export function HeaderBar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Helper function to format segment names
  const formatSegmentName = (seg: string) => {
    // Handle special cases
    const specialCases: Record<string, string> = {
      'todos': 'Todos',
      'dashboard': 'Dashboard',
      'settings': 'Settings',
      'project': 'Project',
      'focus': 'Focus',
      'work': 'Work',
      'client': 'Client',
      'personal': 'Personal',
      'today': 'Today'
    };
    
    return specialCases[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-background px-4 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="lg:hidden" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {segments.length > 0 && segments.map((seg, i) => (
              <Fragment key={`breadcrumb-${i}`}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {i === segments.length - 1 ? (
                    <BreadcrumbPage>
                      {formatSegmentName(seg)}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={"/" + segments.slice(0, i + 1).join("/")}>
                        {formatSegmentName(seg)}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        {/* Show quick actions on desktop, and mobile dropdown on small screens */}
        <div className="hidden sm:flex items-center gap-2">
          <AddProjectDialog>
            <Button size="sm" className="gap-2">
              <FolderPlus className="h-4 w-4" />
              <span className="hidden lg:inline">Add Project</span>
            </Button>
          </AddProjectDialog>
          <AddTodoDialog>
            <Button size="sm" variant="secondary" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden lg:inline">Add Todo</span>
            </Button>
          </AddTodoDialog>
        </div>
        
        {/* Mobile actions dropdown */}
        <div className="sm:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="flex flex-col gap-2">
                <AddProjectDialog>
                  <Button variant="ghost" size="sm" className="justify-start gap-2">
                    <FolderPlus className="h-4 w-4" />
                    Add Project
                  </Button>
                </AddProjectDialog>
                <AddTodoDialog>
                  <Button variant="ghost" size="sm" className="justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Add Todo
                  </Button>
                </AddTodoDialog>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <ThemeToggle />
        <AuthGate />
      </div>
    </header>
  );
}

export default HeaderBar;