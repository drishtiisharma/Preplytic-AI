const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const startInterview =') || lines[i].includes('async function startInterview')) {
        for (let j = i; j < i + 50 && j < lines.length; j++) {
            console.log(`Line ${j + 1}: ${lines[j]}`);
            if (lines[j].includes('}')) {
                // heuristic end
            }
        }
        break;
    }
}