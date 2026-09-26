const fs = require('fs');
let path = 'src/app/(app)/quick-apply/page.tsx';
let content = fs.readFileSync(path, 'utf8');
let lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('if (!response.ok)') || l.includes('errData.detail') || l.includes('throw new Error(')) {
        console.log(`Line ${i + 1}: ${l.trim()}`);
    }
});