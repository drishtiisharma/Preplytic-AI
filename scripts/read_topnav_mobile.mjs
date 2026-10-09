import fs from 'fs';
const content = fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8');
const index = content.indexOf('<SheetContent');
console.log(content.substring(index, index + 1000));