import os
import sys
import traceback
from dotenv import load_dotenv
from groq import Groq

# Load backend/.env
env_path = os.path.join(os.getcwd(), 'backend', '.env')
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    print("Error: GROQ_API_KEY is not defined in backend/.env")
    sys.exit(1)

try:
    print("Testing Groq authentication...")
    client = Groq(api_key=api_key)
    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": "Hello"}],
        max_tokens=10
    )
    print("Success! Authentication works.")
except Exception as e:
    print("Authentication Failed!")
    traceback.print_exc()