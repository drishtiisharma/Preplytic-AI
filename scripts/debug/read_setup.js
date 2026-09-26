const fs = require('fs');
if (fs.existsSync('src/app/(app)/interview/page.tsx')) {
    console.log(fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8'));
} else {
    console.log("File not found.");
}