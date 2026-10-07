const fs = require('fs');
console.log("=== API Route ===");
console.log(fs.readFileSync('src/app/api/report/generate/route.ts', 'utf8'));

console.log("\n=== Backend Main ===");
const backendLines = fs.readFileSync('backend/main.py', 'utf8').split('\n');
let start = -1;
for (let i = 0; i < backendLines.length; i++) {
    if (backendLines[i].includes('def generate_interview_report')) {
        start = i;
    }
    if (start !== -1 && i > start + 30) {
        console.log(backendLines.slice(start, i).join('\n'));
        break;
    }
}