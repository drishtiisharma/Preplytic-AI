const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');

content = content.replace(
  /order_index:\s*index\s*\+\s*1\s*\/\/\s*Assuming order_index exists, if not we rely on created_at\n?/,
  ''
);

// wait, the trailing comma from the previous property might cause a syntax error if not removed.
content = content.replace(
  /question_text:\s*typeof\s*q\s*===\s*'string'\s*\?\s*q\s*:\s*JSON\.stringify\(q\),\s*\}\)\);/,
  `question_text: typeof q === 'string' ? q : JSON.stringify(q)\n            }));`
);

fs.writeFileSync('src/app/(app)/interview/page.tsx', content, 'utf8');
console.log("Removed order_index!");