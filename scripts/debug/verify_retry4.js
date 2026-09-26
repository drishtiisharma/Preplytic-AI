const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');
let lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('_generate_with_retry') || l.includes('gemini_client.models.generate_content')) {
        console.log(`Line ${i + 1}: ${l.trim()}`);
    }
});