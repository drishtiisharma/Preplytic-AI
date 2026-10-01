const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');
const lines = content.split('\n');

for(let i=0; i<lines.length; i++) {
    if (lines[i].includes('fetch(\'/api/tts\'')) {
        for(let j=Math.max(0, i-5); j<i+20; j++) {
            console.log(`Line ${j+1}: ${lines[j]}`);
        }
        break;
    }
}