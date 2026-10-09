import fs from 'fs';
console.log(fs.readFileSync('src/components/landing/Navbar.tsx', 'utf8').substring(0, 1500));