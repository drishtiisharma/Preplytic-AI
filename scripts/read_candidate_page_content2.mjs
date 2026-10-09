import fs from 'fs';
console.log(fs.readFileSync('src/app/(app)/candidate/page.tsx', 'utf8').substring(10000, 14000));