"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, FileText, Target, Clock, ShieldCheck, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden bg-gradient-to-br from-teal-50/50 via-white to-mint-50/30 dark:from-teal-950/20 dark:via-zinc-950 dark:to-teal-900/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-600 border border-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20 mb-8 font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              AI-Powered Career Companion
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.1]">
              Find Jobs. Prepare Smarter. <br />
              <span className="text-teal-500">Get Hired.</span>
            </h1>
            
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-lg leading-relaxed">
              Preplytic AI helps you match with the right jobs, optimize your resume, prepare for interviews and land opportunities faster.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Button asChild size="lg" className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8 h-12 text-base">
                <Link href="/signup">Get Started for Free <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-zinc-200 text-teal-600 hover:bg-teal-50 dark:border-zinc-800 dark:text-teal-400 dark:hover:bg-teal-950/50">
                <Play className="mr-2 w-4 h-4" /> Watch Demo
              </Button>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-teal-50 dark:bg-teal-500/10 p-2 rounded-lg text-teal-500 mt-1 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white text-sm mb-1">AI-Powered Insights</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Smart analysis and personalized recommendations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-teal-50 dark:bg-teal-500/10 p-2 rounded-lg text-teal-500 mt-1 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white text-sm mb-1">Save Time</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Automate applications and follow-ups</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-teal-50 dark:bg-teal-500/10 p-2 rounded-lg text-teal-500 mt-1 shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white text-sm mb-1">Better Results</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Improve your chances and interview performance</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Dashboard Mockup */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            {/* Background glowing effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-teal-500/20 to-mint-400/20 rounded-full blur-3xl -z-10 dark:from-teal-500/10 dark:to-mint-400/10 pointer-events-none"></div>
            
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl shadow-teal-900/5 border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col md:flex-row h-[500px]">
              
              {/* Sidebar */}
              <div className="w-64 border-r border-zinc-100 dark:border-zinc-800 p-4 hidden md:flex flex-col gap-6">
                <div className="flex items-center gap-2 px-2">
                  <div className="text-teal-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="font-bold text-zinc-900 dark:text-white">Preplytic AI</span>
                </div>
                
                <nav className="flex flex-col gap-1">
                  {[
                    { icon: Sparkles, label: "Dashboard", active: true },
                    { icon: Mail, label: "Job Profiles" },
                    { icon: Target, label: "Quick Apply" },
                    { icon: Clock, label: "Interview Prep" },
                    { icon: ShieldCheck, label: "My Progress" },
                    { icon: FileText, label: "Preparation Roadmap" },
                    { icon: MapPin, label: "Settings" }
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${item.active ? 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400' : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50'}`}>
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>
                  ))}
                </nav>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-900/50">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      Welcome back, Ananya <span role="img" aria-label="wave">👋</span>
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Let's get you closer to your next opportunity.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="rounded-full border border-zinc-200 dark:border-zinc-800 h-8 w-8">
                      <Clock className="w-4 h-4 text-zinc-500" />
                    </Button>
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-semibold text-sm border border-teal-200">
                      A
                    </div>
                  </div>
                </div>
                
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Job Profiles", value: "12", sub: "Active" },
                    { label: "Applications", value: "28", sub: "This Month" },
                    { label: "Interviews", value: "5", sub: "Upcoming" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{stat.value}</h3>
                      <p className="text-xs text-zinc-400 mt-1">{stat.sub}</p>
                    </div>
                  ))}
                  
                  <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm relative overflow-hidden flex flex-col justify-center items-center">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-teal-50 dark:bg-teal-500/10 rounded-full blur-xl"></div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-2">Profile Match</p>
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-zinc-100 dark:text-zinc-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-teal-500" strokeDasharray="78, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute text-xs font-bold text-zinc-900 dark:text-white">78%</span>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Row */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {/* Recent Matches */}
                  <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Recent Job Matches</h3>
                    <div className="flex flex-col gap-4 flex-1">
                      {[
                        { company: "Google", role: "Software Engineer, Backend", loc: "Bengaluru, India", match: "92%" },
                        { company: "Microsoft", role: "Backend Developer", loc: "Hyderabad, India", match: "85%" },
                        { company: "Amazon", role: "Software Engineer", loc: "Pune, India", match: "80%" }
                      ].map((job, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">
                              {job.company[0]}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-zinc-900 dark:text-white line-clamp-1">{job.role}</p>
                              <p className="text-[10px] text-zinc-500">{job.company} • {job.loc}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-teal-600 dark:text-teal-400">{job.match}</p>
                            <p className="text-[10px] text-zinc-500">Match</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="text-xs text-teal-600 font-medium flex items-center mt-4">
                      View All Matches <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                  
                  {/* Upcoming Interview */}
                  <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Upcoming Interview</h3>
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xl">
                            G
                         </div>
                         <div>
                           <p className="text-sm font-bold text-zinc-900 dark:text-white">Google</p>
                           <p className="text-xs text-zinc-500">Software Engineer, Backend</p>
                         </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                          <Clock className="w-3.5 h-3.5" />
                          May 24, 2025 • 10:00 AM
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                          <MapPin className="w-3.5 h-3.5" />
                          Online
                        </div>
                      </div>
                    </div>
                    <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-lg h-9 text-xs">
                      Prepare Now
                    </Button>
                  </div>
                </div>
                
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
    </section>
  );
}
