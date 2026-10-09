import fs from 'fs';
console.log(fs.readFileSync('src/app/(app)/candidate/actions.ts', 'utf8').substring(0, 2000));