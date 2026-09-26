const { execSync } = require('child_process');

try {
    const out = execSync('python -c "import google.genai as genai; print(genai.Client)"').toString();
    console.log(out);
} catch(e) {
    console.log("Error:", e.toString());
}