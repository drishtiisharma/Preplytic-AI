import fs from 'fs';
const content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(440, 460).join('\n'));