const fs = require('fs');
let content = fs.readFileSync('backend/ai/clients.py', 'utf8');
console.log(content);