const fs = require('fs');
const content = fs.readFileSync('backend/main.py', 'utf8');
const lines = content.split('\n');

let printMode = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@app.post("/generate/interview-questions")')) {
        console.log("=== INTERVIEW QUESTIONS ENDPOINT ===");
        printMode = true;
    }
    if (lines[i].includes('@app.post("/generate/interview-evaluate")') && printMode) {
        printMode = false;
        console.log("===================================\n");
    }
    
    if (printMode) console.log(lines[i]);
}

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@app.post("/generate/interview-report")')) {
        console.log("=== INTERVIEW REPORT ENDPOINT ===");
        printMode = true;
    }
    if (lines[i].includes('@app.post("/generate/roadmap")') && printMode) {
        printMode = false;
        console.log("===================================\n");
    }
    
    if (printMode) console.log(lines[i]);
}