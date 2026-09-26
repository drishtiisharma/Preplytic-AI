const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/candidate/page.tsx', 'utf8');
let lines = content.split('\n');
for (let i = 0; i < 40; i++) {
    console.log(`Line ${i+1}: ${lines[i]}`);
}