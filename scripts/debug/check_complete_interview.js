const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

// Find completeInterview
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const completeInterview =')) {
        for (let j = i; j < i + 20 && j < lines.length; j++) {
            console.log(`Line ${j + 1}: ${lines[j]}`);
            if (lines[j].includes('}')) {
                // heuristic end
            }
        }
    }
}