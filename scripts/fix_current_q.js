const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const regex = /"\{interviewState\.currentQuestion\}"/;
const replacement = `{currentQ ? \`"\${currentQ.question_text}"\` : "Loading question..."}`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
    console.log("Updated Current Question UI!");
} else {
    console.log("Regex not matched!");
}