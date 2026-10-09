import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/settings/page.tsx', 'utf8');

content = content.replace(
  'setAvatarUrl(publicUrl);',
  'setAvatarUrl(finalUrl);'
);

fs.writeFileSync('src/app/(app)/settings/page.tsx', content, 'utf8');
console.log("Fixed avatar URL state update!");