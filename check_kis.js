const fs = require('fs');
const path = require('path');
const kiPath = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\knowledge';
if (fs.existsSync(kiPath)) {
    const files = fs.readdirSync(kiPath);
    for (const file of files) {
        if (file.endsWith('.json')) {
            console.log(`--- ${file} ---`);
            console.log(fs.readFileSync(path.join(kiPath, file), 'utf8'));
        }
    }
}