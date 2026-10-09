import fs from 'fs';
let content = fs.readFileSync('src/components/candidate/MatchScoreCard.tsx', 'utf8');

const oldLogic = `  if (isSelected && profile && selectedJob && !hasMissingData) {
    const jobSkills = parsedJobSkills;
    const candSkills = (profile.skills || []).map((s: string) => s.toLowerCase());
    const intersection = jobSkills.filter((s: string) => candSkills.some((cs: string) => cs.includes(s) || s.includes(cs)));
    const skillScore = jobSkills.length ? Math.round((intersection.length / jobSkills.length) * 100) : 0;
    
    // Simulate other match metrics based on profile depth if exact extraction isn't available
    const expScore = profile.experience?.length ? (profile.experience.length >= 2 ? 90 : 60) : 0;
    const eduScore = profile.education?.length ? 100 : 0;
    const keywordScore = skillScore > 0 ? Math.min(skillScore + 10, 100) : 0; // Simple simulation

    const overallScore = Math.round((skillScore * 0.4) + (expScore * 0.3) + (eduScore * 0.1) + (keywordScore * 0.2));`;

const newLogic = `  if (isSelected && profile && selectedJob && !hasMissingData) {
    const jobSkills = parsedJobSkills;
    const candSkills = (profile.skills || []).map((s: string) => s.toLowerCase());
    
    let matchCount = 0;
    jobSkills.forEach((s: string) => {
      if (candSkills.some((cs: string) => cs.includes(s) || s.includes(cs))) {
        matchCount += 1;
      } else {
        const jobWords = s.split(/\\s+/).filter(w => w.length > 3);
        const hasPartial = candSkills.some((cs: string) => {
          const candWords = cs.split(/\\s+/).filter(w => w.length > 3);
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
    const overallScore = Math.min(100, Math.round((skillScore * 0.4) + (expScore * 0.35) + (eduScore * 0.1) + (keywordScore * 0.15)));`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync('src/components/candidate/MatchScoreCard.tsx', content, 'utf8');
console.log("Updated match scoring to be more generous!");