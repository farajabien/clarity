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
import { Home, CheckSquare, Briefcase, DollarSign, User, Focus, Settings } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar } from "@/components/ui/avatar";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Todos", href: "/dashboard?tab=todos", icon: CheckSquare },
  { title: "Work", href: "/dashboard?tab=work", icon: Briefcase },
  { title: "Client", href: "/dashboard?tab=client", icon: DollarSign },
  { title: "Personal", href: "/dashboard?tab=personal", icon: User },
  { title: "Focus", href: "/focus", icon: Focus },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
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
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
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