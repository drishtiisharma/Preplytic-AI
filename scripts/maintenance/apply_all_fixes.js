const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

// 1. Re-apply the useParams fix
content = content.replace(
    /export default function AIInterviewPage\(\{ params \}: \{ params: \{ sessionId: string \} \}\) \{[\s\n]*const \{ sessionId \} = params;/g,
    `import { useParams } from "next/navigation";\n\nexport default function AIInterviewPage() {\n  const params = useParams();\n  const sessionId = params?.sessionId as string;`
);

content = content.replace(
    /import \{ useParams \} from "next\/navigation";\n\nexport default function/,
    "export default function"
);

content = content.replace(
    /import \{ useRouter \} from "next\/navigation";/,
    "import { useRouter, useParams } from \"next/navigation\";"
);

// 2. Re-apply the completeInterview fix
content = content.replace(
    /const completeInterview = async \(\) => \{[\s\n]*setIsCompleting\(true\);/g,
    `const completeInterview = async () => {\n    if (!sessionId) return;\n    setIsCompleting(true);`
);

// 3. Disable STT securely
content = content.replace(
    /const startRecording = async \(\) => \{[\s\n]*try \{/g,
    `const startRecording = async () => {\n    setSubmitError("Voice input unavailable (STT not configured).");\n    return;\n    try {`
);

// We need to exactly match the button to replace it without swallowing JSX
// Let's find the start of the button
const buttonSearch = '<Button \n                      variant={isRecording ? "default" : "outline"}\n                      size="icon" ';
const buttonEnd = '                    </Button>';

const buttonStartIndex = content.indexOf(buttonSearch);
if (buttonStartIndex !== -1) {
    const buttonEndIndex = content.indexOf(buttonEnd, buttonStartIndex);
    if (buttonEndIndex !== -1) {
        const fullButton = content.substring(buttonStartIndex, buttonEndIndex + buttonEnd.length);
        const newButton = `<Button \n                      variant="outline"\n                      size="icon" \n                      className="w-14 h-14 rounded-2xl border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed"\n                      disabled={true}\n                      title="Voice input unavailable"\n                    >\n                      <MicOff className="w-5 h-5" />\n                    </Button>`;
        content = content.replace(fullButton, newButton);
    }
}

fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
console.log("Updated page.tsx correctly.");