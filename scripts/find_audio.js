const fs = require('fs');
const lines = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8').split('\n');
lines.forEach((line, i) => {
    if (line.includes('audio') || line.includes('Audio') || line.includes('isAiSpeaking')) {
        console.log(`${i+1}: ${line}`);
    }
});