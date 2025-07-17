"use client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import { Toaster, toast } from "sonner";
import Link from "next/link";

export function HeaderBar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
      <div className="flex items-center gap-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((seg, i) => (
            <BreadcrumbItem key={i}>
              <BreadcrumbLink asChild>
                <Link href={"/" + segments.slice(0, i + 1).join("/")}>{seg}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
        <div className="flex items-center gap-2">
          <Button onClick={() => toast.success("Project added!")}>Add Project</Button>
          <Button variant="secondary" onClick={() => toast.info("Todo added!")}>Add Todo</Button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Popover>
          <PopoverTrigger asChild>
            <Avatar />
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="flex flex-col gap-2">
              <Link href="/settings" className="text-sm">Settings</Link>
              <Button variant="outline" size="sm">Logout</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Toaster />
    </header>
  );
}

export default HeaderBar;