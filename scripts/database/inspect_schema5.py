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

# 1. Try OPTIONS
res = requests.options(f"{supabase_url}/rest/v1/roadmaps", headers=headers)
print("OPTIONS Headers:", res.headers)

# 2. Try an invalid INSERT to provoke a schema error
payload = {
    "user_id": "00000000-0000-0000-0000-000000000000",
    "job_profile_id": "00000000-0000-0000-0000-000000000000",
    "resume_record_id": "00000000-0000-0000-0000-000000000000",
    "readiness_score": 50,
    "estimated_weeks": 4,
    "hours_per_week": 10,
    "summary": "test",
    "focus_skills": ["test"],
    "current_version": 1,
    "fake_column_to_provoke_error": True
}
headers["Prefer"] = "return=representation"
res2 = requests.post(f"{supabase_url}/rest/v1/roadmaps", headers=headers, json=payload)
print("POST Error:", res2.text)
