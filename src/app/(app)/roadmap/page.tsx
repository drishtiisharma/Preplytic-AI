"use client";

import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  RefreshCw, Clock,
  Code2,
  MonitorPlay,
  Database,
  Rocket,
  ChevronDown,
  ArrowUpCircle,
  PlayCircle,
  BookOpen,
  Link2,
  ArrowRight,
  Bot,
  Sparkles
} from "lucide-react";

const summaryData = {
  targetRole: "Software Engineer",
  company: "Google",
  matchScore: 72,
  skillsToImprove: 8,
  estimatedTime: "8-10 weeks",
  hoursPerWeek: "~ 5-7 hrs / week"
};

const roadmapStages = [
  {
    id: 1,
    weekRange: "Weeks 1-2",
    title: "Strengthen Core Fundamentals",
    desc: "Build a strong foundation in CS fundamentals and problem-solving.",
    progress: 40,
    skills: ["Data Structures", "Algorithms", "Time Complexity", "Problem Solving"],
    icon: Code2,
    colorTheme: { bg: "bg-teal-50 dark:bg-teal-950/40", text: "text-teal-600 dark:text-teal-400", dot: "bg-teal-500", border: "border-teal-100 dark:border-teal-900/50" }
  },
  {
    id: 2,
    weekRange: "Weeks 3-4",
    title: "Web Development & System Design Basics",
    desc: "Improve full-stack skills and learn system design fundamentals.",
    progress: 20,
    skills: ["HTML/CSS", "JavaScript", "React.js", "Node.js", "System Design Basics"],
    icon: MonitorPlay,
    colorTheme: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500", border: "border-emerald-100 dark:border-emerald-900/50" }
  },
  {
    id: 3,
    weekRange: "Weeks 5-7",
    title: "Databases & Advanced Concepts",
    desc: "Deep dive into databases, APIs and advanced CS concepts.",
    progress: 0,
    skills: ["SQL", "Database Design", "REST APIs", "OOP in JS", "Caching"],
    icon: Database,
    colorTheme: { bg: "bg-cyan-50 dark:bg-cyan-950/40", text: "text-cyan-600 dark:text-cyan-400", dot: "bg-cyan-500", border: "border-cyan-100 dark:border-cyan-900/50" }
  },
  {
    id: 4,
    weekRange: "Weeks 8-10",
    title: "Interview Preparation & Practice",
    desc: "Practice DSA, system design and behavioral rounds.",
    progress: 0,
    skills: ["DSA Practice", "System Design", "Mock Interviews", "Behavioral Prep"],
    icon: Rocket,
    colorTheme: { bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-600 dark:text-purple-400", dot: "bg-purple-500", border: "border-purple-100 dark:border-purple-900/50" }
  }
];

const focusSkills = [
  "System Design",
  "Advanced Algorithms",
  "Distributed Systems",
  "Docker",
  "Cloud (AWS)"
];

const resources = [
  { title: "System Design Interview - Full Course", author: "YouTube • 8.5 hrs", icon: PlayCircle, color: "text-red-500" },
  { title: "Grokking the System Design Interview", author: "Book", icon: BookOpen, color: "text-slate-600 dark:text-slate-400" },
  { title: "NeetCode 150 - DSA Roadmap", author: "NeetCode", icon: Link2, color: "text-slate-600 dark:text-slate-400" }
];

export default function PreparationRoadmapPage() {
  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Preparation Roadmap</h1>
            <p className="text-muted-foreground text-[15px] mt-1 max-w-2xl">
              Your personalized plan to bridge skill gaps, improve your profile and get job-ready for your target roles.
            </p>
          </div>
          <div className="flex items-center shrink-0">
            <Button variant="outline" className="h-10 rounded-xl border-teal-200 text-teal-700 bg-teal-50/50 hover:bg-teal-50 dark:border-teal-900/50 dark:text-teal-400 dark:bg-teal-950/30 font-medium">
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-generate Roadmap
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="rounded-3xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-x-0 lg:divide-x divide-slate-100 dark:divide-border">
            
            <div className="space-y-1.5">
              <p className="text-[13px] text-slate-500 font-medium">Target Role</p>
              <p className="font-bold text-[16px] text-slate-900 dark:text-slate-100">{summaryData.targetRole}</p>
              <div className="flex items-center gap-1.5 text-[13px] text-slate-600 dark:text-slate-400 pt-1">
                <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">G</span>
                {summaryData.company}
              </div>
            </div>

            <div className="space-y-2 lg:pl-8">
              <p className="text-[13px] text-slate-500 font-medium">Overall Match Score</p>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex items-center justify-center rounded-full border-[3px] border-teal-500 text-[15px] font-bold text-slate-900 dark:text-white">
                  {summaryData.matchScore}%
                </div>
              </div>
            </div>

            <div className="space-y-1.5 lg:pl-8">
              <p className="text-[13px] text-slate-500 font-medium">Skills to Improve</p>
              <p className="font-bold text-[24px] text-slate-900 dark:text-slate-100 leading-none">{summaryData.skillsToImprove}</p>
              <p className="text-[12px] text-slate-400">High Priority</p>
            </div>

            <div className="space-y-1.5 lg:pl-8">
              <p className="text-[13px] text-slate-500 font-medium">Estimated Time</p>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <p className="font-bold text-[16px] text-slate-900 dark:text-slate-100">{summaryData.estimatedTime}</p>
              </div>
              <p className="text-[12px] text-slate-400 pt-0.5">{summaryData.hoursPerWeek}</p>
            </div>

          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-8">
          
          {/* Left Column (Tabs + Roadmap) */}
          <div className="space-y-6">
            <Tabs defaultValue="roadmap" className="w-full">
              <TabsList className="bg-transparent border-b border-border w-full justify-start h-auto p-0 rounded-none space-x-8">
                {["Roadmap", "Skill Gaps", "Milestones"].map((tab) => (
                  <TabsTrigger 
                    key={tab}
                    value={tab.toLowerCase().replace(' ', '-')} 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-teal-500 rounded-none px-0 pb-3 pt-2 text-[15px] font-medium text-slate-500 hover:text-slate-700 data-[state=active]:text-teal-600"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="roadmap" className="mt-8 space-y-8 relative">
                
                {/* Vertical Timeline Line */}
                <div className="absolute left-[15px] top-4 bottom-12 w-[2px] bg-slate-100 dark:bg-slate-800 z-0 hidden sm:block" />

                {roadmapStages.map((stage) => (
                  <div key={stage.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 relative z-10">
                    
                    {/* Timeline Node & Week */}
                    <div className="flex items-center sm:items-start gap-4 shrink-0 sm:w-28 pt-2">
                      <div className={"w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[13px] shrink-0 shadow-[0_0_0_4px_white] dark:shadow-[0_0_0_4px_#09090b] " + stage.colorTheme.dot}>
                        {stage.id}
                      </div>
                      <span className="text-[13px] font-medium text-slate-500 mt-1 sm:mt-1.5">{stage.weekRange}</span>
                    </div>

                    {/* Stage Card */}
                    <Card className={"flex-1 rounded-2xl shadow-sm bg-white dark:bg-card p-5 border " + stage.colorTheme.border}>
                      <div className="flex flex-col sm:flex-row gap-5 items-start">
                        
                        {/* Icon */}
                        <div className={"w-12 h-12 rounded-xl flex items-center justify-center shrink-0 " + stage.colorTheme.bg + " " + stage.colorTheme.text}>
                          <stage.icon className="w-6 h-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 w-full space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                            <div>
                              <h3 className="text-[16px] font-bold text-slate-900 dark:text-white leading-tight">{stage.title}</h3>
                              <p className="text-[13px] text-slate-500 mt-1">{stage.desc}</p>
                            </div>
                            
                            <div className="flex items-center gap-4 shrink-0">
                              <div className="flex flex-col items-end gap-1.5 w-20">
                                <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">{stage.progress}%</span>
                                <Progress value={stage.progress} className={"h-1.5 bg-slate-100 dark:bg-slate-800 [&>div]:" + stage.colorTheme.dot} />
                              </div>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                                <ChevronDown className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 pt-3">
                            {stage.skills.map((skill) => (
                              <span key={skill} className={"inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium " + stage.colorTheme.bg + " " + stage.colorTheme.text}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>
                    </Card>

                  </div>
                ))}

                {/* Info Banner */}
                <div className="ml-0 sm:ml-[136px] mt-6">
                  <div className="rounded-xl bg-[#f8faff] dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 p-4 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
                    <p className="text-[13px] text-indigo-900/80 dark:text-indigo-300 font-medium">
                      This roadmap is personalized using semantic analysis of your resume and the job description.
                    </p>
                  </div>
                </div>

              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column (Widgets) */}
          <div className="space-y-6">
            
            {/* Roadmap Progress */}
            <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card">
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-6">Roadmap Progress</h3>
              <div className="flex items-center gap-5 mb-6">
                <div className="relative w-20 h-20 flex items-center justify-center rounded-full border-[6px] border-slate-100 dark:border-slate-800 shrink-0">
                  {/* Faux Progress Ring overlay (25%) */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 text-teal-500" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="289" strokeDashoffset="216" className="drop-shadow-sm" />
                  </svg>
                  <span className="text-[18px] font-bold text-slate-900 dark:text-white">25%</span>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    You're on track! <span className="text-[16px]">🎉</span>
                  </h4>
                  <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">Keep going. Consistency is the key.</p>
                </div>
              </div>
              <Button variant="outline" className="w-full h-10 border-teal-200 text-teal-700 bg-teal-50/50 hover:bg-teal-50 dark:border-teal-900/50 dark:text-teal-400 dark:bg-teal-950/30 font-medium">
                View Progress Details
              </Button>
            </Card>

            {/* Focus Skills */}
            <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card">
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">Focus Skills (High Priority)</h3>
              <div className="space-y-4 mb-5">
                {focusSkills.map((skill) => (
                  <div key={skill} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ArrowUpCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{skill}</span>
                    </div>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 px-2 py-0.5 rounded-full">
                      High
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full h-9 text-[13px] text-teal-600 hover:text-teal-700 hover:bg-teal-50/50 font-medium justify-between group">
                View All Skills
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>

            {/* Recommended Resources */}
            <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Recommended Resources</h3>
                <span className="text-[12px] font-medium text-teal-600 cursor-pointer hover:underline">View All</span>
              </div>
              <div className="space-y-5 mb-5">
                {resources.map((res, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <res.icon className={"w-5 h-5 shrink-0 mt-0.5 " + res.color} />
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">{res.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{res.author}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full h-10 border-slate-200 text-slate-700 font-medium justify-between group">
                Explore Resources
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>

            {/* AI Coach Need Help */}
            <Card className="rounded-2xl border-transparent bg-gradient-to-br from-[#f0fbf9] to-white dark:from-teal-950/20 dark:to-card shadow-sm p-5 border border-teal-100/50 dark:border-teal-900/30">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Need Help?</h3>
                  <p className="text-[12px] text-slate-600 dark:text-slate-400 mt-1 mb-3">Ask our AI Coach for guidance.</p>
                  <Button variant="outline" className="h-8 px-4 text-[12px] border-teal-200 text-teal-700 bg-white hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400 dark:bg-card">
                    Ask AI Coach
                  </Button>
                </div>
              </div>
            </Card>

          </div>

        </div>
      </div>
    </PageContainer>
  );
}