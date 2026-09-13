"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Briefcase, 
  User, 
  Send, 
  MessageSquare, 
  Map, 
  Settings, 
  CircleUser,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Job Profiles", href: "/job-profiles", icon: Briefcase },
  { name: "Candidate Profile", href: "/candidate", icon: User },
  { name: "Quick Apply", href: "/quick-jobs", icon: Send },
  { name: "Interview Prep", href: "/interview", icon: MessageSquare },
  { name: "Preparation Roadmap", href: "/roadmap", icon: Map },
];

const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Account", href: "/account", icon: CircleUser },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div 
      className={cn(
        "relative flex h-full flex-col bg-white dark:bg-[#121214] border-r shadow-[2px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none transition-all duration-300 rounded-r-[2rem]",
        collapsed ? "w-20" : "w-[280px]"
      )}
    >
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-4 top-8 z-10 h-8 w-8 rounded-xl bg-white dark:bg-card shadow-sm hidden md:flex"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-teal-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-teal-600" />
        )}
      </Button>

      <div className={cn("flex h-24 items-center", collapsed ? "justify-center px-0" : "px-8")}>
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          {collapsed ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-mint-400 shrink-0 shadow-sm">
              <span className="font-bold text-white text-xl">P</span>
            </div>
          ) : (
            <div className="relative h-10 w-40 shrink-0">
               <Image 
                 src="/logo.png" 
                 alt="Preplytic AI" 
                 fill 
                 className="object-contain object-left dark:brightness-200 dark:contrast-100" 
                 priority
               />
            </div>
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-y-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="space-y-1.5 mt-2 flex flex-col">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={cn(
                  "relative flex items-center py-3.5 text-[15px] font-medium transition-colors rounded-r-2xl",
                  collapsed ? "pl-7 w-20" : "gap-4 pl-8 pr-4 mr-6",
                  isActive
                    ? "bg-gradient-to-r from-[#f0fbf9] to-transparent dark:from-teal-950/40 dark:to-transparent text-foreground"
                    : "text-foreground hover:bg-muted/50"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-1.5 rounded-r-full bg-teal-500" />
                )}
                <item.icon
                  className={cn(
                    "h-6 w-6 shrink-0 stroke-[1.5]",
                    isActive ? "text-teal-600 dark:text-teal-400" : "text-teal-600/80 dark:text-teal-500/80"
                  )}
                  aria-hidden="true"
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          <div className="mx-8 mb-6 h-px bg-border" />
          <nav className="space-y-1.5 flex flex-col">
            {secondaryNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    "relative flex items-center py-3.5 text-[15px] font-medium transition-colors rounded-r-2xl",
                    collapsed ? "pl-7 w-20" : "gap-4 pl-8 pr-4 mr-6",
                    isActive
                      ? "bg-gradient-to-r from-[#f0fbf9] to-transparent dark:from-teal-950/40 dark:to-transparent text-foreground"
                      : "text-foreground hover:bg-muted/50"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 h-full w-1.5 rounded-r-full bg-teal-500" />
                  )}
                  <item.icon
                    className={cn(
                      "h-6 w-6 shrink-0 stroke-[1.5]",
                      isActive ? "text-teal-600 dark:text-teal-400" : "text-teal-600/80 dark:text-teal-500/80"
                    )}
                    aria-hidden="true"
                  />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
