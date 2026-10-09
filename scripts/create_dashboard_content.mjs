import fs from 'fs';

const content = `"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { UserCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface CandidateDashboardContentProps {
  candidateData: any;
  profile: any;
  jobs: any[];
}

export function CandidateDashboardContent({ candidateData, profile, jobs }: CandidateDashboardContentProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const selectedJob = jobs.find(j => j.id === selectedJobId);
  const isSelected = !!selectedJob;

  // 1. Generate Meaningful Summary
  const generateSummary = () => {
    if (!profile) return "Welcome! Please upload your resume to generate a professional summary.";
    
    let summary = "";
    const role = profile.current_role || (profile.experience?.length ? profile.experience[0].title : "Professional");
    const expYears = profile.experience?.length ? \`with a proven track record across \${profile.experience.length} roles\` : "";
    const edu = profile.education?.length ? \`Backed by an educational foundation in \${profile.education[0].degree}.\` : "";
    
    const topSkills = (profile.skills || []).slice(0, 3).join(", ");
    
    summary = \`A dedicated \${role} \${expYears}. \`;
    if (topSkills) {
      summary += \`Demonstrates core expertise in \${topSkills}. \`;
    }
    summary += edu;
    
    return summary.trim();
  };

  // 2. Rank Top Skills
  const getRankedSkills = () => {
    const candSkills = profile?.skills || [];
    if (!candSkills.length) return [];

    if (!isSelected || !selectedJob) {
      return candSkills.slice(0, 10).map((s: string) => ({ name: s, isMatch: false }));
    }

    const jobSkillsRaw = selectedJob.required_skills || selectedJob.job_description || "";
    const parsedJobSkills = typeof jobSkillsRaw === 'string' 
      ? jobSkillsRaw.split(/[,;\\n]/).map((s: string) => s.trim().toLowerCase()).filter(Boolean)
      : (jobSkillsRaw || []).map((s: string) => typeof s === 'string' ? s.toLowerCase() : '');

    // Score and rank skills
    const scoredSkills = candSkills.map((candSkill: string) => {
      const lowerCand = candSkill.toLowerCase();
      let score = 0;
      
      // Exact match
      if (parsedJobSkills.some((js: string) => lowerCand.includes(js) || js.includes(lowerCand))) {
        score = 2;
      } else {
        // Partial token match
        const candWords = lowerCand.split(/\\s+/).filter((w: string) => w.length > 3);
        const hasPartial = parsedJobSkills.some((js: string) => {
          const jsWords = js.split(/\\s+/).filter((w: string) => w.length > 3);
          return candWords.some((cw: string) => jsWords.some((jw: string) => cw.includes(jw) || jw.includes(cw)));
        });
        if (hasPartial) score = 1;
      }
      return { name: candSkill, score, isMatch: score > 0 };
    });

    // Sort by score (desc), then alphabetically
    scoredSkills.sort((a: any, b: any) => b.score - a.score || a.name.localeCompare(b.name));
    return scoredSkills.slice(0, 10);
  };

  // 3. Match Score Logic
  const getMatchData = () => {
    let matchData = {
      overallScore: 0,
      categories: [
        { name: "Skills Match", score: 0 },
        { name: "Experience Match", score: 0 },
        { name: "Education Match", score: 0 },
        { name: "Keyword Match", score: 0 },
      ]
    };

    if (!isSelected || !profile || !selectedJob) return matchData;

    const jobSkillsRaw = selectedJob.required_skills || selectedJob.job_description || "";
    const parsedJobSkills = typeof jobSkillsRaw === 'string' 
      ? jobSkillsRaw.split(/[,;\\n]/).map((s: string) => s.trim().toLowerCase()).filter(Boolean)
      : (jobSkillsRaw || []).map((s: string) => typeof s === 'string' ? s.toLowerCase() : '');

    if (parsedJobSkills.length === 0) return matchData;

    const candSkills = (profile.skills || []).map((s: string) => s.toLowerCase());
    
    let matchCount = 0;
    parsedJobSkills.forEach((s: string) => {
      if (candSkills.some((cs: string) => cs.includes(s) || s.includes(cs))) {
        matchCount += 1;
      } else {
        const jobWords = s.split(/\\s+/).filter((w: string) => w.length > 3);
        const hasPartial = candSkills.some((cs: string) => {
          const candWords = cs.split(/\\s+/).filter((w: string) => w.length > 3);
          return jobWords.some((jw: string) => candWords.some((cw: string) => cw.includes(jw) || jw.includes(cw)));
        });
        if (hasPartial) matchCount += 0.6; 
      }
    });

    let rawSkillScore = parsedJobSkills.length ? (matchCount / parsedJobSkills.length) * 100 : 0;
    const skillScore = Math.min(100, Math.round(rawSkillScore * 1.3)); 
    
    const expCount = profile.experience?.length || 0;
    const expScore = expCount > 0 ? Math.min(100, 75 + (expCount * 10)) : 40; 
    
    const eduScore = profile.education?.length ? 100 : 60; 
    
    const keywordScore = Math.min(100, Math.round(skillScore * 1.1 + 15)); 

    const overallScore = Math.min(100, Math.round((skillScore * 0.4) + (expScore * 0.35) + (eduScore * 0.1) + (keywordScore * 0.15)));

    return {
      overallScore,
      categories: [
        { name: "Skills Match", score: skillScore },
        { name: "Experience Match", score: expScore },
        { name: "Education Match", score: eduScore },
        { name: "Keyword Match", score: keywordScore },
      ]
    };
  };

  const rankedSkills = getRankedSkills();
  const matchData = getMatchData();
  const jobSkillsRawForMissingCheck = selectedJob?.required_skills || selectedJob?.job_description || "";
  const parsedJobSkillsForMissingCheck = typeof jobSkillsRawForMissingCheck === 'string' 
      ? jobSkillsRawForMissingCheck.split(/[,;\\n]/).map((s: string) => s.trim().toLowerCase()).filter(Boolean)
      : (jobSkillsRawForMissingCheck || []).map((s: string) => typeof s === 'string' ? s.toLowerCase() : '');
  const hasMissingData = isSelected && (!profile?.skills || parsedJobSkillsForMissingCheck.length === 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
      
      {/* Left Column */}
      <div className="space-y-6">
        
        {/* Profile Summary */}
        <Card className="rounded-2xl border-slate-100 shadow-sm p-6 bg-white dark:bg-card">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="w-5 h-5 text-teal-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Summary</h3>
          </div>
          <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {generateSummary()}
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {candidateData.skills.slice(0, 5).map((skill: string) => (
              <span key={skill} className="inline-flex items-center px-3 py-1 rounded-lg bg-[#f0fbf9] dark:bg-teal-950/30 text-[13px] font-medium text-teal-700 dark:text-teal-300">
                {skill}
              </span>
            ))}
            {candidateData.additionalSkillsCount > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[13px] font-medium text-slate-600 dark:text-slate-400">
                +{candidateData.additionalSkillsCount} more
              </span>
            )}
          </div>
        </Card>

        {/* Top Skills */}
        <Card className="rounded-2xl border-slate-100 shadow-sm p-6 bg-white dark:bg-card">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-teal-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Skills {isSelected ? "for Selected Job" : ""}</h3>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            {rankedSkills.length > 0 ? rankedSkills.map((skill: any) => (
              <div 
                key={skill.name} 
                className={\`inline-flex items-center px-3.5 py-1.5 rounded-full text-[13px] font-medium border \${skill.isMatch ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:border-teal-900/50 dark:text-teal-300' : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'}\`}
              >
                {skill.name}
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No parsed skills available from resume.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
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
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/candidate/CandidateDashboardContent.tsx', content, 'utf8');
console.log("Created CandidateDashboardContent!");