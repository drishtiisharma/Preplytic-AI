const fs = require('fs');
const lines = fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8').split('\n');
console.log(lines.slice(0, 30).join('\n'));