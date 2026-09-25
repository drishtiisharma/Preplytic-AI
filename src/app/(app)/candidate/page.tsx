import React from "react";
import { getCandidateProfile, getLatestResume } from "./actions";
import { ResumeUploader } from "@/components/candidate/ResumeUploader";
import { EditProfileDialog } from "@/components/candidate/EditProfileDialog";
import { CandidateSetupOptions } from "@/components/candidate/CandidateSetupOptions";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/server";
import { 
  Upload, Edit, Mail, Phone, MapPin, Link as LinkedinIcon, Code,
  Camera, FileText, Eye, RefreshCw, MoreVertical, ArrowRight,
  UserCheck, TrendingUp, FileBadge, Clock
} from "lucide-react";

export default async function CandidateProfilePage() {
  const profile = await getCandidateProfile();
  const latestResume = await getLatestResume();
  const supabase = await createClient();

  // Fetch job profiles to calculate match score
  const { data: jobs } = await supabase.from("job_profiles").select("*");

  const candidateData = {
    firstName: profile?.name ? profile.name.split(" ")[0] : "New",
    lastName: profile?.name ? profile.name.split(" ").slice(1).join(" ") : "Candidate",
    initials: profile?.name ? profile.name.substring(0,2).toUpperCase() : "NC",
    email: profile?.email || "Not provided",
    phone: profile?.phone || "Not provided",
    location: profile?.location || "Not provided",
    linkedin: profile?.linkedin_url || "Not provided",
    github: profile?.github_url || "Not provided",
    experience: (profile?.experience && profile.experience.length > 0) ? profile.experience[0].title || "Not specified" : "Not provided",
    currentRole: profile?.current_role || "Not provided",
    highestEducation: (profile?.education && profile.education.length > 0) ? profile.education[0].degree || "Not specified" : "Not provided",
    summary: profile?.summary || "Welcome! Please set up your profile by editing it or uploading a resume.",
    skills: profile?.skills || [],
    additionalSkillsCount: profile?.skills && profile.skills.length > 5 ? profile.skills.length - 5 : 0,
  };

  // Simple keyword matching against jobs
  let matchData = {
    overallScore: 0,
    categories: [
      { name: "Skills Match", score: 0 },
      { name: "Experience Match", score: 0 },
      { name: "Education Match", score: 0 },
      { name: "Keyword Match", score: 0 },
    ]
  };

  if (profile && jobs && jobs.length > 0) {
    let totalScore = 0;
    let skillScore = 0;
    
    jobs.forEach(job => {
      const jobSkills = (job.skills || []).map((s: string) => s.toLowerCase());
      const candSkills = (profile.skills || []).map((s: string) => s.toLowerCase());
      const intersection = jobSkills.filter((s: string) => candSkills.some((cs: string) => cs.includes(s) || s.includes(cs)));
      const sScore = jobSkills.length ? Math.round((intersection.length / jobSkills.length) * 100) : 0;
      skillScore += sScore;
    });

    const avgSkill = Math.round(skillScore / jobs.length);
    matchData = {
      overallScore: avgSkill,
      categories: [
        { name: "Skills Match", score: avgSkill },
        { name: "Experience Match", score: profile.experience?.length ? 80 : 0 },
        { name: "Education Match", score: profile.education?.length ? 100 : 0 },
        { name: "Keyword Match", score: avgSkill },
      ]
    };
  }

  const topSkills = (profile?.skills || []).slice(0, 5).map((s: string) => ({
    name: s,
    progress: 80,
    level: "Advanced"
  }));

  const resumeData = latestResume ? {
    filename: latestResume.file_name || "Resume.pdf",
    uploadDate: new Date(latestResume.uploaded_at).toLocaleDateString(),
    size: latestResume.file_size ? `${(latestResume.file_size / 1024).toFixed(1)} KB` : "Unknown size",
    url: latestResume.signed_url || "#"
  } : null;

  const recentActivity = profile?.activity || [];

  if (!candidateData) {
    return (
      <PageContainer>
        <div className="max-w-6xl mx-auto space-y-8 pb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Candidate Profile</h1>
          <p className="text-muted-foreground text-[15px] mt-1">Please set up your profile.</p>
          <EditProfileDialog profile={null} />
        </div>
      </PageContainer>
    );
  }

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
            {resumeData && (
              <a href={resumeData.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center whitespace-nowrap h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 text-sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview Resume
              </a>
            )}
            <CandidateSetupOptions existingProfile={profile} />
          </div>
        </div>

        {/* Top Info Card */}
        <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden bg-white dark:bg-card">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 p-6">
            <div className="relative shrink-0">
              <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#c1f4e1] to-[#a2d8ce] flex items-center justify-center text-4xl font-medium text-teal-900 border-4 border-white shadow-sm">
                {candidateData.initials}
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <div className="space-y-4 col-span-1 md:col-span-2 lg:col-span-1">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{candidateData.firstName} {candidateData.lastName}</h2>
                </div>
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
                    <span className="text-teal-600 truncate">{candidateData.linkedin}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Code className="h-4 w-4 text-slate-400" />
                    <span className="text-teal-600 truncate">{candidateData.github}</span>
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
                <p className="text-[13px] text-slate-500 font-medium">Highest Education</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{candidateData.highestEducation}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* Profile Summary */}
            <Card className="rounded-2xl border-slate-100 shadow-sm p-6 bg-white dark:bg-card">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="w-5 h-5 text-teal-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Summary</h3>
              </div>
              <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {candidateData.summary}
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {candidateData.skills.slice(0, 5).map((skill: string) => (
                  <span key={skill} className="inline-flex items-center px-3 py-1 rounded-lg bg-[#f0fbf9] dark:bg-teal-950/30 text-[13px] font-medium text-teal-700 dark:text-teal-300">
                    {skill}
                  </span>
                ))}
                {candidateData.additionalSkillsCount > 0 && <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[13px] font-medium text-slate-600 dark:text-slate-400">+{candidateData.additionalSkillsCount} more</span>}
              </div>
            </Card>

            {/* Top Skills */}
            <Card className="rounded-2xl border-slate-100 shadow-sm p-6 bg-white dark:bg-card">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Skills</h3>
              </div>
              <div className="space-y-5">
                {topSkills.length > 0 ? topSkills.map((skill: any) => (
                  <div key={skill.name} className="flex items-center justify-between text-[14px]">
                    <span className="font-medium text-slate-700 dark:text-slate-300 w-40">{skill.name}</span>
                    <Progress value={skill.progress} className="h-2 flex-1 mx-4 bg-slate-100 dark:bg-slate-800 [&>div]:bg-teal-500" />
                    <span className="text-slate-500 w-20 text-right">{skill.level}</span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No parsed skills available from resume.</p>
                )}
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
                  <span className="text-teal-600 font-semibold mt-3">{matchData.overallScore > 75 ? "Good Match" : matchData.overallScore > 40 ? "Fair Match" : "Low Match"}</span>
                  <span className="text-[12px] text-slate-400 mt-1">Based on stored data.</span>
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
                    <a href="/job-profiles" className="w-full h-full flex items-center justify-between">
                      View Match Insights vs Jobs
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </a>
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