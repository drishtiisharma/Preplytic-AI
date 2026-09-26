const fs = require('fs');
console.log('--- backend/ai/config.py ---');
console.log(fs.readFileSync('backend/ai/config.py', 'utf8'));
console.log('\n--- backend/ai/clients.py ---');
console.log(fs.readFileSync('backend/ai/clients.py', 'utf8'));