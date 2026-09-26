const fs = require('fs');
let path = 'src/app/(app)/quick-apply/page.tsx';
let content = fs.readFileSync(path, 'utf8');
let lines = content.split('\n');
for (let i = 0; i < 150; i++) {
    console.log(`Line ${i+1}: ${lines[i]}`);
}