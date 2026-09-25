"use client";

import React, { useState } from "react";
import { ResumeUploader } from "./ResumeUploader";
import { EditProfileDialog } from "./EditProfileDialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveParsedResumeData } from "@/app/(app)/candidate/resume-actions";

export function CandidateSetupOptions({ existingProfile }: { existingProfile?: any }) {
  const [parsedProfile, setParsedProfile] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const router = useRouter();

  const handleParseSuccess = (parsedData: any, path: string) => {
    setParsedProfile(parsedData);
    setStoragePath(path);
    setDialogOpen(true);
  };

  const handleSaveSuccess = async () => {
    if (parsedProfile && storagePath) {
      // The profile was just saved manually by EditProfileDialog.
      // We still need to update resume_records status to "parsed" using saveParsedResumeData
      await saveParsedResumeData(parsedProfile, storagePath);
    }
    router.refresh();
  };

  return (
    <div className="flex items-center gap-3">
      <ResumeUploader 
        label={existingProfile ? "Update Resume" : "Upload Resume"} 
        variant="outline"
        className="h-10 rounded-xl bg-white border-slate-200 text-slate-700 font-medium hover:bg-slate-50" 
        onParseSuccess={handleParseSuccess} 
      />
      
      
      <EditProfileDialog 
        profile={parsedProfile || existingProfile} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSaveSuccess={handleSaveSuccess}
        trigger={
          <Button className="h-10 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-medium shadow-sm">
            <Edit className="w-4 h-4 mr-2" />
            {existingProfile ? "Edit Profile" : "Enter Manually"}
          </Button>
        }
      />
    </div>
  );
}
