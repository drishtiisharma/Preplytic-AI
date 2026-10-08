const fs = require('fs');
let content = fs.readFileSync('src/app/api/stt/route.ts', 'utf8');

if (content.includes('STT_API_KEY')) {
    content = content.replace(/STT_API_KEY/g, 'GROQ_API_KEY');
    fs.writeFileSync('src/app/api/stt/route.ts', content, 'utf8');
    console.log("Replaced STT_API_KEY with GROQ_API_KEY successfully!");
} else {
    console.log("Could not find STT_API_KEY in the file.");
}