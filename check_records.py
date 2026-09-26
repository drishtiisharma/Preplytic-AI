import os
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
headers = {"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}"}

res = requests.get(f"{supabase_url}/rest/v1/job_profiles?select=id,user_id&limit=1", headers=headers)
print("job_profiles:", res.text)

res2 = requests.get(f"{supabase_url}/rest/v1/resume_records?select=id,user_id&limit=1", headers=headers)
print("resume_records:", res2.text)