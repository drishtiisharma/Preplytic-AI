"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveResumeRecord, deleteOldResume, saveParsedResumeData } from "@/app/(app)/candidate/resume-actions";

interface ResumeUploaderProps {
  variant?: "outline" | "ghost" | "default";
  className?: string;
  label?: string;
  icon?: React.ReactNode;
  existingStoragePath?: string | null;
  onParseSuccess?: (parsedData: any, storagePath: string) => void;
}

export function ResumeUploader({ existingStoragePath, variant = "outline", className, label = "Upload New Resume", icon = <Upload className="w-4 h-4 mr-2" /> , onParseSuccess }: ResumeUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("File is too large. Maximum size is 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Auth Error: You must be logged in to upload a resume.");
        return;
      }

      // 1. Upload to storage
      const resumeId = crypto.randomUUID();
      const storagePath = user.id + "/" + resumeId + ".pdf";
      
      if (process.env.NODE_ENV === 'development') {
                      }
      
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(storagePath, file, {
          contentType: "application/pdf",
          upsert: false
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        toast.error("Storage Error: Failed to upload resume to storage.");
        return;
      }

      // 2. Save metadata to DB
      const result = await saveResumeRecord({
        fileName: file.name,
        storagePath: storagePath,
        fileSize: file.size
      });

      if (!result.success) {
        toast.error("Database Error: " + (result.error || "Failed to save resume record."));
        return;
      }

      // 3. Cleanup old resume if replacing
      if (existingStoragePath) {
        await deleteOldResume(existingStoragePath);
      }
      
      // 4. Trigger parsing milestone
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (token) {
                    const parseRes = await fetch("http://localhost:8000/parse", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token 
            },
            body: JSON.stringify({
              storagePath: storagePath,
              userId: user.id
            })
          });
          
          if (parseRes.ok) {
            const parseData = await parseRes.json();
                        
            if (onParseSuccess) {
              onParseSuccess(parseData.data, storagePath);
            } else {
              // Save parsed data to DB
              const saveRes = await saveParsedResumeData(parseData.data, storagePath);
              if (!saveRes.success) {
                console.error("Failed to save parsed data:", saveRes.error);
              } else {
                router.refresh();
                toast.success("Resume uploaded successfully!");
              }
            }
          } else {
            console.error("Parse failed:", await parseRes.text());
          }
        }
      } catch (parseErr) {
        console.error("Failed to call parser API:", parseErr);
      }

    } catch (err) {
      console.error(err);
      toast.error("Upload failed: An unexpected error occurred.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input 
        type="file" 
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button 
        variant={variant} 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={className || "h-10 rounded-xl border-slate-200 text-slate-700 font-medium bg-white hover:bg-slate-50 dark:bg-card dark:hover:bg-slate-900 dark:border-border"}
      >
        {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : icon}
        {isUploading ? "Uploading..." : label}
      </Button>
    </>
  );
}