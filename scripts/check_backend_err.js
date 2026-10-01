const fs = require('fs');
const content = fs.readFileSync('backend/main.py', 'utf8');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Failed to generate interview questions')) {
        for (let j = Math.max(0, i - 15); j <= Math.min(lines.length - 1, i + 5); j++) {
            console.log(`Line ${j + 1}: ${lines[j]}`);
        }
    }
}