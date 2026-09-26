const fs = require('fs');
let path = 'src/app/(app)/interview/[sessionId]/page.tsx';
let content = fs.readFileSync(path, 'utf8');
let lines = content.split('\n');

// Find the index of the first useEffect (line 61) to insert currentQ right before it
let useEffIdx = lines.findIndex(l => l.includes('useEffect(() => {'));
lines.splice(useEffIdx, 0, '  const currentQ = questions[currentQuestionIndex];');
lines.splice(useEffIdx + 1, 0, '  const existingResponse = responses.find(r => r.question_id === currentQ?.id);');

let newLines = [];
let skip = false;
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Remove the inner declarations
    if (line.includes('const currentQ = questions[currentQuestionIndex];') && i > useEffIdx + 2) continue;
    if (line.includes('const existingResponse = responses.find(r => r.question_id === currentQ?.id);') && i > useEffIdx + 2) continue;
    
    // Fix chunks type
    if (line.includes('const chunks = [];')) {
        line = line.replace('const chunks = [];', 'const chunks: BlobPart[] = [];');
    }
    
    // Skip duplicate useEffect blocks if they just check existingResponse
    if (line.includes('if (existingResponse) {') && lines[i+1]?.includes('setAnswer(existingResponse.response_text || "");') && i > 300) {
        // This is the duplicate effect around 385. We skip it and its wrappers.
        skip = true;
    }
    
    if (skip) {
        if (line.includes('}, [currentQuestionIndex, existingResponse]);')) {
            skip = false;
        }
        continue;
    }
    
    newLines.push(line);
}

fs.writeFileSync(path, newLines.join('\n'), 'utf8');
console.log("Fixed TS errors in interview page.");