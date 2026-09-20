"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sun, HelpCircle, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "About Us", href: "#about" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact Us", href: "#contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 dark:bg-zinc-950/80 dark:border-zinc-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              {/* Logo placeholder - using an icon for now, ideally an SVG */}
              <div className="relative h-10 w-40 shrink-0">
                <img src="/logo.png" alt="Preplytic AI" className="h-full w-full object-contain object-left dark:brightness-200 dark:contrast-100" />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 flex items-center gap-1"
                >
                  {link.name}
                  {link.hasDropdown && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 px-3">
                Log in
              </Link>
              <Button render={<Link href="/signup">Sign up</Link>} className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-6" />
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger render={
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              } />
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-lg font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-4" />
                  <Link href="/login" className="text-lg font-medium">
                    Log in
                  </Link>
                  <Button render={<Link href="/signup">Sign up</Link>} className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-full mt-2" />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
