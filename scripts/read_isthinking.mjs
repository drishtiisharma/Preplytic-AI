import fs from 'fs';
const content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');
const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.includes('const isThinking ='));
console.log(lines.slice(startIdx - 5, startIdx + 5).join('\n'));