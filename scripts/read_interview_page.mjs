import fs from 'fs';
console.log(fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8').substring(0, 3000));