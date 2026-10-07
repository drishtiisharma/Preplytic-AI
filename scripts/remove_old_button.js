const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const oldButtonRegex = /\{answer && !existingResponse && \([\s\S]*?<Button\s+onClick=\{handleAnswerSubmit\}[\s\S]*?\{isSubmitting \? "Evaluating\.\.\." : "Submit Answer"\}\s*<\/Button>\s*\)\}/;

if (oldButtonRegex.test(content)) {
    content = content.replace(oldButtonRegex, '');
    fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
    console.log("Removed redundant Submit Answer button!");
} else {
    console.log("Regex not matched!");
}