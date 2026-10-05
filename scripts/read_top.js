const fs = require('fs');
const lines = fs.readFileSync('src/app/(app)/interview/[sessionId]/report/page.tsx', 'utf8').split('\n');
console.log(lines.slice(0, 60).join('\n'));