const fs = require('fs');
let path = 'backend/.env';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('GEMINI_TEXT_MODEL=gemini-2.5-flash', 'GEMINI_TEXT_MODEL=gemini-3.8-flash');

fs.writeFileSync(path, content, 'utf8');
console.log("Updated .env successfully.");