const fs = require('fs');
const content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');
fs.writeFileSync('E:/PreplyticAI/scripts/interview_page_backup.txt', content);