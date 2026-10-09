import fs from 'fs';
console.log(fs.readFileSync('src/components/landing/Hero.tsx', 'utf8').substring(2000, 2500));