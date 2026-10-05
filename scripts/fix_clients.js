const fs = require('fs');
let content = fs.readFileSync('backend/ai/clients.py', 'utf8');

const replacementStr = `from .config import AIConfig

# Initialize OpenRouter
from openai import OpenAI
if AIConfig.OPENROUTER_API_KEY:
    openrouter_client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=AIConfig.OPENROUTER_API_KEY,
    )
else:
    openrouter_client = None

# Initialize Gemini`;

content = content.replace('from .config import AIConfig\n\n# Initialize Gemini', replacementStr);
fs.writeFileSync('backend/ai/clients.py', content, 'utf8');
console.log("Updated clients.py");