const fs = require('fs');
let content = fs.readFileSync('src/lib/supabase/database.types.ts', 'utf8');

const lines = content.split('\n');
let capture = false;
let braceCount = 0;
for (let i=0; i<lines.length; i++) {
    if (lines[i].includes('interview_questions: {')) {
        capture = true;
    }
    if (capture) {
        console.log(lines[i]);
        if (lines[i].includes('{')) braceCount += (lines[i].match(/\{/g) || []).length;
        if (lines[i].includes('}')) braceCount -= (lines[i].match(/\}/g) || []).length;
        if (braceCount === 0 && lines[i].includes('}')) {
            break;
        }
    }
}