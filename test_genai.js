const { execSync } = require('child_process');
try {
    const out = execSync('python -c "import google.genai"').toString();
    console.log("google.genai imports successfully");
} catch(e) {
    console.log("Error importing google.genai:", e.toString());
}