const fs = require('fs');
const lines = fs.readFileSync('src/components/ui/dropdown-menu.tsx', 'utf8').split('\n');
console.log(lines.slice(150, 180).join('\n'));