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
    "Authorization": f"Bearer {supabase_key}",
    "Range": "0-0"
}

# We can query the OpenAPI spec of PostgREST which Supabase exposes at /rest/v1/
res = requests.get(f"{supabase_url}/rest/v1/", headers=headers)
openapi = res.json()
roadmaps = openapi.get('definitions', {}).get('roadmaps', {}).get('properties', {})
print(json.dumps(roadmaps, indent=2))