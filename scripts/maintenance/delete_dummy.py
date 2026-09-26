import os
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
headers = {"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}"}

# Find dummy roadmaps
res = requests.get(f"{supabase_url}/rest/v1/roadmaps?readiness_score=eq.0", headers=headers)
if res.status_code == 200:
    roadmaps = res.json()
    for r in roadmaps:
        if "AI generation is disabled" in r.get("summary", ""):
            print(f"Found dummy roadmap {r['id']}, deleting...")
            del_res = requests.delete(f"{supabase_url}/rest/v1/roadmaps?id=eq.{r['id']}", headers=headers)
            print("Delete status:", del_res.status_code)
else:
    print("Error fetching roadmaps:", res.status_code, res.text)