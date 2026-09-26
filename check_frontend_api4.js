const fs = require('fs');
let content = fs.readFileSync('src/app/api/roadmap/generate/route.ts', 'utf8');
let lines = content.split('\n');
for (let i = 0; i < 145; i++) {
    if (lines[i].includes('AI generation is disabled')) {
        console.log(`FOUND IN ROUTE.TS AT LINE ${i+1}`);
    }
}