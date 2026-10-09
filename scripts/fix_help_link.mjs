import fs from 'fs';
let content = fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8');

content = content.replace(/href="#help"/g, 'href="/#faq"');

fs.writeFileSync('src/components/layout/TopNav.tsx', content, 'utf8');
console.log("Fixed help link in TopNav!");