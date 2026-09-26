const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');

const lines = content.split('\n');
let found = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@app.post("/generate/interview-questions")')) {
        for (let j = i; j < i + 40 && j < lines.length; j++) {
            console.log(`Line ${j + 1}: ${lines[j]}`);
        }
        break;
    }
}