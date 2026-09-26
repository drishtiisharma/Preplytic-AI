const fs = require('fs');
let path = 'backend/ai/config.py';
let content = fs.readFileSync(path, 'utf8');

const targetContent = `import os
from dotenv import load_dotenv

load_dotenv()`;

const newContent = `import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)`;

content = content.replace(targetContent, newContent);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated config.py successfully.");