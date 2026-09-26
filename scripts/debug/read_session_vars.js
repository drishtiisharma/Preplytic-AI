const fs = require('fs');
let path = 'src/app/(app)/interview/[sessionId]/page.tsx';
let content = fs.readFileSync(path, 'utf8');
let lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('currentQ') || l.includes('existingResponse') || l.includes('chunks')) {
        console.log(`Line ${i + 1}: ${l.trim()}`);
    }
});