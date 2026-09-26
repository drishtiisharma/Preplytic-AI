import os
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
headers = {"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}"}

res = requests.get(f"{supabase_url}/rest/v1/roadmap_versions?limit=1", headers=headers)
print(f"GET Status: {res.status_code}")
print(f"GET Response: {res.text}")