import os
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
headers = {"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}"}

cols = {
    "readiness_score": "foo",
    "estimated_weeks": "foo",
    "hours_per_week": "foo",
    "focus_skills": "foo",
    "current_version": "foo"
}

for col, val in cols.items():
    payload = {
        "user_id": "00000000-0000-0000-0000-000000000000",
        "job_profile_id": "00000000-0000-0000-0000-000000000000",
        "resume_record_id": "00000000-0000-0000-0000-000000000000",
        col: val
    }
    res = requests.post(f"{supabase_url}/rest/v1/roadmaps", headers=headers, json=payload)
    print(f"{col}: {res.text}")