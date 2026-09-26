const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(100, 160).join('\n'));