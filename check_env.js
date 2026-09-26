const fs = require('fs');
let content = fs.readFileSync('backend/.env', 'utf8');
let lines = content.split('\n');
for (let line of lines) {
    if (line.includes('SUPABASE')) {
        console.log(line.substring(0, line.indexOf('=') + 1) + "***");
    }
}