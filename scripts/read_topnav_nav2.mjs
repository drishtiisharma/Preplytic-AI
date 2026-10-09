import fs from 'fs';
console.log(fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8').substring(0, 1500));