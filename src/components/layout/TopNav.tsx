"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Bell, Menu, User, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "About Us", href: "#about" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact Us", href: "#contact" },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <header className="sticky top-0 z-30 w-full shrink-0 bg-white/80 backdrop-blur-md border-b border-zinc-100 dark:bg-zinc-950/80 dark:border-zinc-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-40 shrink-0">
                <img src="/logo.png" alt="Preplytic AI" className="h-full w-full object-contain object-left dark:brightness-200 dark:contrast-100" />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 flex items-center gap-1"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Help */}
            <div className="hidden md:flex items-center mr-2">
              <Link href="#help" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 flex items-center gap-1">
                <HelpCircle className="w-4 h-4" />
                Help
              </Link>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="rounded-full text-zinc-600 dark:text-zinc-400">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
            
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" className="rounded-full p-1 pl-1 pr-3 flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white shrink-0 overflow-hidden">
                    {user?.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : user?.user_metadata?.full_name ? (
                      <span className="text-sm font-medium">{user.user_metadata.full_name.charAt(0).toUpperCase()}</span>
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden sm:block truncate max-w-[120px]">
                    {user?.user_metadata?.full_name || "My Account"}
                  </span>
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/');
                }} className="text-red-600 focus:text-red-600">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger render={
                <Button variant="ghost" size="icon" className="lg:hidden ml-1">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              } />
              <SheetContent side="left" className="w-72 p-0 flex flex-col h-full bg-white dark:bg-zinc-950">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                  <Link href="/" className="flex items-center gap-2 mb-6">
                    <div className="relative h-10 w-40 shrink-0">
                      <img src="/logo.png" alt="Preplytic AI" className="h-full w-full object-contain object-left dark:brightness-200 dark:contrast-100" />
                    </div>
                  </Link>
                  <nav className="flex flex-col gap-3">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                      >
                        {link.name}
                      </Link>
                    ))}
                    <Link href="#help" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 mt-2 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" /> Help
                    </Link>
                  </nav>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 ml-2">Dashboard</p>
                  </div>
                  {/* The Sidebar is wrapped to inherit the menu styles gracefully */}
                  <Sidebar />
                </div>
              </SheetContent>
            </Sheet>

          </div>
        </div>
      </div>
    </header>
  );
}