const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@app.post') || lines[i].includes('def generate_')) {
        console.log(`Line ${i + 1}: ${lines[i]}`);
    }
}