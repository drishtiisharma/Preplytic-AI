const { execSync } = require('child_process');
const fs = require('fs');

fs.writeFileSync('test_env.py', `
import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
print("Before load_dotenv in test script:", os.getenv("GEMINI_API_KEY"))
load_dotenv(dotenv_path=env_path)
print("After load_dotenv in test script:", os.getenv("GEMINI_API_KEY"))

from backend.ai.config import AIConfig
print("AIConfig.GEMINI_API_KEY:", AIConfig.GEMINI_API_KEY)
`);

try {
    const out = execSync('python test_env.py').toString();
    console.log(out);
} catch(e) {
    console.error(e.toString());
}