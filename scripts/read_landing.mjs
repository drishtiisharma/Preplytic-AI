import fs from 'fs';
console.log(fs.readFileSync('src/app/page.tsx', 'utf8').substring(0, 3000));