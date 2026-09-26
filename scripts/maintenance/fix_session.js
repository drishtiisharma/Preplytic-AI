const fs = require('fs');
let path = 'src/app/(app)/interview/[sessionId]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix Select type errors by appending 'as string' or casting
content = content.replace(/onValueChange=\{setNumberOfQuestions\}/g, 'onValueChange={(val) => setNumberOfQuestions(val as string)}');
content = content.replace(/onValueChange=\{setSelectedDifficulty\}/g, 'onValueChange={(val) => setSelectedDifficulty(val as string)}');
content = content.replace(/onValueChange=\{setSelectedJobId\}/g, 'onValueChange={(val) => setSelectedJobId(val as string)}');
content = content.replace(/onValueChange=\{setSelectedResumeId\}/g, 'onValueChange={(val) => setSelectedResumeId(val as string)}');

// We also need to fix interview/page.tsx
let path2 = 'src/app/(app)/interview/page.tsx';
let content2 = fs.readFileSync(path2, 'utf8');
content2 = content2.replace(/onValueChange=\{setSelectedJobId\}/g, 'onValueChange={(val) => setSelectedJobId(val as string)}');
content2 = content2.replace(/onValueChange=\{setSelectedResumeId\}/g, 'onValueChange={(val) => setSelectedResumeId(val as string)}');
content2 = content2.replace(/onValueChange=\{setNumberOfQuestions\}/g, 'onValueChange={(val) => setNumberOfQuestions(val as string)}');
content2 = content2.replace(/onValueChange=\{setSelectedDifficulty\}/g, 'onValueChange={(val) => setSelectedDifficulty(val as string)}');
fs.writeFileSync(path2, content2, 'utf8');

// Now for the redeclarations in page.tsx, let's just strip out everything from the first "const currentQ" up to the NEXT "const currentQ" if it's identical
// But this file seems to have multiple copies of the ENTIRE component or something!
let lines = content.split('\n');
let uniqueLines = [];
let seenFuncs = new Set();
let skipLines = false;
let brackets = 0;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.includes('const currentQ = questions[currentQuestionIndex];')) {
        if (seenFuncs.has('currentQ')) {
            continue; // this line is just duplicated
        }
        seenFuncs.has('currentQ', true);
    }
    
    if (line.includes('const existingResponse = responses.find(r => r.question_id === currentQ?.id);')) {
        if (seenFuncs.has('existingResponse')) continue;
        seenFuncs.has('existingResponse', true);
    }
    
    if (line.includes('const completeInterview = async () => {')) {
        if (seenFuncs.has('completeInterview')) {
            skipLines = true;
            brackets = 0;
        } else {
            seenFuncs.add('completeInterview');
        }
    }
    
    if (line.includes('const handleAnswerSubmit = async () => {')) {
        if (seenFuncs.has('handleAnswerSubmit')) {
            skipLines = true;
            brackets = 0;
        } else {
            seenFuncs.add('handleAnswerSubmit');
        }
    }

    if (skipLines) {
        if (line.includes('{')) brackets += (line.match(/\{/g) || []).length;
        if (line.includes('}')) brackets -= (line.match(/\}/g) || []).length;
        if (brackets <= 0 && line.includes('}')) {
            skipLines = false;
        }
        continue;
    }
    
    uniqueLines.push(line);
}

// Fix chunks type
let joined = uniqueLines.join('\n');
joined = joined.replace(/let chunks = \[\];/g, 'let chunks: BlobPart[] = [];');

fs.writeFileSync(path, joined, 'utf8');
console.log("Fixed interview session TS issues.");