const fs = require('fs');
const path = 'src/app/api/roadmap/generate/route.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add validateRoadmap function at the top
const validationFunc = `
function validateRoadmap(roadmap: any) {
  if (typeof roadmap.readiness_score !== 'number' || roadmap.readiness_score < 0 || roadmap.readiness_score > 100) throw new Error("Invalid readiness_score");
  if (typeof roadmap.estimated_weeks !== 'number' || roadmap.estimated_weeks <= 0) throw new Error("Invalid estimated_weeks");
  if (typeof roadmap.hours_per_week !== 'number' || roadmap.hours_per_week <= 0) throw new Error("Invalid hours_per_week");
  if (typeof roadmap.summary !== 'string' || !roadmap.summary.trim()) throw new Error("Invalid summary");
  if (!Array.isArray(roadmap.focus_skills) || roadmap.focus_skills.length === 0) throw new Error("Invalid focus_skills");
  if (!Array.isArray(roadmap.phases) || roadmap.phases.length === 0) throw new Error("Invalid phases");
  
  for (const phase of roadmap.phases) {
    if (typeof phase.title !== 'string') throw new Error("Phase missing title");
    if (typeof phase.description !== 'string') throw new Error("Phase missing description");
    if (typeof phase.week_start !== 'number' || typeof phase.week_end !== 'number') throw new Error("Phase missing weeks");
    if (!['high', 'medium', 'low'].includes(phase.priority)) throw new Error("Invalid phase priority");
    if (!Array.isArray(phase.skills) || !Array.isArray(phase.resources)) throw new Error("Phase missing skills/resources");
  }
}
`;

content = content.replace(`async function generateAIResponse`, validationFunc + `\nasync function generateAIResponse`);

// 2. Fetch candidate_profiles to get the parsed resume data & existing skill gaps
const oldResumeData = `    // 4. To get parsed resume data
    const resumeData = {
       fileName: resumeRecord.file_name,
       fileSize: resumeRecord.file_size,
       uploadedAt: resumeRecord.uploaded_at
    };`;

const newResumeData = `    // 4. To get parsed resume data & candidate profile
    const { data: candidateProfile } = await supabase
      .from("candidate_profiles")
      .select("*")
      .eq("user_id", user.id)
      .eq("resume_record_id", resume_record_id)
      .single();

    const preparedContext = {
       jobDescription: jobProfile.description || jobProfile.title,
       resumeContent: candidateProfile ? candidateProfile.parsed_content : "No parsed content available",
       skills: candidateProfile ? candidateProfile.skills : [],
       existingSkillGaps: [], // To be populated if previous interview gaps exist
    };`;

content = content.replace(oldResumeData, newResumeData);

// 3. Update the call to generateAIResponse to use preparedContext
const oldCall = `generatedRoadmap = await generateAIResponse(jobProfile, resumeData);`;
const newCall = `generatedRoadmap = await generateAIResponse(preparedContext, null);\n      validateRoadmap(generatedRoadmap);`;

content = content.replace(oldCall, newCall);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated generate API with validation and context preparation.");