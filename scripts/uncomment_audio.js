const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const updatedContent = content.replace(
    /\/\/ audio\.play\(\)\.catch\(e => console\.warn\("Audio autoplay blocked"\)\);/,
    'audio.play().catch(e => console.warn("Audio autoplay blocked", e));'
);

fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', updatedContent, 'utf8');
console.log("Uncommented audio.play()");