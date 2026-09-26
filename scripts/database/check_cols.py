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

columns = [
    "user_id",
    "job_profile_id",
    "resume_record_id",
    "readiness_score",
    "estimated_weeks",
    "hours_per_week",
    "summary",
    "focus_skills",
    "current_version"
]

print("Checking columns...")
for col in columns:
    res = requests.get(f"{supabase_url}/rest/v1/roadmaps?select={col}&limit=1", headers=headers)
    if res.status_code == 200:
        print(f"[OK] {col} exists.")
    else:
        print(f"[MISSING] {col}: {res.text}")
