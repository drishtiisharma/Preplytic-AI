const fs = require('fs');

console.log("=== TTS ROUTE URL ===");
const ttsCode = fs.readFileSync('src/app/api/tts/route.ts', 'utf8');
const ttsLines = ttsCode.split('\n');
ttsLines.forEach(l => {
    if (l.includes('fetch(') || l.includes('http://')) console.log(l.trim());
});

console.log("\n=== REPORT ROUTE URL ===");
const repCode = fs.readFileSync('src/app/api/report/generate/route.ts', 'utf8');
const repLines = repCode.split('\n');
repLines.forEach(l => {
    if (l.includes('fetch(') || l.includes('http://')) console.log(l.trim());
});