const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const target = `            res.blob().then(blob => {
               const audioUrl = URL.createObjectURL(blob);
               const audio = new Audio(audioUrl);
               audio.play().catch(e => console.warn("Audio autoplay blocked", e));
            });`;

const replacement = `            res.blob().then(blob => {
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

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
    console.log("Updated audio logic!");
} else {
    console.log("Target not found!");
}