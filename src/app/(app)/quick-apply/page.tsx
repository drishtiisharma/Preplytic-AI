"use client";

import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChevronRight,
  ChevronDown,
  FileText,
  Sparkles,
  ArrowRight,
  Check,
  X,
  TrendingUp,
  AlertTriangle,
  Info,
  PenTool,
  Mail,
  Users,
  ExternalLink
} from "lucide-react";

// Mock Data
const steps = [
  { id: 1, title: "Select Job Profile", desc: "Choose a job you want to apply for", active: false },
  { id: 2, title: "Upload Resume", desc: "Upload your latest resume", active: false },
  { id: 3, title: "AI Analysis", desc: "We analyze and match your profile", active: false },
  { id: 4, title: "Results & Actions", desc: "Get insights and take action", active: true },
];

const selectedJob = {
  title: "Software Engineer",
  company: "Google",
  location: "Bengaluru, India",
  logoChar: "G",
  logoColor: "text-blue-600 bg-blue-50"
};

const selectedResume = {
  filename: "Jane_Doe_Resume_2026.pdf",
  uploadDate: "Oct 15, 2026",
  size: "512 KB"
};

const matchData = {
  overallScore: 72,
  atsScore: 78,
  matchedSkills: ["JavaScript", "React", "TypeScript", "Node.js", "PostgreSQL"],
  missingSkills: ["System Design", "AWS", "Docker", "Kubernetes", "CI/CD"],
  totalMatched: 12,
  totalMissing: 8
};

const insights = [
  { type: "success", text: "Your experience with React, Node.js and databases aligns strongly with this role.", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
  { type: "warning", text: "Adding projects related to AWS, Docker and System Design can improve your match.", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  { type: "info", text: "Consider highlighting more metrics and impact in your work experience.", icon: Info, color: "text-blue-500", bg: "bg-blue-50" }
];

const recommendedActions = [
  { title: "Optimize Resume", desc: "Get AI suggestions to improve your resume for this job.", buttonText: "Optimize Now", icon: PenTool },
  { title: "Generate HR Email", desc: "Generate a personalized cold email to the hiring manager.", buttonText: "Generate Email", icon: Mail },
  { title: "Referral Message", desc: "Create a referral message to reach out to your network.", buttonText: "Create Message", icon: Users },
  { title: "View Job & Apply", desc: "Open the original job posting and apply directly.", buttonText: "View Job", icon: ExternalLink, external: true }
];

export default function QuickApplyPage() {
  return (
    <PageContainer>
      <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Quick Apply</h1>
          <p className="text-muted-foreground text-[15px] mt-1.5 max-w-3xl">
            Find out how well your resume matches a job and get AI-powered insights, resume improvement tips, and personalized outreach messages.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-center gap-2 lg:gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {steps.map((step, i) => (
            <React.Fragment key={step.id}>
              <Card className="flex-1 min-w-[240px] rounded-2xl border-slate-200 shadow-sm p-4 bg-white dark:bg-card flex items-center gap-4 shrink-0">
                <div className={"w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 " + (step.active ? "bg-teal-500 text-white" : "bg-teal-50 text-teal-600 dark:bg-teal-950/40")}>
                  {step.id}
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900 dark:text-white">{step.title}</h4>
                  <p className="text-[12px] text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </Card>
              {i < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 text-slate-300 hidden md:block shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Selectors Bar */}
        <div className="flex flex-col lg:flex-row items-center gap-6 p-1">
          
          <div className="flex-1 w-full space-y-2">
            <label className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 pl-1">Select Job Profile</label>
            <div className="w-full h-16 rounded-2xl border border-slate-200 bg-white dark:bg-card dark:border-border px-4 flex items-center justify-between cursor-pointer hover:border-teal-200 transition-colors shadow-sm">
              <div className="flex items-center gap-3">
                <div className={"w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] " + selectedJob.logoColor}>
                  {selectedJob.logoChar}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">{selectedJob.title}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5">{selectedJob.company} • {selectedJob.location}</p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="flex-1 w-full space-y-2">
            <label className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 pl-1">Select Resume</label>
            <div className="w-full h-16 rounded-2xl border border-slate-200 bg-white dark:bg-card dark:border-border px-4 flex items-center justify-between cursor-pointer hover:border-teal-200 transition-colors shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-500 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">{selectedResume.filename}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5">Uploaded on {selectedResume.uploadDate} • {selectedResume.size}</p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="flex-none w-full lg:w-[220px] pt-6 space-y-2">
            <Button className="w-full h-14 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white shadow-sm font-medium text-[15px]">
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze Now
            </Button>
            <p className="text-[11px] text-slate-400 text-center">This may take a few moments</p>
          </div>

        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* Match Score */}
          <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card flex flex-col items-center text-center">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-6 self-start">Overall Match Score</h3>
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-[8px] border-teal-500 text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {matchData.overallScore}%
            </div>
            <p className="text-[16px] font-bold text-teal-600">Good Match</p>
            <p className="text-[13px] text-slate-500 mt-1 mb-6">You are a good fit for this role.</p>
            <Button variant="outline" className="w-full mt-auto h-10 border-slate-200 text-slate-700 font-medium justify-between group">
              View Match Breakdown
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          {/* ATS Score */}
          <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card flex flex-col items-center text-center">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-6 self-start">ATS Score</h3>
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-[8px] border-blue-500 text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {matchData.atsScore}/100
            </div>
            <p className="text-[16px] font-bold text-blue-600">Good</p>
            <p className="text-[13px] text-slate-500 mt-1 mb-6">Your resume is ATS-friendly.</p>
            <Button variant="outline" className="w-full mt-auto h-10 border-slate-200 text-slate-700 font-medium justify-between group">
              Improve ATS Score
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          {/* Matched Skills */}
          <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card flex flex-col">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">Top Skills Matched</h3>
            <div className="space-y-4 mb-6">
              {matchData.matchedSkills.map((skill) => (
                <div key={skill} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-500" />
                  </div>
                  <span className="text-[14px] font-medium text-slate-700 dark:text-slate-300">{skill}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-auto h-10 border-slate-200 text-slate-700 font-medium justify-between group">
              View All Matched Skills ({matchData.totalMatched})
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          {/* Missing Skills */}
          <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card flex flex-col">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">Top Skills Missing</h3>
            <div className="space-y-4 mb-6">
              {matchData.missingSkills.map((skill) => (
                <div key={skill} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <X className="w-3 h-3 text-red-500" />
                  </div>
                  <span className="text-[14px] font-medium text-slate-700 dark:text-slate-300">{skill}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-auto h-10 border-slate-200 text-slate-700 font-medium justify-between group">
              View All Missing Skills ({matchData.totalMissing})
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
          
          {/* AI Insights */}
          <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-teal-500" />
              <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">AI Insights</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              {insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={"w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 " + insight.bg}>
                    <insight.icon className={"w-4 h-4 " + insight.color} />
                  </div>
                  <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {insight.text}
                  </p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-auto h-10 border-slate-200 text-slate-700 font-medium justify-between group">
              View Detailed Analysis
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          {/* Recommended Actions */}
          <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-teal-500" />
              <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">Recommended Actions</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 h-full">
              {recommendedActions.map((action, i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/50 dark:bg-slate-900/20 dark:border-slate-800 p-5 flex flex-col h-full">
                  <div className="mb-4">
                    <action.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <h4 className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight mb-2">{action.title}</h4>
                  <p className="text-[12px] text-slate-500 leading-relaxed mb-6 flex-1">
                    {action.desc}
                  </p>
                  <Button variant="outline" className={"w-full h-9 text-[12px] font-medium border-teal-200 text-teal-700 bg-white hover:bg-teal-50 dark:border-teal-900/50 dark:text-teal-400 dark:bg-card justify-center"}>
                    {action.buttonText}
                    {action.external && <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-70" />}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </PageContainer>
  );
}