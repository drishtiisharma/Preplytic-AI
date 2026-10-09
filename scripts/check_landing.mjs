import fs from 'fs';
const content = fs.readFileSync('src/app/page.tsx', 'utf8');
const idMatches = content.match(/id="[^"]+"/g);
console.log("IDs in page.tsx:", idMatches);