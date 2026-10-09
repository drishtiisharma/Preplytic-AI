import fs from 'fs';
const content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');

const match = content.match(/AI is speaking.../g);
console.log("AI is speaking found count:", match ? match.length : 0);

const context = content.substring(content.indexOf('AI is speaking...') - 200, content.indexOf('AI is speaking...') + 200);
console.log("\nContext:\n", context);