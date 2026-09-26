const fs = require('fs');
let path = 'backend/ai/config.py';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('os.getenv("GEMINI_TEXT_MODEL", "gemini-2.5-flash")', 'os.getenv("GEMINI_TEXT_MODEL", "gemini-3.8-flash")');

fs.writeFileSync(path, content, 'utf8');
console.log("Updated config.py successfully.");