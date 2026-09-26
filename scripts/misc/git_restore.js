const { execSync } = require('child_process');
execSync('git checkout "src/app/(app)/interview/[sessionId]/page.tsx"');
console.log("Restored");