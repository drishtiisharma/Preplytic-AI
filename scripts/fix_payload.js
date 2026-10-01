const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');

content = content.replace(
  /job_profile: jobProfile\.job_description \|\| JSON\.stringify\(jobProfile\),/,
  'job_profile: jobProfile,'
);

content = content.replace(
  /resume_data: JSON\.stringify\(resumeRecord\)/,
  'resume_data: resumeRecord'
);

fs.writeFileSync('src/app/(app)/interview/page.tsx', content, 'utf8');
console.log("Updated payload!");