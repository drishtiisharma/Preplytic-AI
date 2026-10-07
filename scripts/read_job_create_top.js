const fs = require('fs');
const lines = fs.readFileSync('src/app/(app)/job-profiles/create/page.tsx', 'utf8').split('\n');
console.log(lines.slice(0, 100).join('\n'));