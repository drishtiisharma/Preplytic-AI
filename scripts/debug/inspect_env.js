const fs = require('fs');
let clientsContent = fs.readFileSync('backend/ai/clients.py', 'utf8');
console.log("--- clients.py ---");
console.log(clientsContent);

let envContent = fs.readFileSync('backend/.env', 'utf8');
console.log("\n--- .env Keys ---");
envContent.split('\n').forEach(line => {
    let key = line.split('=')[0];
    if (key.trim()) console.log(key);
});

let mainContent = fs.readFileSync('backend/main.py', 'utf8');
console.log("\n--- main.py Initialization Order ---");
let lines = mainContent.split('\n');
for(let i=0; i<20; i++) console.log(lines[i]);
for(let i=70; i<78; i++) console.log(lines[i]);