const fs = require('fs');
let path = 'src/components/landing/Navbar.tsx';
let content = fs.readFileSync(path, 'utf8');
let lines = content.split('\n');
for (let i = 0; i < 30; i++) {
    console.log(`Line ${i + 1}: ${lines[i]}`);
}