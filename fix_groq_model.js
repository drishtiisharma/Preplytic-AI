const fs = require('fs');

let configContent = fs.readFileSync('backend/ai/config.py', 'utf8');
configContent = configContent.replace('"llama-3.1-8b-instant"', '"llama3-8b-8192"');
fs.writeFileSync('backend/ai/config.py', configContent, 'utf8');

let envContent = fs.readFileSync('backend/.env', 'utf8');
envContent = envContent.replace('llama-3.1-8b-instant', 'llama3-8b-8192');
fs.writeFileSync('backend/.env', envContent, 'utf8');

console.log("Updated Groq model to llama3-8b-8192");