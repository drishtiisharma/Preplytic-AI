const fs = require('fs');

let configContent = fs.readFileSync('backend/ai/config.py', 'utf8');
configContent = configContent.replace('"llama3-8b-8192"', '"mixtral-8x7b-32768"');
fs.writeFileSync('backend/ai/config.py', configContent, 'utf8');

let envContent = fs.readFileSync('backend/.env', 'utf8');
envContent = envContent.replace('llama3-8b-8192', 'mixtral-8x7b-32768');
fs.writeFileSync('backend/.env', envContent, 'utf8');

console.log("Updated Groq model to mixtral-8x7b-32768");