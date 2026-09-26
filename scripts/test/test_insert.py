import os
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
headers = {"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}", "Content-Type": "application/json", "Prefer": "return=representation"}

payload = {
    "roadmap_version_id": "00000000-0000-0000-0000-000000000000",
    "title": "Test Phase",
    "description": "Test Desc",
    "week_start": 1,
    "week_end": 2,
    "priority": "high",
    "skills": ["Python"],
    "resources": [],
    "progress": 0,
    "status": "not_started"
}

res = requests.post(f"{supabase_url}/rest/v1/roadmap_items", headers=headers, json=payload)
print("Status:", res.status_code)
print("Response:", res.text)