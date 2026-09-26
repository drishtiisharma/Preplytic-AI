import os
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
headers = {"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}"}

columns = ["summary", "user_id", "readiness_score"]
for col in columns:
    res = requests.get(f"{supabase_url}/rest/v1/roadmap_versions?select={col}&limit=1", headers=headers)
    print(f"roadmap_versions.{col}: {res.status_code} {res.text[:50]}")