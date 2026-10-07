const fs = require('fs');
const lines = fs.readFileSync('src/app/(app)/roadmap/page.tsx', 'utf8').split('\n');
for (let i = 400; i < 430; i++) {
    console.log(`${i+1}: ${lines[i]}`);
}