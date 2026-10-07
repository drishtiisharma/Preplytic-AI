const fs = require('fs');
let content1 = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');
let content2 = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const regex = /animationDelay:\s*i\s*\*\s*0\.1\s*\+\s*'s'/g;
const replacement = 'animationDelay: `${i * 0.1}s`';

content1 = content1.replace(regex, replacement);
content2 = content2.replace(regex, replacement);

fs.writeFileSync('src/app/(app)/interview/page.tsx', content1, 'utf8');
fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content2, 'utf8');
console.log("Fixed animationDelay style in both files!");