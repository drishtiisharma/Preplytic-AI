const fs = require('fs');
let path = 'src/app/(app)/quick-apply/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// For cold email
content = content.replace(
    'if (!response.ok) throw new Error("Failed to generate");',
    'if (!response.ok) { const errData = await response.json().catch(() => ({})); throw new Error(errData.detail || "Failed to generate"); }'
);

fs.writeFileSync(path, content, 'utf8');
console.log("Improved frontend error handling.");