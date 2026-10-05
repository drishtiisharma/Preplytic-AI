const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');

// Find the report endpoint and replace ONLY inside it
const startIndex = content.indexOf('@app.post("/generate/interview-report")');
if (startIndex !== -1) {
    const endIndex = content.indexOf('@app.post("/generate/roadmap")', startIndex);
    
    let reportBlock = content.substring(startIndex, endIndex);
    
    // Replace the specific groq check with openrouter check inside this block
    reportBlock = reportBlock.replace(
        'if not groq_client:\n        raise HTTPException(status_code=500, detail="Groq client not configured")',
        'if not openrouter_client:\n        raise HTTPException(status_code=500, detail="OpenRouter client not configured")'
    );
    
    content = content.substring(0, startIndex) + reportBlock + content.substring(endIndex);
    fs.writeFileSync('backend/main.py', content, 'utf8');
    console.log("Fixed main.py groq check!");
} else {
    console.log("Could not find endpoint");
}