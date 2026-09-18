import React from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Link as LinkIcon, 
  Lightbulb, 
  Sparkles, 
  Building2, 
  Briefcase, 
  Navigation,
  FileText,
  Building,
  ClipboardList,
  Settings,
  GraduationCap,
  Clock
} from "lucide-react";

export default function ExtractJobProfilePage() {
  return (
    <PageContainer>
      <div className="max-w-[1400px] mx-auto pb-10">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/job-profiles" className="inline-flex items-center text-sm font-medium text-teal-500 hover:text-teal-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Job Profiles
          </Link>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          
          {/* Main Left Column */}
          <div className="flex-1 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Extract from URL</h1>
              <p className="text-muted-foreground text-[15px] max-w-2xl leading-relaxed">
                Paste a job description URL (e.g., LinkedIn, company careers, or any job post) and
                we'll extract key details, analyze it, and create a structured job profile for you.
              </p>
            </div>

            {/* Job URL Card */}
            <div className="bg-white border border-zinc-100 shadow-sm rounded-2xl p-6 md:p-8 relative overflow-hidden">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                  <LinkIcon className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">Job URL</h3>
                  <p className="text-sm text-zinc-500">Paste the link to the job post or career page below.</p>
                </div>
              </div>

              {/* Input Area */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input 
                    type="url"
                    placeholder="https://example.com/job-post" 
                    className="pl-10 h-12 bg-white border-zinc-200 text-base"
                  />
                </div>
                <Button className="h-12 px-8 bg-teal-500 hover:bg-teal-600 text-white font-medium text-base shrink-0">
                  Extract <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </div>

              {/* Supported Sources */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-zinc-900 mb-3">Supported Sources</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-50 border border-zinc-100 text-xs font-medium text-zinc-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> LinkedIn
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-50 border border-zinc-100 text-xs font-medium text-zinc-600">
                    <Building2 className="w-3.5 h-3.5" /> Company Career Pages
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-50 border border-zinc-100 text-xs font-medium text-zinc-600">
                    <Briefcase className="w-3.5 h-3.5" /> Job Boards
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-50 border border-zinc-100 text-xs font-medium text-zinc-600">
                    <Navigation className="w-3.5 h-3.5" /> AngelList
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-50 border border-zinc-100 text-xs font-medium text-zinc-500">
                    + More
                  </div>
                </div>
              </div>

              {/* Information Tip */}
              <div className="bg-teal-50/50 border border-teal-100/50 rounded-xl p-4 flex gap-3">
                <Lightbulb className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <p className="text-[13px] leading-relaxed text-zinc-600">
                  Make sure the URL is publicly accessible. We'll automatically extract the job details 
                  and create a complete profile with required skills, role, company info and more.
                </p>
              </div>
            </div>

            {/* Empty State / Bottom Area */}
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center rotate-3 relative z-10 border border-teal-100/50">
                  <FileText className="w-10 h-10 text-teal-300" />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center shadow-md">
                    <LinkIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <Sparkles className="absolute -top-3 -left-3 w-5 h-5 text-teal-400" />
                <Sparkles className="absolute top-2 -right-4 w-4 h-4 text-teal-300" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Paste a job URL to get started</h3>
              <p className="text-sm text-zinc-500 max-w-sm">
                It only takes a few seconds to extract and analyze the job details.
              </p>
            </div>

          </div>

          {/* Right Column - What We Extract */}
          <div className="w-full xl:w-[380px] shrink-0">
            <div className="bg-white border border-zinc-100 shadow-sm rounded-2xl p-6">
              
              <div className="flex items-center gap-2 mb-8">
                <Sparkles className="w-5 h-5 text-teal-500" />
                <h3 className="text-[15px] font-semibold text-zinc-900">What We Extract</h3>
              </div>

              <div className="space-y-6">
                
                {/* Item */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900 mb-0.5">Job Title</h4>
                    <p className="text-[13px] text-zinc-500">Role and designation</p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <Building className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900 mb-0.5">Company Details</h4>
                    <p className="text-[13px] text-zinc-500">Name, location, industry</p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900 mb-0.5">Key Responsibilities</h4>
                    <p className="text-[13px] text-zinc-500">Main duties and tasks</p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <Settings className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900 mb-0.5">Required Skills</h4>
                    <p className="text-[13px] text-zinc-500">Technical & soft skills</p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900 mb-0.5">Experience & Education</h4>
                    <p className="text-[13px] text-zinc-500">Experience level, degrees</p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900 mb-0.5">Other Details</h4>
                    <p className="text-[13px] text-zinc-500">Salary (if available), type, location etc.</p>
                  </div>
                </div>

              </div>

              {/* Pro Tip */}
              <div className="mt-8 bg-teal-50/50 border border-teal-100/50 rounded-xl p-4 flex gap-3">
                <Lightbulb className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[13px] font-medium text-teal-700 mb-1">Pro Tip</h5>
                  <p className="text-[12px] leading-relaxed text-teal-600/80">
                    For better results, use the original job post URL (not a forwarded link).
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </PageContainer>
  );
}
