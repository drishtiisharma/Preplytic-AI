const fs = require('fs');
let path = 'src/app/api/roadmap/[id]/sync-interview/route.ts';
let content = fs.readFileSync(path, 'utf8');

// There is a try block without catch at the end of the file or commented out improperly.
// Let's print the last 30 lines.
let lines = content.split('\n');
console.log(lines.slice(Math.max(lines.length - 30, 0)).join('\n'));