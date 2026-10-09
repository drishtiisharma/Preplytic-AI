import fs from 'fs';
const content = fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8');
const index = content.indexOf('navLinks.map');
console.log(content.substring(Math.max(0, index - 200), index + 500));