const fs = require('fs');
let content = fs.readFileSync('src/app/api/roadmap/generate/route.ts', 'utf8');
let lines = content.split('\n');
for (let i = 215; i < 240; i++) {
    if (lines[i] !== undefined) console.log(`Line ${i + 1}: ${lines[i]}`);
}