"use client";

import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  subtitle: string;
  features: {
    icon: React.ElementType;
    title: string;
    description: string;
  }[];
  footerNode?: React.ReactNode;
}

export function AuthLayout({ children, title, subtitle, features, footerNode }: AuthLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        {/* Background wavy shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
           <svg className="absolute bottom-0 left-0 w-full h-auto text-mint-100/40 dark:text-teal-950/20" viewBox="0 0 1440 320" preserveAspectRatio="none" fill="currentColor">
              <path d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
           </svg>
           <svg className="absolute bottom-0 right-0 w-full h-auto text-teal-100/30 dark:text-teal-900/10" viewBox="0 0 1440 320" preserveAspectRatio="none" fill="currentColor">
              <path d="M0,128L60,149.3C120,171,240,213,360,202.7C480,192,600,128,720,106.7C840,85,960,107,1080,122.7C1200,139,1320,149,1380,154.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
           </svg>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-teal-900/5 border border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row max-w-5xl w-full z-10 overflow-hidden min-h-[600px]">
          
          {/* Left Branding Pane */}
          <div className="w-full md:w-5/12 p-10 lg:p-12 bg-gradient-to-br from-white via-mint-50/30 to-teal-100/60 dark:from-zinc-900 dark:via-teal-950/20 dark:to-teal-900/30 flex flex-col justify-between relative overflow-hidden">
             
             {/* Left side decorative wave */}
             <div className="absolute bottom-0 left-0 right-0 h-48 opacity-40 dark:opacity-20 pointer-events-none">
                 <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{height: '100%', width: '100%'}}>
                    <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{stroke: 'none', fill: '#14b8a6'}}></path>
                 </svg>
             </div>
             
             <div className="relative z-10">
               <Link href="/" className="inline-block mb-12">
                 <div className="text-teal-500 font-bold text-2xl flex items-center gap-2">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12Z" fill="currentColor"/>
                    </svg>
                    <span className="text-zinc-900 dark:text-white">Preplytic AI</span>
                  </div>
               </Link>
               
               <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight">
                 {title}
               </h1>
               
               <p className="text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed text-sm lg:text-base pr-4">
                 {subtitle}
               </p>
               
               <div className="space-y-6">
                 {features.map((feature, i) => (
                   <div key={i} className="flex items-start gap-4">
                     <div className="bg-white dark:bg-zinc-800 p-2 rounded-xl text-teal-500 shrink-0 shadow-sm border border-zinc-100 dark:border-zinc-700">
                       <feature.icon className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">{feature.title}</h3>
                       <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{feature.description}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             
             {footerNode && (
               <div className="relative z-10 mt-12 font-medium text-teal-600 dark:text-teal-400 -rotate-2 origin-left">
                  {footerNode}
               </div>
             )}
          </div>
          
          {/* Right Form Pane */}
          <div className="w-full md:w-7/12 p-8 lg:p-16 flex flex-col justify-center">
            {children}
          </div>
          
        </div>
      </main>
    </div>
  );
}
