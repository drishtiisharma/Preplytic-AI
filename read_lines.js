const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');
let lines = content.split(/\r?\n/);
for (let i = 480; i < 530; i++) {
    if(lines[i] !== undefined) {
        console.log(`Line ${i + 1}: ${lines[i]}`);
    }
}