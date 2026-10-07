const fs = require('fs');
const lines = fs.readFileSync('src/app/(app)/roadmap/page.tsx', 'utf8').split('\n');
lines.forEach((line, i) => {
    if (line.includes('<button') || line.includes('<Button') || line.includes('</button') || line.includes('</Button')) {
        console.log(`${i+1}: ${line.trim()}`);
    }
});