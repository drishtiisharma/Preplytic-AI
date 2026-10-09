import fs from 'fs';
let content = fs.readFileSync('src/components/candidate/MatchScoreCard.tsx', 'utf8');

const oldLogic = `  const hasMissingData = isSelected && (!profile?.skills || !selectedJob?.skills);

  if (isSelected && profile && selectedJob && !hasMissingData) {
    const jobSkills = (selectedJob.skills || []).map((s: string) => s.toLowerCase());
    const candSkills = (profile.skills || []).map((s: string) => s.toLowerCase());`;

const newLogic = `  const jobSkillsRaw = selectedJob?.required_skills || selectedJob?.job_description || "";
  const parsedJobSkills = typeof jobSkillsRaw === 'string' 
    ? jobSkillsRaw.split(/[,;\n]/).map(s => s.trim().toLowerCase()).filter(Boolean)
    : (jobSkillsRaw || []).map((s: string) => typeof s === 'string' ? s.toLowerCase() : '');

  const hasMissingData = isSelected && (!profile?.skills || parsedJobSkills.length === 0);

  if (isSelected && profile && selectedJob && !hasMissingData) {
    const jobSkills = parsedJobSkills;
    const candSkills = (profile.skills || []).map((s: string) => s.toLowerCase());`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync('src/components/candidate/MatchScoreCard.tsx', content, 'utf8');
console.log("Fixed MatchScoreCard missing data logic!");