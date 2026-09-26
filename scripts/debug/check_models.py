import os
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)
key = os.getenv("GROQ_ROADMAP_API_KEY")
print("Key starts with:", key[:5] if key else "None")

from groq import Groq
try:
    client = Groq(api_key=key)
    models = client.models.list()
    print("Available Groq Models:")
    for m in models.data:
        print(m.id)
except Exception as e:
    print(e)