const fs = require('fs');
console.log("=== forgot-password/page.tsx ===");
console.log(fs.readFileSync('src/app/forgot-password/page.tsx', 'utf8').substring(0, 2000));
console.log("=== reset-password/page.tsx ===");
console.log(fs.readFileSync('src/app/reset-password/page.tsx', 'utf8').substring(0, 2000));