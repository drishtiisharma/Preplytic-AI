const fs = require('fs');
let path = 'src/components/landing/Navbar.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/\{ name: string; href: string; \}/g, '{ name: string; href: string; hasDropdown?: boolean; }');
fs.writeFileSync(path, content, 'utf8');
console.log("Fixed Navbar type.");