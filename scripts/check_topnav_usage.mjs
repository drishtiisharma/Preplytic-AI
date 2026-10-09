import fs from 'fs';
const content = fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8');
if (content.includes('navLinks.map')) {
    console.log("TopNav uses navLinks!");
} else {
    console.log("TopNav does not use navLinks!");
}