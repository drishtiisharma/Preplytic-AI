const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/roadmap/page.tsx', 'utf8');

// 1. Fix nested button hydration error
content = content.replace(/<DropdownMenuTrigger>/g, '<DropdownMenuTrigger asChild>');

// 2. Fix strokeDashoffset NaN
const oldOffset = /strokeDashoffset=\{289 - \(289 \* totalProgress\) \/ 100\}/g;
const newOffset = 'strokeDashoffset={isNaN(totalProgress) ? 289 : (289 - (289 * totalProgress) / 100)}';
content = content.replace(oldOffset, newOffset);

fs.writeFileSync('src/app/(app)/roadmap/page.tsx', content, 'utf8');
console.log("Fixed roadmap hydration and NaN issues!");