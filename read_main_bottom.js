const fs = require('fs');
let path = 'backend/main.py';
let content = fs.readFileSync(path, 'utf8');
let lines = content.split('\n');
for (let i = lines.length - 10; i < lines.length; i++) {
    console.log(`Line ${i + 1}: ${lines[i]}`);
}