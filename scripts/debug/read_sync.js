const fs = require('fs');
let path = 'src/app/api/roadmap/[id]/sync-interview/route.ts';
let content = fs.readFileSync(path, 'utf8');
console.log(content.substring(6000, 7500));