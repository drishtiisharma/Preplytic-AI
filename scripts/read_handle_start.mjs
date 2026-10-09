import fs from 'fs';
const content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const startIndex = content.indexOf('const handleStartInterview =');
console.log(content.substring(startIndex, startIndex + 2000));