const fs = require('fs');
const lines = fs.readFileSync('src/app/globals.css', 'utf8').split('\n');
console.log(lines.slice(Math.max(lines.length - 20, 0)).join('\n'));