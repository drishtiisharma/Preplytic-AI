const fs = require('fs');
const lines = fs.readFileSync('src/app/(app)/roadmap/page.tsx', 'utf8').split('\n');
console.log(lines.slice(250, 280).join('\n'));