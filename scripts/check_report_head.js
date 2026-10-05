const fs = require('fs');
const content = fs.readFileSync('src/app/(app)/interview/[sessionId]/report/page.tsx', 'utf8');
console.log(content.split('\n').slice(0, 30).join('\n'));