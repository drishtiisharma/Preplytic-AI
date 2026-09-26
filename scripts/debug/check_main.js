const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');
let lines = content.split('\n');
let inRoadmap = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('mistral_client')) {
        console.log(`Line ${i + 1}: ${lines[i].trim()}`);
    }
}