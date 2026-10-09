import fs from 'fs';
let content = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

// The Sidebar usually has a navItems array. I will comment out the dashboard item.
// Let's first read it to be sure.
console.log(content.substring(0, 1500));