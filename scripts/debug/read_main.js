const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');
let lines = content.split('\n');
lines.forEach((l, i) => {
  if(l.includes('roadmap_data')) {
    console.log(`Line ${i}: ${l}`);
  }
});