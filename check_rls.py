import os
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
headers = {"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}", "Prefer": "return=representation"}

# 1. Attempt insert without user_id
payload1 = {
    "roadmap_id": "00000000-0000-0000-0000-000000000000",
    "version_number": 1,
    "source": "initial"
}
res1 = requests.post(f"{supabase_url}/rest/v1/roadmap_versions", headers=headers, json=payload1)
print(f"Insert without user_id: {res1.text}")

# 2. Attempt insert with user_id
payload2 = {
    "roadmap_id": "00000000-0000-0000-0000-000000000000",
    "version_number": 1,
    "source": "initial",
    "user_id": "00000000-0000-0000-0000-000000000000"
}
res2 = requests.post(f"{supabase_url}/rest/v1/roadmap_versions", headers=headers, json=payload2)
print(f"Insert with user_id: {res2.text}")