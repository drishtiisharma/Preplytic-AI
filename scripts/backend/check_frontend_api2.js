const fs = require('fs');
let content = fs.readFileSync('src/app/api/roadmap/generate/route.ts', 'utf8');
if (content.includes('AI generation is disabled') || content.includes('Pending AI Generation')) {
    console.log("Dummy text exists in frontend API route!");
} else {
    console.log("No dummy text in frontend API route");
}