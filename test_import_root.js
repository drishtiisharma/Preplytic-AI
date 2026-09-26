const { execSync } = require('child_process');

try {
    const out = execSync('python -c "from backend.ai.config import AIConfig; print(AIConfig.GEMINI_API_KEY)"').toString();
    console.log("From root:", out);
} catch(e) {
    console.log("Error from root:", e.toString());
}