import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');

content = content.replace(
  /\{interviewState\.isAiSpeaking && \(\s*\)\}/g,
  ``
);

fs.writeFileSync('src/app/(app)/interview/page.tsx', content, 'utf8');