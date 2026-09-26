const { execSync } = require('child_process');
const fs = require('fs');

fs.writeFileSync('test_uvicorn.py', `
import os
from fastapi import FastAPI
from dotenv import load_dotenv
from pathlib import Path

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

from backend.ai.config import AIConfig

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    print("--- STARTUP ---")
    print("GEMINI_API_KEY in os.environ:", os.getenv("GEMINI_API_KEY"))
    print("AIConfig.GEMINI_API_KEY:", AIConfig.GEMINI_API_KEY)
    import sys; sys.exit(0)
`);

try {
    const out = execSync('uvicorn test_uvicorn:app').toString();
    console.log(out);
} catch(e) {
    console.log(e.toString());
    console.log(e.stdout ? e.stdout.toString() : "");
}