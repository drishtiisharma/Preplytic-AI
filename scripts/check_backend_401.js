const fs = require('fs');
const content = fs.readFileSync('backend/main.py', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('401') || lines[i].includes('Invalid API Key') || lines[i].includes('verify_token')) {
        console.log(`Line ${i + 1}: ${lines[i]}`);
    }
}