import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/candidate/page.tsx', 'utf8');

// 1. Add import
content = content.replace(
  'import { CandidateSetupOptions } from "@/components/candidate/CandidateSetupOptions";',
  'import { CandidateSetupOptions } from "@/components/candidate/CandidateSetupOptions";\nimport { MatchScoreCard } from "@/components/candidate/MatchScoreCard";'
);

// 2. Remove old matchData logic
const matchDataRegex = /\/\/ Simple keyword matching against jobs[\s\S]*?matchData = \{[\s\S]*?overallScore: avgSkill,[\s\S]*?categories: \([\s\S]*?\][\s\S]*?\};[\s\S]*?\}/;
content = content.replace(matchDataRegex, '');

// The regex might not be perfect. Let me just do a manual string replace.
const oldMatchLogic = `  // Simple keyword matching against jobs
  let matchData = {
    overallScore: 0,
    categories: [
      { name: "Skills Match", score: 0 },
      { name: "Experience Match", score: 0 },
      { name: "Education Match", score: 0 },
      { name: "Keyword Match", score: 0 },
    ]
  };

  if (profile && jobs && jobs.length > 0) {
    let totalScore = 0;
    let skillScore = 0;
    
    jobs.forEach(job => {
      const jobSkills = (job.skills || []).map((s: string) => s.toLowerCase());
      const candSkills = (profile.skills || []).map((s: string) => s.toLowerCase());
      const intersection = jobSkills.filter((s: string) => candSkills.some((cs: string) => cs.includes(s) || s.includes(cs)));
      const sScore = jobSkills.length ? Math.round((intersection.length / jobSkills.length) * 100) : 0;
      skillScore += sScore;
    });

    const avgSkill = Math.round(skillScore / jobs.length);
    matchData = {
      overallScore: avgSkill,
      categories: [
        { name: "Skills Match", score: avgSkill },
        { name: "Experience Match", score: profile.experience?.length ? 80 : 0 },
        { name: "Education Match", score: profile.education?.length ? 100 : 0 },
        { name: "Keyword Match", score: avgSkill },
      ]
    };
  }`;

content = content.replace(oldMatchLogic, '');

// 3. Replace JSX
const oldCardJsx = `            {/* Overall Match Score */}
            <Card className="rounded-2xl border-slate-100 shadow-sm p-6 bg-white dark:bg-card">
              <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-6">Overall Match Score (All Jobs)</h3>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-[6px] border-teal-500 text-3xl font-bold text-slate-900 dark:text-white shadow-sm">
                    {matchData.overallScore}%
                  </div>
                  <span className="text-teal-600 font-semibold mt-3">{matchData.overallScore > 75 ? "Good Match" : matchData.overallScore > 40 ? "Fair Match" : "Low Match"}</span>
                  <span className="text-[12px] text-slate-400 mt-1">Based on stored data.</span>
                </div>

                <div className="flex-1 w-full space-y-4">
                  {matchData.categories.map((cat) => (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex justify-between text-[13px] font-medium">
                        <span className="text-slate-600 dark:text-slate-300">{cat.name}</span>
                        <span className="text-slate-900 dark:text-slate-100">{cat.score}%</span>
                      </div>
                      <Progress value={cat.score} className="h-1.5 bg-slate-100 dark:bg-slate-800 [&>div]:bg-teal-500" />
                    </div>
                  ))}
                  <Button variant="outline" className="w-full h-10 mt-2 text-[14px] border-slate-200 text-slate-700 justify-between group">
                    <a href="/job-profiles" className="w-full h-full flex items-center justify-between">
                      View Match Insights vs Jobs
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>`;

content = content.replace(oldCardJsx, `            {/* Overall Match Score */}
            <MatchScoreCard jobs={jobs || []} profile={profile} />`);

fs.writeFileSync('src/app/(app)/candidate/page.tsx', content, 'utf8');
console.log("Updated candidate page with MatchScoreCard!");