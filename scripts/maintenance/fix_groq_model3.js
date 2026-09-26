const fs = require('fs');

let configContent = fs.readFileSync('backend/ai/config.py', 'utf8');
configContent = configContent.replace('"mixtral-8x7b-32768"', '"openai/gpt-oss-120b"');
fs.writeFileSync('backend/ai/config.py', configContent, 'utf8');

let envContent = fs.readFileSync('backend/.env', 'utf8');
envContent = envContent.replace('mixtral-8x7b-32768', 'openai/gpt-oss-120b');
fs.writeFileSync('backend/.env', envContent, 'utf8');

console.log("Updated Groq model to openai/gpt-oss-120b");