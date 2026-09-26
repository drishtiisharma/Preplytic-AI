const { execSync } = require('child_process');

try {
    const out = execSync('python -c "import sys; sys.path.insert(0, \'backend\'); from backend.ai.config import AIConfig; print(\'Key detected:\', bool(AIConfig.GEMINI_API_KEY))"').toString();
    console.log(out);
} catch(e) {
    console.log("Error:", e.toString());
}