const fs = require('fs');
const content = fs.readFileSync('backend/main.py', 'utf8');
const lines = content.split('\n');
let printMode = false;
for(let i=0; i<lines.length; i++) {
    if (lines[i].includes('@app.post("/generate/interview-report")')) printMode = true;
    if (lines[i].includes('@app.post("/generate/roadmap")')) printMode = false;
    if (printMode && (lines[i].includes('if not ') || lines[i].includes('openrouter_client') || lines[i].includes('groq_client'))) {
        console.log(`Line ${i+1}: ${lines[i]}`);
    }
}