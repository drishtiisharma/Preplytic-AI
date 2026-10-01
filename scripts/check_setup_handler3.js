const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');

const lines = content.split('\n');
let printed = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const handleStartInterview') || lines[i].includes('async function startInterview')) {
        for (let j = i; j < i + 60 && j < lines.length; j++) {
            console.log(`Line ${j + 1}: ${lines[j]}`);
        }
        printed = true;
        break;
    }
}
if (!printed) console.log("Handler not found");