const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');
let lines = content.split('\n');
for (let i = 490; i < 540; i++) {
    if (lines[i] !== undefined) console.log(`Line ${i + 1}: ${lines[i]}`);
}