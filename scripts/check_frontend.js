const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');
const lines = content.split('\n');

console.log("--- TTS Logic ---");
for(let i=0; i<lines.length; i++) {
    if (lines[i].includes('fetch(\'/api/tts\'')) {
        for(let j=Math.max(0, i-2); j<i+15; j++) {
            console.log(lines[j]);
        }
        break;
    }
}

console.log("\n--- STT Logic ---");
for(let i=0; i<lines.length; i++) {
    if (lines[i].includes('/api/stt') || lines[i].includes('stt') || lines[i].includes('SpeechRecognition')) {
        for(let j=Math.max(0, i-2); j<i+10; j++) {
            console.log(lines[j]);
        }
        break;
    }
}