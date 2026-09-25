const fs = require('fs');
let path = 'src/app/(app)/interview/[sessionId]/report/page.tsx';
let content = fs.readFileSync(path, 'utf8');
const matches = content.match(/report\.([a-zA-Z_]+)/g);
console.log(Array.from(new Set(matches)));