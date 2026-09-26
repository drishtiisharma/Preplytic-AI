const fs = require('fs');
let content = fs.readFileSync('backend/.env', 'utf8');
content.split('\n').forEach(line => {
    if(line.startsWith('GEMINI_API_KEY')) {
        let val = line.substring(line.indexOf('=') + 1).trim();
        console.log(`Length: ${val.length}`);
        console.log(`StartsWith Quote: ${val.startsWith('"') || val.startsWith("'")}`);
        console.log(`Is empty: ${val === '""' || val === "''" || val === ''}`);
        if(val.length > 5) {
            console.log(`First 3 chars: ${val.substring(0,3)}`);
        }
    }
});