const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('currentQ') || lines[i].includes('qData')) {
        for (let j = Math.max(0, i - 1); j <= i + 1; j++) {
            console.log(`Line ${j + 1}: ${lines[j]}`);
        }
    }
}