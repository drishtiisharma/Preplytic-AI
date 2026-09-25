"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveResumeRecord(metadata: {
  fileName: string;
  storagePath: string;
  fileSize: number;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Insert into resume_records
    const { error: insertError } = await supabase
      .from("resume_records")
      .insert({
        user_id: user.id,
        file_name: metadata.fileName,
        storage_path: metadata.storagePath,
        file_size: metadata.fileSize,
        mime_type: "application/pdf",
        status: "uploaded"
      });

    if (insertError) {
      console.error("Failed to insert resume record:", insertError);
      return { success: false, error: "Failed to record resume metadata." };
    }

    // Candidate profile update removed to avoid schema errors.

    revalidatePath("/candidate");
    revalidatePath("/quick-apply");

    return { success: true };
  } catch (err) {
    console.error("Unexpected error saving resume:", err);
    return { success: false, error: "Unexpected error occurred." };
  }
}

export async function deleteOldResume(storagePath: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // 1. Delete from storage bucket
    const { error: storageError } = await supabase
      .storage
      .from("resumes")
      .remove([storagePath]);

    if (storageError) {
      console.error("Failed to delete old resume from storage:", storageError);
    }

    // 2. Delete from resume_records
    const { error: dbError } = await supabase
      .from("resume_records")
      .delete()
      .match({ storage_path: storagePath, user_id: user.id });

    if (dbError) {
      console.error("Failed to delete old resume record:", dbError);
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error deleting old resume:", err);
    return { success: false, error: "Unexpected error occurred." };
  }
}
export async function saveParsedResumeData(parsedData: any, storagePath: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch existing profile
    const { data: profile } = await supabase
      .from("candidate_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      // Insert new profile
                  
      const { error: insertError } = await supabase
        .from("candidate_profiles")
          .insert({
            id: user.id,
            user_id: user.id,
          name: parsedData.name || null,
          email: parsedData.email || null,
          phone: parsedData.phone || null,
          location: parsedData.location || null,
          summary: parsedData.summary || null,
          skills: parsedData.skills || [],
          experience: parsedData.experience || [],
          education: parsedData.education || [],
          certifications: parsedData.certifications || [],
        });
      if (insertError) console.error("Insert profile error:", insertError);
    } else {
      // Merge logic: only overwrite if existing is empty
      const updates: any = {};

      const isEmptyString = (v: any) => typeof v === 'string' && v.trim() === '';
      const isEmptyArray = (v: any) => Array.isArray(v) && v.length === 0;
      const isNullOrEmpty = (v: any) => v == null || isEmptyString(v) || isEmptyArray(v);

      if (parsedData.name && isNullOrEmpty(profile.name)) updates.name = parsedData.name;
      if (parsedData.email && isNullOrEmpty(profile.email)) updates.email = parsedData.email;
      if (parsedData.phone && isNullOrEmpty(profile.phone)) updates.phone = parsedData.phone;

      if (parsedData.location && isNullOrEmpty(profile.location)) updates.location = parsedData.location;
      if (parsedData.summary && isNullOrEmpty(profile.summary)) updates.summary = parsedData.summary;
      if (parsedData.skills && parsedData.skills.length > 0 && isNullOrEmpty(profile.skills)) updates.skills = parsedData.skills;
      if (parsedData.experience && parsedData.experience.length > 0 && isNullOrEmpty(profile.experience)) updates.experience = parsedData.experience;
      if (parsedData.education && parsedData.education.length > 0 && isNullOrEmpty(profile.education)) updates.education = parsedData.education;
      if (parsedData.certifications && parsedData.certifications.length > 0 && isNullOrEmpty(profile.certifications)) updates.certifications = parsedData.certifications;

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from("candidate_profiles")
          .update(updates)
          .eq("id", user.id);
        if (updateError) console.error("Update profile error:", updateError);
      }
    }

    // Update resume_records
    const { error: recordError } = await supabase
      .from("resume_records")
      .update({
        status: "parsed",
        parsed_at: new Date().toISOString()
      })
      .eq("user_id", user.id)
      .eq("storage_path", storagePath);

    if (recordError) console.error("Update resume record error:", recordError);

    revalidatePath("/candidate");

    return { success: true };
  } catch (err) {
    console.error("Unexpected error saving parsed data:", err);
    return { success: false, error: "Unexpected error occurred." };
  }
}
