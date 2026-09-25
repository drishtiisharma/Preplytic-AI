const fs = require('fs');
let path = 'backend/ai/clients.py';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('from mistralai import Mistral', 'from mistralai.client import Mistral');

fs.writeFileSync(path, content, 'utf8');
console.log("Fixed mistral import in clients.py");