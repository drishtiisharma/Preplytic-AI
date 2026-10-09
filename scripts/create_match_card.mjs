import fs from 'fs';

const content = `"use client";

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

  const hasMissingData = isSelected && (!profile?.skills || !selectedJob?.skills);

  if (isSelected && profile && selectedJob && !hasMissingData) {
    const jobSkills = (selectedJob.skills || []).map((s: string) => s.toLowerCase());
    const candSkills = (profile.skills || []).map((s: string) => s.toLowerCase());
    const intersection = jobSkills.filter((s: string) => candSkills.some((cs: string) => cs.includes(s) || s.includes(cs)));
    const skillScore = jobSkills.length ? Math.round((intersection.length / jobSkills.length) * 100) : 0;
    
    // Simulate other match metrics based on profile depth if exact extraction isn't available
    const expScore = profile.experience?.length ? (profile.experience.length >= 2 ? 90 : 60) : 0;
    const eduScore = profile.education?.length ? 100 : 0;
    const keywordScore = skillScore > 0 ? Math.min(skillScore + 10, 100) : 0; // Simple simulation

    const overallScore = Math.round((skillScore * 0.4) + (expScore * 0.3) + (eduScore * 0.1) + (keywordScore * 0.2));

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
        <Select value={selectedJobId} onValueChange={setSelectedJobId}>
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
        <div className={\`flex flex-col sm:flex-row items-center sm:items-start gap-8 \${!isSelected ? 'opacity-40 grayscale pointer-events-none transition-opacity' : 'transition-opacity'}\`}>
          
          <div className="flex flex-col items-center shrink-0">
            <div className={\`relative w-28 h-28 flex items-center justify-center rounded-full border-[6px] \${!isSelected ? 'border-slate-200' : matchData.overallScore > 75 ? 'border-teal-500' : matchData.overallScore > 40 ? 'border-amber-500' : 'border-red-500'}\`}>
              <div className="absolute inset-2 rounded-full bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-3xl font-bold text-slate-900 dark:text-white shadow-sm">
                {isSelected ? matchData.overallScore : '-'}{isSelected ? '%' : ''}
              </div>
            </div>
            <span className={\`font-semibold mt-3 \${!isSelected ? 'text-slate-400' : matchData.overallScore > 75 ? 'text-teal-600' : matchData.overallScore > 40 ? 'text-amber-600' : 'text-red-600'}\`}>
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
                <Progress value={cat.score} className={\`h-1.5 \${!isSelected ? 'bg-slate-200' : 'bg-slate-100 dark:bg-slate-800 [&>div]:bg-teal-500'}\`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
`;

fs.writeFileSync('src/components/candidate/MatchScoreCard.tsx', content, 'utf8');
console.log("Created MatchScoreCard.tsx!");