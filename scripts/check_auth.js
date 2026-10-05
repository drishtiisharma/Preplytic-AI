const fs = require('fs');

console.log("=== REPORT PAGE ===");
console.log(fs.readFileSync('src/app/(app)/interview/[sessionId]/report/page.tsx', 'utf8'));

console.log("\n=== DASHBOARD PAGE ===");
console.log(fs.readFileSync('src/app/(app)/dashboard/page.tsx', 'utf8'));