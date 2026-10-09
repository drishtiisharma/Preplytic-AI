import fs from 'fs';
console.log(fs.readFileSync('src/components/ui/dialog.tsx', 'utf8').substring(0, 1000));