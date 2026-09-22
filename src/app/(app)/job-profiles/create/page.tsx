"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useJobProfiles } from "@/hooks/useJobProfiles";
import { 
  ArrowLeft, 
  CloudUpload, 
  Briefcase, 
  Loader2,
  Building2,
  MapPin,
  Clock,
  GraduationCap,
  Banknote,
  Link as LinkIcon
} from "lucide-react";

export default function CreateJobProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { addProfile, updateProfile, profiles } = useJobProfiles();
  
  const [activeTab, setActiveTab] = useState("paste");
  const [rawJD, setRawJD] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editId && profiles.length > 0) {
      const profileToEdit = profiles.find(p => p.id === editId);
      if (profileToEdit) {
        setFormData({
          title: profileToEdit.title || "",
          company: profileToEdit.company || "",
          location: profileToEdit.location || "",
          type: profileToEdit.type || "",
          experience: profileToEdit.experience || "",
          jobDescription: profileToEdit.jobDescription || "",
          requiredSkills: profileToEdit.requiredSkills || "",
          preferredSkills: profileToEdit.preferredSkills || "",
          education: profileToEdit.education || "",
          responsibilities: profileToEdit.responsibilities || "",
          qualifications: profileToEdit.qualifications || "",
          salary: profileToEdit.salary || "",
          jobUrl: profileToEdit.jobUrl || ""
        });
        setActiveTab("manual");
      }
    }
  }, [editId, profiles]);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    experience: "",
    jobDescription: "",
    requiredSkills: "",
    preferredSkills: "",
    education: "",
    responsibilities: "",
    qualifications: "",
    salary: "",
    jobUrl: ""
  });

  const extractField = (text: string, patterns: RegExp[]): string => {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return "";
  };

  const parseJD = () => {
    if (!rawJD.trim()) return;
    setIsParsing(true);
    
    setTimeout(() => {
      // Deterministic Regex extraction
      const title = extractField(rawJD, [/Job Title:\s*([^\n]+)/i, /Role:\s*([^\n]+)/i]) || "Extracted Title";
      const company = extractField(rawJD, [/Company:\s*([^\n]+)/i, /About\s*(.*?):/i]) || "Extracted Company";
      const location = extractField(rawJD, [/Location:\s*([^\n]+)/i]);
      const type = extractField(rawJD, [/Employment Type:\s*([^\n]+)/i, /Job Type:\s*([^\n]+)/i]);
      const experience = extractField(rawJD, [/Experience:\s*([^\n]+)/i, /Experience Required:\s*([^\n]+)/i]);
      const salary = extractField(rawJD, [/Salary:\s*([^\n]+)/i, /Compensation:\s*([^\n]+)/i]);
      const education = extractField(rawJD, [/Education:\s*([^\n]+)/i, /Degree:\s*([^\n]+)/i]);

      setFormData(prev => ({
        ...prev,
        title,
        company,
        location,
        type,
        experience,
        salary,
        education,
        jobDescription: rawJD
      }));

      setIsParsing(false);
      setActiveTab("manual");
    }, 800); // simulate slight delay for UX
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company) {
      alert("Job Title and Company are required.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const profileData = {
        title: formData.title,
        company: formData.company,
        location: formData.location || "Remote",
        type: formData.type || "Full-time",
        matchScore: editId ? profiles.find(p => p.id === editId)?.matchScore ?? 0 : 0, 
        jobDescription: formData.jobDescription,
        requiredSkills: formData.requiredSkills,
        preferredSkills: formData.preferredSkills,
        education: formData.education,
        responsibilities: formData.responsibilities,
        qualifications: formData.qualifications,
        salary: formData.salary,
        jobUrl: formData.jobUrl,
        experience: formData.experience
      };

      if (editId) {
        await updateProfile(editId, profileData);
      } else {
        await addProfile(profileData);
      }
      
      router.push("/job-profiles");
    } catch (error: any) {
      console.error("Error saving job profile:", error);
      alert(error.message || "Failed to save job profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto pb-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/job-profiles" />} className="rounded-full shrink-0 hover:bg-zinc-100">
            
              <ArrowLeft className="w-5 h-5 text-zinc-600" />
            
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{editId ? "Edit Job Profile" : "Create Job Profile"}</h1>
            <p className="text-muted-foreground text-sm">{editId ? "Update your saved job profile details." : "Add a new job profile to track and match against your candidate profiles."}</p>
          </div>
        </div>

        {/* Content */}
        <Card className="p-6 md:p-8 bg-white border-zinc-100 shadow-sm rounded-2xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-100/50 p-1 rounded-xl h-12">
              <TabsTrigger value="paste" className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Paste Job Description
              </TabsTrigger>
              <TabsTrigger value="manual" className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Create Manually
              </TabsTrigger>
            </TabsList>

            <TabsContent value="paste" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-zinc-700">Full Job Description</label>
                  <span className="text-xs text-muted-foreground">Paste the raw text here</span>
                </div>
                <Textarea 
                  value={rawJD}
                  onChange={(e) => setRawJD(e.target.value)}
                  placeholder="e.g. We are looking for a Senior Software Engineer..."
                  className="min-h-[400px] resize-y p-4 text-sm leading-relaxed"
                />
              </div>

              <div className="flex justify-end border-t pt-6">
                <Button 
                  onClick={parseJD} 
                  disabled={!rawJD.trim() || isParsing}
                  className="h-11 px-8 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-medium"
                >
                  {isParsing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Parsing...</>
                  ) : (
                    <><CloudUpload className="w-4 h-4 mr-2" /> Parse Job Description</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="mt-0">
              <form onSubmit={handleSave} className="space-y-8">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2"><Briefcase className="w-4 h-4 text-zinc-400"/> Job Title *</label>
                      <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g. Product Manager" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2"><Building2 className="w-4 h-4 text-zinc-400"/> Company *</label>
                      <Input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required placeholder="e.g. Acme Corp" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2"><MapPin className="w-4 h-4 text-zinc-400"/> Location</label>
                      <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. San Francisco, CA (or Remote)" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2"><Clock className="w-4 h-4 text-zinc-400"/> Employment Type</label>
                      <Input value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="e.g. Full-time, Contract" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Job Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2"><GraduationCap className="w-4 h-4 text-zinc-400"/> Experience Required</label>
                      <Input value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} placeholder="e.g. 5+ years" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2"><Banknote className="w-4 h-4 text-zinc-400"/> Salary/Compensation</label>
                      <Input value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} placeholder="e.g. $120k - " />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium flex items-center gap-2"><LinkIcon className="w-4 h-4 text-zinc-400"/> Job URL</label>
                      <Input value={formData.jobUrl} onChange={e => setFormData({...formData, jobUrl: e.target.value})} placeholder="https://..." type="url" />
                    </div>
                  </div>
                </div>

                {/* Long Text Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Requirements & Description</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Description</label>
                    <Textarea value={formData.jobDescription} onChange={e => setFormData({...formData, jobDescription: e.target.value})} className="h-32" placeholder="Full job description..." />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Required Skills</label>
                      <Textarea value={formData.requiredSkills} onChange={e => setFormData({...formData, requiredSkills: e.target.value})} className="h-24" placeholder="React, Node.js, etc." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preferred Skills</label>
                      <Textarea value={formData.preferredSkills} onChange={e => setFormData({...formData, preferredSkills: e.target.value})} className="h-24" placeholder="AWS, Docker, etc." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Responsibilities</label>
                      <Textarea value={formData.responsibilities} onChange={e => setFormData({...formData, responsibilities: e.target.value})} className="h-24" placeholder="What you'll do..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Qualifications & Education</label>
                      <Textarea value={formData.qualifications} onChange={e => setFormData({...formData, qualifications: e.target.value})} className="h-24" placeholder="BS in Computer Science..." />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t pt-6">
                  <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="h-11 px-8 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-medium">
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                    ) : (
                      editId ? "Update Job Profile" : "Save Job Profile"
                    )}
                  </Button>
                </div>
                
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </PageContainer>
  );
}