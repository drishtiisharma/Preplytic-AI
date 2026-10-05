const fs = require('fs');

console.log("=== API ROUTE EXISTS? ===");
console.log(fs.existsSync('src/app/api/report/generate/route.ts'));

console.log("\n=== BACKEND ENDPOINTS ===");
const backendContent = fs.readFileSync('backend/main.py', 'utf8');
const lines = backendContent.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@app.') || lines[i].includes('def generate_report')) {
        console.log(lines[i]);
    }
}