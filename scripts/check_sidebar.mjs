import fs from 'fs';
const content = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');
if (content.includes('DropdownMenuLabel')) {
  console.log("Sidebar has DropdownMenuLabel");
} else {
  console.log("Sidebar does not have DropdownMenuLabel");
}