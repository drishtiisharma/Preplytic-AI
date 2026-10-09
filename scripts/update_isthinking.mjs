import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

content = content.replace(
  'const isThinking = isSubmitting || questionsLoading || isProcessingVoice || (questions.length > 0 && !currentQ);',
  'const isInterviewStarted = sessionId && sessionId !== "new";\n  const isThinking = isInterviewStarted && (isSubmitting || questionsLoading || isProcessingVoice || (questions.length > 0 && !currentQ));'
);

fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
console.log("Updated isThinking logic!");