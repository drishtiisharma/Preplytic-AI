const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/roadmap/page.tsx', 'utf8');
let lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('focus_skills')) {
        console.log(`Line ${i + 1}: ${l.trim()}`);
    }
});