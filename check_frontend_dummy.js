const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/roadmap/page.tsx', 'utf8');
if (content.includes('AI generation is disabled')) {
    console.log("Found dummy text in frontend page");
} else {
    console.log("No dummy text in frontend page");
}