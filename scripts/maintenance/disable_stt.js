const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

// 1. Disable startRecording completely
content = content.replace(
    /const startRecording = async \(\) => \{[\s\n]*try \{[\s\n]*const stream = await navigator\.mediaDevices\.getUserMedia/g,
    `const startRecording = async () => {\n    setSubmitError("Voice input unavailable (STT not configured).");\n    return;\n    try {\n      const stream = await navigator.mediaDevices.getUserMedia`
);

// 2. Disable the Microphone button visually and functionally
const oldButton = `<Button \n                      variant={isRecording ? "default" : "outline"}\n                      size="icon" \n                      className={\`w-14 h-14 rounded-2xl border-slate-200 \${isRecording ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" : "text-slate-600 hover:bg-slate-50 bg-white"}\`}\n                      onClick={isRecording ? stopRecording : startRecording}\n                      disabled={isProcessingVoice || isSubmitting}\n                    >\n                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}\n                    </Button>`;

const newButton = `<Button \n                      variant="outline"\n                      size="icon" \n                      className="w-14 h-14 rounded-2xl border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed"\n                      disabled={true}\n                      title="Voice input unavailable"\n                    >\n                      <MicOff className="w-5 h-5" />\n                    </Button>`;

// Handle potential whitespace differences by using regex for the button replacement
content = content.replace(
    /<Button[\s\S]*?onClick=\{isRecording \? stopRecording : startRecording\}[\s\S]*?<\/Button>/,
    newButton
);

fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
console.log("Updated page.tsx to disable STT.");