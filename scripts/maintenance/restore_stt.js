const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

// 1. Remove the early return from startRecording
content = content.replace(
    /const startRecording = async \(\) => \{[\s\n]*setSubmitError\("Voice input unavailable \(STT not configured\)\."\);[\s\n]*return;[\s\n]*try \{/g,
    `const startRecording = async () => {\n    try {`
);

// 2. Restore the original Mic Button
const oldButtonDisabled = `<Button \n                      variant="outline"\n                      size="icon" \n                      className="w-14 h-14 rounded-2xl border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed"\n                      disabled={true}\n                      title="Voice input unavailable"\n                    >\n                      <MicOff className="w-5 h-5" />\n                    </Button>`;

const originalButton = `<Button \n                      variant={isRecording ? "default" : "outline"}\n                      size="icon" \n                      className={\`w-14 h-14 rounded-2xl border-slate-200 \${isRecording ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" : "text-slate-600 hover:bg-slate-50 bg-white"}\`}\n                      onClick={isRecording ? stopRecording : startRecording}\n                      disabled={isProcessingVoice || isSubmitting}\n                    >\n                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}\n                    </Button>`;

content = content.replace(oldButtonDisabled, originalButton);

fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
console.log("Restored STT flow.");