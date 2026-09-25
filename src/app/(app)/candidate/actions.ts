"use server";

import { createClient } from "@/lib/supabase/server";

export type CandidateProfile = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  summary: string | null;
  current_role: string | null;
  skills: any[];
  experience: any[];
  education: any[];
  certifications: any[];
  preferences: any;
  resume_metadata: any;
  activity: any[];
};

export async function getCandidateProfile(): Promise<CandidateProfile | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from("candidate_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error("Error fetching candidate profile:", error);
      return null;
    }

    return data as CandidateProfile;
  } catch (error) {
    console.error("Unexpected error in getCandidateProfile:", error);
    return null;
  }
}
import { revalidatePath } from "next/cache";

export async function updateCandidateProfile(data: Partial<CandidateProfile>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Strip out id or user_id from the update payload to be safe
    const { id, user_id, ...updatePayload } = data as any;

    // Use upsert to handle both creation and update
    const { error } = await supabase
      .from("candidate_profiles")
      .upsert({ id: user.id, user_id: user.id, ...updatePayload })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating candidate profile:", error);
      return { success: false, error: "Failed to update profile: " + error.message };
    }

    revalidatePath("/candidate");
    return { success: true };
  } catch (error: any) {
    console.error("Unexpected error in updateCandidateProfile:", error);
    return { success: false, error: error.message || "Unexpected error occurred" };
  }
}

export async function getLatestResume() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from("resume_records")
      .select("*")
      .eq("user_id", user.id)
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching latest resume:", error);
    }

    if (data && data.storage_path) {
      const { data: signedData, error: signedError } = await supabase.storage
        .from("resumes")
        .createSignedUrl(data.storage_path, 3600);
      if (signedData) {
        data.signed_url = signedData.signedUrl;
      }
    }

    return data || null;
  } catch (err) {
    return null;
  }
}
