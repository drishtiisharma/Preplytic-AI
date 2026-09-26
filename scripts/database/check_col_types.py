import os
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or supabase_key
headers = {"apikey": service_key, "Authorization": f"Bearer {service_key}"}

# Query the database types via the PostgREST RPC if possible, or just fetch 1 item and look at it
res = requests.get(f"{supabase_url}/rest/v1/roadmap_items?limit=1", headers=headers)
if res.status_code == 200:
    data = res.json()
    if len(data) > 0:
        row = data[0]
        print("skills type:", type(row.get("skills")))
        print("skills value:", row.get("skills"))
        print("resources type:", type(row.get("resources")))
        print("resources value:", row.get("resources"))
    else:
        print("No rows found")
else:
    print("Error:", res.text)