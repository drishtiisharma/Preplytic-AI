const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/roadmap/page.tsx', 'utf8');
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('JSON.parse') && (lines[i].includes('skills') || lines[i].includes('resources'))) {
        console.log(`Line ${i + 1}: ${lines[i]}`);
    }
}