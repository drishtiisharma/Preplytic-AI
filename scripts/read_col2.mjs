import fs from 'fs';
const content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');
const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.includes('{/* 2. AI Interviewer Column */}'));
console.log(lines.slice(startIdx - 5, startIdx + 20).join('\n'));