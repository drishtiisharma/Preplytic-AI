import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');
const controlsIdx = content.indexOf('{/* Bottom Controls */}');
console.log(content.substring(controlsIdx, controlsIdx + 2000));