const fs = require('fs');
console.log(fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8').substring(3000, 5000));