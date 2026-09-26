const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');
let lines = content.split('\n');
for (let i = 80; i < 155; i++) {
    console.log(`Line ${i + 1}: ${lines[i]}`);
}