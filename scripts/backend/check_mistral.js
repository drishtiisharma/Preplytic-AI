const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');
let lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('mistral_client')) {
        console.log(`Line ${i + 1}: ${l.trim()}`);
    }
});