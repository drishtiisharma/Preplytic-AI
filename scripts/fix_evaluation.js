const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const regex = /response_text:\s*answer,\s*evaluation:\s*evaluation/g;
if (regex.test(content)) {
    content = content.replace(regex, 'response_text: answer');
    fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
    console.log("Removed evaluation from insert payload!");
} else {
    console.log("Regex not matched!");
}