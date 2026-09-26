const fs = require('fs');
let path = 'src/types_db.ts';
if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    let lines = content.split('\n');
    lines.forEach((l, i) => {
        if (l.toLowerCase().includes('profile') || l.toLowerCase().includes('candidate')) {
            console.log(`Line ${i + 1}: ${l.trim()}`);
        }
    });
} else {
    console.log("types_db.ts not found.");
}