
import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
print("Before load_dotenv in test script:", os.getenv("GEMINI_API_KEY"))
load_dotenv(dotenv_path=env_path)
print("After load_dotenv in test script:", os.getenv("GEMINI_API_KEY"))

from backend.ai.config import AIConfig
print("AIConfig.GEMINI_API_KEY:", AIConfig.GEMINI_API_KEY)
