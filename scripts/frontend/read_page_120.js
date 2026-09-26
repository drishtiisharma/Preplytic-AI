const fs = require('fs');
let path = 'src/app/(app)/interview/[sessionId]/page.tsx';
let content = fs.readFileSync(path, 'utf8');
let lines = content.split('\n');
for (let i = 120; i < 140; i++) {
    console.log(`Line ${i + 1}: ${lines[i]}`);
}