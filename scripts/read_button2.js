const fs = require('fs');
console.log(fs.readFileSync('src/components/ui/button.tsx', 'utf8').substring(1500, 3000));