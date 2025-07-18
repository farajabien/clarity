// filepath: /Users/farajabien/Desktop/webapps/clarity/components/layout/app-sidebar.tsx
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Home, CheckSquare, Briefcase, DollarSign, User, Focus, Settings } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { useHydratedStore } from "@/hooks/use-hydrated-store";
import { useMemo } from "react";

export function AppSidebar() {
  const { projects, isHydrated } = useHydratedStore();

  const projectCounts = useMemo(() => {
    if (!isHydrated) {
      return { work: 0, client: 0, personal: 0 };
    }
    
    const projectList = Object.values(projects);
    return {
      work: projectList.filter(p => p.category === 'work' && !p.archived).length,
      client: projectList.filter(p => p.category === 'client' && !p.archived).length,
      personal: projectList.filter(p => p.category === 'personal' && !p.archived).length,
    };
  }, [projects, isHydrated]);

  const navItems = [
    { title: "Today", href: "/today", icon: Home },
    { title: "Todos", href: "/todos", icon: CheckSquare },
    { title: "Work", href: "/work", icon: Briefcase, count: projectCounts.work },
    { title: "Client", href: "/client", icon: DollarSign, count: projectCounts.client },
    { title: "Personal", href: "/personal", icon: User, count: projectCounts.personal },
    { title: "Focus", href: "/focus", icon: Focus },
    { title: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <span className="text-xl font-bold tracking-tight">Clarity</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {item.count}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="flex items-center justify-between px-2 py-4">
          <ThemeToggle />
          <Avatar />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;