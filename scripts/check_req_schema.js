const fs = require('fs');
const content = fs.readFileSync('backend/main.py', 'utf8');
const lines = content.split('\n');
let printed = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('class InterviewGenerateRequest(BaseModel):')) {
        for (let j = i; j <= i + 10; j++) {
            console.log(`Line ${j + 1}: ${lines[j]}`);
        }
        printed = true;
        break;
    }
}
if (!printed) { console.log("Not found."); }