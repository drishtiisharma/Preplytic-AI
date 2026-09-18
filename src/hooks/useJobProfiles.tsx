"use client";

import { useState, useEffect } from "react";

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
};

const initialProfiles: JobProfile[] = [
  {
    id: "1",
    title: "Software Engineer",
    company: "Tech Corp Alpha",
    location: "New York, USA",
    role: "Backend Developer",
    type: "Full-time",
    matchScore: 88,
    addedOnDate: "May 15, 2025",
    addedOnRelative: "1 day ago",
    status: "Active",
    logoChar: "T",
    logoColor: "bg-blue-50 text-blue-600",
  },
  {
    id: "2",
    title: "Data Analyst",
    company: "DataWorks LLC",
    location: "London, UK",
    role: "Data Analyst",
    type: "Contract",
    matchScore: 74,
    addedOnDate: "May 12, 2025",
    addedOnRelative: "4 days ago",
    status: "Active",
    logoChar: "D",
    logoColor: "bg-purple-50 text-purple-600",
  },
  {
    id: "3",
    title: "Product Manager",
    company: "Innovate Inc",
    location: "San Francisco, USA",
    role: "Product Manager",
    type: "Full-time",
    matchScore: 65,
    addedOnDate: "May 10, 2025",
    addedOnRelative: "6 days ago",
    status: "Active",
    logoChar: "I",
    logoColor: "bg-amber-50 text-amber-600",
  },
  {
    id: "4",
    title: "UX Designer",
    company: "Design Studio Co",
    location: "Berlin, Germany",
    role: "UX Researcher",
    type: "Part-time",
    matchScore: 52,
    addedOnDate: "May 5, 2025",
    addedOnRelative: "11 days ago",
    status: "Inactive",
    logoChar: "D",
    logoColor: "bg-rose-50 text-rose-600",
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "Cloud Systems",
    location: "Remote",
    role: "Cloud Architect",
    type: "Full-time",
    matchScore: 61,
    addedOnDate: "May 2, 2025",
    addedOnRelative: "14 days ago",
    status: "Inactive",
    logoChar: "C",
    logoColor: "bg-teal-50 text-teal-600",
  }
];

export function useJobProfiles() {
  const [profiles, setProfiles] = useState<JobProfile[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("jobProfiles");
    if (saved) {
      try {
        setProfiles(JSON.parse(saved));
      } catch (e) {
        setProfiles(initialProfiles);
      }
    } else {
      setProfiles(initialProfiles);
      localStorage.setItem("jobProfiles", JSON.stringify(initialProfiles));
    }
  }, []);

  const addProfile = (newProfileData: Omit<JobProfile, "id" | "addedOnDate" | "addedOnRelative" | "status" | "logoChar" | "logoColor">) => {
    const newProfile: JobProfile = {
      ...newProfileData,
      id: Date.now().toString(),
      addedOnDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      addedOnRelative: "Just now",
      status: "Active",
      logoChar: newProfileData.company ? newProfileData.company.charAt(0).toUpperCase() : "J",
      logoColor: "bg-teal-50 text-teal-600",
    };
    
    const saved = localStorage.getItem("jobProfiles");
    let currentProfiles = initialProfiles;
    if (saved) {
      try {
        currentProfiles = JSON.parse(saved);
      } catch (e) {}
    }
    
    const updated = [newProfile, ...currentProfiles];
    localStorage.setItem("jobProfiles", JSON.stringify(updated));
    setProfiles(updated);
  };

  return { profiles, addProfile };
}
