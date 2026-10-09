const fs = require('fs');
const content = fs.readFileSync('src/components/ui/dropdown-menu.tsx', 'utf8');
const exports = content.match(/function DropdownMenu[A-Za-z0-9]*/g) || [];
console.log(exports);