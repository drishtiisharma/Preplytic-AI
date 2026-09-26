const fs = require('fs');
let transcript = fs.readFileSync('C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\cc143510-c94d-4b64-b535-122cb7333881\\.system_generated\\logs\\transcript.jsonl', 'utf8');
let lines = transcript.split('\n');
for (let line of lines) {
    if (line.includes('RLS') || line.includes('roadmap_versions')) {
        console.log(line.substring(0, 300));
    }
}