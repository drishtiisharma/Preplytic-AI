const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const regex = /res\.blob\(\)\.then\(blob => \{\s+const audioUrl = URL\.createObjectURL\(blob\);\s+const audio = new Audio\(audioUrl\);\s+audio\.play\(\)\.catch\(e => console\.warn\("Audio autoplay blocked", e\)\);\s+\}\);/;

const replacement = `res.blob().then(blob => {
               const audioUrl = URL.createObjectURL(blob);
               const audio = new Audio(audioUrl);
               
               audio.onplay = () => {
                 setInterviewState(prev => ({ ...prev, isAiSpeaking: true }));
               };
               
               audio.onended = () => {
                 setInterviewState(prev => ({ ...prev, isAiSpeaking: false }));
               };
               
               audio.onerror = () => {
                 setInterviewState(prev => ({ ...prev, isAiSpeaking: false }));
               };

               audio.play().catch(e => {
                 console.warn("Audio autoplay blocked", e);
                 setInterviewState(prev => ({ ...prev, isAiSpeaking: false }));
               });
            });`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
    console.log("Updated audio logic via regex!");
} else {
    console.log("Regex not matched!");
}