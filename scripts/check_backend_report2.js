const fs = require('fs');
const content = fs.readFileSync('backend/main.py', 'utf8');
const lines = content.split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@app.post("/generate/interview-report")')) {
        startIndex = i;
    }
    // Find the next @app.post or end of file
    if (startIndex !== -1 && i > startIndex && lines[i].includes('@app.post(')) {
        endIndex = i;
        break;
    }
}

if (startIndex !== -1) {
    if (endIndex === -1) endIndex = lines.length;
    console.log(lines.slice(startIndex, endIndex).join('\n'));
} else {
    console.log("Endpoint not found.");
}