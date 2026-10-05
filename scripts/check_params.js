const fs = require('fs');

console.log("=== INTERVIEW PAGE ===");
const interviewContent = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');
console.log(interviewContent.split('\n').slice(0, 30).join('\n'));