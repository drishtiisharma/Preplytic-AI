const { execSync } = require('child_process');

try {
    const out = execSync('python -c "import sys; sys.path.insert(0, \'backend\'); from backend.ai.clients import gemini_client; print(\'gemini_client initialized:\', gemini_client is not None)"').toString();
    console.log(out);
} catch(e) {
    console.log("Error:", e.toString());
}