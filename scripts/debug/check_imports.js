const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');
let lines = content.split('\n');
for (let i = 0; i < 20; i++) {
    console.log(`Line ${i + 1}: ${lines[i]}`);
}