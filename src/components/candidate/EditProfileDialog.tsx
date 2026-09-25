"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { updateCandidateProfile, CandidateProfile } from "@/app/(app)/candidate/actions";

interface EditProfileDialogProps {
  profile: CandidateProfile | null;
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSaveSuccess?: () => void;
}

export function EditProfileDialog({ profile, trigger, open, onOpenChange, onSaveSuccess }: EditProfileDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;
  const [isSaving, setIsSaving] = useState(false);

  // Sync when profile changes
  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
        current_role: profile.current_role || "",
        summary: profile.summary || "",
        skills: profile.skills || [],
        experience: profile.experience || [],
        education: profile.education || [],
        certifications: profile.certifications || [],
      });
      setSkillsInput(profile.skills?.map((s: any) => typeof s === 'string' ? s : s?.name || '').join(", ") || "");
    }
  }, [profile]);

  // Form state initialized with existing profile values
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    linkedin_url: profile?.linkedin_url || "",
      github_url: profile?.github_url || "",
    current_role: profile?.current_role || "",
    summary: profile?.summary || "",
    skills: profile?.skills || [],
    experience: profile?.experience || [],
    education: profile?.education || [],
    certifications: profile?.certifications || [],
    
  });

  const [skillsInput, setSkillsInput] = useState(formData.skills.map((s: any) => typeof s === 'string' ? s : s?.name || '').join(", "));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: Partial<CandidateProfile> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        linkedin_url: formData.linkedin_url,
        current_role: formData.current_role,
        summary: formData.summary,
        skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
        experience: formData.experience,
        education: formData.education,
        certifications: formData.certifications,
        preferences: {
          ...(profile?.preferences || {}),
          
        },
      };

      const result = await updateCandidateProfile(payload);
      if (result.success) {
        setIsOpen(false);
        if (onSaveSuccess) onSaveSuccess();
      } else {
        alert("Failed to save profile: " + result.error);
      }
    } catch (err) {
      alert("Unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateArrayField = (field: keyof typeof formData, index: number, key: string, value: string) => {
    const updatedArray = [...(formData[field] as any[])];
    updatedArray[index] = { ...updatedArray[index], [key]: value };
    setFormData({ ...formData, [field]: updatedArray });
  };

  const addArrayItem = (field: keyof typeof formData, defaultObj: any) => {
    setFormData({ ...formData, [field]: [...(formData[field] as any[]), defaultObj] });
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    const updatedArray = [...(formData[field] as any[])];
    updatedArray.splice(index, 1);
    setFormData({ ...formData, [field]: updatedArray });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
              {trigger ? <DialogTrigger render={trigger} /> : <DialogTrigger render={<Button className="h-10 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-medium shadow-sm"><Edit className="w-4 h-4 mr-2" />Edit Profile</Button>} />}
      
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[750px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
          <DialogDescription>Make changes to your candidate profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>

        <div className="space-y-8 pb-10">
          
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Jane Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="e.g. jane@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="e.g. +1 234 567 890" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g. New York, NY" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">LinkedIn URL</label>
                <Input value={formData.linkedin_url} onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})} placeholder="https://linkedin.com/in/..." />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub URL</label>
                <Input value={formData.github_url} onChange={(e) => setFormData({...formData, github_url: e.target.value})} placeholder="https://github.com/..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Role</label>
                <Input value={formData.current_role} onChange={(e) => setFormData({...formData, current_role: e.target.value})} placeholder="e.g. Software Engineer" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Professional Summary</label>
              <Textarea 
                value={formData.summary} 
                onChange={(e) => setFormData({...formData, summary: e.target.value})} 
                placeholder="A brief summary of your professional background..." 
                className="h-24"
              />
            </div>

            
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Skills</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500">Enter skills separated by commas</label>
              <Textarea 
                value={skillsInput} 
                onChange={(e) => setSkillsInput(e.target.value)} 
                placeholder="React, TypeScript, Node.js, Project Management" 
                className="h-20"
              />
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold">Work Experience</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("experience", { title: "", company: "", dates: "", description: "" })}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            
            {formData.experience.map((exp: any, index: number) => (
              <div key={index} className="p-4 border rounded-xl space-y-4 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-semibold">Experience #{index + 1}</h4>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => removeArrayItem("experience", index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Job Title" value={exp.title || ""} onChange={(e) => updateArrayField("experience", index, "title", e.target.value)} />
                  <Input placeholder="Company" value={exp.company || ""} onChange={(e) => updateArrayField("experience", index, "company", e.target.value)} />
                  <Input placeholder="Dates (e.g. 2020 - Present)" value={exp.dates || exp.date || ""} onChange={(e) => updateArrayField("experience", index, "dates", e.target.value)} />
                </div>
                <Textarea placeholder="Description of responsibilities..." value={exp.description || ""} onChange={(e) => updateArrayField("experience", index, "description", e.target.value)} />
              </div>
            ))}
            {formData.experience.length === 0 && <p className="text-sm text-slate-500">No experience added.</p>}
          </div>

          {/* Education */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold">Education</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("education", { degree: "", school: "", dates: "" })}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            
            {formData.education.map((edu: any, index: number) => (
              <div key={index} className="p-4 border rounded-xl space-y-4 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-semibold">Education #{index + 1}</h4>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => removeArrayItem("education", index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Degree/Major" value={edu.degree || ""} onChange={(e) => updateArrayField("education", index, "degree", e.target.value)} />
                  <Input placeholder="School/University" value={edu.school || edu.institution || ""} onChange={(e) => updateArrayField("education", index, "school", e.target.value)} />
                  <Input placeholder="Dates (e.g. 2016 - 2020)" value={edu.dates || edu.date || ""} onChange={(e) => updateArrayField("education", index, "dates", e.target.value)} />
                </div>
              </div>
            ))}
            {formData.education.length === 0 && <p className="text-sm text-slate-500">No education added.</p>}
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold">Certifications</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("certifications", { name: "", issuer: "", date: "" })}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            
            {formData.certifications.map((cert: any, index: number) => (
              <div key={index} className="p-4 border rounded-xl space-y-4 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-semibold">Certification #{index + 1}</h4>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => removeArrayItem("certifications", index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Certification Name" value={cert.name || ""} onChange={(e) => updateArrayField("certifications", index, "name", e.target.value)} />
                  <Input placeholder="Issuer" value={cert.issuer || ""} onChange={(e) => updateArrayField("certifications", index, "issuer", e.target.value)} />
                  <Input placeholder="Date" value={cert.date || ""} onChange={(e) => updateArrayField("certifications", index, "date", e.target.value)} />
                </div>
              </div>
            ))}
            {formData.certifications.length === 0 && <p className="text-sm text-slate-500">No certifications added.</p>}
          </div>

        </div>

        <DialogFooter className="sticky bottom-0 bg-white dark:bg-card pt-4 pb-2 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-teal-500 hover:bg-teal-600 text-white">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
