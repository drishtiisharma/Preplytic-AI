const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');
let lines = content.split('\n');
let inRoadmap = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@app.post("/generate/roadmap")')) inRoadmap = true;
    if (inRoadmap && lines[i].includes('@app.post')) {
        if(i > 0 && !lines[i].includes('roadmap')) {
             inRoadmap = false;
        }
    }
    if (inRoadmap) {
        console.log(`Line ${i + 1}: ${lines[i]}`);
    }
}