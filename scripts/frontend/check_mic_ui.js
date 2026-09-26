const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<Mic') || lines[i].includes('<MicOff')) {
        for (let j = Math.max(0, i - 15); j < i + 15 && j < lines.length; j++) {
            console.log(`Line ${j + 1}: ${lines[j]}`);
        }
        break; // we only need the first occurrence context
    }
}