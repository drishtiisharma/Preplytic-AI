import os
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
# USING SERVICE ROLE KEY TO BYPASS RLS
service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or supabase_key
headers = {"apikey": service_key, "Authorization": f"Bearer {service_key}"}

res = requests.get(f"{supabase_url}/rest/v1/roadmap_items?select=id,title&limit=5", headers=headers)
print("roadmap_items count:", len(res.json()) if res.status_code == 200 else res.text)