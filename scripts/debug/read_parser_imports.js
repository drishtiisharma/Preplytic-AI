const fs = require('fs');
let content = fs.readFileSync('backend/parser.py', 'utf8');
let lines = content.split('\n');
lines.forEach(l => {
    if(l.startsWith('import ') || l.startsWith('from ')) {
        console.log(l.trim());
    }
});