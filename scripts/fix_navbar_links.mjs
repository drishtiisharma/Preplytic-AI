import fs from 'fs';
let content = fs.readFileSync('src/components/landing/Navbar.tsx', 'utf8');

content = content.replace(/href: "#features"/g, 'href: "/#features"');
content = content.replace(/href: "#how-it-works"/g, 'href: "/#how-it-works"');
content = content.replace(/href: "#about"/g, 'href: "/#about"');
content = content.replace(/href: "#faq"/g, 'href: "/#faq"');
content = content.replace(/href: "#contact"/g, 'href: "/#contact"');

fs.writeFileSync('src/components/landing/Navbar.tsx', content, 'utf8');
console.log("Fixed Navbar hashes to absolute paths!");