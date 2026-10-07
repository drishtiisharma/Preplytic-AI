const fs = require('fs');
const content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');
console.log(content);