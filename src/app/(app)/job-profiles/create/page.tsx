"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useJobProfiles } from "@/hooks/useJobProfiles";
import { 
  ArrowLeft, 
  Link as LinkIcon, 
  ArrowRight, 
  CloudUpload, 
  FileText, 
  Briefcase, 
  Building2, 
  ListTodo, 
  Wrench, 
  GraduationCap, 
  Clock, 
  Lightbulb,
  Link2,
  Loader2
} from "lucide-react";

export default function CreateJobProfilePage() {
  const router = useRouter();
  const { addProfile } = useJobProfiles();
  
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [manualForm, setManualForm] = useState({
    title: "",
    company: "",
    responsibilities: "",
    skills: "",
    experience: "",
    other: ""
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url && !description) return;
    
    setIsSubmitting(true);
    
    // Simulate API call and extraction
    setTimeout(() => {
      let title = "Software Engineer";
      let company = "Tech Startup";
      
      if (url) {
        try {
          const urlObj = new URL(url.startsWith('http') ? url : '"https://"' + url);
          const parts = urlObj.pathname.split('/').filter(Boolean);
          if (parts.length > 0) {
            const rawTitle = parts[parts.length - 1].replace(/-/g, ' ');
            title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
          }
          company = urlObj.hostname.replace('www.', '').split('.')[0].toUpperCase();
        } catch(e) {
          title = "Extracted Job Profile";
        }
      } else if (description) {
        title = "Pasted Job Description";
        company = "Extracted Company";
      }

      addProfile({
        title,
        company,
        location: "Remote",
        role: title,
        type: "Full-time",
        matchScore: Math.floor(Math.random() * 40) + 60,
      });
      
      router.push("/job-profiles");
    }, 800);
  };

  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.title || !manualForm.company) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      addProfile({
        title: manualForm.title,
        company: manualForm.company,
        location: manualForm.other.includes("Remote") ? "Remote" : "Unknown",
        role: manualForm.title,
        type: manualForm.other.includes("Contract") ? "Contract" : "Full-time",
        matchScore: Math.floor(Math.random() * 40) + 60,
      });
      router.push("/job-profiles");
    }, 800);
  };

  const handleReset = () => {
    setManualForm({
      title: "",
      company: "",
      responsibilities: "",
      skills: "",
      experience: "",
      other: ""
    });
  };

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Link 
            href="/job-profiles" 
            className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job Profiles
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create Job Profile</h1>
            <p className="mt-2 text-muted-foreground text-[15px] max-w-2xl leading-relaxed">
              Add a job URL or paste the job description to create a structured profile. 
              We'll analyze it and extract key details for better matching and insights.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Main Content Area */}
          <Card className="rounded-3xl border-slate-200 shadow-sm p-2">
            <Tabs defaultValue="url" className="w-full">
              <div className="px-6 pt-4">
                <TabsList className="bg-transparent border-b border-border w-full justify-start h-auto p-0 rounded-none space-x-8">
                  <TabsTrigger 
                    value="url" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-teal-500 rounded-none px-0 pb-3 pt-2 text-[15px] font-medium text-muted-foreground data-[state=active]:text-teal-600"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    From Job URL
                  </TabsTrigger>
                  <TabsTrigger 
                    value="description" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-teal-500 rounded-none px-0 pb-3 pt-2 text-[15px] font-medium text-muted-foreground data-[state=active]:text-teal-600"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    From Job Description
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6 md:p-8">
                <TabsContent value="url" className="mt-0">
                  <form onSubmit={handleCreate} className="space-y-8">
                    {/* Job URL Section */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Job URL</h3>
                        <p className="text-sm text-muted-foreground">Paste the link to the job post or career page below.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/job-post" 
                            className="pl-10 h-12 rounded-xl border-slate-200 bg-slate-50/50 dark:bg-card dark:border-border text-[15px]"
                          />
                        </div>
                        <Button type="button" className="h-12 rounded-xl px-6 bg-teal-500 hover:bg-teal-600 text-white shadow-sm font-medium">
                          Fetch Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* OR Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200 dark:border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-card px-4 text-slate-400 font-medium">OR</span>
                      </div>
                    </div>

                    {/* Upload Section */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Upload Job Description <span className="text-muted-foreground font-normal">(Optional)</span></h3>
                        <p className="text-sm text-muted-foreground">You can also upload a PDF or paste the JD directly.</p>
                      </div>
                      
                      <div className="border-2 border-dashed border-teal-200/60 dark:border-teal-900/40 rounded-2xl p-8 text-center bg-[#f8fdfc] dark:bg-teal-950/10 hover:bg-teal-50/50 transition-colors cursor-pointer group">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-teal-100/50 dark:bg-teal-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <CloudUpload className="h-6 w-6 text-teal-500" />
                          </div>
                          <div>
                            <p className="text-[15px] font-medium text-slate-700 dark:text-slate-300">
                              Drag & drop a file here, or <span className="text-teal-500">click to upload</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT (Max 5MB)</p>
                          </div>
                        </div>
                      </div>
                      
                      <Textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Paste job description here..." 
                        className="min-h-[120px] rounded-2xl resize-none border-slate-200 bg-slate-50/50 dark:bg-card dark:border-border p-4 text-[15px]"
                      />
                    </div>

                    {/* Action */}
                    <div className="pt-2">
                      <Button type="submit" disabled={isSubmitting || (!url && !description)} className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white shadow-sm font-medium text-[15px]">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            Create Job Profile
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="description" className="mt-0">
                  <form onSubmit={handleManualCreate} className="space-y-6">
                    <div className="space-y-4">
                      {/* Title */}
                      <div className="space-y-1.5">
                        <label className="text-[14px] font-semibold text-slate-900 dark:text-white">Job Title <span className="text-red-500">*</span></label>
                        <Input 
                          placeholder="Role and designation (e.g. Frontend Engineer)" 
                          className="h-11 rounded-xl bg-slate-50/50 dark:bg-card border-slate-200 dark:border-border text-[14px]"
                          required
                          value={manualForm.title}
                          onChange={(e) => setManualForm({...manualForm, title: e.target.value})}
                        />
                      </div>

                      {/* Company */}
                      <div className="space-y-1.5">
                        <label className="text-[14px] font-semibold text-slate-900 dark:text-white">Company Details <span className="text-red-500">*</span></label>
                        <Input 
                          placeholder="Name, location, industry (e.g. Acme Corp, Remote, SaaS)" 
                          className="h-11 rounded-xl bg-slate-50/50 dark:bg-card border-slate-200 dark:border-border text-[14px]"
                          required
                          value={manualForm.company}
                          onChange={(e) => setManualForm({...manualForm, company: e.target.value})}
                        />
                      </div>

                      {/* Responsibilities */}
                      <div className="space-y-1.5">
                        <label className="text-[14px] font-semibold text-slate-900 dark:text-white">Key Responsibilities</label>
                        <Textarea 
                          placeholder="Main duties and tasks..." 
                          className="min-h-[80px] rounded-xl resize-none bg-slate-50/50 dark:bg-card border-slate-200 dark:border-border text-[14px]"
                          value={manualForm.responsibilities}
                          onChange={(e) => setManualForm({...manualForm, responsibilities: e.target.value})}
                        />
                      </div>

                      {/* Skills */}
                      <div className="space-y-1.5">
                        <label className="text-[14px] font-semibold text-slate-900 dark:text-white">Required Skills</label>
                        <Textarea 
                          placeholder="Technical & soft skills..." 
                          className="min-h-[80px] rounded-xl resize-none bg-slate-50/50 dark:bg-card border-slate-200 dark:border-border text-[14px]"
                          value={manualForm.skills}
                          onChange={(e) => setManualForm({...manualForm, skills: e.target.value})}
                        />
                      </div>

                      {/* Experience & Education */}
                      <div className="space-y-1.5">
                        <label className="text-[14px] font-semibold text-slate-900 dark:text-white">Experience & Education</label>
                        <Input 
                          placeholder="Experience level, degrees (e.g. 3+ years, B.S. CS)" 
                          className="h-11 rounded-xl bg-slate-50/50 dark:bg-card border-slate-200 dark:border-border text-[14px]"
                          value={manualForm.experience}
                          onChange={(e) => setManualForm({...manualForm, experience: e.target.value})}
                        />
                      </div>

                      {/* Other Details */}
                      <div className="space-y-1.5">
                        <label className="text-[14px] font-semibold text-slate-900 dark:text-white">Other Details</label>
                        <Input 
                          placeholder="Salary (if available), type, location etc." 
                          className="h-11 rounded-xl bg-slate-50/50 dark:bg-card border-slate-200 dark:border-border text-[14px]"
                          value={manualForm.other}
                          onChange={(e) => setManualForm({...manualForm, other: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 mt-8 border-t border-slate-100 dark:border-border">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleReset}
                        className="w-1/3 h-12 rounded-xl border-slate-200 dark:border-border text-slate-700 dark:text-slate-200 font-medium"
                      >
                        Reset
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting || !manualForm.title || !manualForm.company}
                        className="w-2/3 h-12 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white shadow-sm font-medium text-[15px]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            Create Job Profile
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </div>
            </Tabs>
          </Card>

          {/* Right Sidebar */}
          <Card className="rounded-3xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 dark:bg-teal-950/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="relative">
              <div className="mb-6 flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center shrink-0">
                  <div className="relative">
                    <FileText className="h-7 w-7 text-teal-200" />
                    <LinkIcon className="h-5 w-5 text-teal-500 absolute -bottom-1 -right-1 bg-teal-50 dark:bg-[#151c20] rounded-full p-0.5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">What We Extract</h3>
                  <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
                    We'll find and structure key information from the job post, including:
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { icon: Briefcase, title: "Job Title", desc: "Role and designation" },
                  { icon: Building2, title: "Company Details", desc: "Name, location, industry" },
                  { icon: ListTodo, title: "Key Responsibilities", desc: "Main duties and tasks" },
                  { icon: Wrench, title: "Required Skills", desc: "Technical & soft skills" },
                  { icon: GraduationCap, title: "Experience & Education", desc: "Experience level, degrees" },
                  { icon: Clock, title: "Other Details", desc: "Salary (if available), type, location etc." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3.5">
                    <div className="h-8 w-8 rounded-full bg-teal-50/80 dark:bg-teal-950/20 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="h-4 w-4 text-teal-500" />
                    </div>
                    <div>
                      <h4 className="text-[13.5px] font-semibold text-slate-900 dark:text-slate-100">{item.title}</h4>
                      <p className="text-[12px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-[#f0fbf9] dark:bg-teal-950/20 p-4 flex gap-3 border border-teal-100/50 dark:border-teal-900/30">
                <Lightbulb className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[13px] font-semibold text-teal-700 dark:text-teal-400">Pro Tip</h4>
                  <p className="text-[12px] text-teal-600/80 dark:text-teal-400/80 mt-1 leading-relaxed">
                    A complete job URL or detailed JD helps us create a more accurate profile and better recommendations.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
