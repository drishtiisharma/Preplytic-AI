const fs = require('fs');
const lines = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8').split('\n');
lines.forEach((l, i) => console.log(`${i + 1}: ${l}`));