const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

// Remove states
content = content.replace(/const \[isRecording, setIsRecording\] = useState\(false\);\n/g, '');
content = content.replace(/const \[mediaRecorder, setMediaRecorder\] = useState<MediaRecorder \| null>\(null\);\n/g, '');
content = content.replace(/const \[isProcessingVoice, setIsProcessingVoice\] = useState\(false\);\n/g, '');
content = content.replace(/const audioRef = React\.useRef<HTMLAudioElement \| null>\(null\);\n/g, '');

// Strip out isAiSpeaking state fields
content = content.replace(/,\s*isAiSpeaking:\s*false/g, '');
content = content.replace(/setInterviewState\(\{ \.\.\.interviewState, isAiSpeaking: true \}\);\n?/g, '');
content = content.replace(/setInterviewState\(\{ \.\.\.interviewState, isAiSpeaking: false \}\);\n?/g, '');
content = content.replace(/isAiSpeaking: true/g, '');
content = content.replace(/isAiSpeaking: false/g, '');

// We need to carefully remove playAudio, handleStartRecording, handleStopRecording, processAudio functions
// Using a regex with greedy match might break things. I will comment them out or remove them using simpler matching.
// Instead of risky regex, I'll match the function declarations and remove their bodies, or remove the whole block if I can match reliably.
// Since it's a TSX file, we can use a small AST parser or just robust string manipulation.
// Actually, it's easier to just match from "const playAudio = " to the end of processAudio function if they are sequential, but they might not be.

// Let's replace the audio playing useEffect completely.
const audioEffectRegex = /useEffect\(\(\) => \{\n\s*if \(interviewState\.status === "in_progress" && currentQ && currentQ\.question_text\) \{\n\s*\/\/ Play audio for new question\n\s*playAudio\(currentQ\.question_text\);\n\s*\}\n\s*\}, \[currentQ, interviewState\.status\]\);\n/;
content = content.replace(audioEffectRegex, '');

// Replace playAudio function
content = content.replace(/const playAudio = async \(text: string\) => \{[\s\S]*?audio\.play\(\);\n\s*\}\n\s*\};\n/g, '');

// Replace handleStartRecording function
content = content.replace(/const handleStartRecording = async \(\) => \{[\s\S]*?setMediaRecorder\(recorder\);\n\s*\}\n/g, '');

// Replace handleStopRecording function
content = content.replace(/const handleStopRecording = \(\) => \{[\s\S]*?setIsRecording\(false\);\n\s*\}\n\s*\};\n/g, '');

// Replace processAudio function
content = content.replace(/const processAudio = async \(audioBlob: Blob\) => \{[\s\S]*?setIsProcessingVoice\(false\);\n\s*\}\n\s*\};\n/g, '');

// Remove audio tag
content = content.replace(/<audio ref=\{audioRef\} className="hidden" \/>/g, '');

// Remove the voice visualizer
const visualizerRegex = /\{\/\* Voice Visualizer \*\/\}\n\s*<div className="flex justify-center gap-1 mt-4">[\s\S]*?<\/div>/g;
content = content.replace(visualizerRegex, '');

// Remove the record button
const recordButtonRegex = /<Button\n\s*onClick=\{isRecording \? handleStopRecording : handleStartRecording\}[\s\S]*?<\/Button>/g;
content = content.replace(recordButtonRegex, '');

// Remove isProcessingVoice indicator
const processingRegex = /\{isProcessingVoice && \([\s\S]*?<\/div>\n\s*\)\}/g;
content = content.replace(processingRegex, '');

fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
console.log("Stripped STT and TTS from interview session page!");