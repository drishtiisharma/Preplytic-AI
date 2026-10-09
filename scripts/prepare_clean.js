const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

// Remove states related to recording and TTS
content = content.replace(/const \[isRecording, setIsRecording\] = useState\(false\);\n/g, '');
content = content.replace(/const \[mediaRecorder, setMediaRecorder\] = useState<MediaRecorder \| null>\(null\);\n/g, '');
content = content.replace(/const \[isProcessingVoice, setIsProcessingVoice\] = useState\(false\);\n/g, '');
content = content.replace(/const \[isAiSpeaking, setIsAiSpeaking\] = useState\(false\);\n/g, '');

// The interviewState still has isAiSpeaking: false, let's leave it or remove it from the default object
content = content.replace(/isAiSpeaking: false/g, '');
content = content.replace(/,  \}/g, ' }');

// Remove audioRef
content = content.replace(/const audioRef = React\.useRef<HTMLAudioElement \| null>\(null\);\n/g, '');

// Remove startRecording, stopRecording, processAudio functions
// This might be tricky with regex, so let's try to match them if they are simple
// Since I can't easily parse AST in a simple script, I will write a script to output the whole file with line numbers so I can use multi_replace_file_content or a custom Node script.