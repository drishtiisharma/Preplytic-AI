const fs = require('fs');
let content = fs.readFileSync('backend/ai/config.py', 'utf8');

const replacementStr = `class AIConfig:
    # OpenRouter
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    OPENROUTER_TEXT_MODEL = os.getenv("OPENROUTER_TEXT_MODEL", "openrouter/free")
    
    # Gemini`;

content = content.replace('class AIConfig:\n    # Gemini', replacementStr);
fs.writeFileSync('backend/ai/config.py', content, 'utf8');
console.log("Updated config.py");