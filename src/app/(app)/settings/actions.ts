"use server";

import { createClient } from "@/lib/supabase/server";

export async function resetUserAccount() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // 1. Delete job_profiles
    const { error: jobError } = await supabase
      .from("job_profiles")
      .delete()
      .eq("user_id", user.id);

    if (jobError) {
      console.error("Error deleting job_profiles:", jobError);
    }

    // 2. Fetch all resume records to delete from storage
    const { data: resumes } = await supabase
      .from("resume_records")
      .select("storage_path")
      .eq("user_id", user.id);

    if (resumes && resumes.length > 0) {
      const storagePaths = resumes.map(r => r.storage_path).filter(Boolean) as string[];
      if (storagePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("resumes")
          .remove(storagePaths);
        if (storageError) {
          console.error("Error deleting resumes from storage:", storageError);
        }
      }
    }

    // 3. Delete resume_records
    const { error: resumeError } = await supabase
      .from("resume_records")
      .delete()
      .eq("user_id", user.id);

    if (resumeError) {
      console.error("Error deleting resume_records:", resumeError);
    }

    // 4. "Delete" candidate profile by resetting it (since no DELETE policy exists on candidate_profiles)
    // or attempt delete if it somehow works
    const { error: profileDeleteError } = await supabase
      .from("candidate_profiles")
      .delete()
      .eq("id", user.id);

    if (profileDeleteError) {
      console.log("RLS prevented DELETE on candidate_profiles, falling back to UPDATE reset.");
      await supabase
        .from("candidate_profiles")
        .update({
          phone: null,
          location: null,
          linkedin_url: null,
          summary: null,
          current_role: null,
          skills: [],
          experience: [],
          education: [],
          certifications: [],
          preferences: {},
          resume_metadata: {},
          activity: []
        })
        .eq("id", user.id);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Unexpected error in resetUserAccount:", err);
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}