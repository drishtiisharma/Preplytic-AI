"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface MatchScoreCardProps {
  jobs: any[];
  profile: any;
}

export function MatchScoreCard({ jobs, profile }: MatchScoreCardProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const selectedJob = jobs.find(j => j.id === selectedJobId);
  const isSelected = !!selectedJob;

  let matchData = {
    overallScore: 0,
    categories: [
      { name: "Skills Match", score: 0 },
      { name: "Experience Match", score: 0 },
      { name: "Education Match", score: 0 },
      { name: "Keyword Match", score: 0 },
    ]
  };

  const jobSkillsRaw = selectedJob?.required_skills || selectedJob?.job_description || "";
  const parsedJobSkills = typeof jobSkillsRaw === 'string' 
    ? jobSkillsRaw.split(/[,;\n]/).map(s => s.trim().toLowerCase()).filter(Boolean)
    : (jobSkillsRaw || []).map((s: string) => typeof s === 'string' ? s.toLowerCase() : '');

  const hasMissingData = isSelected && (!profile?.skills || parsedJobSkills.length === 0);

  if (isSelected && profile && selectedJob && !hasMissingData) {
    const jobSkills = parsedJobSkills;
    const candSkills = (profile.skills || []).map((s: string) => s.toLowerCase());
    
    let matchCount = 0;
    jobSkills.forEach((s: string) => {
      if (candSkills.some((cs: string) => cs.includes(s) || s.includes(cs))) {
        matchCount += 1;
      } else {
        const jobWords = s.split(/\s+/).filter(w => w.length > 3);
        const hasPartial = candSkills.some((cs: string) => {
          const candWords = cs.split(/\s+/).filter(w => w.length > 3);
          return jobWords.some(jw => candWords.some(cw => cw.includes(jw) || jw.includes(cw)));
        });
        if (hasPartial) {
          matchCount += 0.6; // Give 60% partial credit for transferable/related skills
        }
      }
    });

    // Apply a generous curve to the skill score
    let rawSkillScore = jobSkills.length ? (matchCount / jobSkills.length) * 100 : 0;
    const skillScore = Math.min(100, Math.round(rawSkillScore * 1.3)); // 30% generous boost
    
    // Experience Match: More forgiving based on any experience listed
    const expCount = profile.experience?.length || 0;
    const expScore = expCount > 0 ? Math.min(100, 75 + (expCount * 10)) : 40; // Base 40% if missing, otherwise 85-100%
    
    // Education Match: Give baseline credit
    const eduScore = profile.education?.length ? 100 : 60; // 60% partial credit if unspecified
    
    // Keyword Match: Boosted by related word matches
    const keywordScore = Math.min(100, Math.round(skillScore * 1.1 + 15)); 

    // Overall formula weights adjusted slightly
    const overallScore = Math.min(100, Math.round((skillScore * 0.4) + (expScore * 0.35) + (eduScore * 0.1) + (keywordScore * 0.15)));

    matchData = {
      overallScore,
      categories: [
        { name: "Skills Match", score: skillScore },
        { name: "Experience Match", score: expScore },
        { name: "Education Match", score: eduScore },
        { name: "Keyword Match", score: keywordScore },
      ]
    };
  }

  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm p-6 bg-white dark:bg-card flex flex-col h-full">
      <div className="flex justify-between items-start mb-6 gap-4">
        <h3 className="text-[16px] font-bold text-slate-900 dark:text-white shrink-0">Overall Match Score</h3>
        <Select value={selectedJobId} onValueChange={(val) => setSelectedJobId(val || "")}>
          <SelectTrigger className="w-full max-w-[200px] h-9 text-sm bg-slate-50 dark:bg-slate-900/50">
            <SelectValue placeholder="Select a saved job" />
          </SelectTrigger>
          <SelectContent>
            {jobs.length === 0 ? (
              <SelectItem value="none" disabled>No saved jobs found</SelectItem>
            ) : (
              jobs.map(job => (
                <SelectItem key={job.id} value={job.id}>{job.title || job.company || 'Unknown Job'}</SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      
      {isSelected && hasMissingData ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <AlertTriangle className="w-8 h-8 text-amber-500 mb-3" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Incomplete Data</p>
          <p className="text-xs text-slate-500 mt-1 max-w-[200px]">We need both your parsed resume skills and the job description skills to calculate a match.</p>
        </div>
      ) : (
        <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-8 ${!isSelected ? 'opacity-40 grayscale pointer-events-none transition-opacity' : 'transition-opacity'}`}>
          
          <div className="flex flex-col items-center shrink-0">
            <div className={`relative w-28 h-28 flex items-center justify-center rounded-full border-[6px] ${!isSelected ? 'border-slate-200' : matchData.overallScore > 75 ? 'border-teal-500' : matchData.overallScore > 40 ? 'border-amber-500' : 'border-red-500'}`}>
              <div className="absolute inset-2 rounded-full bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-3xl font-bold text-slate-900 dark:text-white shadow-sm">
                {isSelected ? matchData.overallScore : '-'}{isSelected ? '%' : ''}
              </div>
            </div>
            <span className={`font-semibold mt-3 ${!isSelected ? 'text-slate-400' : matchData.overallScore > 75 ? 'text-teal-600' : matchData.overallScore > 40 ? 'text-amber-600' : 'text-red-600'}`}>
              {!isSelected ? 'No Job Selected' : matchData.overallScore > 75 ? "Strong Match" : matchData.overallScore > 40 ? "Fair Match" : "Low Match"}
            </span>
            <span className="text-[12px] text-slate-400 mt-1">Based on parsed data.</span>
          </div>

          <div className="flex-1 w-full space-y-4">
            {matchData.categories.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between text-[13px] font-medium">
                  <span className="text-slate-600 dark:text-slate-300">{cat.name}</span>
                  <span className="text-slate-900 dark:text-slate-100">{isSelected ? cat.score : '-'}{isSelected ? '%' : ''}</span>
                </div>
                <Progress value={cat.score} className={`h-1.5 ${!isSelected ? 'bg-slate-200' : 'bg-slate-100 dark:bg-slate-800 [&>div]:bg-teal-500'}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
