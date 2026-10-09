import fs from 'fs';
let content = fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8');

// Remove navLinks array
content = content.replace(/const navLinks = \[\s*\{ name: "Features", href: "#features" \},[\s\S]*?\];\n/, '');

// Remove desktop nav
const desktopNavRegex = /\{\/\* Desktop Nav \*\/\}\s*<nav className="hidden lg:flex items-center gap-6">[\s\S]*?<\/nav>/;
content = content.replace(desktopNavRegex, '');

// Remove mobile navLinks map and the HelpCircle link that was hardcoded
const mobileNavRegex = /<nav className="flex flex-col gap-3">[\s\S]*?<\/nav>/;
content = content.replace(mobileNavRegex, '');

fs.writeFileSync('src/components/layout/TopNav.tsx', content, 'utf8');
console.log("Removed redundant landing page links from TopNav!");