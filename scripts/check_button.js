const fs = require('fs');
const lines = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8').split('\n');
console.log(lines.slice(640, 660).join('\n'));