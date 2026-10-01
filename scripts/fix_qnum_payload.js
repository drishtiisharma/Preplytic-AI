const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');

const replacement = `            // Insert questions into interview_questions
            const questionsToInsert = generatedQuestions.map((q, index) => ({
              session_id: data.id,
              question_number: index + 1,
              question_text: typeof q === 'string' ? q : JSON.stringify(q)
            }));`;

content = content.replace(
  /\/\/ Insert questions into interview_questions\s+const questionsToInsert = generatedQuestions\.map\(\(q, index\) => \(\{\s+session_id: data\.id,\s+question_text: typeof q === 'string' \? q : JSON\.stringify\(q\)\s+\}\)\);/m,
  replacement
);

fs.writeFileSync('src/app/(app)/interview/page.tsx', content, 'utf8');
console.log("Updated page.tsx with question_number");