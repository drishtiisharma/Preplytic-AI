const fs = require('fs');

console.log("=== REPORT PAGE (Top 100 lines) ===");
const reportContent = fs.readFileSync('src/app/(app)/interview/[sessionId]/report/page.tsx', 'utf8');
console.log(reportContent.split('\n').slice(0, 100).join('\n'));