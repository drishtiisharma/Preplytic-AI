"use client";

import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Link as LinkedinIcon, 
  Camera,
  FileText,
  Eye,
  RefreshCw,
  MoreVertical,
  ArrowRight,
  UserCheck,
  TrendingUp,
  FileBadge,
  Clock
} from "lucide-react";

// Mock Data
const candidateData = {
  firstName: "Jane",
  lastName: "Doe",
  initials: "JD",
  email: "jane.doe@example.com",
  phone: "+1 234 567 8900",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/janedoe",
  experience: "4.5 years",
  currentRole: "Senior Developer",
  highestEducation: "M.S. in Computer Science",
  availability: "2 Weeks Notice",
  summary: "Experienced software engineer with 4+ years in building scalable web applications using React, Next.js, TypeScript, Node.js and PostgreSQL. Strong problem-solving skills and passion for AI-powered tools and backend systems.",
  skills: ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "Tailwind CSS"],
  additionalSkillsCount: 8,
};

const matchData = {
  overallScore: 82,
  categories: [
    { name: "Skills Match", score: 90 },
    { name: "Experience Match", score: 85 },
    { name: "Education Match", score: 95 },
    { name: "Keyword Match", score: 70 },
  ]
};

const topSkills = [
  { name: "JavaScript / TypeScript", level: "Expert", progress: 95 },
  { name: "React / Next.js", level: "Expert", progress: 90 },
  { name: "Node.js", level: "Advanced", progress: 80 },
  { name: "Python", level: "Advanced", progress: 75 },
  { name: "PostgreSQL", level: "Intermediate", progress: 60 },
];

const resumeData = {
  filename: "Jane_Doe_Resume_2026.pdf",
  uploadDate: "Oct 15, 2026",
  size: "845 KB",
};

const recentActivity = [
  { action: "Resume updated", date: "Oct 15, 2026", time: "2:30 PM", dotColor: "bg-teal-500" },
  { action: "Profile information updated", date: "Oct 10, 2026", time: "11:15 AM", dotColor: "bg-teal-500" },
  { action: "Added new skill: GraphQL", date: "Oct 8, 2026", time: "4:45 PM", dotColor: "bg-teal-500" },
  { action: "Profile created", date: "Oct 1, 2026", time: "10:00 AM", dotColor: "bg-teal-500" },
];

export default function CandidateProfilePage() {
  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto space-y-8 pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Candidate Profile</h1>
            <p className="text-muted-foreground text-[15px] mt-1">Manage your resume, skills and preferences to get better job matches.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-slate-700 font-medium bg-white hover:bg-slate-50 dark:bg-card dark:hover:bg-slate-900 dark:border-border">
              <Upload className="w-4 h-4 mr-2" />
              Upload New Resume
            </Button>
            <Button className="h-10 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-medium shadow-sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Info Card */}
        <Card className="rounded-3xl border-slate-200 shadow-sm p-6 md:p-8 bg-white dark:bg-card relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative shrink-0">
              <div className="h-28 w-28 rounded-full bg-[#f0fbf9] dark:bg-teal-950/40 flex items-center justify-center text-[40px] font-medium text-teal-700 dark:text-teal-400">
                {candidateData.initials}
              </div>
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-sm hover:bg-slate-700 transition-colors border-2 border-white dark:border-card">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-6 lg:gap-8 pt-1">
              <div className="space-y-3.5">
                <h2 className="text-[22px] font-bold text-slate-900 dark:text-white leading-none">{candidateData.firstName} {candidateData.lastName}</h2>
                <div className="space-y-2.5 text-[14px] text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{candidateData.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{candidateData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{candidateData.location}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <LinkedinIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-teal-600 hover:underline cursor-pointer">{candidateData.linkedin}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1 lg:pl-6 lg:border-l border-slate-100 dark:border-border mt-1">
                <p className="text-[13px] text-slate-500 font-medium">Experience</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{candidateData.experience}</p>
              </div>

              <div className="space-y-1 lg:pl-6 lg:border-l border-slate-100 dark:border-border mt-1">
                <p className="text-[13px] text-slate-500 font-medium">Current Role</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{candidateData.currentRole}</p>
              </div>

              <div className="space-y-1 lg:pl-6 lg:border-l border-slate-100 dark:border-border mt-1">
                <div className="mb-5">
                  <p className="text-[13px] text-slate-500 font-medium">Highest Education</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{candidateData.highestEducation}</p>
                </div>
                <div>
                  <p className="text-[13px] text-slate-500 font-medium">Availability</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{candidateData.availability}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full space-y-6">
          <TabsList className="bg-transparent border-b border-border w-full justify-start h-auto p-0 rounded-none space-x-6 overflow-x-auto overflow-y-hidden">
            {["Overview", "Skills", "Resume", "Work Experience", "Education", "Certifications", "Preferences"].map((tab) => (
              <TabsTrigger 
                key={tab}
                value={tab.toLowerCase()} 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-teal-500 rounded-none px-0 pb-3 pt-2 text-[15px] font-medium text-slate-500 hover:text-slate-700 data-[state=active]:text-teal-600 whitespace-nowrap"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
              
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* Profile Summary */}
                <Card className="rounded-2xl border-slate-100 shadow-sm p-6 bg-white dark:bg-card">
                  <div className="flex items-center gap-2 mb-4">
                    <UserCheck className="w-5 h-5 text-teal-500" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Summary</h3>
                  </div>
                  <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {candidateData.summary}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {candidateData.skills.map((skill) => (
                      <span key={skill} className="inline-flex items-center px-3 py-1 rounded-lg bg-[#f0fbf9] dark:bg-teal-950/30 text-[13px] font-medium text-teal-700 dark:text-teal-300">
                        {skill}
                      </span>
                    ))}
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[13px] font-medium text-slate-600 dark:text-slate-400">
                      +{candidateData.additionalSkillsCount} more
                    </span>
                  </div>
                </Card>

                {/* Top Skills */}
                <Card className="rounded-2xl border-slate-100 shadow-sm p-6 bg-white dark:bg-card">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-teal-500" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Skills</h3>
                  </div>
                  <div className="space-y-5">
                    {topSkills.map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between text-[14px]">
                        <span className="font-medium text-slate-700 dark:text-slate-300 w-40">{skill.name}</span>
                        <Progress value={skill.progress} className="h-2 flex-1 mx-4 bg-slate-100 dark:bg-slate-800 [&>div]:bg-teal-500" />
                        <span className="text-slate-500 w-20 text-right">{skill.level}</span>
                      </div>
                    ))}
                  </div>
                </Card>

              </div>

              {/* Right Column */}
              <div className="space-y-6">
                
                {/* Overall Match Score */}
                <Card className="rounded-2xl border-slate-100 shadow-sm p-6 bg-white dark:bg-card">
                  <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-6">Overall Match Score (All Jobs)</h3>
                  
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    
                    <div className="flex flex-col items-center shrink-0">
                      <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-[6px] border-teal-500 text-3xl font-bold text-slate-900 dark:text-white shadow-sm">
                        {matchData.overallScore}%
                      </div>
                      <span className="text-teal-600 font-semibold mt-3">Good Match</span>
                      <span className="text-[12px] text-slate-400 mt-1">Keep optimizing!</span>
                    </div>

                    <div className="flex-1 w-full space-y-4">
                      {matchData.categories.map((cat) => (
                        <div key={cat.name} className="space-y-1.5">
                          <div className="flex justify-between text-[13px] font-medium">
                            <span className="text-slate-600 dark:text-slate-300">{cat.name}</span>
                            <span className="text-slate-900 dark:text-slate-100">{cat.score}%</span>
                          </div>
                          <Progress value={cat.score} className="h-1.5 bg-slate-100 dark:bg-slate-800 [&>div]:bg-teal-500" />
                        </div>
                      ))}
                      <Button variant="outline" className="w-full h-10 mt-2 text-[14px] border-slate-200 text-slate-700 justify-between group">
                        View Match Insights
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>

                  </div>
                </Card>

                {/* Resume Card & Recent Activity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Resume */}
                  <Card className="rounded-2xl border-slate-100 shadow-sm p-5 bg-white dark:bg-card flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <FileBadge className="w-5 h-5 text-teal-500" />
                      <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">Resume</h3>
                    </div>
                    
                    <div className="border border-slate-100 dark:border-border rounded-xl p-3 flex items-start gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                      <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 truncate">{resumeData.filename}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Uploaded on {resumeData.uploadDate} • {resumeData.size}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="mt-auto space-y-2 pt-4">
                      <Button variant="outline" className="w-full h-10 bg-white border-slate-200 text-slate-700 font-medium">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Resume
                      </Button>
                      <Button variant="ghost" className="w-full h-10 text-teal-600 hover:text-teal-700 hover:bg-teal-50/50 font-medium">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Replace Resume
                      </Button>
                    </div>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="rounded-2xl border-slate-100 shadow-sm p-5 bg-white dark:bg-card h-full">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                      <button className="text-[13px] font-medium text-teal-600 hover:underline">View All</button>
                    </div>
                    
                    <div className="space-y-4 pl-1">
                      {recentActivity.map((activity, i) => (
                        <div key={i} className="flex gap-4 relative">
                          {i !== recentActivity.length - 1 && (
                            <div className="absolute left-1 top-5 bottom-[-16px] w-[2px] bg-slate-100 dark:bg-slate-800" />
                          )}
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 z-10 ${activity.dotColor} shadow-[0_0_0_4px_white] dark:shadow-[0_0_0_4px_#09090b]`} />
                          <div>
                            <p className="text-[13px] font-medium text-slate-800 dark:text-slate-200">{activity.action}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{activity.date} • {activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  
                </div>

              </div>
            </div>
          </TabsContent>

          {["skills", "resume", "work experience", "education", "certifications", "preferences"].map((tab) => (
            <TabsContent key={tab} value={tab.replace(' ', '-')} className="mt-0">
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                Content for {tab} tab.
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
      </div>
    </PageContainer>
  );
}