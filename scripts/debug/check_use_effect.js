const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('useEffect(() => {') && lines[i+1] && lines[i+1].includes('if (sessionId) {')) {
        for (let j = i - 2; j < i + 25 && j < lines.length; j++) {
            console.log(`Line ${j + 1}: ${lines[j]}`);
        }
    }
}