import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FAQ } from "@/components/landing/FAQ";
import { ContactUs } from "@/components/landing/ContactUs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <FAQ />
        <ContactUs />
      </main>
      
      {/* Simple Footer */}
      <footer className="py-8 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} Preplytic AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
