"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export type JobProfile = {
  id: string;
  title: string;
  company: string;
  location: string;
  role: string;
  type: string;
  matchScore: number;
  addedOnDate: string;
  addedOnRelative: string;
  status: string;
  logoChar: string;
  logoColor: string;
  // Extended Fields
  jobDescription?: string | null;
  requiredSkills?: string | null;
  preferredSkills?: string | null;
  education?: string | null;
  responsibilities?: string | null;
  qualifications?: string | null;
  salary?: string | null;
  jobUrl?: string | null;
  experience?: string | null;
};

// Helper to format date strings
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Simple relative time format
const getRelativeTime = (dateString: string) => {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

// Map DB row to JobProfile structure
const mapDbToProfile = (row: any): JobProfile => {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location || "",
    role: row.title,
    type: row.type || "Full-time",
    matchScore: row.match_score || 0,
    addedOnDate: row.created_at ? formatDate(row.created_at) : "",
    addedOnRelative: row.created_at ? getRelativeTime(row.created_at) : "",
    status: "Active", // Keep as mock if DB doesn't track status
    logoChar: row.company ? row.company.charAt(0).toUpperCase() : "J",
    logoColor: "bg-teal-50 text-teal-600",
    jobDescription: row.job_description || "",
    requiredSkills: row.required_skills || "",
    preferredSkills: row.preferred_skills || "",
    education: row.education || "",
    responsibilities: row.responsibilities || "",
    qualifications: row.qualifications || "",
    salary: row.salary || "",
    jobUrl: row.job_url || "",
    experience: row.experience || ""
  };
};

export function useJobProfiles() {
  const [profiles, setProfiles] = useState<JobProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchProfiles = async () => {
    setIsLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setProfiles([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('job_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching job profiles:", error);
      setError(error.message);
    } else if (data) {
      setProfiles(data.map(mapDbToProfile));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const addProfile = async (newProfileData: Partial<JobProfile>) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error("Must be logged in to create job profile");

    const dbRow = {
      user_id: userData.user.id,
      title: newProfileData.title,
      company: newProfileData.company,
      location: newProfileData.location,
      type: newProfileData.type,
      match_score: newProfileData.matchScore || 0,
      job_description: newProfileData.jobDescription === "" ? null : newProfileData.jobDescription,
      required_skills: newProfileData.requiredSkills === "" ? null : newProfileData.requiredSkills,
      preferred_skills: newProfileData.preferredSkills === "" ? null : newProfileData.preferredSkills,
      education: newProfileData.education === "" ? null : newProfileData.education,
      responsibilities: newProfileData.responsibilities === "" ? null : newProfileData.responsibilities,
      qualifications: newProfileData.qualifications === "" ? null : newProfileData.qualifications,
      salary: newProfileData.salary === "" ? null : newProfileData.salary,
      job_url: newProfileData.jobUrl === "" ? null : newProfileData.jobUrl,
      experience: newProfileData.experience === "" ? null : newProfileData.experience
    };

    const { data, error } = await supabase.from('job_profiles').insert(dbRow).select().single();
    if (error) throw error;
    
    setProfiles([mapDbToProfile(data), ...profiles]);
    return data;
  };

  const updateProfile = async (id: string, updatedData: Partial<JobProfile>) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error("Must be logged in to update job profile");

    const dbRow = {
      title: updatedData.title,
      company: updatedData.company,
      location: updatedData.location,
      type: updatedData.type,
      job_description: updatedData.jobDescription === "" ? null : updatedData.jobDescription,
      required_skills: updatedData.requiredSkills === "" ? null : updatedData.requiredSkills,
      preferred_skills: updatedData.preferredSkills === "" ? null : updatedData.preferredSkills,
      education: updatedData.education === "" ? null : updatedData.education,
      responsibilities: updatedData.responsibilities === "" ? null : updatedData.responsibilities,
      qualifications: updatedData.qualifications === "" ? null : updatedData.qualifications,
      salary: updatedData.salary === "" ? null : updatedData.salary,
      job_url: updatedData.jobUrl === "" ? null : updatedData.jobUrl,
      experience: updatedData.experience === "" ? null : updatedData.experience
    };

    // Remove undefined values
    Object.keys(dbRow).forEach(key => (dbRow as any)[key] === undefined && delete (dbRow as any)[key]);

    const { data, error } = await supabase.from('job_profiles').update(dbRow).eq('id', id).select().single();
    if (error) throw error;

    setProfiles(profiles.map(p => p.id === id ? mapDbToProfile(data) : p));
    return data;
  };

  const deleteProfile = async (id: string) => {
    const { error } = await supabase.from('job_profiles').delete().eq('id', id);
    if (error) throw error;
    setProfiles(profiles.filter(p => p.id !== id));
  };

  return { profiles, isLoading, error, addProfile, updateProfile, deleteProfile, refreshProfiles: fetchProfiles };
}