import fs from 'fs';
const content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

console.log({
  hasIsThinking: content.includes('const isThinking = ')
});