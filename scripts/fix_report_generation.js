const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/report/page.tsx', 'utf8');

const regex = /useEffect\(\(\) => \{\n\s*async function fetchReport\(\) \{/;
const replacement = `useEffect(() => {
    if (hasGenerated.current) return;
    hasGenerated.current = true;
    
    async function fetchReport() {`;

content = content.replace(regex, replacement);

const regex2 = /\/\/ Report not found, generate it!\n\s*if \(hasGenerated\.current\) return;\n\s*hasGenerated\.current = true;/;
const replacement2 = `// Report not found, generate it!`;

content = content.replace(regex2, replacement2);

fs.writeFileSync('src/app/(app)/interview/[sessionId]/report/page.tsx', content, 'utf8');
console.log("Fixed duplicate report generation!");