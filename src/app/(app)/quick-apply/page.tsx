"use client";

import React, { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronRight, FileText, Mail, Users, PenTool, ExternalLink, RefreshCw } from "lucide-react";

type JobProfile = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  job_description: string;
  required_skills: string;
  preferred_skills: string;
  education: string;
  responsibilities: string;
  qualifications: string;
  salary: string;
};

type ResumeRecord = {
  id: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
  parsed_data?: any;
};

type ApplicationMessage = {
  id: string;
  message_type: 'cold_mail' | 'referral_message';
  content: string;
};

export default function QuickApplyPage() {
  const supabase = createClient();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [jobProfiles, setJobProfiles] = useState<JobProfile[]>([]);
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");

  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [coldMail, setColdMail] = useState<ApplicationMessage | null>(null);
  const [referralMessage, setReferralMessage] = useState<ApplicationMessage | null>(null);

  const [isGeneratingColdMail, setIsGeneratingColdMail] = useState(false);
  const [isGeneratingReferral, setIsGeneratingReferral] = useState(false);
  const [isGeneratingOverview, setIsGeneratingOverview] = useState(false);
  const [jobOverview, setJobOverview] = useState<string | null>(null);
  const [candidateProfile, setCandidateProfile] = useState<any>(null);

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const [jobsRes, resumesRes] = await Promise.all([
        supabase.from('job_profiles').select('*').eq('user_id', userData.user.id).order('created_at', { ascending: false }),
        supabase.from('resume_records').select('*').eq('user_id', userData.user.id).order('uploaded_at', { ascending: false })
      ]);

      const jobs = jobsRes.data || [];
      const resumesData = resumesRes.data || [];

      if (resumesData.length === 0) {
        toast.error("Enter candidate details first.");
        router.push("/candidate");
        return;
      }

      if (jobs.length === 0) {
        toast.error("Create at least 1 job profile first.");
        router.push("/job-profiles");
        return;
      }

      setJobProfiles(jobs);
      setResumes(resumesData);
      setIsLoading(false);
    }
    loadInitialData();
  }, [router]);

  useEffect(() => {
    async function loadMessages() {
      if (!selectedJobId || !selectedResumeId) {
        setColdMail(null);
        setReferralMessage(null);
        return;
      }

      setIsFetchingMessages(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data, error } = await supabase
        .from('application_messages')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('job_profile_id', selectedJobId)
        .eq('resume_id', selectedResumeId);

      if (!error && data) {
        setColdMail(data.find(m => m.message_type === 'cold_mail') || null);
        setReferralMessage(data.find(m => m.message_type === 'referral_message') || null);
      }
      setIsFetchingMessages(false);
    }
    loadMessages();
  }, [selectedJobId, selectedResumeId]);

  const selectedJob = jobProfiles.find(j => j.id === selectedJobId);
  const selectedResume = resumes.find(r => r.id === selectedResumeId);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, dm = 2, sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleGenerateColdMail = async () => {
    setIsGeneratingColdMail(true);
    try {
      const job = jobProfiles.find(j => j.id === selectedJobId);
      const resume = resumes.find(r => r.id === selectedResumeId);
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch("http://localhost:8000/generate/cold-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          job_profile: job,
          resume_data: resume,
          candidate_profile: candidateProfile
        })
      });
      
      if (!response.ok) throw new Error("Failed to generate");
      
      const result = await response.json();
      
      const newMsg: ApplicationMessage = {
        id: result.id,
        message_type: 'cold_mail',
        content: result.content
      };
      
      const { data: userData } = await supabase.auth.getUser();
      await supabase.from('application_messages').insert({
        id: result.id,
        user_id: userData.user?.id,
        job_profile_id: selectedJobId,
        resume_id: selectedResumeId,
        message_type: 'cold_mail',
        content: result.content
      });
      
      setColdMail(newMsg);
      toast.success("Cold mail generated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate cold mail");
    } finally {
      setIsGeneratingColdMail(false);
    }
  };

  const handleGenerateOverview = () => {
    setIsGeneratingOverview(true);
    // TODO: Hook up to actual LLM API endpoint for Job Overview
    setTimeout(() => {
      setIsGeneratingOverview(false);
      setJobOverview("This feature is ready for LLM integration. Once connected, a 1-paragraph summary of role expectations will appear here.");
    }, 2000);
  };

  const handleGenerateReferral = async () => {
    setIsGeneratingReferral(true);
    try {
      const job = jobProfiles.find(j => j.id === selectedJobId);
      const resume = resumes.find(r => r.id === selectedResumeId);
      const { data: { session } } = await supabase.auth.getSession();
      
      let linkedinUrl = "";
      if (candidateProfile && candidateProfile.contact_details && candidateProfile.contact_details.linkedin) {
          linkedinUrl = candidateProfile.contact_details.linkedin;
      } else if (resume && resume.parsed_data && resume.parsed_data.contact && resume.parsed_data.contact.linkedin) {
          linkedinUrl = resume.parsed_data.contact.linkedin;
      }
      
      const response = await fetch("http://localhost:8000/generate/referral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          job_profile: job,
          resume_data: resume,
          candidate_profile: candidateProfile,
          linkedin_url: linkedinUrl
        })
      });
      
      if (!response.ok) throw new Error("Failed to generate");
      
      const result = await response.json();
      
      const newMsg: ApplicationMessage = {
        id: result.id,
        message_type: 'referral_message',
        content: result.content
      };
      
      const { data: userData } = await supabase.auth.getUser();
      await supabase.from('application_messages').insert({
        id: result.id,
        user_id: userData.user?.id,
        job_profile_id: selectedJobId,
        resume_id: selectedResumeId,
        message_type: 'referral_message',
        content: result.content
      });
      
      setReferralMessage(newMsg);
      toast.success("Referral message generated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate referral message");
    } finally {
      setIsGeneratingReferral(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-[600px] max-w-full" />
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-6 p-1">
            <Skeleton className="flex-1 h-20 w-full rounded-2xl" />
            <Skeleton className="flex-1 h-20 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Quick Apply</h1>
          <p className="text-muted-foreground text-[15px] mt-1.5 max-w-3xl">
            Match your resume to a job profile, get insights, and generate personalized outreach messages.
          </p>
        </div>

        {/* Steps Tracker */}
        <div className="flex flex-col md:flex-row items-center gap-2 lg:gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {[ 
            { id: 1, title: "Select Profile & Resume", active: !selectedJobId || !selectedResumeId },
            { id: 2, title: "Review Insights", active: !!selectedJobId && !!selectedResumeId },
            { id: 3, title: "Generate Messages", active: !!selectedJobId && !!selectedResumeId }
          ].map((step, i) => (
            <React.Fragment key={step.id}>
              <Card className="flex-1 min-w-[240px] rounded-2xl border-slate-200 shadow-sm p-4 bg-white dark:bg-card flex items-center gap-4 shrink-0">
                <div className={"w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 " + (step.active ? "bg-teal-500 text-white" : "bg-teal-50 text-teal-600 dark:bg-teal-950/40")}>
                  {step.id}
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900 dark:text-white">{step.title}</h4>
                </div>
              </Card>
              {i < 2 && <ChevronRight className="w-5 h-5 text-slate-300 hidden md:block shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        {/* Selectors Bar */}
        <div className="flex flex-col lg:flex-row items-center gap-6 p-1">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 pl-1">Select Job Profile</label>
            <Select value={selectedJobId} onValueChange={(val) => setSelectedJobId(val as string)}>
              <SelectTrigger className="w-full h-16 rounded-2xl border-slate-200 dark:border-border px-4 text-left shadow-sm">
                <SelectValue placeholder="Select a saved job profile" />
              </SelectTrigger>
              <SelectContent>
                {jobProfiles.length === 0 ? (
                  <SelectItem value="empty" disabled>No job profiles found.</SelectItem>
                ) : (
                  jobProfiles.map(job => (
                    <SelectItem key={job.id} value={job.id}>
                      <span className="font-bold">{job.title}</span> at {job.company}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 w-full space-y-2">
            <label className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 pl-1">Select Resume</label>
            <Select value={selectedResumeId} onValueChange={(val) => setSelectedResumeId(val as string)}>
              <SelectTrigger className="w-full h-16 rounded-2xl border-slate-200 dark:border-border px-4 text-left shadow-sm">
                <SelectValue placeholder="Select an uploaded resume" />
              </SelectTrigger>
              <SelectContent>
                {resumes.length === 0 ? (
                  <SelectItem value="empty" disabled>No resumes found.</SelectItem>
                ) : (
                  resumes.map(res => (
                    <SelectItem key={res.id} value={res.id}>
                      <span className="font-bold">{res.file_name}</span> ({formatSize(res.file_size)})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dynamic Content */}
        {!selectedJobId || !selectedResumeId ? (
          <div className="text-center py-20 text-slate-500">
            Please select both a Job Profile and a Resume to continue.
          </div>
        ) : (
          <>
            {/* Job Overview */}
            <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Job Overview</h3>
                <Button 
                  onClick={handleGenerateOverview} 
                  disabled={isGeneratingOverview} 
                  variant="outline" 
                  className="h-8 text-xs bg-slate-50 border-slate-200 text-slate-600 hover:text-teal-600"
                >
                  {isGeneratingOverview ? <RefreshCw className="w-3 h-3 mr-2 animate-spin" /> : <PenTool className="w-3 h-3 mr-2" />}
                  Generate AI Overview
                </Button>
              </div>

              {jobOverview && (
                <div className="mb-6 p-4 bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 rounded-xl">
                  <p className="text-[14px] text-teal-800 dark:text-teal-200 leading-relaxed">{jobOverview}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                {selectedJob?.title && selectedJob?.company && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Position</p>
                    <p className="text-[15px] font-medium text-slate-900 dark:text-slate-100">{selectedJob.title} at {selectedJob.company}</p>
                  </div>
                )}
                
                {(selectedJob?.location || selectedJob?.type) && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Location & Type</p>
                    <p className="text-[15px] font-medium text-slate-900 dark:text-slate-100">
                      {[selectedJob.location, selectedJob.type].filter(Boolean).join(" • ")}
                    </p>
                  </div>
                )}
                
                {selectedJob?.experience && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Experience</p>
                    <p className="text-[15px] font-medium text-slate-900 dark:text-slate-100">{selectedJob.experience}</p>
                  </div>
                )}

                {selectedJob?.salary && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Salary</p>
                    <p className="text-[15px] font-medium text-slate-900 dark:text-slate-100">{selectedJob.salary}</p>
                  </div>
                )}

                {selectedJob?.education && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Education</p>
                    <p className="text-[15px] font-medium text-slate-900 dark:text-slate-100 leading-relaxed">{selectedJob.education}</p>
                  </div>
                )}

                {selectedJob?.required_skills && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Required Skills</p>
                    <p className="text-[15px] font-medium text-slate-900 dark:text-slate-100 leading-relaxed">{selectedJob.required_skills}</p>
                  </div>
                )}

                {selectedJob?.preferred_skills && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Preferred Skills</p>
                    <p className="text-[15px] font-medium text-slate-900 dark:text-slate-100 leading-relaxed">{selectedJob.preferred_skills}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Application Method & Output Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Cold Mail */}
              <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card flex flex-col min-h-[400px]">
                <div className="flex items-center gap-2 mb-6">
                  <Mail className="w-5 h-5 text-teal-500" />
                  <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">Cold Mail</h3>
                </div>
                
                {isFetchingMessages ? (
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : coldMail ? (
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                    {coldMail.content}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-slate-500 mb-4">No cold mail generated for this job and resume combination.</p>
                    <Button 
                      onClick={handleGenerateColdMail} 
                      disabled={isGeneratingColdMail}
                      className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl h-10 px-6"
                    >
                      {isGeneratingColdMail ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <PenTool className="w-4 h-4 mr-2" />}
                      {isGeneratingColdMail ? "Generating..." : "Generate Cold Mail"}
                    </Button>
                  </div>
                )}
              </Card>

              {/* Referral Message */}
              <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card flex flex-col min-h-[400px]">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-blue-500" />
                  <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">Referral Message</h3>
                </div>
                
                {isFetchingMessages ? (
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : referralMessage ? (
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                    {referralMessage.content}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-slate-500 mb-4">No referral message generated for this job and resume combination.</p>
                    <Button 
                      onClick={handleGenerateReferral} 
                      disabled={isGeneratingReferral}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-10 px-6"
                    >
                      {isGeneratingReferral ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <PenTool className="w-4 h-4 mr-2" />}
                      {isGeneratingReferral ? "Generating..." : "Generate Referral"}
                    </Button>
                  </div>
                )}
              </Card>

            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}