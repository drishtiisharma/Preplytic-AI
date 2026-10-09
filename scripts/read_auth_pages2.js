const fs = require('fs');
console.log("=== forgot-password/page.tsx ===");
console.log(fs.readFileSync('src/app/(auth)/forgot-password/page.tsx', 'utf8'));
console.log("=== reset-password/page.tsx ===");
console.log(fs.readFileSync('src/app/(auth)/reset-password/page.tsx', 'utf8'));