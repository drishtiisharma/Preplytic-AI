const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    console.log(`${i+1}: ${lines[i]}`);
}