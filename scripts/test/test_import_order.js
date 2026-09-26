const { execSync } = require('child_process');

try {
    const out = execSync('python -c "import backend.main; from backend.ai.config import AIConfig; print(AIConfig.GEMINI_API_KEY)"').toString();
    console.log("With main first:", out);
} catch(e) {
    console.log("Error:", e.toString());
}