const fs = require('fs');
const filePath = 'src/app/(app)/interview/[sessionId]/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the signature and extraction
content = content.replace(
    /export default function AIInterviewPage\(\{ params \}: \{ params: \{ sessionId: string \} \}\) \{[\s\n]*const \{ sessionId \} = params;/g,
    "export default function AIInterviewPage({ params }: { params: Promise<{ sessionId: string }> }) {\n  const { sessionId } = React.use(params);"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated page.tsx params unwrapping.");