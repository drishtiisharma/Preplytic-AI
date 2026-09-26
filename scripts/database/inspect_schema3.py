import os
import requests
import json
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}"
}

res = requests.get(f"{supabase_url}/rest/v1/roadmaps?limit=1", headers=headers)
if res.status_code == 200:
    data = res.json()
    if data:
        print("Columns found in roadmaps:")
        for k, v in data[0].items():
            print(f"- {k} (type: {type(v).__name__})")
    else:
        print("Table 'roadmaps' exists but is empty.")
else:
    print("Error:", res.status_code, res.text)