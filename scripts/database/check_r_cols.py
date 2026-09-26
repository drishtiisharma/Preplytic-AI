import os
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
headers = {"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}"}

columns = ["summary", "readiness_score", "estimated_weeks", "hours_per_week", "focus_skills"]
for col in columns:
    res = requests.get(f"{supabase_url}/rest/v1/roadmaps?select={col}&limit=1", headers=headers)
    print(f"roadmaps.{col}: {res.status_code}")