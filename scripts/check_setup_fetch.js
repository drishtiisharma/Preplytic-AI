const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');

const lines = content.split('\n');
let found = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('fetch(') || lines[i].includes('fetch (')) {
        for (let j = Math.max(0, i - 2); j < i + 10 && j < lines.length; j++) {
            console.log(`Line ${j + 1}: ${lines[j]}`);
        }
        found = true;
        console.log("---------");
    }
}
if (!found) console.log("No fetch calls found in setup page.");