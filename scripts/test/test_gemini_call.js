const { execSync } = require('child_process');

try {
    const out = execSync('python -c "import sys; sys.path.insert(0, \'backend\'); from backend.ai.config import AIConfig; import google.genai as genai; gemini_client = genai.Client(api_key=AIConfig.GEMINI_API_KEY); response = gemini_client.models.generate_content(model=AIConfig.GEMINI_TEXT_MODEL, contents=\'test\'); print(response.text)"').toString();
    console.log("Response:", out);
} catch(e) {
    console.log("Python Error:", e.stderr ? e.stderr.toString() : e.toString());
}