const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');
console.log(content.split('\n').slice(0, 80).join('\n'));