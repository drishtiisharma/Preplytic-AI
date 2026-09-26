const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

// Replace the signature to use useParams
content = content.replace(
    /export default function AIInterviewPage\(\{ params \}: \{ params: Promise<\{ sessionId: string \}> \}\) \{[\s\n]*const \{ sessionId \} = React\.use\(params\);/g,
    `import { useParams } from "next/navigation";\n\nexport default function AIInterviewPage() {\n  const params = useParams();\n  const sessionId = params?.sessionId as string;`
);

// We also need to remove the extra import if it duplicated useRouter
content = content.replace(
    /import \{ useParams \} from "next\/navigation";\n\nexport default function/,
    "export default function"
);
content = content.replace(
    /import \{ useRouter \} from "next\/navigation";/,
    "import { useRouter, useParams } from \"next/navigation\";"
);

// Add safety check in completeInterview
content = content.replace(
    /const completeInterview = async \(\) => \{[\s\n]*setIsCompleting\(true\);/g,
    `const completeInterview = async () => {\n    if (!sessionId) return;\n    setIsCompleting(true);`
);

fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
console.log("Updated page.tsx to use useParams and protect completeInterview.");