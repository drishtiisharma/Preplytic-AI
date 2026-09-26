const fs = require('fs');
let content = fs.readFileSync('backend/.env', 'utf8');
let lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('GEMINI_TEXT_MODEL')) {
        console.log(`Line ${i + 1}: ${l.trim()}`);
    }
});