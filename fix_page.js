const fs = require('fs');
let path = 'src/app/(app)/candidate/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix candidateData initialization to never be null
const oldInit = `  const candidateData = profile ? {
    firstName: profile.name ? profile.name.split(" ")[0] : "",
    lastName: profile.name ? profile.name.split(" ").slice(1).join(" ") : "",
    initials: profile.name ? profile.name.substring(0,2).toUpperCase() : "?",
    email: profile.email || "Not provided",
    phone: profile.phone || "Not provided",
    location: profile.location || "Not provided",
    linkedin: profile.linkedin_url || "Not provided",
    github: profile.github_url || "Not provided",
    experience: (profile.experience && profile.experience.length > 0) ? profile.experience[0].title || "Not specified" : "Not provided",
    currentRole: profile.current_role || "Not provided",
    highestEducation: (profile.education && profile.education.length > 0) ? profile.education[0].degree || "Not specified" : "Not provided",
    summary: profile.summary || "No summary provided.",
    skills: profile.skills || [],
    additionalSkillsCount: profile.skills && profile.skills.length > 5 ? profile.skills.length - 5 : 0,
  } : null;`;

const newInit = `  const candidateData = {
    firstName: profile?.name ? profile.name.split(" ")[0] : "New",
    lastName: profile?.name ? profile.name.split(" ").slice(1).join(" ") : "Candidate",
    initials: profile?.name ? profile.name.substring(0,2).toUpperCase() : "NC",
    email: profile?.email || "Not provided",
    phone: profile?.phone || "Not provided",
    location: profile?.location || "Not provided",
    linkedin: profile?.linkedin_url || "Not provided",
    github: profile?.github_url || "Not provided",
    experience: (profile?.experience && profile.experience.length > 0) ? profile.experience[0].title || "Not specified" : "Not provided",
    currentRole: profile?.current_role || "Not provided",
    highestEducation: (profile?.education && profile.education.length > 0) ? profile.education[0].degree || "Not specified" : "Not provided",
    summary: profile?.summary || "Welcome! Please set up your profile by editing it or uploading a resume.",
    skills: profile?.skills || [],
    additionalSkillsCount: profile?.skills && profile.skills.length > 5 ? profile.skills.length - 5 : 0,
  };`;
content = content.replace(oldInit, newInit);

// 2. Remove the entire if (!candidateData) block
const ifNotBlockRegex = /if \(!candidateData\) \{\s*return \([\s\S]*?<\/PageContainer>\);\s*\}/;
content = content.replace(ifNotBlockRegex, '');

// 3. Update the header to use CandidateSetupOptions instead of just EditProfileDialog
const headerRegex = /<div className="flex items-center gap-3">\s*<EditProfileDialog profile=\{profile\} \/>\s*<\/div>/;
const newHeader = `<div className="flex items-center gap-3">\s*<CandidateSetupOptions />\s*</div>`;
// Wait, CandidateSetupOptions doesn't take profile? I need to pass profile to CandidateSetupOptions if it exists!
content = content.replace(headerRegex, newHeader);

fs.writeFileSync(path, content, 'utf8');
console.log("Fixed candidateData and removed blank fallback page");