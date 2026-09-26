const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');
let lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('class GenerateRequest')) {
        for(let j=0; j<6; j++) console.log(lines[i+j]);
    }
});