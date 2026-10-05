const fs = require('fs');
const interviewContent = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');
const lines = interviewContent.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('export default function')) {
        console.log(lines.slice(i, i + 10).join('\n'));
        break;
    }
}