const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

// Replace specific references to isAiSpeaking
content = content.replace(/interviewState\.isAiSpeaking \?/g, 'false ?');
content = content.replace(/interviewState\.isAiSpeaking/g, 'false');

fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
console.log("Replaced leftover isAiSpeaking references!");