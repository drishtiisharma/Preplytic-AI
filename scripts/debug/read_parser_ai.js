const fs = require('fs');
let content = fs.readFileSync('backend/parser.py', 'utf8');
let lines = content.split('\n');
lines.forEach((l, i) => {
    if(l.includes('ai')) {
        console.log(`Line ${i+1}: ${l.trim()}`);
    }
});