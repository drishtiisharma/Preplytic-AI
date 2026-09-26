const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');
let lines = content.split('\n');
for (let i = 460; i < lines.length; i++) {
    if (lines[i].includes('AI generation is disabled')) {
        console.log(`FOUND AT LINE ${i+1}: ${lines[i]}`);
    }
}