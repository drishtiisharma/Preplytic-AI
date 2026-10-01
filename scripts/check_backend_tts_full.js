const fs = require('fs');
const content = fs.readFileSync('backend/main.py', 'utf8');
const lines = content.split('\n');
let printed = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@app.post("/generate/tts")')) {
        for (let j = i-5; j <= i + 35; j++) {
            console.log(`Line ${j + 1}: ${lines[j]}`);
        }
        printed = true;
        break;
    }
}