"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageContainer } from "@/components/layout/PageContainer";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { 
  StopCircle,
  Settings,
  Briefcase,
  Clock,
  BarChart,
  CheckCircle2,
  Sparkles,
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Download,
  MessageSquare,
  Play
} from "lucide-react";

// Mock Data


export default function AIInterviewPage() {
  const supabase = createClient();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [interviewState, setInterviewState] = useState({ status: "setup", timeElapsed: "00:00", currentQuestion: "", isAiSpeaking: false });

  const [jobProfiles, setJobProfiles] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [numberOfQuestions, setNumberOfQuestions] = useState<string>("1");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Hard");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [topicSource, setTopicSource] = useState<"resume" | "jd">("resume");
  
  const [availableResumeTopics, setAvailableResumeTopics] = useState<string[]>([]);
  const [selectedResumeTopics, setSelectedResumeTopics] = useState<string[]>([]);
  
  const toggleResumeTopic = (topic: string) => {
    setSelectedResumeTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };
  
  const [availableJobTopics, setAvailableJobTopics] = useState<string[]>([]);
  const [selectedJobTopics, setSelectedJobTopics] = useState<string[]>([]);
  
  const toggleJobTopic = (topic: string) => {
    setSelectedJobTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  useEffect(() => {
    async function loadJobs() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [jobsRes, resumesRes, profileRes] = await Promise.all([
        supabase.from("job_profiles").select("id, title, company, required_skills").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("resume_records").select("id, file_name").eq("user_id", user.id).order("uploaded_at", { ascending: false }),
        supabase.from("candidate_profiles").select("skills").eq("id", user.id).single()
      ]);
      
      if (jobsRes.data) {
        setJobProfiles(jobsRes.data);
      }
      if (resumesRes.data) {
        setResumes(resumesRes.data);
      }
      if (profileRes.data && Array.isArray(profileRes.data.skills)) {
        // Map string array of skills or extract name if they are objects
        const skills = profileRes.data.skills.map((s: any) => typeof s === 'string' ? s : s.name).filter(Boolean);
        setAvailableResumeTopics(skills);
        setSelectedResumeTopics(skills); // Select all by default
      }
    }
    loadJobs();
  }, []);

  // Update JD topics when selected Job changes
  useEffect(() => {
    if (selectedJobId) {
      const job = jobProfiles.find(j => j.id === selectedJobId);
      if (job && job.required_skills) {
        const skills = job.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean);
        setAvailableJobTopics(skills);
        setSelectedJobTopics(skills); // Select all by default
      } else {
        setAvailableJobTopics([]);
        setSelectedJobTopics([]);
      }
    }
  }, [selectedJobId, jobProfiles]);

  const handleStartInterview = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedJobId) newErrors.job = "Job Profile is required";
    if (!selectedResumeId) newErrors.resume = "Resume is required";
    if (!numberOfQuestions) newErrors.questions = "Number of questions is required";
    if (!selectedDifficulty) newErrors.difficulty = "Difficulty is required";
    if (selectedJobTopics.length === 0 && selectedResumeTopics.length === 0) {
      newErrors.topics = "At least one topic (JD or Resume) must be selected";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setErrors({ submit: "You must be logged in to start an interview." });
          return;
        }

        const questionsCount = parseInt(numberOfQuestions) || 1;

        const { data, error } = await supabase
          .from("interview_sessions")
          .insert({
            user_id: user.id,
            job_profile_id: selectedJobId,
            resume_id: selectedResumeId,
            number_of_questions: questionsCount,
            selected_jd_topics: selectedJobTopics,
            selected_resume_topics: selectedResumeTopics,
            difficulty: selectedDifficulty,
            status: "created"
          })
          .select()
          .single();

        if (error) {
          console.error(error);
          setErrors({ submit: "Failed to create interview session. Please try again." });
        } else if (data) {
          router.push(`/interview/${data.id}`);
        }
      } catch (err) {
        console.error(err);
        setErrors({ submit: "An unexpected error occurred." });
      }
    }
  };

  return (
    <PageContainer>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-6 h-full min-h-[calc(100vh-6rem)] flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">AI Interview Preparation</h1>
            <p className="text-muted-foreground text-[15px] mt-1 max-w-2xl">
              Practice answering questions dynamically tailored to your resume and the job description.
            </p>
          </div>
          <div className="flex items-center shrink-0">
            <Button variant="destructive" className="h-10 rounded-xl font-medium shadow-sm">
              <StopCircle className="w-4 h-4 mr-2" />
              End Interview
            </Button>
          </div>
        </div>

        {/* 3 Columns Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr_380px] gap-6 flex-1 min-h-0">
          
          {/* 1. Interview Setup Column */}
          <div className="flex flex-col gap-6 overflow-y-auto pr-1">
            <Card className="rounded-3xl border-slate-200 shadow-sm p-5 bg-white dark:bg-card">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">Interview Setup</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Target Job</label>
                  <Select value={selectedJobId} onValueChange={(val) => setSelectedJobId(val as string)}>
                    <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border-slate-100 dark:border-border h-11 shadow-none">
                      <SelectValue placeholder="Select Job Profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobProfiles.map((job: any) => (
                        <SelectItem key={job.id} value={job.id}>{job.title} at {job.company}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Number of Questions</label>
                      <Select value={numberOfQuestions} onValueChange={(val) => setNumberOfQuestions(val as string)}>
                        <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border-slate-100 dark:border-border h-[42px] shadow-none flex items-center gap-2 px-2.5">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <div className="flex-1 text-left text-[13px] font-medium text-slate-700 dark:text-slate-300"><SelectValue placeholder="Select Number of Questions" /></div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Question</SelectItem>
                        <SelectItem value="3">3 Questions</SelectItem>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        </SelectContent>
                  </Select>
                </div>
                  <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Difficulty</label>
                      <Select value={selectedDifficulty} onValueChange={(val) => setSelectedDifficulty(val as string)}>
                        <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border-slate-100 dark:border-border h-[42px] shadow-none flex items-center gap-2 px-2.5">
                          <BarChart className={`w-4 h-4 shrink-0 ${selectedDifficulty === "Hard" ? "text-red-400" : selectedDifficulty === "Medium" ? "text-amber-500" : "text-emerald-500"}`} />
                          <div className="flex-1 text-left text-[13px] font-medium text-slate-700 dark:text-slate-300"><SelectValue placeholder="Select Difficulty" /></div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                  </Select>
                </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Baseline Resume</label>
                  <Select value={selectedResumeId} onValueChange={(val) => setSelectedResumeId(val as string)}>
                    <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border-slate-100 dark:border-border h-11 shadow-none">
                      <SelectValue placeholder="Select Resume" />
                    </SelectTrigger>
                    <SelectContent>
                      {resumes.map((res: any) => (
                        <SelectItem key={res.id} value={res.id}>{res.file_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.resume && <p className="text-red-500 text-[11px] font-medium mt-1">{errors.resume}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Topic Source</label>
                  <Select value={topicSource} onValueChange={(val: any) => setTopicSource(val)}>
                    <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border-slate-100 dark:border-border h-11 shadow-none">
                      <SelectValue placeholder="Select Topic Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resume">Resume Topics</SelectItem>
                      <SelectItem value="jd">Job Description Topics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                    Available {topicSource === "resume" ? "Resume" : "JD"} Topics
                  </label>
                  
                  {topicSource === "resume" && availableResumeTopics.length === 0 && (
                    <p className="text-[12px] text-slate-500">No skills found in Candidate Profile.</p>
                  )}
                  {topicSource === "jd" && availableJobTopics.length === 0 && (
                    <p className="text-[12px] text-slate-500">No required skills found in selected Job Profile.</p>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {topicSource === "resume" ? availableResumeTopics.map(topic => {
                      const isSelected = selectedResumeTopics.includes(topic);
                      return (
                        <button 
                          key={topic}
                          onClick={() => toggleResumeTopic(topic)}
                          className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                            isSelected 
                              ? "bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 border-teal-100/50 dark:border-teal-900/30" 
                              : "bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    }) : availableJobTopics.map(topic => {
                      const isSelected = selectedJobTopics.includes(topic);
                      return (
                        <button 
                          key={topic}
                          onClick={() => toggleJobTopic(topic)}
                          className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                            isSelected 
                              ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-100/50 dark:border-indigo-900/30" 
                              : "bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                   {errors.topics && <p className="text-red-500 text-[11px] font-medium mt-1">{errors.topics}</p>}
                </div>

                {errors.submit && <p className="text-red-500 text-[13px] font-medium mt-2 text-center">{errors.submit}</p>}
                {errors.submit && <p className="text-red-500 text-[13px] font-medium mt-2 text-center">{errors.submit}</p>}
                <Button onClick={handleStartInterview} disabled={isGenerating} className="w-full h-12 rounded-xl bg-teal-500 hover:bg-teal-600 text-white shadow-sm font-bold text-[14px] mt-2">
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2 fill-current" />
                      Start Interview
                    </>
                  )}
                </Button>
              </div>
            </Card>

            <Card className="rounded-2xl border-transparent bg-gradient-to-br from-[#f0fbf9] to-white dark:from-teal-950/20 dark:to-card shadow-sm p-4 border border-teal-100/50 dark:border-teal-900/30 mt-auto">
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                <p className="text-[12px] text-teal-800 dark:text-teal-300 font-medium leading-relaxed">
                  The AI will automatically adapt follow-up questions based on your answers to simulate a real interview environment.
                </p>
              </div>
            </Card>
          </div>

          {/* 2. AI Interviewer Column */}
          <div className="flex flex-col gap-6">
            <Card className="flex-1 rounded-3xl border-slate-200 shadow-sm bg-white dark:bg-card overflow-hidden flex flex-col relative min-h-[400px]">
              
              {/* Top Bar inside interviewer */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">Live</span>
                  <span className="text-[12px] font-medium text-slate-500 ml-1 border-l border-slate-300 dark:border-slate-700 pl-2">{interviewState.timeElapsed}</span>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                  <Bot className="w-4 h-4 text-teal-500" />
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">AI Interviewer</span>
                </div>
              </div>

              {/* Central Animation Area */}
              <div className="flex-1 bg-slate-50 dark:bg-[#0c1015] flex flex-col items-center justify-center relative">
                
                {/* Decorative background circles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                  <div className="w-64 h-64 border border-teal-500/10 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                  <div className="absolute w-96 h-96 border border-teal-500/5 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-1000" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 shadow-xl flex items-center justify-center mb-8 border-4 border-white dark:border-slate-800 relative">
                    <Bot className="w-14 h-14 text-white" />
                    {interviewState.isAiSpeaking && (
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                        <Volume2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Soundwave representation */}
                  <div className="flex items-end justify-center gap-1.5 h-12">
                    {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((val, i) => (
                      <div 
                        key={i} 
                        className={"w-1.5 rounded-full bg-teal-500/80 transition-all duration-150 " + (interviewState.isAiSpeaking ? ("h-" + (val * 2 + 2)) : "h-2")}
                        style={{ animation: interviewState.isAiSpeaking ? 'pulse-y 1s ease-in-out infinite alternate' : 'none', animationDelay: i * 0.1 + 's' }}
                      />
                    ))}
                  </div>
                  <p className="text-[13px] font-medium text-slate-500 mt-4">AI is speaking...</p>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="p-6 bg-white dark:bg-card border-t border-slate-100 dark:border-border">
                
                {/* Current Question */}
                <div className="mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-border">
                  <p className="text-[12px] font-bold text-teal-600 dark:text-teal-400 mb-1.5 uppercase tracking-wider">Current Question</p>
                  <p className="text-[15px] font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    "{interviewState.currentQuestion}"
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 bg-white">
                    <Mic className="w-5 h-5" />
                  </Button>
                  <Button variant="destructive" className="h-14 px-8 rounded-2xl font-bold shadow-md shadow-red-500/20">
                    <PhoneOff className="w-5 h-5 mr-2" />
                    End Call
                  </Button>
                  <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 bg-white">
                    <Volume2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* 3. Live Conversation Column */}
          <Card className="rounded-3xl border-slate-200 shadow-sm bg-white dark:bg-card flex flex-col overflow-hidden xl:col-span-1 lg:col-span-2 hidden lg:flex">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-border bg-slate-50/50 dark:bg-slate-900/20 shrink-0">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Live Transcript</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                <Download className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={"flex flex-col gap-1 max-w-[85%] " + (msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start")}>
                  
                  <div className={"flex items-center gap-2 text-[11px] font-medium " + (msg.sender === "user" ? "text-slate-400 flex-row-reverse" : "text-teal-600")}>
                    {msg.sender === "ai" ? "AI Interviewer" : "You"}
                    <span className="text-slate-300 dark:text-slate-600">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢</span>
                    <span className="text-slate-400">{msg.time}</span>
                  </div>

                  <div className={"p-3.5 rounded-2xl text-[14px] leading-relaxed " + (msg.sender === "user" ? "bg-teal-500 text-white rounded-tr-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm")}>
                    {msg.text}
                  </div>
                  
                </div>
              ))}
            </div>

            {/* Speaking Indicator */}
            <div className="p-4 border-t border-slate-100 dark:border-border bg-slate-50/80 dark:bg-slate-900/50 shrink-0 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <p className="text-[12px] font-medium text-slate-500">AI is speaking...</p>
            </div>
          </Card>

        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse-y {
            0% { transform: scaleY(0.4); }
            100% { transform: scaleY(1); }
          }
        `}} />
      </div>
    </PageContainer>
  );
}