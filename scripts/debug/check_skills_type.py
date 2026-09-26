import os
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
headers = {"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}"}

payload = {
    "user_id": "00000000-0000-0000-0000-000000000000",
    "job_profile_id": "00000000-0000-0000-0000-000000000000",
    "resume_record_id": "00000000-0000-0000-0000-000000000000",
    "focus_skills": {"invalid": "object"}
}
res = requests.post(f"{supabase_url}/rest/v1/roadmaps", headers=headers, json=payload)
print(f"focus_skills object: {res.text}")

payload["focus_skills"] = 123
res2 = requests.post(f"{supabase_url}/rest/v1/roadmaps", headers=headers, json=payload)
print(f"focus_skills int: {res2.text}")