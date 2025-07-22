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
import { 
  Code2, 
  Focus, 
  CreditCard, 
  Settings, 
  Briefcase, 
  DollarSign, 
  User, 
  CheckSquare 
} from "lucide-react";
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

  // Main navigation items organized by 3 tabs
  const mainTabs = [
    { 
      title: "Programming Projects", 
      href: "/dashboard", 
      icon: Code2,
      subItems: [
        { title: "Work Projects", href: "/work", icon: Briefcase, count: projectCounts.work },
        { title: "Client Projects", href: "/client", icon: DollarSign, count: projectCounts.client },
        { title: "Personal Projects", href: "/personal", icon: User, count: projectCounts.personal },
        { title: "All Todos", href: "/todos", icon: CheckSquare },
      ]
    },
    { 
      title: "Focus Sessions", 
      href: "/focus", 
      icon: Focus 
    },
    { 
      title: "ELTIW + Loans", 
      href: "/finance", 
      icon: CreditCard,
      subItems: [
        { title: "ELTIW Tracker", href: "/finance/eltiw", icon: CreditCard },
        { title: "Loan Tracker", href: "/finance/loans", icon: DollarSign },
      ]
    }
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
          <SidebarGroupLabel>Main Tabs</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainTabs.map((tab) => (
                <div key={tab.title}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={tab.href} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <tab.icon className="h-4 w-4" />
                          <span className="font-medium">{tab.title}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {tab.subItems && (
                    <div className="ml-4 mt-1 space-y-1">
                      {tab.subItems.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild>
                            <Link href={subItem.href} className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <subItem.icon className="h-3 w-3" />
                                <span className="text-sm">{subItem.title}</span>
                              </div>
                              {subItem.count !== undefined && subItem.count > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {subItem.count}
                                </Badge>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/today" className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    <span>Today</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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