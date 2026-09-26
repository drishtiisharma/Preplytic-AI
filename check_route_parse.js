const fs = require('fs');
let content = fs.readFileSync('src/app/api/roadmap/generate/route.ts', 'utf8');
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('JSON.parse')) {
        console.log(`Line ${i + 1}: ${lines[i]}`);
    }
}