const fs = require('fs');
let path = 'backend/main.py';
let content = fs.readFileSync(path, 'utf8');
let lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('@app.post') || l.includes('def generate_cold_email') || l.includes('def generate_referral')) {
        console.log(`Line ${i + 1}: ${l.trim()}`);
    }
});