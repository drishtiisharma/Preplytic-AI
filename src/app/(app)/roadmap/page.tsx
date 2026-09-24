"use client";

import React, { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { 
  RefreshCw, Clock,
  Code2, MonitorPlay, Database, Rocket,
  ChevronDown, ArrowUpCircle, PlayCircle, BookOpen, Link2, ArrowRight, Bot, Sparkles,
  AlertTriangle
} from "lucide-react";

type JobProfile = { id: string; title: string; company: string; };
type ResumeRecord = { id: string; file_name: string; };
type RoadmapItem = { id: string; title: string; description: string; week_start: number; week_end: number; progress: number; status: string; skills: string[]; resources: string[]; };
type Roadmap = { id: string; readiness_score: number; estimated_weeks: number; hours_per_week: number; summary: string; focus_skills: string[]; roadmap_versions: { roadmap_items: RoadmapItem[] }[]; };

const getIcon = (index: number) => {
  const icons = [Code2, MonitorPlay, Database, Rocket];
  return icons[index % icons.length];
};

const getColorTheme = (index: number) => {
  const themes = [
    { bg: "bg-teal-50 dark:bg-teal-950/40", text: "text-teal-600 dark:text-teal-400", dot: "bg-teal-500", border: "border-teal-100 dark:border-teal-900/50" },
    { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500", border: "border-emerald-100 dark:border-emerald-900/50" },
    { bg: "bg-cyan-50 dark:bg-cyan-950/40", text: "text-cyan-600 dark:text-cyan-400", dot: "bg-cyan-500", border: "border-cyan-100 dark:border-cyan-900/50" },
    { bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-600 dark:text-purple-400", dot: "bg-purple-500", border: "border-purple-100 dark:border-purple-900/50" }
  ];
  return themes[index % themes.length];
};

export default function PreparationRoadmapPage() {
  const supabase = createClient();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [jobProfiles, setJobProfiles] = useState<JobProfile[]>([]);
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [items, setItems] = useState<RoadmapItem[]>([]);

  useEffect(() => {
    async function loadInitialData() {
      setIsInitialLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const [jobsRes, resumesRes] = await Promise.all([
        supabase.from("job_profiles").select("id, title, company").eq("user_id", userData.user.id).order("created_at", { ascending: false }),
        supabase.from("resume_records").select("id, file_name").eq("user_id", userData.user.id).order("uploaded_at", { ascending: false })
      ]);

      if (jobsRes.data) setJobProfiles(jobsRes.data);
      if (resumesRes.data) setResumes(resumesRes.data);
      setIsInitialLoading(false);
    }
    loadInitialData();
  }, []);

  const handleGenerate = async () => {
    if (!selectedJobId || !selectedResumeId) {
      setError("Please select both a job profile and a resume.");
      return;
    }
    setError(null);
    setIsGenerating(true);

    try {
      let res;
      // If we already have a roadmap for this exact combo, a second click means 'update version'
      if (roadmap && roadmap.job_profile_id === selectedJobId && roadmap.resume_record_id === selectedResumeId) {
         res = await fetch(`/api/roadmap/${roadmap.id}/versions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
         });
      } else {
         // Reset state if selecting a different combo
         setRoadmap(null);
         setItems([]);
         res = await fetch("/api/roadmap/generate", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ job_profile_id: selectedJobId, resume_record_id: selectedResumeId })
         });
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      
      setRoadmap(data.data);
      // Ensure we extract items from the active version
      const activeVersion = data.data.roadmap_versions?.find((v: any) => v.version_number === data.data.current_version) || data.data.roadmap_versions?.[0];
      const sortedItems = (activeVersion?.roadmap_items || []).sort((a: any, b: any) => a.week_start - b.week_start);
      setItems(sortedItems);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateItemStatus = async (itemId: string, newProgress: number, newStatus: string) => {
    // Optimistic UI update
    setItems(currentItems => currentItems.map(item => 
      item.id === itemId ? { ...item, progress: newProgress, status: newStatus } : item
    ));

    try {
      const res = await fetch(`/api/roadmap/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: newProgress, status: newStatus })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Update failed.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to update status. Please try again.");
    }
  };

  const selectedJob = jobProfiles.find(j => j.id === selectedJobId);

  // Derive total progress for the widget
  const totalProgress = items.length > 0 
    ? Math.round(items.reduce((acc, val) => acc + val.progress, 0) / items.length) 
    : 0;

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Preparation Roadmap</h1>
            <p className="text-muted-foreground text-[15px] mt-1 max-w-2xl">
              Select a job profile and your resume to dynamically generate a targeted, step-by-step career readiness roadmap.
            </p>
          </div>
        </div>

        {/* Selection Area */}
        <Card className="rounded-3xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card">
          <div className="flex flex-col lg:flex-row items-end gap-6">
            <div className="flex-1 w-full space-y-2">
              <label className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 pl-1">Target Job Profile</label>
              <Select value={selectedJobId} onValueChange={setSelectedJobId} disabled={isInitialLoading || isGenerating}>
                <SelectTrigger className="w-full h-12 rounded-xl">
                  <SelectValue placeholder={isInitialLoading ? "Loading..." : "Select Job Profile"} />
                </SelectTrigger>
                <SelectContent>
                  {jobProfiles.map(job => (
                    <SelectItem key={job.id} value={job.id}>{job.title} at {job.company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 pl-1">Baseline Resume</label>
              <Select value={selectedResumeId} onValueChange={setSelectedResumeId} disabled={isInitialLoading || isGenerating}>
                <SelectTrigger className="w-full h-12 rounded-xl">
                  <SelectValue placeholder={isInitialLoading ? "Loading..." : "Select Resume"} />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map(res => (
                    <SelectItem key={res.id} value={res.id}>{res.file_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !selectedJobId || !selectedResumeId}
              className="h-12 px-8 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold w-full lg:w-auto"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Bot className="w-4 h-4 mr-2" />}
              {isGenerating ? "Generating Roadmap..." : roadmap ? "Re-Generate Roadmap" : "Generate Roadmap"}
            </Button>
          </div>
          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-950/40 p-3 rounded-lg border border-red-100 dark:border-red-900/50">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}
        </Card>

        {isGenerating && (
          <div className="text-center py-20 text-slate-500 animate-pulse">
            <RefreshCw className="w-10 h-10 animate-spin mx-auto text-teal-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI is crafting your roadmap...</h3>
            <p>Analyzing job requirements and identifying skill gaps.</p>
          </div>
        )}

        {/* Roadmap Display Area */}
        {roadmap && !isGenerating && (
          <>
            {/* Summary Card */}
            <Card className="rounded-3xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-x-0 lg:divide-x divide-slate-100 dark:divide-border">
                
                <div className="space-y-1.5">
                  <p className="text-[13px] text-slate-500 font-medium">Target Role</p>
                  <p className="font-bold text-[16px] text-slate-900 dark:text-slate-100 leading-tight">
                    {selectedJob?.title || "Unknown Role"}
                  </p>
                  <div className="flex items-center gap-1.5 text-[13px] text-slate-600 dark:text-slate-400 pt-1">
                    <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                      {selectedJob?.company.charAt(0)}
                    </span>
                    {selectedJob?.company}
                  </div>
                </div>

                <div className="space-y-2 lg:pl-8">
                  <p className="text-[13px] text-slate-500 font-medium">Readiness Score</p>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center rounded-full border-[3px] border-teal-500 text-[15px] font-bold text-slate-900 dark:text-white">
                      {roadmap.readiness_score}%
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 lg:pl-8">
                  <p className="text-[13px] text-slate-500 font-medium">Focus Skills</p>
                  <p className="font-bold text-[24px] text-slate-900 dark:text-slate-100 leading-none">
                    {roadmap.focus_skills?.length || 0}
                  </p>
                  <p className="text-[12px] text-slate-400">High Priority</p>
                </div>

                <div className="space-y-1.5 lg:pl-8">
                  <p className="text-[13px] text-slate-500 font-medium">Estimated Time</p>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <p className="font-bold text-[16px] text-slate-900 dark:text-slate-100">{roadmap.estimated_weeks} weeks</p>
                  </div>
                  <p className="text-[12px] text-slate-400 pt-0.5">~ {roadmap.hours_per_week} hrs / week</p>
                </div>

              </div>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-8">
              
              {/* Left Column (Tabs + Roadmap) */}
              <div className="space-y-6">
                <Tabs defaultValue="roadmap" className="w-full">
                  <TabsList className="bg-transparent border-b border-border w-full justify-start h-auto p-0 rounded-none space-x-8">
                    {["Roadmap", "Summary"].map((tab) => (
                      <TabsTrigger 
                        key={tab}
                        value={tab.toLowerCase()} 
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-teal-500 rounded-none px-0 pb-3 pt-2 text-[15px] font-medium text-slate-500 hover:text-slate-700 data-[state=active]:text-teal-600"
                      >
                        {tab}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="roadmap" className="mt-8 space-y-8 relative">
                    <div className="absolute left-[15px] top-4 bottom-12 w-[2px] bg-slate-100 dark:bg-slate-800 z-0 hidden sm:block" />

                    {items.map((stage, idx) => {
                      const IconComponent = getIcon(idx);
                      const theme = getColorTheme(idx);
                      
                      return (
                        <div key={stage.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 relative z-10">
                          
                          <div className="flex items-center sm:items-start gap-4 shrink-0 sm:w-28 pt-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[13px] shrink-0 shadow-[0_0_0_4px_white] dark:shadow-[0_0_0_4px_#09090b] ${theme.dot}`}>
                              {idx + 1}
                            </div>
                            <span className="text-[13px] font-medium text-slate-500 mt-1 sm:mt-1.5">
                              Weeks {stage.week_start}-{stage.week_end}
                            </span>
                          </div>

                          <Card className={`flex-1 rounded-2xl shadow-sm bg-white dark:bg-card p-5 border ${theme.border}`}>
                            <div className="flex flex-col sm:flex-row gap-5 items-start">
                              
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${theme.bg} ${theme.text}`}>
                                <IconComponent className="w-6 h-6" />
                              </div>

                              <div className="flex-1 min-w-0 w-full space-y-1">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                                  <div>
                                    <h3 className="text-[16px] font-bold text-slate-900 dark:text-white leading-tight">{stage.title}</h3>
                                    <p className="text-[13px] text-slate-500 mt-1">{stage.description}</p>
                                  </div>
                                  
                                  <div className="flex items-center gap-4 shrink-0">
                                    <div className="flex flex-col items-end gap-1.5 w-20">
                                      <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">{stage.progress}%</span>
                                      <Progress value={stage.progress} className={`h-1.5 bg-slate-100 dark:bg-slate-800 [&>div]:${theme.dot}`} />
                                    </div>

                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                                          <ChevronDown className="w-5 h-5" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => updateItemStatus(stage.id, 0, "not_started")}>
                                          Not Started (0%)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => updateItemStatus(stage.id, 50, "in_progress")}>
                                          In Progress (50%)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => updateItemStatus(stage.id, 100, "completed")}>
                                          Completed (100%)
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>

                                  </div>
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2 pt-3">
                                  {stage.skills?.map((skill, i) => (
                                    <span key={i} className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium ${theme.bg} ${theme.text}`}>
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                                
                                {/* Recommended Resources snippet within stage */}
                                {stage.resources?.length > 0 && (
                                  <div className="mt-4 border-t border-slate-100 dark:border-border pt-3">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Resources</p>
                                    <ul className="space-y-1">
                                      {stage.resources.map((res, i) => (
                                        <li key={i} className="text-[13px] text-teal-600 font-medium flex items-center gap-2">
                                          <Link2 className="w-3 h-3" /> {res}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        </div>
                      )
                    })}

                    <div className="ml-0 sm:ml-[136px] mt-6">
                      <div className="rounded-xl bg-[#f8faff] dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 p-4 flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
                        <p className="text-[13px] text-indigo-900/80 dark:text-indigo-300 font-medium">
                          This roadmap is personalized using semantic analysis of your resume and the job description.
                        </p>
                      </div>
                    </div>

                  </TabsContent>
                  
                  <TabsContent value="summary" className="mt-8 space-y-4">
                     <Card className="p-6 text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed rounded-2xl shadow-sm">
                       {roadmap.summary}
                     </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column (Widgets) */}
              <div className="space-y-6">
                
                <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card">
                  <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-6">Roadmap Progress</h3>
                  <div className="flex items-center gap-5 mb-6">
                    <div className="relative w-20 h-20 flex items-center justify-center rounded-full border-[6px] border-slate-100 dark:border-slate-800 shrink-0">
                      <svg className="absolute inset-0 w-full h-full -rotate-90 text-teal-500" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" 
                          strokeDasharray="289" 
                          strokeDashoffset={289 - (289 * totalProgress) / 100} 
                          className="drop-shadow-sm transition-all duration-500" 
                        />
                      </svg>
                      <span className="text-[18px] font-bold text-slate-900 dark:text-white">{totalProgress}%</span>
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {totalProgress === 100 ? "All Complete!" : totalProgress > 50 ? "Doing Great!" : "You're on track!"}
                      </h4>
                      <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">Keep going. Consistency is the key.</p>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card">
                  <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">Focus Skills (High Priority)</h3>
                  <div className="space-y-4 mb-5">
                    {roadmap.focus_skills?.map((skill, i) => (
                      <div key={i} className="flex items-center justify-between">
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
                </Card>

              </div>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}