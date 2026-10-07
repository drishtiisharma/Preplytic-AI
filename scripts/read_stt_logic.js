const fs = require('fs');
const lines = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8').split('\n');

let start = -1;
let openBraces = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const stopRecording = () => {')) {
        start = i;
        openBraces = (lines[i].match(/\{/g) || []).length - (lines[i].match(/\}/g) || []).length;
    } else if (start !== -1) {
        openBraces += (lines[i].match(/\{/g) || []).length;
        openBraces -= (lines[i].match(/\}/g) || []).length;
        if (openBraces === 0) {
            console.log(lines.slice(start, i + 1).join('\n'));
            break;
        }
    }
}