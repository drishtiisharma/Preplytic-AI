const fs = require('fs');
let configContent = fs.readFileSync('backend/ai/config.py', 'utf8');
console.log("--- config.py ---");
console.log(configContent);

let parserContent = fs.readFileSync('backend/parser.py', 'utf8');
console.log("\n--- parser.py Imports ---");
let lines = parserContent.split('\n');
for(let i=0; i<15; i++) console.log(lines[i]);