"use server";

import { createClient } from "@/lib/supabase/server";

export type CandidateProfile = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
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
      .eq("user_id", user.id)
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