import os
import sys
import json
import urllib.request
from dotenv import load_dotenv

load_dotenv(dotenv_path="backend/.env")
api_key = os.getenv("OPENROUTER_API_KEY")

if not api_key:
    print("OPENROUTER_API_KEY is not loaded.")
    sys.exit(1)

print("1. OPENROUTER_API_KEY is loaded.")
print(f"2. Key length: {len(api_key)}")

model = os.getenv("OPENROUTER_TEXT_MODEL", "openrouter/free")
print(f"3. Requested Model: {model}")

print("\n4. Making minimal OpenRouter test...")
url = "https://openrouter.ai/api/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
data = {
    "model": model,
    "messages": [{"role": "user", "content": "Say 'hello'"}]
}

try:
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.getcode()}")
        result = json.loads(response.read().decode())
        print(f"Response: {result['choices'][0]['message']['content']}")
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(f"Error Body: {e.read().decode()}")
except Exception as e:
    print(f"Error: {str(e)}")