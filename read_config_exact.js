const fs = require('fs');
let content = fs.readFileSync('backend/ai/config.py', 'utf8');
console.log(content);