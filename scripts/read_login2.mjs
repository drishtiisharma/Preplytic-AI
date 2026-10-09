import fs from 'fs';
console.log(fs.readFileSync('src/app/(auth)/login/page.tsx', 'utf8').substring(3000, 6000));