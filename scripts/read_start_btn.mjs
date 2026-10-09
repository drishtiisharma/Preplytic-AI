import fs from 'fs';
const content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const match = content.match(/Start Interview/g);
console.log("Start Interview found count:", match ? match.length : 0);

const context = content.substring(content.indexOf('Start Interview') - 500, content.indexOf('Start Interview') + 500);
console.log("\nContext:\n", context);