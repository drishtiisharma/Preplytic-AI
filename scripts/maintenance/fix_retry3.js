const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');
let lines = content.split(/\r?\n/);

let inColdMail = false;
let inReferral = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@app.post("/generate/cold-email")')) inColdMail = true;
    if (lines[i].includes('@app.post("/generate/referral")')) {
        inColdMail = false;
        inReferral = true;
    }
    if (lines[i].includes('class InterviewGenerateRequest')) {
        inReferral = false;
    }
    
    if ((inColdMail || inReferral) && lines[i].includes('response = gemini_client.models.generate_content(')) {
        lines[i] = '        response = await _generate_with_retry(prompt)';
        lines[i+1] = ''; // model=...
        lines[i+2] = ''; // contents=...
        lines[i+3] = ''; // )
    }
    
    if ((inColdMail || inReferral) && lines[i].includes('except Exception as e:')) {
        // We only want to add the except HTTPException once.
        if (lines[i-1].indexOf('except HTTPException') === -1) {
            lines[i] = '    except HTTPException:\n        raise\n' + lines[i];
        }
    }
}

// Remove empty lines we cleared
const newLines = lines.filter((l, index) => {
    // Only remove if it was explicitly cleared
    return l !== '' || !lines[index-1] || !lines[index-1].includes('_generate_with_retry'); 
    // Actually, let's just write back directly
});

let finalContent = lines.join('\n');
finalContent = finalContent.replace(/\n\n\n/g, '\n');

fs.writeFileSync('backend/main.py', finalContent, 'utf8');
console.log("Updated via lines!");