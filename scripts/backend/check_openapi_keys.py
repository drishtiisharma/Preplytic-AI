import os
import requests
import json
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('.env.local')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
headers = {"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}"}

res = requests.get(f"{supabase_url}/rest/v1/", headers=headers)
data = res.json()
schemas = data.get("components", {}).get("schemas", {})
if not schemas:
    schemas = data.get("definitions", {})

schema = schemas.get("roadmap_items", {})
print(json.dumps(schema.get("properties", {}), indent=2))